'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { 
  ArrowLeft, Save, Loader2, LayoutGrid, 
  Trash, Plus, Hash, Settings, Info, CheckCircle2,
  Map as MapIcon, Table as TableIcon, Palette, MousePointer2, Search, X, Maximize
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const isLightColor = (color: string) => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 155;
};

const AdminPlotManagement = () => {
  const { id } = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [plots, setPlots] = useState<any[]>([]);
  const [bulkInput, setBulkInput] = useState('');
  const [quickAddNumber, setQuickAddNumber] = useState('');
  const [deleteMode, setDeleteMode] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'map' | 'table'>('grid');
  const [selectedPlotIndex, setSelectedPlotIndex] = useState<number | null>(null);
  const [placementMode, setPlacementMode] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFullscreenMap, setIsFullscreenMap] = useState(false);
  const [hoveredPlotIdx, setHoveredPlotIdx] = useState<number | null>(null);
  
  // Custom colors
  const [colors, setColors] = useState({
    available: '#ffffff',
    booked: '#22c55e',
    sold: '#fac915'
  });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(`/api/properties/${id}`);
        setProperty(res.data);
        setPlots(Array.isArray(res.data.plots) ? res.data.plots : []);
        setColors({
          available: res.data.availableColor || '#ffffff',
          booked: res.data.bookedColor || '#22c55e',
          sold: res.data.soldColor || '#fac915'
        });
        if (res.data.layoutImage) {
          setViewMode('map');
        }
      } catch (error) {
        console.error('Error fetching property:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProperty();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put(`/api/properties/${id}`, { 
        ...property, 
        plots,
        availableColor: colors.available,
        bookedColor: colors.booked,
        soldColor: colors.sold
      });
      alert('Plot inventory saved successfully!');
    } catch (error) {
      console.error('Error saving plots:', error);
      alert('Failed to save plot inventory.');
    } finally {
      setSaving(false);
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom(prev => Math.min(Math.max(0.5, prev + delta), 5));
    }
  };

  const handlePlotClick = (index: number) => {
    if (deleteMode) {
      setPlots(plots.filter((_, i) => i !== index));
      if (selectedPlotIndex === index) setSelectedPlotIndex(null);
      return;
    }

    if (viewMode === 'map') {
      setSelectedPlotIndex(index);
      setPlacementMode(true);
      return;
    }

    // Cycle Status in Grid/Table view
    const newPlots = [...plots];
    const currentStatus = newPlots[index].status;
    const nextStatus = 
      currentStatus === 'available' ? 'booked' : 
      currentStatus === 'booked' ? 'sold' : 
      'available';
    newPlots[index].status = nextStatus;
    setPlots(newPlots);
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!placementMode || selectedPlotIndex === null) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newPlots = [...plots];
    newPlots[selectedPlotIndex] = {
      ...newPlots[selectedPlotIndex],
      x,
      y
    };
    setPlots(newPlots);
    // Optional: stay in placement mode for fine tuning, or exit
    // setPlacementMode(false);
  };

  const addBulkPlots = () => {
    if (!bulkInput.trim()) return;
    
    // Split by comma or newline
    const nums = bulkInput.split(/[\n,]+/).map(n => n.trim()).filter(Boolean);
    const newPlotsList = [...plots];
    nums.forEach(n => {
      if (!newPlotsList.find(p => p.number === n)) {
        newPlotsList.push({ 
          number: n, 
          status: 'available', 
          x: 50, y: 50, width: 5, height: 3 
        });
      }
    });
    setPlots(newPlotsList);
    setBulkInput('');
  };

  const handleQuickAdd = () => {
    if (!quickAddNumber.trim()) return;
    
    if (!plots.find(p => p.number === quickAddNumber.trim())) {
      setPlots([...plots, { 
        number: quickAddNumber.trim(), 
        status: 'available', 
        x: 50, y: 50, width: 5, height: 3 
      }]);
      
      // Try to increment the number
      const num = parseInt(quickAddNumber);
      if (!isNaN(num)) {
        setQuickAddNumber((num + 1).toString());
      } else {
        setQuickAddNumber('');
      }
    } else {
      alert('Plot number already exists!');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-white dark:bg-[#050505] flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
    </div>
  );

  const availableCount = plots.filter(p => p.status === 'available').length;
  const bookedCount = plots.filter(p => p.status === 'booked').length;
  const soldCount = plots.filter(p => p.status === 'sold').length;

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] flex flex-col font-sans text-black dark:text-white pb-20">
      {/* Header */}
      <header className="px-6 md:px-10 py-6 border-b border-black/10 dark:border-white/10 flex items-center justify-between sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-xl z-[100]">
        <div className="flex items-center gap-4 md:gap-6">
          <button 
            onClick={() => {
              if (window.history.length > 1) {
                router.back();
              } else {
                router.push(`/admin/properties/edit/${id}`);
              }
            }}
            className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-primary hover:text-black transition-all group"
          >
            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h1 className="text-xl md:text-3xl font-black uppercase tracking-tighter text-black dark:text-white">Plot Manager</h1>
            <p className="text-[10px] md:text-xs font-black uppercase tracking-widest text-primary mt-1">{property?.title}</p>
          </div>
        </div>

        <button 
          onClick={handleSave}
          disabled={saving}
          className="px-6 md:px-12 py-4 bg-primary text-black font-black uppercase tracking-widest text-xs rounded-2xl shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          <span className="hidden md:inline">Save Inventory</span>
          <span className="md:hidden">Save</span>
        </button>
      </header>

      <main className="max-w-7xl mx-auto w-full p-6 md:p-10 flex flex-col lg:flex-row gap-10">
        
        {/* Left Side: Controls & Stats */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          {/* Status Overview & Color Customization */}
          <div className="bg-black/5 dark:bg-white/5 rounded-[2rem] p-8 border border-black/10 dark:border-white/10">
            <h3 className="text-sm font-black uppercase tracking-widest mb-6 text-gray-500">Inventory Status</h3>
            <div className="flex items-center justify-between mb-8">
              <span className="text-5xl font-black text-black dark:text-white">{plots.length}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest bg-black/10 dark:bg-white/10 px-4 py-2 rounded-full">Total Plots</span>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-black/50 border border-black/5 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <input 
                    type="color" 
                    value={colors.available} 
                    onChange={(e) => setColors({...colors, available: e.target.value})}
                    className="w-6 h-6 rounded-full overflow-hidden border-none cursor-pointer bg-transparent"
                  />
                  <span className="text-xs font-bold uppercase tracking-widest">Available</span>
                </div>
                <span className="font-black">{availableCount}</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <input 
                    type="color" 
                    value={colors.booked} 
                    onChange={(e) => setColors({...colors, booked: e.target.value})}
                    className="w-6 h-6 rounded-full overflow-hidden border-none cursor-pointer bg-transparent"
                  />
                  <span className="text-xs font-bold uppercase tracking-widest">Booked</span>
                </div>
                <span className="font-black">{bookedCount}</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <input 
                    type="color" 
                    value={colors.sold} 
                    onChange={(e) => setColors({...colors, sold: e.target.value})}
                    className="w-6 h-6 rounded-full overflow-hidden border-none cursor-pointer bg-transparent"
                  />
                  <span className="text-xs font-bold uppercase tracking-widest">Sold</span>
                </div>
                <span className="font-black">{soldCount}</span>
              </div>
            </div>
            <p className="mt-4 text-[9px] text-gray-400 uppercase font-black tracking-widest text-center">Click color circles to customize</p>
          </div>

          {/* Search Plots */}
          <div className="bg-black/5 dark:bg-white/5 rounded-[2rem] p-8 border border-black/10 dark:border-white/10 flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
              <Search size={18} className="text-primary" />
              <h3 className="text-sm font-black uppercase tracking-widest text-black dark:text-white">Search Inventory</h3>
            </div>
            <div className="relative">
              <input 
                type="text"
                placeholder="Find Plot Number..." 
                className="w-full bg-white dark:bg-black rounded-xl px-4 py-4 text-sm font-bold border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-primary/50 outline-none text-black dark:text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-black/5 rounded-full"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Sequential Add Tool */}
          <div className="bg-black/5 dark:bg-white/5 rounded-[2rem] p-8 border border-black/10 dark:border-white/10 flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
              <Hash size={18} className="text-primary" />
              <h3 className="text-sm font-black uppercase tracking-widest text-black dark:text-white">Quick Add Plot</h3>
            </div>
            <div className="flex gap-2">
              <input 
                type="text"
                placeholder="Plot Number (e.g. 101)" 
                className="flex-grow bg-white dark:bg-black rounded-xl px-4 py-4 text-sm font-bold border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-primary/50 outline-none text-black dark:text-white"
                value={quickAddNumber}
                onChange={(e) => setQuickAddNumber(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleQuickAdd()}
              />
              <button 
                onClick={handleQuickAdd}
                className="p-4 bg-primary text-black rounded-xl hover:scale-105 active:scale-95 transition-all"
              >
                <Plus size={20} />
              </button>
            </div>
            <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest">Adds plot and suggests next number</p>
          </div>

          {/* Bulk Add Tool */}
          <div className="bg-black/5 dark:bg-white/5 rounded-[2rem] p-8 border border-black/10 dark:border-white/10 flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
              <Plus size={18} className="text-primary" />
              <h3 className="text-sm font-black uppercase tracking-widest text-black dark:text-white">Bulk Add Plots</h3>
            </div>
            <textarea 
              placeholder="Enter plot numbers separated by commas or newlines (e.g. 101, 102, 103)" 
              className="w-full h-32 bg-white dark:bg-black rounded-xl px-4 py-4 text-sm font-bold border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-primary/50 outline-none resize-none text-black dark:text-white"
              value={bulkInput}
              onChange={(e) => setBulkInput(e.target.value)}
            />
            <button 
              onClick={addBulkPlots}
              disabled={!bulkInput.trim()}
              className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
            >
              Add Plots to Grid
            </button>
          </div>
          
          <div className="p-6 bg-primary/10 rounded-[2rem] border border-primary/20">
             <div className="flex items-start gap-3 text-primary">
                <Info size={20} className="shrink-0 mt-0.5" />
                <p className="text-xs font-bold leading-relaxed">
                   <strong>Quick Edit:</strong> Click any plot card in the grid to instantly cycle its status (Available → Booked → Sold). In Map mode, click a plot then click on the map to position it.
                </p>
             </div>
          </div>
        </div>

        {/* Right Side: Interactive Area */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-black/5 dark:bg-white/5 p-4 rounded-2xl border border-black/10 dark:border-white/10">
             <div className="flex items-center gap-2 p-1 bg-black/10 dark:bg-white/10 rounded-xl">
                <button 
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'grid' ? 'bg-primary text-black' : 'hover:bg-white/5'}`}
                >
                  <LayoutGrid size={14} /> Grid
                </button>
                <button 
                  onClick={() => setViewMode('map')}
                  disabled={!property?.layoutImage}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'map' ? 'bg-primary text-black' : 'hover:bg-white/5'} disabled:opacity-30`}
                >
                  <MapIcon size={14} /> Map
                </button>
                <button 
                  onClick={() => setViewMode('table')}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${viewMode === 'table' ? 'bg-primary text-black' : 'hover:bg-white/5'}`}
                >
                  <TableIcon size={14} /> Table
                </button>
             </div>
             
             <button
               onClick={() => setDeleteMode(!deleteMode)}
               className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 justify-center ${
                 deleteMode 
                   ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 ring-2 ring-red-500 ring-offset-2 ring-offset-white dark:ring-offset-[#050505]' 
                   : 'bg-black/10 dark:bg-white/10 hover:bg-red-500/10 hover:text-red-500'
               }`}
             >
               <Trash size={14} />
               {deleteMode ? 'Delete Mode Active' : 'Enable Delete Mode'}
             </button>
          </div>

          <div className="bg-black/5 dark:bg-white/5 rounded-[3rem] border border-black/10 dark:border-white/10 overflow-hidden flex-grow">
            {viewMode === 'grid' && (
              (plots.length === 0 || (searchQuery && plots.filter(p => p.number.toLowerCase().includes(searchQuery.toLowerCase())).length === 0)) ? (
                <div className="flex flex-col items-center justify-center text-center p-20">
                  <LayoutGrid size={48} className="text-gray-300 dark:text-gray-700 mb-4" />
                  <h3 className="text-xl font-black uppercase tracking-tighter mb-2 text-gray-500">
                    {searchQuery ? 'No Plots Match Search' : 'No Plots Added Yet'}
                  </h3>
                </div>
              ) : (
                <div className="p-8 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 auto-rows-max">
                  <AnimatePresence>
                    {plots
                      .map((p, i) => ({ ...p, originalIndex: i }))
                      .filter(p => p.number.toLowerCase().includes(searchQuery.toLowerCase()))
                      .map((plot) => (
                        <motion.button
                          key={plot.number + plot.originalIndex}
                          layout
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          onClick={() => handlePlotClick(plot.originalIndex)}
                        style={{ 
                          backgroundColor: plot.status === 'sold' ? colors.sold : 
                                         plot.status === 'booked' ? colors.booked : 
                                         colors.available,
                          color: isLightColor(plot.status === 'sold' ? colors.sold : plot.status === 'booked' ? colors.booked : colors.available) ? '#000000' : '#ffffff',
                          borderColor: 'rgba(0,0,0,0.1)'
                        }}
                        className={`
                          relative aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 transition-all
                          border-2 shadow-sm group
                          ${deleteMode 
                            ? 'hover:border-red-500 hover:bg-red-500/10 cursor-alias' 
                            : 'hover:scale-105 active:scale-95 cursor-pointer'
                          }
                          ${plot.status === 'available' ? 'dark:text-black' : ''}
                        `}
                      >
                        <span className="text-lg md:text-xl font-black tracking-tighter">{plot.number}</span>
                        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-black/10`}>
                          {plot.status}
                        </span>

                        {deleteMode && (
                          <div className="absolute inset-0 bg-red-500/90 backdrop-blur-sm rounded-2xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all text-white">
                            <Trash size={24} />
                          </div>
                        )}
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </div>
              )
            )}

            {viewMode === 'map' && property.layoutImage && (
              <div className="flex flex-col h-full min-h-[600px]">
                 <div className="bg-primary/10 p-4 flex items-center justify-center border-b border-primary/20">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                       {selectedPlotIndex !== null 
                         ? `Currently Positioning: Plot ${plots[selectedPlotIndex]?.number} • Click on map to move` 
                         : 'Select a plot below to position it on the map'}
                    </p>
                 </div>
                 
                 <div 
                    data-lenis-prevent
                    className="relative flex-grow bg-black flex items-center justify-center overflow-hidden p-4 cursor-crosshair group/map-canvas"
                    onWheel={handleWheel}
                    onClick={handleMapClick}
                  >
                    {/* Fullscreen Trigger */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); setIsFullscreenMap(true); }}
                      className="absolute top-6 right-6 z-30 bg-white/10 hover:bg-primary text-white hover:text-black p-3 rounded-xl backdrop-blur-md transition-all opacity-0 group-hover/map-canvas:opacity-100 shadow-xl border border-white/10"
                    >
                      <Maximize size={20} />
                    </button>

                    <div 
                      className="relative transition-transform duration-200 ease-out inline-block"
                      style={{ transform: `scale(${zoom})` }}
                    >
                      <img 
                        src={property.layoutImage} 
                        alt="Layout" 
                        className="max-w-full max-h-[70vh] object-contain rounded-xl select-none"
                      />
                      
                      {/* Plot Markers Removed as requested */}
                    </div>
                    
                    <div className="absolute bottom-6 right-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/50 pointer-events-none z-20">
                       Hold CTRL + Scroll to Zoom • {Math.round(zoom * 100)}%
                    </div>
                  </div>

                  {/* Selected Plot Selector in Map View */}
                  <div className="p-4 bg-black/5 border-t border-black/10 overflow-x-auto custom-scrollbar flex gap-2">
                     {plots.map((plot, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setSelectedPlotIndex(idx);
                            setPlacementMode(true);
                          }}
                          className={`
                            shrink-0 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
                            ${selectedPlotIndex === idx ? 'bg-primary text-black' : 'bg-white/5 text-gray-500 hover:text-white'}
                          `}
                        >
                           Plot {plot.number}
                        </button>
                     ))}
                  </div>
              </div>
            )}

            {viewMode === 'table' && (
              <div className="p-6 overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 border-b border-black/10 dark:border-white/10">
                      <th className="px-6 py-4">Plot Number</th>
                      <th className="px-6 py-4">Plot Status</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 dark:divide-white/5">
                    {plots.map((plot, idx) => (
                      <tr key={idx} className="group hover:bg-black/5 dark:hover:bg-white/10 transition-all">
                        <td className="px-6 py-5">
                          <span className="text-base font-black text-black dark:text-white">{plot.number}</span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-3 h-3 rounded-full shadow-sm" 
                              style={{ backgroundColor: plot.status === 'sold' ? colors.sold : plot.status === 'booked' ? colors.booked : colors.available }}
                            />
                            <select 
                              value={plot.status}
                              onChange={(e) => {
                                const newPlots = [...plots];
                                newPlots[idx].status = e.target.value as any;
                                setPlots(newPlots);
                              }}
                              className="bg-transparent text-[10px] font-black uppercase tracking-widest py-1 outline-none cursor-pointer text-black dark:text-white"
                            >
                              <option value="available" className="text-black">Available</option>
                              <option value="booked" className="text-black">Booked</option>
                              <option value="sold" className="text-black">Sold</option>
                            </select>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <button 
                            onClick={() => {
                              setPlots(plots.filter((_, i) => i !== idx));
                            }}
                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                          >
                            <Trash size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {plots.length === 0 && (
                      <tr>
                        <td colSpan={4} className="px-6 py-10 text-center text-sm font-bold text-gray-500 uppercase tracking-widest">
                           No units added yet
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

      </main>

      {/* Fullscreen Map Modal */}
      <AnimatePresence>
        {isFullscreenMap && property?.layoutImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-white/95 dark:bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-10"
          >
             {/* Close Icon - Placed Perfectly */}
             <button 
               onClick={() => setIsFullscreenMap(false)}
               className="absolute top-6 right-6 md:top-10 md:right-10 z-[1010] bg-black/10 dark:bg-white/10 hover:bg-red-500 text-black dark:text-white hover:text-white p-5 rounded-2xl transition-all shadow-2xl border border-black/10 dark:border-white/10 group"
             >
               <X size={32} className="group-hover:rotate-90 transition-transform duration-300" />
             </button>

             <div className="w-full h-full relative flex items-center justify-center overflow-auto custom-scrollbar" onClick={() => setIsFullscreenMap(false)}>
                <div 
                  className="relative transition-transform duration-200"
                  style={{ transform: `scale(${zoom * 1.5})` }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <img 
                    src={property.layoutImage} 
                    alt="Layout Expanded" 
                    className="max-w-full max-h-[85vh] object-contain rounded-3xl shadow-2xl"
                  />
                </div>
                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-8 py-4 rounded-2xl text-white text-xs font-black uppercase tracking-[0.3em] pointer-events-none border border-white/10">
                   Interactive Fullscreen Mode
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPlotManagement;
