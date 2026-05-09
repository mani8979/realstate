with open('src/components/admin/PropertyForm.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('\r\n', '\n')

# Find the exact old block - from the inner div start to the end of that section
OLD = '''                      <div 
                        className="relative cursor-crosshair max-w-full max-h-full"
                        onClick={handleImageClick}
                        id="layout-image-container-full"
                      >'''

NEW = '''                      <div 
                        ref={imageContainerRef}
                        className="relative cursor-crosshair max-w-full max-h-full"
                        onClick={handleImageClick}
                      >'''

if OLD in content:
    content = content.replace(OLD, NEW, 1)
    print('Step 1 DONE: ref added to container')
else:
    print('Step 1 FAILED: could not find container div')
    exit(1)

# Now replace motion.div markers with pointer-event divs
OLD_MARKERS_START = '                        {/* Plot Markers */}\n                        {formData.plots?.map((plot: any, idx: number) => (\n                          <motion.div \n                            key={idx}\n                            drag\n                            dragMomentum={false}\n                            dragElastic={0}\n                            onDragEnd={(_, info) => {\n                              const parent = document.getElementById(\'layout-image-container-full\');\n                              if (parent) {\n                                const pRect = parent.getBoundingClientRect();\n                                const newX = ((info.point.x - pRect.left) / pRect.width) * 100;\n                                const newY = ((info.point.y - pRect.top) / pRect.height) * 100;\n                                updatePlotField(idx, \'x\', newX);\n                                updatePlotField(idx, \'y\', newY);\n                              }\n                            }}\n                            onClick={(e) => { \n                              e.stopPropagation(); \n                              setSelectedPlotIndex(idx); \n                            }}\n                            tabIndex={0}\n                            onKeyDown={(e) => {\n                              // Only delete if the marker itself is focused, not the input inside it\n                              if (e.key === \'Backspace\' && document.activeElement === e.currentTarget) {\n                                e.preventDefault();\n                                removePlot(idx);\n                                setSelectedPlotIndex(null);\n                              }\n                            }}\n                            style={{ \n                              left: `${plot.x}%`, \n                              top: `${plot.y}%`,\n                              width: `${plot.width || 5}%`,\n                              height: `${plot.height || 3}%`\n                            }}\n                            className={`absolute plot-marker -translate-x-1/2 -translate-y-1/2 rounded-md border shadow-2xl flex items-center justify-center text-[10px] font-black cursor-move z-30 transition-all hover:scale-110 active:scale-95 group/marker focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${\n                              selectedPlotIndex === idx ? \'ring-2 ring-primary ring-offset-2 scale-110\' : \'\'\n                            } ${\n                              plot.status === \'sold\' ? \'bg-red-500 text-white border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)]\' :\n                              plot.status === \'booked\' ? \'bg-yellow-400 text-black border-yellow-300 shadow-[0_0_15px_rgba(250,204,21,0.4)]\' :\n                              \'bg-green-500 text-white border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.4)]\'\n                            }`}\n                          >\n                            <input \n                              type="text"\n                              value={plot.number}\n                              onChange={(e) => updatePlotField(idx, \'number\', e.target.value)}\n                              className="w-full bg-transparent border-none text-center focus:ring-0 p-0 font-black cursor-text"\n                              onClick={(e) => e.stopPropagation()}\n                            />\n                            \n                            {/* Hover Status & Delete Bar */}\n                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-xl border border-white/20 rounded-full p-1.5 flex items-center gap-2 opacity-0 group-hover/marker:opacity-100 transition-all scale-75 group-hover/marker:scale-100 pointer-events-auto z-[60] shadow-2xl">\n                              <button \n                                type="button"\n                                onClick={(e) => { e.stopPropagation(); updatePlotField(idx, \'status\', \'available\'); }}\n                                className={`w-4 h-4 rounded-full border border-white/20 hover:scale-125 transition-all ${plot.status === \'available\' ? \'bg-green-500 scale-110 shadow-[0_0_10px_rgba(34,197,94,0.5)]\' : \'bg-green-500/20\'}`}\n                              />\n                              <button \n                                type="button"\n                                onClick={(e) => { e.stopPropagation(); updatePlotField(idx, \'status\', \'booked\'); }}\n                                className={`w-4 h-4 rounded-full border border-white/20 hover:scale-125 transition-all ${plot.status === \'booked\' ? \'bg-yellow-400 scale-110 shadow-[0_0_10px_rgba(250,204,21,0.5)]\' : \'bg-yellow-400/20\'}`}\n                              />\n                              <button \n                                type="button"\n                                onClick={(e) => { e.stopPropagation(); updatePlotField(idx, \'status\', \'sold\'); }}\n                                className={`w-4 h-4 rounded-full border border-white/20 hover:scale-125 transition-all ${plot.status === \'sold\' ? \'bg-red-500 scale-110 shadow-[0_0_10px_rgba(239,68,68,0.5)]\' : \'bg-red-500/20\'}`}\n                              />\n                              <div className="w-px h-3 bg-white/20 mx-1"></div>\n                              <button \n                                type="button"\n                                onClick={(e) => { e.stopPropagation(); setEditingPlotIndex(idx); }}\n                                className="text-gray-400 hover:text-white transition-colors"\n                              >\n                                <Settings size={12} />\n                              </button>\n                              <button \n                                type="button"\n                                onClick={(e) => { e.stopPropagation(); removePlot(idx); }}\n                                className="text-red-500 hover:text-red-400 transition-colors ml-2 p-1 hover:bg-red-500/10 rounded-lg"\n                              >\n                                <Trash size={16} />\n                              </button>\n                            </div>\n                          </motion.div>\n                        ))}\n\n                        <div id="layout-image-container-full" className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-all pointer-events-none flex items-center justify-center z-10">\n                          <div className="opacity-0 group-hover:opacity-100 flex flex-col items-center gap-2">\n                            <Target size={48} className="text-primary animate-pulse" />\n                            <span className="text-[12px] font-black uppercase tracking-[0.3em] text-primary">Click to create plot</span>\n                          </div>\n                        </div>'''

NEW_MARKERS = '''                        {/* Plot Markers — pointer-event drag */}
                        {formData.plots?.map((plot: any, idx: number) => (
                          <div
                            key={idx}
                            onPointerDown={(e) => handlePlotPointerDown(e, idx)}
                            onPointerMove={handlePlotPointerMove}
                            onPointerUp={handlePlotPointerUp}
                            onPointerCancel={handlePlotPointerUp}
                            onClick={(e) => { e.stopPropagation(); setSelectedPlotIndex(idx); }}
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === 'Backspace' && document.activeElement === e.currentTarget) {
                                e.preventDefault();
                                removePlot(idx);
                              }
                            }}
                            style={{
                              position: 'absolute',
                              left: `${plot.x ?? 50}%`,
                              top: `${plot.y ?? 50}%`,
                              width: `${plot.width || 5}%`,
                              height: `${plot.height || 3}%`,
                              transform: 'translate(-50%, -50%)',
                              touchAction: 'none',
                              userSelect: 'none',
                            }}
                            className={`plot-marker rounded-md border shadow-2xl flex items-center justify-center text-[10px] font-black cursor-move z-30 group/marker focus:outline-none ${
                              selectedPlotIndex === idx ? 'ring-2 ring-white ring-offset-1 ring-offset-transparent' : ''
                            } ${
                              plot.status === 'sold'   ? 'bg-red-500 text-white border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.4)]' :
                              plot.status === 'booked' ? 'bg-yellow-400 text-black border-yellow-300 shadow-[0_0_15px_rgba(250,204,21,0.4)]' :
                                                         'bg-green-500 text-white border-green-400 shadow-[0_0_15px_rgba(34,197,94,0.4)]'
                            }`}
                          >
                            <input
                              type="text"
                              value={plot.number}
                              onChange={(e) => updatePlotField(idx, 'number', e.target.value)}
                              className="w-full bg-transparent border-none text-center focus:ring-0 p-0 font-black cursor-text"
                              onClick={(e) => e.stopPropagation()}
                            />
                            {/* Hover toolbar */}
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/90 backdrop-blur-xl border border-white/20 rounded-full p-1.5 flex items-center gap-2 opacity-0 group-hover/marker:opacity-100 transition-all pointer-events-auto z-[60] shadow-2xl">
                              <button type="button" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); updatePlotField(idx, 'status', 'available'); }} className={`w-4 h-4 rounded-full border border-white/20 hover:scale-125 transition-all ${plot.status === 'available' ? 'bg-green-500 scale-110' : 'bg-green-500/20'}`} />
                              <button type="button" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); updatePlotField(idx, 'status', 'booked');    }} className={`w-4 h-4 rounded-full border border-white/20 hover:scale-125 transition-all ${plot.status === 'booked'    ? 'bg-yellow-400 scale-110' : 'bg-yellow-400/20'}`} />
                              <button type="button" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); updatePlotField(idx, 'status', 'sold');      }} className={`w-4 h-4 rounded-full border border-white/20 hover:scale-125 transition-all ${plot.status === 'sold'      ? 'bg-red-500 scale-110'    : 'bg-red-500/20'}`} />
                              <div className="w-px h-3 bg-white/20 mx-1" />
                              <button type="button" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); setEditingPlotIndex(idx); }} className="text-gray-400 hover:text-white transition-colors"><Settings size={12} /></button>
                              <button type="button" onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); removePlot(idx); }} className="text-red-500 hover:text-red-400 transition-colors ml-2 p-1 hover:bg-red-500/10 rounded-lg"><Trash size={16} /></button>
                            </div>
                          </div>
                        ))}

                        {(!formData.plots || formData.plots.length === 0) && (
                          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
                            <div className="flex flex-col items-center gap-2">
                              <Target size={48} className="text-primary animate-pulse" />
                              <span className="text-[12px] font-black uppercase tracking-[0.3em] text-primary">Click to create plot</span>
                            </div>
                          </div>
                        )}'''

if OLD_MARKERS_START in content:
    content = content.replace(OLD_MARKERS_START, NEW_MARKERS, 1)
    print('Step 2 DONE: markers replaced')
else:
    print('Step 2 FAILED: old markers block not found')
    # Print what we have around that area for debugging
    idx2 = content.find('Plot Markers')
    if idx2 >= 0:
        print('Found Plot Markers at:', idx2)
        print(repr(content[idx2:idx2+300]))
    exit(1)

with open('src/components/admin/PropertyForm.tsx', 'w', encoding='utf-8', newline='\n') as f:
    f.write(content)

print('File written successfully')
