content = open('src/components/admin/PropertyForm.tsx', 'r', encoding='utf-8').read().replace('\r\n', '\n')

# ===== 1. Fix imports: remove Brain, remove PlotAIAnalyzer import =====
content = content.replace(
    "import { Image as ImageIcon, X, Plus, Save, Loader2, ChevronUp, ChevronDown, Play, Target, Hash, Settings, Trash, Sliders, Maximize2, ChevronLeft, Brain } from 'lucide-react';",
    "import { Image as ImageIcon, X, Plus, Save, Loader2, ChevronUp, ChevronDown, Play, Target, Hash, Settings, Trash, Sliders, Maximize2, ChevronLeft, Zap, List } from 'lucide-react';"
)
content = content.replace("import PlotAIAnalyzer from './PlotAIAnalyzer';\n", "")

# ===== 2. Remove showAIAnalyzer state =====
content = content.replace(
    "  const [showAIAnalyzer, setShowAIAnalyzer] = useState(false);\n",
    ""
)

# ===== 3. Remove AI button from the Plot Layout header =====
OLD_AI_BUTTON = '''              <div className="flex items-center gap-3">
                {formData.layoutImage && (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowAIAnalyzer(true)}
                      className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-black uppercase tracking-widest text-[10px] rounded-xl hover:from-violet-500 hover:to-fuchsia-500 transition-all shadow-xl shadow-violet-500/30"
                    >
                      <Brain size={14} /> AI Detect
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowLayoutEditor(true)}
                      className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-black uppercase tracking-widest text-[10px] rounded-xl hover:scale-105 transition-all shadow-xl shadow-primary/20"
                    >
                      <Maximize2 size={16} /> Launch Editor
                    </button>
                  </>
                )}
              </div>'''

NEW_LAUNCH_BUTTON = '''              {formData.layoutImage && (
                <button
                  type="button"
                  onClick={() => setShowLayoutEditor(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-black uppercase tracking-widest text-[10px] rounded-xl hover:scale-105 transition-all shadow-xl shadow-primary/20"
                >
                  <Maximize2 size={16} /> Launch Editor
                </button>
              )}'''

content = content.replace(OLD_AI_BUTTON, NEW_LAUNCH_BUTTON)

# ===== 4. Remove the AI Analyzer modal block =====
OLD_AI_MODAL = '''          {/* AI Plot Analyzer Modal */}
          <AnimatePresence>
            {showAIAnalyzer && (
              <PlotAIAnalyzer
                layoutImageUrl={formData.layoutImage || ''}
                onPlotsDetected={(detectedPlots: any[]) => {
                  setFormData((prev: any) => ({
                    ...prev,
                    plots: detectedPlots.map((p: any, i: number) => ({
                      number: p.number || p.plotNumber || `Plot ${i + 1}`,
                      status: p.status || 'available',
                      x: p.x ?? p.xPercent ?? (50 + i),
                      y: p.y ?? p.yPercent ?? (50 + i),
                      width: p.width ?? p.widthPercent ?? 5,
                      height: p.height ?? p.heightPercent ?? 3,
                    }))
                  }));
                }}
                onClose={() => setShowAIAnalyzer(false)}
              />
            )}
          </AnimatePresence>

          {/* Land Brochure Section */}'''

NEW_AFTER_EDITOR = '''          {/* Land Brochure Section */}'''

content = content.replace(OLD_AI_MODAL, NEW_AFTER_EDITOR)

# ===== 5. Replace sidebar with Quick Add + Live Plot List =====
OLD_SIDEBAR = '''                  {/* Sidebar Stats & Legend (Minimal) */}
                  <div className="w-[350px] flex flex-col gap-6">
                    <div className="bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 p-8 space-y-8">
                      <div className="space-y-1">
                        <h3 className="text-lg font-black uppercase tracking-tighter text-white">Spatial Dashboard</h3>
                        <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 leading-relaxed">
                          • Click map to add<br/>
                          • Drag to move<br/>
                          • Type # on marker
                        </p>
                      </div>

                      <div className="h-px bg-white/10"></div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                          <span className="block text-[8px] font-black uppercase tracking-widest text-gray-500 mb-1">Total Plots</span>
                          <span className="text-2xl font-black text-white">{formData.plots?.length || 0}</span>
                        </div>
                        <div className="p-4 rounded-2xl bg-green-500/10 border border-green-500/10 text-center">
                          <span className="block text-[8px] font-black uppercase tracking-widest text-green-500 mb-1">Available</span>
                          <span className="text-2xl font-black text-green-500">{formData.plots?.filter((p: any) => p.status === 'available' || p.status === 'unsold').length || 0}</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-white">Sold Plots</span>
                          </div>
                          <span className="text-xs font-black text-red-500">{formData.plots?.filter((p: any) => p.status === 'sold').length || 0}</span>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-white">Booked Plots</span>
                          </div>
                          <span className="text-xs font-black text-yellow-400">{formData.plots?.filter((p: any) => p.status === 'booked').length || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>'''

NEW_SIDEBAR = '''                  {/* Sidebar: Quick Add + Live Plot List */}
                  <div className="w-[320px] flex flex-col gap-4 overflow-hidden">

                    {/* Stats Strip */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="p-3 rounded-2xl bg-white/5 border border-white/5 text-center">
                        <span className="block text-[8px] font-black uppercase tracking-widest text-gray-500">Total</span>
                        <span className="text-xl font-black text-white">{formData.plots?.length || 0}</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-green-500/10 border border-green-500/10 text-center">
                        <span className="block text-[8px] font-black uppercase tracking-widest text-green-500">Avail</span>
                        <span className="text-xl font-black text-green-500">{formData.plots?.filter((p: any) => p.status === 'available' || p.status === 'unsold').length || 0}</span>
                      </div>
                      <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/10 text-center">
                        <span className="block text-[8px] font-black uppercase tracking-widest text-red-400">Sold</span>
                        <span className="text-xl font-black text-red-400">{formData.plots?.filter((p: any) => p.status === 'sold').length || 0}</span>
                      </div>
                    </div>

                    {/* Quick Add Panel */}
                    <div className="bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 p-5 space-y-4">
                      <div className="flex items-center gap-2">
                        <Zap size={14} className="text-primary" />
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-white">Quick Add Plot</h3>
                      </div>

                      {/* Plot Number Input — color preview updates as you type */}
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Plot Number e.g. A-101"
                          value={newPlotNumber}
                          onChange={(e) => setNewPlotNumber(e.target.value)}
                          className="w-full bg-black/30 text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm font-bold border border-white/10 focus:border-primary/60 focus:ring-0 focus:outline-none transition-all"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && newPlotNumber.trim()) {
                              const plots = formData.plots || [];
                              const newPlot = {
                                number: newPlotNumber.trim(),
                                status: newPlotStatus,
                                x: 10 + (plots.length % 10) * 8,
                                y: 10 + Math.floor(plots.length / 10) * 12,
                                width: 6,
                                height: 4,
                              };
                              setFormData((prev: any) => ({ ...prev, plots: [...(prev.plots || []), newPlot] }));
                              setNewPlotNumber('');
                            }
                          }}
                        />
                        {/* Live color preview */}
                        {newPlotNumber.trim() && (
                          <div className={`absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-md border border-white/20 ${
                            newPlotStatus === 'sold' ? 'bg-red-500' : newPlotStatus === 'booked' ? 'bg-yellow-400' : 'bg-green-500'
                          }`} />
                        )}
                      </div>

                      {/* Status Picker — instantly changes what color will be used */}
                      <div className="flex gap-2">
                        {(['available', 'booked', 'sold'] as const).map(s => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setNewPlotStatus(s)}
                            className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all border ${
                              newPlotStatus === s
                                ? s === 'sold'   ? 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/20'
                                : s === 'booked' ? 'bg-yellow-400 text-black border-yellow-400 shadow-lg shadow-yellow-400/20'
                                :                  'bg-green-500 text-white border-green-500 shadow-lg shadow-green-500/20'
                                : 'bg-white/5 text-gray-500 border-white/5 hover:bg-white/10'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        disabled={!newPlotNumber.trim()}
                        onClick={() => {
                          if (!newPlotNumber.trim()) return;
                          const plots = formData.plots || [];
                          const newPlot = {
                            number: newPlotNumber.trim(),
                            status: newPlotStatus,
                            x: 10 + (plots.length % 10) * 8,
                            y: 10 + Math.floor(plots.length / 10) * 12,
                            width: 6,
                            height: 4,
                          };
                          setFormData((prev: any) => ({ ...prev, plots: [...(prev.plots || []), newPlot] }));
                          setNewPlotNumber('');
                        }}
                        className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed ${
                          newPlotStatus === 'sold'   ? 'bg-red-500 text-white shadow-lg shadow-red-500/20 hover:bg-red-400'
                          : newPlotStatus === 'booked' ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20 hover:bg-yellow-300'
                          :                              'bg-green-500 text-white shadow-lg shadow-green-500/20 hover:bg-green-400'
                        }`}
                      >
                        <Plus size={14} />
                        Add {newPlotStatus} Plot
                      </button>

                      <p className="text-[9px] text-gray-600 text-center">Press Enter or click Add • Drag markers on map to reposition</p>
                    </div>

                    {/* Live Plot List — change status → color changes instantly on map */}
                    <div className="bg-white/5 backdrop-blur-3xl rounded-3xl border border-white/10 p-5 space-y-3 flex-grow overflow-hidden flex flex-col">
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <List size={14} className="text-gray-400" />
                        <h3 className="text-[11px] font-black uppercase tracking-widest text-white">Plot List</h3>
                        <span className="ml-auto text-[9px] text-gray-500">{formData.plots?.length || 0} plots</span>
                      </div>
                      <div className="overflow-y-auto space-y-2 flex-grow pr-1" style={{ maxHeight: '280px' }}>
                        {(!formData.plots || formData.plots.length === 0) && (
                          <p className="text-[10px] text-gray-600 text-center py-4">No plots yet. Click map or use Quick Add.</p>
                        )}
                        {formData.plots?.map((plot: any, idx: number) => (
                          <div
                            key={idx}
                            onClick={() => setSelectedPlotIndex(idx)}
                            className={`flex items-center gap-2 p-2 rounded-xl cursor-pointer transition-all border ${
                              selectedPlotIndex === idx ? 'border-white/20 bg-white/10' : 'border-white/5 bg-white/3 hover:bg-white/8'
                            }`}
                          >
                            {/* Color dot — instantly reflects status */}
                            <div className={`w-3 h-3 rounded-sm flex-shrink-0 ${
                              plot.status === 'sold' ? 'bg-red-500' : plot.status === 'booked' ? 'bg-yellow-400' : 'bg-green-500'
                            }`} />

                            {/* Editable plot number — as you type, marker on map updates live */}
                            <input
                              type="text"
                              value={plot.number}
                              onChange={(e) => updatePlotField(idx, 'number', e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              className="bg-transparent text-white text-[10px] font-bold flex-grow border-none focus:ring-0 p-0 min-w-0"
                              placeholder="Plot #"
                            />

                            {/* Status cycle button — click to cycle Available → Booked → Sold → Available */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const next = plot.status === 'available' ? 'booked' : plot.status === 'booked' ? 'sold' : 'available';
                                updatePlotField(idx, 'status', next);
                              }}
                              className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-wider transition-all flex-shrink-0 ${
                                plot.status === 'sold'   ? 'bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white'
                                : plot.status === 'booked' ? 'bg-yellow-400/20 text-yellow-400 hover:bg-yellow-400 hover:text-black'
                                :                            'bg-green-500/20 text-green-400 hover:bg-green-500 hover:text-white'
                              }`}
                              title="Click to cycle status"
                            >
                              {plot.status === 'available' ? 'Avail' : plot.status === 'booked' ? 'Booked' : 'Sold'}
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); removePlot(idx); }}
                              className="text-gray-700 hover:text-red-400 transition-colors flex-shrink-0 p-0.5"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>'''

if OLD_SIDEBAR in content:
    content = content.replace(OLD_SIDEBAR, NEW_SIDEBAR)
    print("Step 5 DONE: sidebar replaced")
else:
    print("Step 5 FAILED: old sidebar not found")
    exit(1)

with open('src/components/admin/PropertyForm.tsx', 'w', encoding='utf-8', newline='\n') as f:
    f.write(content)

print("All changes applied successfully")
