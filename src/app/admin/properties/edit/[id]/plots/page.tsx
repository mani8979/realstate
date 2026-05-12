'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { 
  ArrowLeft, Save, Loader2, LayoutGrid, 
  Trash, Plus, Hash, Settings, Info, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminPlotManagement = () => {
  const { id } = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [plots, setPlots] = useState<any[]>([]);
  const [bulkInput, setBulkInput] = useState('');
  const [deleteMode, setDeleteMode] = useState(false);
  
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await axios.get(`/api/properties/${id}`);
        setProperty(res.data);
        setPlots(Array.isArray(res.data.plots) ? res.data.plots : []);
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
      await axios.put(`/api/properties/${id}`, { ...property, plots });
      alert('Plot inventory saved successfully!');
    } catch (error) {
      console.error('Error saving plots:', error);
      alert('Failed to save plot inventory.');
    } finally {
      setSaving(false);
    }
  };

  const handlePlotClick = (index: number) => {
    if (deleteMode) {
      setPlots(plots.filter((_, i) => i !== index));
      return;
    }

    // Cycle Status
    const newPlots = [...plots];
    const currentStatus = newPlots[index].status;
    const nextStatus = 
      currentStatus === 'available' ? 'booked' : 
      currentStatus === 'booked' ? 'sold' : 
      'available';
    newPlots[index].status = nextStatus;
    setPlots(newPlots);
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
          // Default positional data just in case it's needed elsewhere
          x: 0, y: 0, width: 5, height: 3 
        });
      }
    });
    setPlots(newPlotsList);
    setBulkInput('');
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
            onClick={() => router.back()}
            className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl md:text-3xl font-black uppercase tracking-tighter">Plot Manager</h1>
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
          {/* Status Overview */}
          <div className="bg-black/5 dark:bg-white/5 rounded-[2rem] p-8 border border-black/10 dark:border-white/10">
            <h3 className="text-sm font-black uppercase tracking-widest mb-6 text-gray-500">Inventory Status</h3>
            <div className="flex items-center justify-between mb-8">
              <span className="text-5xl font-black">{plots.length}</span>
              <span className="text-[10px] font-bold uppercase tracking-widest bg-black/10 dark:bg-white/10 px-4 py-2 rounded-full">Total Plots</span>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-black/50 border border-black/5 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-white border-2 border-gray-200 dark:border-gray-700 shadow-inner"></div>
                  <span className="text-xs font-bold uppercase tracking-widest">Available</span>
                </div>
                <span className="font-black">{availableCount}</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]"></div>
                  <span className="text-xs font-bold uppercase tracking-widest">Booked</span>
                </div>
                <span className="font-black">{bookedCount}</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-yellow-400/10 border border-yellow-400/20 text-yellow-600 dark:text-yellow-400">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.4)]"></div>
                  <span className="text-xs font-bold uppercase tracking-widest">Sold</span>
                </div>
                <span className="font-black">{soldCount}</span>
              </div>
            </div>
          </div>

          {/* Bulk Add Tool */}
          <div className="bg-black/5 dark:bg-white/5 rounded-[2rem] p-8 border border-black/10 dark:border-white/10 flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
              <Plus size={18} className="text-primary" />
              <h3 className="text-sm font-black uppercase tracking-widest">Add New Plots</h3>
            </div>
            <textarea 
              placeholder="Enter plot numbers separated by commas or newlines (e.g. 101, 102, 103)" 
              className="w-full h-32 bg-white dark:bg-black rounded-xl px-4 py-4 text-sm font-bold border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-primary/50 outline-none resize-none"
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
                   <strong>Quick Edit:</strong> Click any plot card in the grid to instantly cycle its status (Available → Booked → Sold).
                </p>
             </div>
          </div>
        </div>

        {/* Right Side: Interactive Grid */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-black/5 dark:bg-white/5 p-4 rounded-2xl border border-black/10 dark:border-white/10">
             <h2 className="text-lg font-black uppercase tracking-tighter px-2">Interactive Grid</h2>
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

          {plots.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-10 bg-black/5 dark:bg-white/5 rounded-[3rem] border border-black/10 dark:border-white/10 border-dashed">
              <LayoutGrid size={48} className="text-gray-300 dark:text-gray-700 mb-4" />
              <h3 className="text-xl font-black uppercase tracking-tighter mb-2 text-gray-500">No Plots Added Yet</h3>
              <p className="text-sm text-gray-400 max-w-sm">Use the tool on the left to add your plot numbers, then manage them here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 auto-rows-max">
              <AnimatePresence>
                {plots.map((plot, idx) => (
                  <motion.button
                    key={plot.number + idx}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    onClick={() => handlePlotClick(idx)}
                    className={`
                      relative aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 transition-all
                      border-2 shadow-sm group
                      ${deleteMode 
                        ? 'hover:border-red-500 hover:bg-red-500/10 cursor-alias' 
                        : 'hover:scale-105 active:scale-95 cursor-pointer'
                      }
                      ${plot.status === 'sold' ? 'bg-yellow-400 border-yellow-500 text-black shadow-yellow-400/20' : 
                        plot.status === 'booked' ? 'bg-green-500 border-green-600 text-black dark:text-white shadow-green-500/20' : 
                        'bg-white dark:bg-[#111] border-gray-200 dark:border-gray-800 text-black dark:text-white'
                      }
                    `}
                  >
                    <span className="text-lg md:text-xl font-black tracking-tighter">{plot.number}</span>
                    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                      plot.status === 'sold' ? 'bg-black/10' :
                      plot.status === 'booked' ? 'bg-black/20' :
                      'bg-black/5 dark:bg-white/5'
                    }`}>
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
          )}
        </div>

      </main>
    </div>
  );
};

export default AdminPlotManagement;
