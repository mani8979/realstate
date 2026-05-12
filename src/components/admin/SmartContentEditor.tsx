'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { 
  Type, 
  List, 
  AlignLeft, 
  Plus, 
  Trash2, 
  GripVertical, 
  Wand2, 
  Sparkles, 
  X,
  Heading,
  CheckCircle2,
  Copy,
  Layout
} from 'lucide-react';

// --- Types ---

export type SectionType = 'heading' | 'paragraph' | 'bullet' | 'side-heading';

export interface Section {
  id: string;
  type: SectionType;
  heading?: string;
  sideHeading?: string;
  content: string;
  showArrow?: boolean;
  isPointed?: boolean;
  alignment?: 'left' | 'center' | 'right';
}

interface SmartContentEditorProps {
  onSave: (sections: Section[]) => void;
  initialSections?: Section[];
  isOpen: boolean;
  onClose: () => void;
}

// --- Utils ---

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const parseRawText = (text: string): Section[] => {
  const rawLines = text.split('\n').map(l => l.trim());
  const sections: Section[] = [];
  let currentSection: Section | null = null;

  for (let i = 0; i < rawLines.length; i++) {
    const line = rawLines[i];
    
    if (!line) continue; // Skip empty lines for logic, but they help separate paragraphs

    // Ignore markdown separators (---, ***, ___)
    if (/^[-*_]{3,}$/.test(line)) {
      continue;
    }

    // Check if it's an explicitly marked bullet point
    const isExplicitBullet = /^[-\*•→]\s/.test(line) || /^[-*•→]$/.test(line);
    
    // Look ahead to see if the next non-empty line is a bullet
    let nextNonEmptyLine = '';
    for (let j = i + 1; j < rawLines.length; j++) {
      if (rawLines[j] && !/^[-*_]{3,}$/.test(rawLines[j])) {
        nextNonEmptyLine = rawLines[j];
        break;
      }
    }
    const isNextLineBullet = /^[-\*•→]\s/.test(nextNonEmptyLine);
    
    // Advanced Heuristics for Heading
    // 1. Markdown heading (Starts with #)
    // 2. ALL CAPS (and not too long)
    // 3. Ends with a colon
    // 4. Short line that precedes a bulleted list
    const isHeading = !isExplicitBullet && line.length < 100 && !line.endsWith('.') && (
      line.startsWith('#') ||
      (line === line.toUpperCase() && line.length > 3) ||
      line.endsWith(':') ||
      isNextLineBullet
    );

    if (isHeading) {
      if (currentSection) sections.push(currentSection);
      // Clean up the heading text (remove # and colons)
      let headingText = line.replace(/^#+\s*/, '').replace(/:$/, '').trim();
      currentSection = {
        id: generateId(),
        type: 'heading',
        heading: headingText,
        content: '',
        showArrow: true,
        isPointed: false,
        alignment: 'left'
      };
    } 
    else if (isExplicitBullet) {
      const bulletText = line.replace(/^[-*•→]\s*/, '').trim();
      if (!currentSection) {
        currentSection = {
          id: generateId(),
          type: 'heading',
          heading: 'Property Details', // Smart fallback heading
          content: bulletText,
          isPointed: true,
          alignment: 'left'
        };
      } else {
        currentSection.isPointed = true;
        currentSection.content += (currentSection.content ? '\n' : '') + bulletText;
      }
    }
    // Regular Paragraph or Implied Bullet
    else {
      if (!currentSection) {
        currentSection = {
          id: generateId(),
          type: 'heading',
          heading: 'Overview',
          content: line,
          alignment: 'left'
        };
      } else {
        currentSection.content += (currentSection.content ? '\n' : '') + line;
      }
    }
  }

  if (currentSection) sections.push(currentSection);

  // Post-processing: Automatically detect "implied" bullet lists
  // If a section has many short lines separated by newlines, it's likely a list.
  sections.forEach(sec => {
    if (!sec.isPointed && sec.content) {
      const lines = sec.content.split('\n');
      if (lines.length >= 3) {
        // If more than 70% of the lines are short (< 100 characters), convert to a pointed list
        const shortLinesCount = lines.filter(l => l.length < 100).length;
        if (shortLinesCount / lines.length > 0.7) {
          sec.isPointed = true;
        }
      }
    }
  });

  return sections;
};

// --- Sub-Components ---

const HeadingEditor = ({ value, onChange }: { value: string, onChange: (v: string) => void }) => (
  <input
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full bg-transparent text-2xl font-black uppercase tracking-tighter text-gray-900 dark:text-white border-none focus:ring-0 p-0 mb-2 placeholder:opacity-20"
    placeholder="SECTION HEADING"
  />
);

const SideHeadingEditor = ({ value, onChange }: { value: string, onChange: (v: string) => void }) => (
  <input
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full bg-transparent text-[10px] font-black uppercase tracking-widest text-primary border-none focus:ring-0 p-0 mb-4 placeholder:opacity-20"
    placeholder="SIDE HEADING (OPTIONAL)"
  />
);

const ContentEditor = ({ value, onChange, isPointed }: { value: string, onChange: (v: string) => void, isPointed: boolean }) => (
  <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    rows={isPointed ? 4 : 3}
    className="w-full bg-transparent text-gray-600 dark:text-gray-400 text-sm leading-relaxed border-none focus:ring-0 p-0 resize-none placeholder:opacity-20"
    placeholder={isPointed ? "Enter bullet points (one per line)..." : "Write section content here..."}
  />
);

// --- Main Editor ---

export const SmartContentEditor: React.FC<SmartContentEditorProps> = ({ onSave, initialSections, isOpen, onClose }) => {
  const [rawText, setRawText] = useState('');
  const [sections, setSections] = useState<Section[]>(initialSections || []);
  const [mode, setMode] = useState<'input' | 'edit'>('input');

  useEffect(() => {
    if (initialSections && initialSections.length > 0) {
      setSections(initialSections);
      setMode('edit');
    }
  }, [initialSections]);

  const handleSmartPaste = () => {
    const parsed = parseRawText(rawText);
    setSections(parsed);
    setMode('edit');
  };

  const addSection = () => {
    const newSection: Section = {
      id: generateId(),
      type: 'heading',
      heading: 'NEW SECTION',
      content: '',
      alignment: 'left',
      showArrow: true,
      isPointed: false
    };
    setSections([...sections, newSection]);
  };

  const deleteSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id));
  };

  const updateSection = (id: string, updates: Partial<Section>) => {
    setSections(sections.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative w-full max-w-5xl h-[85vh] bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-white/10"
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between flex-shrink-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="bg-primary/20 p-3 rounded-2xl">
              <Wand2 className="text-primary" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tighter text-gray-900 dark:text-white">AI Smart Editor</h2>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary">Intelligent Content Structuring</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {mode === 'edit' && (
              <button
                onClick={() => setMode('input')}
                className="px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all"
              >
                Reset & Paste Again
              </button>
            )}
            <button
              onClick={onClose}
              className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-red-500 transition-all"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            {mode === 'input' ? (
              <motion.div
                key="input"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="h-full flex flex-col gap-6"
              >
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white">Paste Raw Content</h3>
                  <p className="text-sm text-gray-500">Paste your large text here. Our AI will automatically detect headings, sub-headings, and points.</p>
                </div>

                <div className="flex-grow relative group">
                  <textarea
                    autoFocus
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    placeholder="Paste your content here...&#10;&#10;EXAMPLE:&#10;LOCATION ADVANTAGES&#10;Near Airport&#10;Near Highway&#10;&#10;PRICE DETAILS&#10;Starts from ₹3 Lakhs"
                    className="w-full h-full bg-gray-50 dark:bg-gray-800/50 rounded-[2rem] border-2 border-dashed border-gray-200 dark:border-gray-700 p-8 text-lg text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none font-medium"
                  />
                  <div className="absolute bottom-6 right-6 flex gap-3">
                    <button
                      disabled={!rawText.trim()}
                      onClick={handleSmartPaste}
                      className="px-10 py-5 bg-primary text-black dark:text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 disabled:opacity-50 disabled:scale-100"
                    >
                      <Sparkles size={20} />
                      Generate Structure
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="edit"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6 max-w-3xl mx-auto pb-20"
              >
                <div className="flex items-center justify-between mb-10">
                   <div>
                    <h3 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Structured View</h3>
                    <p className="text-gray-500 font-medium">Fine-tune your sections. Drag to reorder.</p>
                   </div>
                   <button
                     onClick={addSection}
                     className="flex items-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-primary hover:text-black transition-all"
                   >
                     <Plus size={16} /> Add Section
                   </button>
                </div>

                <Reorder.Group axis="y" values={sections} onReorder={setSections} className="space-y-6">
                  {sections.map((section) => (
                    <Reorder.Item 
                      key={section.id} 
                      value={section}
                      className="group"
                    >
                      <motion.div 
                        className="relative bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2rem] p-8 hover:shadow-xl transition-all hover:border-primary/30"
                      >
                        {/* Toolbar */}
                        <div className="absolute -left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all flex flex-col gap-2">
                           <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg cursor-grab active:cursor-grabbing border border-gray-100 dark:border-gray-700">
                             <GripVertical size={16} className="text-gray-400" />
                           </div>
                        </div>

                        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all flex items-center gap-2">
                           <button
                             onClick={() => updateSection(section.id, { isPointed: !section.isPointed })}
                             className={`p-2 rounded-lg transition-all ${section.isPointed ? 'bg-primary text-black' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-primary'}`}
                             title="Toggle List View"
                           >
                             <List size={16} />
                           </button>
                           <button
                             onClick={() => updateSection(section.id, { showArrow: !section.showArrow })}
                             className={`p-2 rounded-lg transition-all ${section.showArrow ? 'bg-primary text-black' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-primary'}`}
                             title="Show Arrow"
                           >
                             <Type size={16} />
                           </button>
                           <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1" />
                           <button
                             onClick={() => deleteSection(section.id)}
                             className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                           >
                             <Trash2 size={16} />
                           </button>
                        </div>

                        {/* Editor Controls */}
                        <HeadingEditor 
                          value={section.heading || ''} 
                          onChange={(v) => updateSection(section.id, { heading: v })} 
                        />
                        <SideHeadingEditor 
                          value={section.sideHeading || ''} 
                          onChange={(v) => updateSection(section.id, { sideHeading: v })} 
                        />
                        
                        <div className="relative pl-6 border-l-2 border-primary/20">
                          {section.isPointed && (
                            <div className="absolute left-0 top-1.5 -translate-x-1/2 w-2 h-2 rounded-full bg-primary" />
                          )}
                          <ContentEditor 
                            value={section.content} 
                            isPointed={!!section.isPointed}
                            onChange={(v) => updateSection(section.id, { content: v })} 
                          />
                        </div>

                        {/* Alignment Buttons */}
                        <div className="mt-6 flex items-center gap-2 pt-4 border-t border-gray-50 dark:border-gray-800">
                          {['left', 'center', 'right'].map((align) => (
                            <button
                              key={align}
                              onClick={() => updateSection(section.id, { alignment: align as any })}
                              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                section.alignment === align 
                                  ? 'bg-primary text-black' 
                                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-800'
                              }`}
                            >
                              {align}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-900 flex-shrink-0">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
            <Layout size={14} />
            <span>{sections.length} Sections Ready</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onClose}
              className="px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(sections)}
              disabled={sections.length === 0}
              className="px-12 py-4 bg-primary text-black dark:text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50 disabled:scale-100"
            >
              <CheckCircle2 size={16} />
              Save to Property
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
