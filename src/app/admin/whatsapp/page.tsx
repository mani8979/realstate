'use client';

import React, { useState, useEffect } from 'react';
import { QrCode, CheckCircle2, AlertCircle, Loader2, LogOut, RefreshCw, Wifi, WifiOff, Smartphone, ShieldCheck, HelpCircle } from 'lucide-react';
import axios from 'axios';

const AdminWhatsApp = () => {
  const [statusData, setStatusData] = useState<{ status: string; qr: string | null; error?: string }>({
    status: 'Connecting to service...',
    qr: null
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [serviceOffline, setServiceOffline] = useState(false);

  const fetchStatus = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await axios.get('/api/whatsapp/status');
      setStatusData(res.data);
      setServiceOffline(res.data.status === 'WhatsApp Service Offline');
    } catch (error) {
      console.error('Error fetching WhatsApp status:', error);
      setStatusData({
        status: 'WhatsApp Service Offline',
        qr: null,
        error: 'Background WhatsApp microservice is not responding.'
      });
      setServiceOffline(true);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  // Poll status every 3 seconds to catch scan events automatically
  useEffect(() => {
    fetchStatus(true);
    const interval = setInterval(() => {
      fetchStatus(false);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    if (!confirm('Are you sure you want to disconnect WhatsApp? This will log you out of this session and clear saved credentials.')) return;
    
    setActionLoading(true);
    try {
      const res = await axios.post('/api/whatsapp/logout');
      if (res.data.success) {
        // Refresh immediately
        await fetchStatus(true);
      } else {
        alert(res.data.message || 'Failed to logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('Could not send logout command to the background service.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleManualRefresh = () => {
    fetchStatus(true);
  };

  const isReady = statusData.status === 'WhatsApp is ready';
  const hasQR = !!statusData.qr;

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center gap-3">
            WhatsApp Integration
            {isReady ? (
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            ) : serviceOffline ? (
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            ) : (
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </span>
            )}
          </h1>
          <p className="text-gray-500">Manage your automated customer engagement and WhatsApp notifications.</p>
        </div>

        <button
          onClick={handleManualRefresh}
          disabled={actionLoading || loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 font-bold rounded-xl border border-gray-100 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all text-sm shrink-0"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh Connection
        </button>
      </div>

      {loading ? (
        <div className="h-96 flex flex-col items-center justify-center space-y-4 bg-white dark:bg-gray-900 rounded-[2.5rem] border border-gray-100 dark:border-gray-800">
          <Loader2 size={40} className="animate-spin text-primary" />
          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Syncing connection state...</p>
        </div>
      ) : serviceOffline ? (
        /* Service Offline Card */
        <div className="bg-white dark:bg-gray-900 p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col items-center text-center space-y-6 max-w-2xl mx-auto">
          <div className="bg-rose-500/10 text-rose-500 p-6 rounded-full">
            <WifiOff size={48} />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">System Status: Offline</h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md">
              The background WhatsApp automation service is offline or starting up. If you just triggered a deployment, please allow a few minutes for the container to initialize.
            </p>
          </div>

          {statusData.error && (
            <div className="w-full bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/10 dark:border-rose-500/20 p-5 rounded-2xl text-left font-mono text-xs text-rose-600 dark:text-rose-400 overflow-x-auto max-h-48 whitespace-pre-wrap shadow-inner">
              <span className="font-bold block mb-2 uppercase tracking-wider text-[10px] text-rose-500">Daemon Crash Log:</span>
              {statusData.error}
            </div>
          )}

          <div className="w-full bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 text-left text-sm text-gray-600 dark:text-gray-400 space-y-4">
            <p className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping inline-block" />
              Connection Troubleshooting:
            </p>
            <ul className="space-y-3 pl-4 list-decimal">
              <li>
                <span className="font-bold text-gray-850 dark:text-gray-200">Wait for Initialization:</span> If the cloud container has just booted, Chromium takes 30-60 seconds to download dependencies and launch.
              </li>
              <li>
                <span className="font-bold text-gray-850 dark:text-gray-200">Re-Poll Service:</span> Click the <span className="bg-gray-250 dark:bg-gray-800 px-2 py-0.5 rounded font-mono text-xs">Refresh Connection</span> button above to trigger an instant handshake attempt.
              </li>
              <li>
                <span className="font-bold text-gray-850 dark:text-gray-200">Verify Server Logs:</span> If the offline state persists for more than 5 minutes, check your Render dashboard service logs to ensure the WhatsApp daemon started successfully.
              </li>
            </ul>
          </div>
        </div>
      ) : isReady ? (
        /* Connected state */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Success panel */}
          <div className="lg:col-span-2 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-zinc-950 p-8 md:p-12 rounded-[2.5rem] shadow-md border border-emerald-500/20 dark:border-emerald-500/10 flex flex-col justify-between space-y-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-500 font-bold px-4 py-2 rounded-full text-xs uppercase tracking-widest">
                <Wifi size={14} />
                Live Connection Active
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight leading-tight">
                  Your WhatsApp is Ready!
                </h2>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-lg">
                  The client has successfully authenticated. The background automation service will now seamlessly broadcast booking intimations and customer replies!
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleLogout}
                disabled={actionLoading}
                className="flex items-center justify-center gap-2 bg-rose-500 hover:bg-rose-600 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-lg shadow-rose-500/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 text-sm"
              >
                {actionLoading ? <Loader2 size={18} className="animate-spin" /> : <LogOut size={18} />}
                Disconnect WhatsApp
              </button>
            </div>
          </div>

          {/* Quick status details */}
          <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 space-y-8 flex flex-col justify-between">
            <div className="space-y-6">
              <h4 className="text-sm font-black uppercase tracking-widest text-gray-500">Service Architecture</h4>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-950/50 rounded-2xl">
                  <div className="bg-emerald-500/15 text-emerald-500 p-2.5 rounded-xl shrink-0">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Auth Method</p>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Local Session Cache</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-950/50 rounded-2xl">
                  <div className="bg-primary/10 text-primary p-2.5 rounded-xl shrink-0">
                    <Smartphone size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Puppeteer Browser</p>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200">Chromium Headless</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-amber-500/5 text-amber-500/90 p-5 rounded-2xl border border-amber-500/10 flex gap-3 text-xs leading-relaxed">
              <HelpCircle size={20} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-bold mb-1">Testing Tip:</p>
                <p>Submit a test booking in the customer site visit form on your website. You should receive an immediate confirmation on WhatsApp!</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Scanner code required */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {/* Instructions card */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-900 p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col justify-between space-y-10">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-500 font-bold px-4 py-2 rounded-full text-xs uppercase tracking-widest">
                <WifiOff size={14} />
                Requires Authentication
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
                  Link Admin WhatsApp
                </h2>
                <p className="text-gray-500 leading-relaxed text-sm">
                  Scan the QR code with WhatsApp Web on your phone to configure dynamic notifications. Once logged in, your device will automatically dispatch site visit confirmations.
                </p>
              </div>
            </div>

            {/* Instruction Steps */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="bg-primary/10 text-primary h-8 w-8 rounded-full flex items-center justify-center text-sm font-black shrink-0">1</div>
                <div>
                  <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm">Open WhatsApp</h4>
                  <p className="text-xs text-gray-500">Launch WhatsApp on your mobile phone.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-primary/10 text-primary h-8 w-8 rounded-full flex items-center justify-center text-sm font-black shrink-0">2</div>
                <div>
                  <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm">Open Linked Devices</h4>
                  <p className="text-xs text-gray-500">Go to Menu / Settings and tap <b>Linked Devices</b> then select <b>Link a Device</b>.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="bg-primary/10 text-primary h-8 w-8 rounded-full flex items-center justify-center text-sm font-black shrink-0">3</div>
                <div>
                  <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm">Scan QR Code</h4>
                  <p className="text-xs text-gray-500">Point your phone camera to scan the QR code displayed on the right.</p>
                </div>
              </div>
            </div>
          </div>

          {/* QR Scan card */}
          <div className="bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-950 dark:to-gray-900 p-8 rounded-[2.5rem] shadow-md border border-gray-100 dark:border-gray-800 flex flex-col items-center justify-center text-center space-y-6">
            <h3 className="text-lg font-black text-gray-800 dark:text-gray-200 uppercase tracking-tight flex items-center gap-2">
              <QrCode size={18} className="text-primary animate-pulse" />
              Scan QR Code
            </h3>

            {hasQR ? (
              <div className="relative group p-4 bg-white dark:bg-white rounded-[2rem] border border-gray-150 shadow-lg overflow-hidden">
                {/* QR Image */}
                <img 
                  src={statusData.qr || ''} 
                  alt="WhatsApp Login QR Code"
                  className="w-56 h-56 object-contain"
                />
                
                {/* Futuristic scanner line overlay */}
                <div className="absolute inset-x-0 h-1 bg-emerald-500/60 shadow-lg shadow-emerald-500 animate-[scan_2s_infinite] pointer-events-none opacity-80" />
              </div>
            ) : (
              <div className="w-56 h-56 flex flex-col items-center justify-center space-y-3 bg-white dark:bg-gray-800 rounded-[2rem] border border-dashed border-gray-300 dark:border-gray-700">
                <Loader2 size={32} className="animate-spin text-primary" />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Generating QR...</p>
              </div>
            )}

            <div className="text-[11px] font-bold text-gray-400 bg-gray-100 dark:bg-gray-800/80 px-4 py-2 rounded-full tracking-wider animate-pulse flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 bg-amber-500 rounded-full inline-block" />
              STATUS: {statusData.status}
            </div>
          </div>
        </div>
      )}

      {/* Embedded Scan Line CSS Animation */}
      <style jsx global>{`
        @keyframes scan {
          0% {
            top: 0%;
          }
          50% {
            top: 100%;
          }
          100% {
            top: 0%;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminWhatsApp;
