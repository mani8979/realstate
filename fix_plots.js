const fs = require('fs');
const path = require('path');

const filePath = path.join('d:', 'reals', 'src', 'app', 'properties', '[id]', 'page.tsx');

let content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

let startIndex = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('Interactive Plot Inventory')) {
        startIndex = i;
        break;
    }
}

if (startIndex === -1) {
    console.log("Could not find start index");
    process.exit(1);
}

let endIndex = -1;
for (let i = startIndex; i < lines.length; i++) {
    if (lines[i].includes(')} ') || lines[i].includes(')}') || lines[i].trim() === ')}') {
        if (i + 1 < lines.length && lines[i+1].includes('mt-20')) {
            endIndex = i;
            break;
        }
    }
}

if (endIndex === -1) {
    console.log("Could not find end index");
    process.exit(1);
}

console.log(`Found block from line ${startIndex + 1} to ${endIndex + 1}`);

const newBlock = `          {/* Interactive Plot Inventory */}
          {(property.plots?.length > 0 || property.layoutImage) && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-32 space-y-12"
            >
              <div className="text-center space-y-4">
                 <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-black dark:text-white">Real-time Inventory</h2>
                 <p className="text-gray-500 font-medium uppercase tracking-widest text-[10px] md:text-xs">Explore available plots and secure your future asset today</p>
              </div>

              <div className="flex flex-col xl:flex-row gap-10">
                  {/* Map View */}
                  <div 
                     ref={mapContainerRef}
                     className="dragon-repel flex-grow bg-black/5 dark:bg-white/5 rounded-[3rem] border border-black/10 dark:border-white/10 overflow-auto relative shadow-2xl flex items-center justify-center p-4 md:p-10 min-h-[500px] custom-scrollbar"
                  >
                     {property.layoutImage ? (
                        <div className="relative w-full h-full flex items-center justify-center">
                           <button 
                             onClick={() => setIsMapExpanded(true)}
                             className="absolute top-4 right-4 z-30 bg-black/50 hover:bg-primary border border-white/20 hover:border-primary text-white hover:text-black p-3 rounded-xl backdrop-blur-md transition-all shadow-xl"
                             title="Expand Map"
                           >
                             <Maximize size={20} />
                           </button>
                           
                           <div className="relative group/map min-w-full min-h-full flex items-center justify-center">
                             <Image 
                               src={property.layoutImage} 
                               alt="Plot Layout" 
                               width={4000} 
                               height={3000} 
                               className="w-auto h-auto max-w-none max-h-none object-contain rounded-2xl"
                               style={{ minWidth: '100%', minHeight: '100%' }}
                             />
                             <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                               {property.plots?.map((plot, idx) => (
                                 <motion.rect
                                   key={idx}
                                   x={plot.x}
                                   y={plot.y}
                                   width={plot.width || 5}
                                   height={plot.height || 3}
                                   className="pointer-events-auto cursor-pointer"
                                   initial={{ opacity: 0 }}
                                   animate={{ opacity: hoveredPlot === plot.number ? 0.6 : 0 }}
                                   style={{
                                     fill: plot.status === 'sold' ? (property.soldColor || '#fac915') :
                                           plot.status === 'booked' ? (property.bookedColor || '#22c55e') :
                                           (property.availableColor || '#ffffff'),
                                     stroke: hoveredPlot === plot.number ? '#fff' : 'transparent',
                                     strokeWidth: 0.5
                                   }}
                                   onMouseEnter={() => setHoveredPlot(plot.number)}
                                   onMouseLeave={() => setHoveredPlot(null)}
                                   onClick={() => openContactDialog('whatsapp', \`I'm interested in Plot \${plot.number} of \${property.title}\`)}
                                 />
                               ))}
                             </svg>
                           </div>
                        </div>
                     ) : (
                        <div className="flex flex-col items-center gap-6 text-center opacity-30">
                           <LayoutGrid size={80} />
                           <p className="text-sm font-black uppercase tracking-widest">Interactive Map coming soon</p>
                        </div>
                     )}
                  </div>

                  {/* Table View */}
                  <div 
                     ref={inventoryListRef}
                     className="dragon-repel w-full xl:w-[450px] bg-black/5 dark:bg-white/5 backdrop-blur-xl rounded-[3rem] border border-black/10 dark:border-white/10 p-8 flex flex-col h-[700px] shadow-2xl overflow-hidden"
                  >
                     <div className="flex flex-col gap-6 mb-8">
                        <div className="flex items-center justify-between">
                           <div className="space-y-1">
                              <h3 className="text-xl font-black uppercase tracking-tighter text-black dark:text-white">Unit Table</h3>
                              <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Availability List</p>
                           </div>
                           <div className="bg-primary/10 px-4 py-2 rounded-xl border border-primary/20">
                              <span className="text-[10px] font-black text-primary uppercase tracking-widest">\${property.plots?.length || 0} Units</span>
                           </div>
                        </div>
                        
                        <div className="relative group">
                           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={16} />
                           <input 
                              type="text"
                              placeholder="Search Plot Number..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl focus:ring-2 focus:ring-primary/50 outline-none transition-all text-sm font-bold placeholder:text-gray-400"
                           />
                        </div>
                     </div>

                     <div className="flex-grow overflow-y-auto pr-2 custom-scrollbar">
                        <table className="w-full text-left border-separate border-spacing-y-3">
                           <thead>
                              <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-black dark:text-white/30">
                                 <th className="px-4 py-2">ID</th>
                                 <th className="px-4 py-2">Status</th>
                                 <th className="px-4 py-2 text-right">Action</th>
                              </tr>
                           </thead>
                           <tbody>
                              {property.plots?.filter((plot) => 
                                 plot.number.toString().toLowerCase().includes(searchQuery.toLowerCase())
                              ).map((plot, idx) => (
                                 <tr 
                                    key={idx} 
                                    data-plot={plot.number}
                                    onMouseEnter={() => setHoveredPlot(plot.number)}
                                    onMouseLeave={() => setHoveredPlot(null)}
                                    className={\`
                                    bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-2xl overflow-hidden group transition-all cursor-pointer
                                    \${hoveredPlot === plot.number ? 'ring-2 ring-primary bg-black/5 dark:bg-white/10 scale-[1.02]' : 'hover:bg-black/5 dark:hover:bg-white/10'}
                                  \`}
                                 >
                                    <td className="px-4 py-4 rounded-l-2xl">
                                       <div className="flex items-center gap-3">
                                          <div className={\`w-1.5 h-6 rounded-full transition-all \${hoveredPlot === plot.number ? 'h-8' : ''}\`} style={{
                                            backgroundColor: plot.status === 'sold' ? (property.soldColor || '#fac915') :
                                                            plot.status === 'booked' ? (property.bookedColor || '#22c55e') :
                                                            (property.availableColor || '#ffffff')
                                          }}></div>
                                          <span className="text-sm font-black text-black dark:text-white">\${plot.number}</span>
                                       </div>
                                    </td>
                                    <td className="px-4 py-4">
                                       <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-black/10 dark:border-white/10" style={{
                                          backgroundColor: plot.status === 'sold' ? \`\${property.soldColor || '#fac915'}20\` :
                                                          plot.status === 'booked' ? \`\${property.bookedColor || '#22c55e'}20\` :
                                                          'transparent',
                                          color: plot.status === 'sold' ? (property.soldColor || '#fac915') :
                                                 plot.status === 'booked' ? (property.bookedColor || '#22c55e') :
                                                 'inherit'
                                       }}>
                                          {plot.status}
                                       </span>
                                    </td>
                                    <td className="px-4 py-4 text-right rounded-r-2xl">
                                       <button onClick={(e) => { e.stopPropagation(); openContactDialog('whatsapp', \`I'm interested in Plot \${plot.number} of \${property.title}\`); }} className="text-[9px] font-black uppercase tracking-widest text-primary hover:text-black dark:text-white transition-colors bg-primary/10 hover:bg-primary px-3 py-1.5 rounded-lg border border-primary/20">
                                          Enquire
                                       </button>
                                    </td>
                                 </tr>
                              ))}
                           </tbody>
                        </table>
                     </div>
                     
                     <div className="mt-6 p-4 bg-primary/10 rounded-2xl border border-primary/20">
                        <div className="flex items-center gap-3">
                           <Box size={16} className="text-primary" />
                           <div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-primary">Live Status Analysis</p>
                              <p className="text-[8px] font-bold text-black/60 dark:text-white/60">
                                 {hoveredPlot ? \`Viewing details for Plot \${hoveredPlot}\` : 'Hover over a unit to see its location on the map'}
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>
              </div>
            </motion.div>
          )\`;

const finalLines = [...lines.slice(0, startIndex), newBlock, ...lines.slice(endIndex + 1)];
fs.writeFileSync(filePath, finalLines.join('\\n'), 'utf8');

console.log("File updated successfully");
