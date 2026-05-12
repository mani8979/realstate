'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import { 
  ArrowLeft, Save, Loader2, List, LayoutGrid, 
  Trash, Check, Plus, Hash, Settings, Info
} from 'lucide-react';
import { motion } from 'framer-motion';

const AdminPlotManagement = () => {
  const { id } = useParams();
  const router = useRouter();
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [plots, setPlots] = useState<any[]>([]);
  const [selectedPlotIndex, setSelectedPlotIndex] = useState<number | null>(null);
  const [bulkInput, setBulkInput] = useState('');
  
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

  const cycleStatus = (index: number) => {
    const newPlots = [...plots];
    const currentStatus = newPlots[index].status;
    const nextStatus = 
      currentStatus === 'available' ? 'booked' : 
      currentStatus === 'booked' ? 'sold' : 
      'available';
    newPlots[index].status = nextStatus;
    setPlots(newPlots);
  };

  const updatePlotField = (index: number, field: string, value: any) => {
    const newPlots = [...plots];
    newPlots[index] = { ...newPlots[index], [field]: value };
    setPlots(newPlots);
  };

  const removePlot = (index: number) => {
    setPlots(plots.filter((_, i) => i !== index));
    setSelectedPlotIndex(null);
  };

  const addSinglePlot = () => {
    const nextNum = plots.length > 0 ? (parseInt(plots[plots.length - 1].number) + 1).toString() : "1";
    setPlots([...plots, { 
      number: nextNum, 
      status: 'available', 
      x: 50, 
      y: 50, 
      width: 5, 
      height: 3 
    }]);
  };

  const addBulkPlots = () => {
    if (!bulkInput.trim()) return;
    const nums = bulkInput.split(',').map(n => n.trim()).filter(Boolean);
    const newPlotsList = [...plots];
    nums.forEach(n => {
      if (!newPlotsList.find(p => p.number === n)) {
        newPlotsList.push({ 
          number: n, 
          status: 'available', 
          x: 50, 
          y: 50, 
          width: 5, 
          height: 3 
        });
      }
    });
    setPlots(newPlotsList);
    setBulkInput('');
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
    </div>
  );

  if (!property?.layoutImage) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-10">
      <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">No Layout Map Found</h2>
      <p className="text-gray-500 mb-8">Please upload a layout map image in the property settings first.</p>
      <button onClick={() => router.back()} className="text-primary font-bold uppercase tracking-widest text-xs underline">Go Back</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#050505] flex flex-col">
      {/* Header */}
      <header className="px-6 md:px-10 py-6 border-b border-black/10 dark:border-white/10 flex items-center justify-between sticky top-0 bg-white/80 dark:bg-black/80 backdrop-blur-xl z-[100]">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => router.back()}
            className="p-3 rounded-2xl bg-black/5 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-black dark:text-white transition-all"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter text-black dark:text-white">Unit Inventory Manager</h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-primary mt-1">{property.title}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-8 md:px-12 py-4 bg-primary text-black font-black uppercase tracking-widest text-xs rounded-2xl shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            <span>Save Inventory</span>
          </button>
        </div>
      </header>

      <main className="flex-grow flex flex-col lg:flex-row h-[calc(100vh-100px)] overflow-hidden">
        {/* Table/Editor Side - Now taking primary focus */}
        <div className="lg:w-1/2 h-full bg-white dark:bg-[#080808] flex flex-col p-6 md:p-10 overflow-hidden border-r border-black/10 dark:border-white/10">
          <div className="flex items-center justify-between mb-8 flex-shrink-0">
             <div className="flex items-center gap-3">
                <List size={20} className="text-primary" />
                <h3 className="text-xl font-black uppercase tracking-tighter text-black dark:text-white">Plot Status Directory</h3>
             </div>
             <button 
               onClick={addSinglePlot}
               className="p-3 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-black transition-all"
               title="Add Single Plot"
             >
               <Plus size={20} />
             </button>
          </div>

          {/* Bulk Add Tool */}
          <div className="mb-8 p-6 bg-black/5 dark:bg-white/5 rounded-3xl border border-black/10 dark:border-white/10 space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 px-1">Bulk Add Plots (Comma Separated)</label>
            <div className="flex gap-4">
               <input 
                 type="text" 
                 placeholder="e.g. 101, 102, 103..." 
                 className="flex-grow bg-white dark:bg-black rounded-xl px-6 py-4 text-sm font-bold border border-black/10 dark:border-white/10 focus:ring-2 focus:ring-primary/50 outline-none"
                 value={bulkInput}
                 onChange={(e) => setBulkInput(e.target.value)}
                 onKeyPress={(e) => e.key === 'Enter' && addBulkPlots()}
               />
               <button 
                 onClick={addBulkPlots}
                 className="px-6 py-4 bg-black dark:bg-white text-white dark:text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all"
               >
                 Add All
               </button>
            </div>
            <p className="text-[9px] text-gray-500 font-medium px-1">Note: Plot positions are set to center (50,50) by default when added here.</p>
          </div>

          <div className="flex-grow overflow-y-auto pr-4 custom-scrollbar">
            <table className="w-full text-left border-separate border-spacing-y-3">
              <thead className="sticky top-0 bg-white dark:bg-[#080808] z-10">
                <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                  <th className="px-6 py-4">Plot Number</th>
                  <th className="px-6 py-4 text-center">Status (Click to cycle)</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {plots.map((plot, idx) => (
                  <tr 
                    key={idx} 
                    className={`group transition-all ${selectedPlotIndex === idx ? 'bg-primary/10' : 'bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:bg-white/10'}`}
                    onClick={() => setSelectedPlotIndex(idx)}
                  >
                    <td className="px-6 py-5 rounded-l-2xl">
                       <div className="flex items-center gap-3">
                         <Hash size={14} className="text-primary" />
                         <input 
                            type="text" 
                            value={plot.number}
                            onChange={(e) => updatePlotField(idx, 'number', e.target.value)}
                            className="bg-transparent border-none focus:ring-0 p-0 text-sm font-black text-black dark:text-white w-full"
                         />
                       </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                       <button
                         onClick={(e) => { e.stopPropagation(); cycleStatus(idx); }}
                         className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border shadow-sm ${
                           plot.status === 'sold' ? 'bg-yellow-400 text-black border-yellow-300' :
                           plot.status === 'booked' ? 'bg-green-500 text-black dark:text-white border-green-400' :
                           'bg-white text-black border-gray-100'
                         }`}
                       >
                         {plot.status}
                       </button>
                    </td>
                    <td className="px-6 py-5 text-right rounded-r-2xl">
                       <button 
                         onClick={(e) => { e.stopPropagation(); removePlot(idx); }}
                         className="text-gray-400 hover:text-red-500 transition-colors p-2"
                       >
                         <Trash size={16} />
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Visualization Map Side - Now Read Only */}
        <div className="lg:w-1/2 h-full bg-black/5 dark:bg-white/5 p-6 md:p-10 flex flex-col gap-6 overflow-hidden">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
                <LayoutGrid size={20} className="text-primary" />
                <h3 className="text-xl font-black uppercase tracking-tighter text-black dark:text-white">Layout Preview</h3>
             </div>
             <div className="flex items-center gap-2 bg-yellow-400/10 px-4 py-2 rounded-xl border border-yellow-400/20">
                <Info size={14} className="text-yellow-500" />
                <span className="text-[10px] font-black text-yellow-500 uppercase tracking-widest">Read-Only Preview</span>
             </div>
          </div>

          <div className="flex-grow bg-white dark:bg-black rounded-[3rem] border border-black/10 dark:border-white/10 overflow-hidden relative shadow-2xl flex items-center justify-center">
            <div className="relative max-w-full max-h-full">
              <Image 
                src={property.layoutImage} 
                alt="Layout Map" 
                width={4000} 
                height={3000} 
                className="w-auto h-auto max-w-full max-h-[70vh] select-none object-contain rounded-2xl opacity-80" 
              />
              
              {plots.map((plot, idx) => (
                <div
                  key={idx}
                  style={{
                    position: 'absolute',
                    left: `${plot.x}%`,
                    top: `${plot.y}%`,
                    width: `${plot.width || 5}%`,
                    height: `${plot.height || 3}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className={`rounded-md border shadow-2xl flex items-center justify-center text-[8px] font-black z-30 transition-all ${
                    selectedPlotIndex === idx ? 'ring-4 ring-primary scale-125 z-50' : ''
                  } ${
                    plot.status === 'sold'   ? 'bg-yellow-400 text-black border-yellow-300' :
                    plot.status === 'booked' ? 'bg-green-500 text-black dark:text-white border-green-400' :
                                               'bg-white text-black border-gray-200'
                  }`}
                >
                  {plot.number}
                </div>
              ))}
            </div>
            
            {/* Legend Overlay */}
            <div className="absolute bottom-10 left-10 flex gap-4 p-4 bg-white/80 dark:bg-black/80 backdrop-blur-xl rounded-2xl border border-black/10 dark:border-white/10 shadow-xl">
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded bg-white border border-gray-200"></div>
                 <span className="text-[10px] font-bold uppercase text-gray-500">Available</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded bg-green-500"></div>
                 <span className="text-[10px] font-bold uppercase text-gray-500">Booked</span>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded bg-yellow-400"></div>
                 <span className="text-[10px] font-bold uppercase text-gray-500">Sold</span>
               </div>
            </div>
          </div>

          {/* Quick Selection Tip */}
          <div className="p-6 bg-black text-white dark:bg-white dark:text-black rounded-[2rem] flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-black">
                   <Settings size={20} />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest opacity-50">Editor Mode</p>
                   <p className="text-sm font-black uppercase tracking-tighter">Table-Driven Management</p>
                </div>
             </div>
             <p className="text-[9px] font-bold text-primary uppercase tracking-widest max-w-[200px] text-right">
                All changes made in the table are reflected in the preview. Click statuses in the table to cycle them.
             </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminPlotManagement;
