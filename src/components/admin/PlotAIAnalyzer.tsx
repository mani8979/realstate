'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Upload, Zap, CheckCircle, AlertCircle, RefreshCw, X,
  Eye, Download, Sparkles, ImageIcon, ChevronRight, Target,
  TrendingUp, Home, Clock, Activity, MapPin
} from 'lucide-react';
import Image from 'next/image';

interface DetectedPlot {
  plotNumber: string;
  status: 'available' | 'booked' | 'sold';
  xPercent: number;
  yPercent: number;
  widthPercent: number;
  heightPercent: number;
  color?: string;
}

interface AnalysisResult {
  totalPlots: number;
  sold: number;
  booked: number;
  available: number;
  confidence: number;
  notes?: string;
  plots: DetectedPlot[];
}

interface PlotAIAnalyzerProps {
  layoutImageUrl: string;
  onPlotsDetected: (plots: DetectedPlot[]) => void;
  onClose: () => void;
}

type Stage = 'idle' | 'uploading' | 'analyzing' | 'review' | 'done' | 'error';

const STATUS_COLORS = {
  available: { bg: 'bg-green-500', text: 'text-green-400', border: 'border-green-500/40', glow: 'shadow-green-500/30' },
  booked:    { bg: 'bg-yellow-400', text: 'text-yellow-400', border: 'border-yellow-400/40', glow: 'shadow-yellow-400/30' },
  sold:      { bg: 'bg-red-500', text: 'text-red-400', border: 'border-red-500/40', glow: 'shadow-red-500/30' },
};

const PROCESSING_STEPS = [
  { icon: <ImageIcon size={16} />, label: 'Loading image data', duration: 800 },
  { icon: <Eye size={16} />, label: 'Detecting plot boundaries', duration: 1200 },
  { icon: <Activity size={16} />, label: 'Analyzing color patterns', duration: 1000 },
  { icon: <Target size={16} />, label: 'Reading plot numbers (OCR)', duration: 1400 },
  { icon: <Brain size={16} />, label: 'Classifying plot statuses', duration: 1000 },
  { icon: <Sparkles size={16} />, label: 'Generating results', duration: 600 },
];

export default function PlotAIAnalyzer({ layoutImageUrl, onPlotsDetected, onClose }: PlotAIAnalyzerProps) {
  const [stage, setStage] = useState<Stage>('idle');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [editedPlots, setEditedPlots] = useState<DetectedPlot[]>([]);
  const [error, setError] = useState('');
  const [processingStep, setProcessingStep] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(layoutImageUrl || '');
  const [uploadedPreview, setUploadedPreview] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // ----- File handling -----
  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) { setError('Please upload an image file (JPG, PNG, WEBP)'); return; }
    setUploadedFile(file);
    setUploadedPreview(URL.createObjectURL(file));
    setError('');
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  // ----- Simulate processing steps animation -----
  const runProcessingAnimation = async () => {
    for (let i = 0; i < PROCESSING_STEPS.length; i++) {
      setProcessingStep(i);
      await new Promise(r => setTimeout(r, PROCESSING_STEPS[i].duration));
    }
  };

  // ----- Main analysis function -----
  const runAnalysis = async () => {
    const imageToAnalyze = uploadedImageUrl || layoutImageUrl;
    if (!imageToAnalyze && !uploadedFile) {
      setError('No image to analyze. Please upload one or use the existing layout image.');
      return;
    }

    setStage('analyzing');
    setError('');

    try {
      // Run animation concurrently
      const animPromise = runProcessingAnimation();

      let requestBody: any = {};

      if (uploadedFile) {
        // Convert file to base64
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve((e.target?.result as string).split(',')[1]);
          reader.readAsDataURL(uploadedFile);
        });
        requestBody = { imageBase64: base64, mimeType: uploadedFile.type };
      } else {
        requestBody = { imageUrl: imageToAnalyze };
      }

      const res = await fetch('/api/analyze-layout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      await animPromise; // Ensure animation completes

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'AI analysis failed. Check your GEMINI_API_KEY.');
        setStage('error');
        return;
      }

      setAnalysisResult(data.analysis);
      setEditedPlots(data.analysis.plots || []);
      setStage('review');
    } catch (err: any) {
      setError(err.message || 'Analysis request failed');
      setStage('error');
    }
  };

  // ----- Editable plot status -----
  const updatePlotStatus = (idx: number, status: 'available' | 'booked' | 'sold') => {
    setEditedPlots(prev => prev.map((p, i) => i === idx ? { ...p, status } : p));
  };

  const removePlot = (idx: number) => {
    setEditedPlots(prev => prev.filter((_, i) => i !== idx));
  };

  const updatePlotNumber = (idx: number, plotNumber: string) => {
    setEditedPlots(prev => prev.map((p, i) => i === idx ? { ...p, plotNumber } : p));
  };

  const handleConfirm = () => {
    // Convert AI detected plots to the format PropertyForm expects
    const formattedPlots = editedPlots.map(p => ({
      number: p.plotNumber,
      status: p.status,
      x: p.xPercent,
      y: p.yPercent,
      width: p.widthPercent,
      height: p.heightPercent,
    }));
    onPlotsDetected(formattedPlots as any);
    onClose();
  };

  // ----- Computed stats from edited plots -----
  const stats = {
    total: editedPlots.length,
    available: editedPlots.filter(p => p.status === 'available').length,
    booked: editedPlots.filter(p => p.status === 'booked').length,
    sold: editedPlots.filter(p => p.status === 'sold').length,
  };

  const displayImage = uploadedPreview || uploadedImageUrl || layoutImageUrl;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-2xl flex flex-col overflow-hidden"
    >
      {/* ---- Header ---- */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-white/10 bg-black/60 flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <Brain size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-white font-black text-lg uppercase tracking-tighter leading-none">AI Plot Analyzer</h2>
            <p className="text-violet-400 text-[10px] font-bold uppercase tracking-[0.2em]">Powered by Gemini Vision</p>
          </div>
        </div>
        <button onClick={onClose} className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all">
          <X size={20} />
        </button>
      </div>

      <div className="flex-grow overflow-y-auto">
        <AnimatePresence mode="wait">

          {/* ===== IDLE / UPLOAD STAGE ===== */}
          {(stage === 'idle' || stage === 'error') && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto p-8 space-y-8"
            >
              {/* Existing layout preview */}
              {layoutImageUrl && (
                <div className="bg-white/5 rounded-3xl border border-white/10 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle size={16} className="text-green-400" />
                    <span className="text-white font-bold text-sm">Current Layout Image Detected</span>
                    <span className="ml-auto text-[10px] text-green-400 bg-green-500/10 px-3 py-1 rounded-full font-bold uppercase tracking-widest">Ready to Analyze</span>
                  </div>
                  <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-900">
                    <Image src={layoutImageUrl} alt="Layout" fill className="object-contain" />
                  </div>
                </div>
              )}

              {/* Custom upload (override) */}
              <div className="space-y-3">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">
                  {layoutImageUrl ? 'Or Upload a Different Image to Analyze' : 'Upload Plot Layout Image'}
                </label>
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  onClick={() => fileRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all ${
                    isDragOver ? 'border-violet-500 bg-violet-500/10' : 'border-white/10 hover:border-violet-500/50 hover:bg-violet-500/5'
                  }`}
                >
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
                  {uploadedPreview ? (
                    <div className="relative aspect-video max-h-48 mx-auto rounded-2xl overflow-hidden">
                      <Image src={uploadedPreview} alt="Upload preview" fill className="object-contain" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-16 h-16 mx-auto rounded-3xl bg-violet-500/10 flex items-center justify-center">
                        <Upload size={28} className="text-violet-400" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm">Drop your plot layout here</p>
                        <p className="text-gray-500 text-xs mt-1">JPG, PNG, WEBP supported • Any quality</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                  <AlertCircle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* AI Capabilities info */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: <Eye size={18} />, label: 'Plot Detection', desc: 'Finds every plot boundary' },
                  { icon: <Activity size={18} />, label: 'Color Analysis', desc: 'Reads fill colors & status' },
                  { icon: <Target size={18} />, label: 'OCR Numbers', desc: 'Reads plot labels & IDs' },
                  { icon: <Sparkles size={18} />, label: 'Auto-Classification', desc: 'Available / Booked / Sold' },
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                    <div className="text-violet-400">{item.icon}</div>
                    <div className="text-white font-bold text-xs">{item.label}</div>
                    <div className="text-gray-500 text-[10px]">{item.desc}</div>
                  </div>
                ))}
              </div>

              {/* Analyze button */}
              <button
                type="button"
                onClick={runAnalysis}
                disabled={!layoutImageUrl && !uploadedFile}
                className="w-full py-5 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-black uppercase tracking-widest text-sm hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-2xl shadow-violet-500/30 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                <Brain size={20} />
                Analyze with AI
                <ChevronRight size={18} />
              </button>
            </motion.div>
          )}

          {/* ===== ANALYZING STAGE ===== */}
          {stage === 'analyzing' && (
            <motion.div
              key="analyzing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center min-h-[70vh] p-8 space-y-12"
            >
              {/* Animated brain */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center shadow-2xl shadow-violet-500/40">
                  <Brain size={52} className="text-white" />
                </div>
                {/* Orbiting particles */}
                {[0, 1, 2, 3].map(i => (
                  <motion.div
                    key={i}
                    className="absolute w-3 h-3 rounded-full bg-violet-400"
                    style={{ top: '50%', left: '50%', marginTop: -6, marginLeft: -6, transformOrigin: '70px 0' }}
                    animate={{ rotate: [i * 90, i * 90 + 360] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: i * 0.3 }}
                  />
                ))}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-violet-500/30"
                  animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>

              <div className="text-center space-y-3">
                <h3 className="text-white text-2xl font-black uppercase tracking-tighter">Analyzing Layout</h3>
                <p className="text-violet-400 text-sm font-bold">AI is scanning your plot map...</p>
              </div>

              {/* Processing steps */}
              <div className="w-full max-w-md space-y-3">
                {PROCESSING_STEPS.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0.2 }}
                    animate={{ opacity: processingStep >= i ? 1 : 0.2 }}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                      processingStep === i ? 'bg-violet-500/20 border border-violet-500/30' :
                      processingStep > i ? 'bg-green-500/10' : 'bg-white/5'
                    }`}
                  >
                    <div className={`flex-shrink-0 ${processingStep > i ? 'text-green-400' : processingStep === i ? 'text-violet-400' : 'text-gray-600'}`}>
                      {processingStep > i ? <CheckCircle size={16} /> : step.icon}
                    </div>
                    <span className={`text-xs font-bold ${processingStep >= i ? 'text-white' : 'text-gray-600'}`}>{step.label}</span>
                    {processingStep === i && (
                      <motion.div className="ml-auto w-4 h-4 border-2 border-violet-400 border-t-transparent rounded-full" animate={{ rotate: 360 }} transition={{ duration: 0.6, repeat: Infinity, ease: 'linear' }} />
                    )}
                    {processingStep > i && <CheckCircle size={14} className="ml-auto text-green-400" />}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ===== REVIEW STAGE ===== */}
          {stage === 'review' && analysisResult && (
            <motion.div
              key="review"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-8 space-y-8"
            >
              {/* Stats summary */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Plots', value: stats.total, color: 'text-white', bg: 'bg-white/5', border: 'border-white/10' },
                  { label: 'Available', value: stats.available, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' },
                  { label: 'Booked', value: stats.booked, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' },
                  { label: 'Sold', value: stats.sold, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
                ].map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className={`p-5 rounded-3xl ${s.bg} border ${s.border} text-center`}
                  >
                    <div className={`text-4xl font-black ${s.color}`}>{s.value}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1">{s.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* AI confidence & notes */}
              <div className="flex items-center gap-4 p-4 bg-violet-500/10 border border-violet-500/20 rounded-2xl">
                <Sparkles size={18} className="text-violet-400 flex-shrink-0" />
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-black text-white uppercase tracking-widest">AI Confidence</span>
                    <span className="text-violet-400 font-black text-sm">{analysisResult.confidence}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${analysisResult.confidence}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full"
                    />
                  </div>
                </div>
                {analysisResult.notes && (
                  <p className="text-gray-400 text-xs max-w-xs">{analysisResult.notes}</p>
                )}
              </div>

              {/* Visual map overlay */}
              {displayImage && editedPlots.length > 0 && (
                <div className="space-y-3">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Visual Preview — Detected Plots</label>
                  <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gray-900">
                    <div className="relative" style={{ paddingBottom: '60%' }}>
                      <Image src={displayImage} alt="Layout" fill className="object-contain" />
                      {/* Overlay detected plots */}
                      {editedPlots.map((plot, i) => (
                        <div
                          key={i}
                          style={{
                            position: 'absolute',
                            left: `${plot.xPercent ?? 50}%`,
                            top: `${plot.yPercent ?? 50}%`,
                            width: `${plot.widthPercent || 5}%`,
                            height: `${plot.heightPercent || 4}%`,
                            transform: 'translate(-50%, -50%)',
                          }}
                          className={`flex items-center justify-center text-[8px] font-black rounded border border-white/60 bg-opacity-70 ${
                            plot.status === 'sold'   ? 'bg-red-500 text-white' :
                            plot.status === 'booked' ? 'bg-yellow-400 text-black' :
                                                       'bg-green-500 text-white'
                          }`}
                          title={`${plot.plotNumber} - ${plot.status}`}
                        >
                          {plot.plotNumber?.replace('Plot ', '')}
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Legend */}
                  <div className="flex items-center gap-6 justify-center py-2">
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-green-500" /><span className="text-[10px] text-gray-400 font-bold">Available</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-yellow-400" /><span className="text-[10px] text-gray-400 font-bold">Booked</span></div>
                    <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-red-500" /><span className="text-[10px] text-gray-400 font-bold">Sold</span></div>
                  </div>
                </div>
              )}

              {/* Editable plots list */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Review & Edit Detected Plots</label>
                  <span className="text-[10px] text-gray-500">{editedPlots.length} plots detected</span>
                </div>
                <div className="max-h-64 overflow-y-auto space-y-2 pr-1">
                  {editedPlots.map((plot, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                      {/* Status dot */}
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                        plot.status === 'sold' ? 'bg-red-500' : plot.status === 'booked' ? 'bg-yellow-400' : 'bg-green-500'
                      }`} />
                      {/* Plot number input */}
                      <input
                        type="text"
                        value={plot.plotNumber}
                        onChange={e => updatePlotNumber(i, e.target.value)}
                        className="bg-transparent text-white text-xs font-bold flex-grow border-none focus:ring-0 p-0 min-w-0"
                        placeholder="Plot #"
                      />
                      {/* Status buttons */}
                      <div className="flex gap-1 flex-shrink-0">
                        {(['available', 'booked', 'sold'] as const).map(s => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => updatePlotStatus(i, s)}
                            className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${
                              plot.status === s
                                ? s === 'sold' ? 'bg-red-500 text-white' : s === 'booked' ? 'bg-yellow-400 text-black' : 'bg-green-500 text-white'
                                : 'bg-white/5 text-gray-500 hover:bg-white/10'
                            }`}
                          >
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                          </button>
                        ))}
                      </div>
                      {/* Remove button */}
                      <button type="button" onClick={() => removePlot(i)} className="text-gray-600 hover:text-red-400 transition-colors flex-shrink-0">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-4 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => { setStage('idle'); setAnalysisResult(null); setEditedPlots([]); }}
                  className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-all font-bold uppercase tracking-widest text-xs"
                >
                  <RefreshCw size={16} />
                  Re-analyze
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="flex-grow py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-black uppercase tracking-widest text-sm hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-2xl shadow-violet-500/30 flex items-center justify-center gap-3"
                >
                  <CheckCircle size={18} />
                  Apply {editedPlots.length} Plots to Map
                </button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </motion.div>
  );
}
