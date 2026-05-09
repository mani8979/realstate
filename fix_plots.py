content = open('src/components/admin/PropertyForm.tsx', 'r', encoding='utf-8').read().replace('\r\n', '\n')

# ===== 1. Update handleImageClick to use Quick Add fields when set =====
OLD_CLICK = '''  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent clicking on existing markers from triggering a new plot creation
    if ((e.target as HTMLElement).closest('.plot-marker')) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Auto-create and open editor
    const newPlot = { 
      number: `Plot ${formData.plots?.length + 1 || 1}`, 
      status: 'available', 
      x, 
      y,
      width: 5,
      height: 3
    };
    
    const newPlots = [...(formData.plots || []), newPlot];
    setFormData((prev: any) => ({
      ...prev,
      plots: newPlots
    }));
    
    // Set indices AFTER triggering the formData update
    const newIndex = newPlots.length - 1;
    setEditingPlotIndex(newIndex);
    setSelectedPlotIndex(newIndex);
  };'''

NEW_CLICK = '''  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent clicking on existing markers from triggering a new plot creation
    if ((e.target as HTMLElement).closest('.plot-marker')) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Use Quick Add values if admin has typed a plot number, otherwise auto-name
    const hasQuickAdd = newPlotNumber.trim().length > 0;
    const newPlot = {
      number: hasQuickAdd ? newPlotNumber.trim() : `Plot ${(formData.plots?.length || 0) + 1}`,
      status: hasQuickAdd ? newPlotStatus : 'available',
      x,
      y,
      width: 5,
      height: 3
    };

    const newPlots = [...(formData.plots || []), newPlot];
    setFormData((prev: any) => ({
      ...prev,
      plots: newPlots
    }));

    // Clear quick-add input after placing so next click auto-names
    if (hasQuickAdd) setNewPlotNumber('');

    const newIndex = newPlots.length - 1;
    setSelectedPlotIndex(newIndex);
    // Only open configure modal if NOT using quick-add (quick-add already knows number & status)
    if (!hasQuickAdd) setEditingPlotIndex(newIndex);
  };'''

if OLD_CLICK in content:
    content = content.replace(OLD_CLICK, NEW_CLICK)
    print('Step 1 DONE: handleImageClick updated')
else:
    print('Step 1 FAILED')
    exit(1)

# ===== 2. Fix the Quick Add panel: remove grid placement, replace button with "then click on map" UX =====
OLD_QUICK_ADD_ENTER = '''                          onKeyDown={(e) => {
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
                          }}'''

NEW_QUICK_ADD_ENTER = '''                          onKeyDown={(e) => {
                            if (e.key === 'Escape') setNewPlotNumber('');
                          }}'''

if OLD_QUICK_ADD_ENTER in content:
    content = content.replace(OLD_QUICK_ADD_ENTER, NEW_QUICK_ADD_ENTER)
    print('Step 2 DONE: Enter key fixed')
else:
    print('Step 2 FAILED')
    exit(1)

# ===== 3. Replace the Add button with a "Now click on the map" instruction =====
OLD_ADD_BUTTON = '''                      <button
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

                      <p className="text-[9px] text-gray-600 text-center">Press Enter or click Add • Drag markers on map to reposition</p>'''

NEW_ADD_BUTTON = '''                      {/* "Now click on map" instruction — appears when plot number is typed */}
                      {newPlotNumber.trim() ? (
                        <div className={`w-full py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-center animate-pulse border-2 border-dashed ${
                          newPlotStatus === 'sold'   ? 'border-red-500 text-red-400 bg-red-500/10'
                          : newPlotStatus === 'booked' ? 'border-yellow-400 text-yellow-400 bg-yellow-400/10'
                          :                              'border-green-500 text-green-400 bg-green-500/10'
                        }`}>
                          ↓ Now click the plot on the map
                        </div>
                      ) : (
                        <div className="w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-center text-gray-600 bg-white/3 border border-white/5">
                          Type a number → click on map
                        </div>
                      )}

                      <p className="text-[9px] text-gray-600 text-center">Drag markers on map to reposition • ESC to cancel</p>'''

if OLD_ADD_BUTTON in content:
    content = content.replace(OLD_ADD_BUTTON, NEW_ADD_BUTTON)
    print('Step 3 DONE: Add button replaced with instruction')
else:
    print('Step 3 FAILED')
    exit(1)

# ===== 4. Update the canvas hint text + cursor to reflect Quick Add state =====
OLD_CANVAS_HINT = '''                        {(!formData.plots || formData.plots.length === 0) && (
                          <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
                            <div className="flex flex-col items-center gap-2">
                              <Target size={48} className="text-primary animate-pulse" />
                              <span className="text-[12px] font-black uppercase tracking-[0.3em] text-primary">Click to create plot</span>
                            </div>
                          </div>
                        )}'''

NEW_CANVAS_HINT = '''                        {/* Canvas hint — changes based on Quick Add state */}
                        <div className="absolute inset-0 pointer-events-none flex items-end justify-center z-10 pb-4">
                          {newPlotNumber.trim() ? (
                            <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-2xl animate-pulse ${
                              newPlotStatus === 'sold'   ? 'bg-red-500 text-white'
                              : newPlotStatus === 'booked' ? 'bg-yellow-400 text-black'
                              :                              'bg-green-500 text-white'
                            }`}>
                              <span>Click to place "{newPlotNumber}"</span>
                            </div>
                          ) : (!formData.plots || formData.plots.length === 0) ? (
                            <div className="flex flex-col items-center gap-2">
                              <Target size={36} className="text-primary animate-pulse" />
                              <span className="text-[11px] font-black uppercase tracking-[0.3em] text-primary">Click to add plot</span>
                            </div>
                          ) : null}
                        </div>'''

if OLD_CANVAS_HINT in content:
    content = content.replace(OLD_CANVAS_HINT, NEW_CANVAS_HINT)
    print('Step 4 DONE: canvas hint updated')
else:
    print('Step 4 FAILED')
    exit(1)

# ===== 5. Update cursor class: crosshair always, but add a ring when quick-add is active =====
OLD_CURSOR = '''                        ref={imageContainerRef}
                        className="relative cursor-crosshair max-w-full max-h-full"
                        onClick={handleImageClick}'''

NEW_CURSOR = '''                        ref={imageContainerRef}
                        className={`relative max-w-full max-h-full ${newPlotNumber.trim() ? 'cursor-cell' : 'cursor-crosshair'}`}
                        onClick={handleImageClick}'''

if OLD_CURSOR in content:
    content = content.replace(OLD_CURSOR, NEW_CURSOR)
    print('Step 5 DONE: cursor updated')
else:
    print('Step 5 FAILED')

with open('src/components/admin/PropertyForm.tsx', 'w', encoding='utf-8', newline='\n') as f:
    f.write(content)

print('All changes applied!')
