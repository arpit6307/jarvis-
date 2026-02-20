import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, FolderSearch, Clock, Settings, 
  Zap, Bell, User, ArrowUpRight, ShieldCheck, 
  LogOut, Box, Cpu
} from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from "firebase/auth";

// Electron IPC communication
const { ipcRenderer } = window.require('electron');

const Dashboard = () => {
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({ moved: 0, foldersProcessed: 0 });
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = () => signOut(auth);

  const handleOrganize = async () => {
    try {
      const folderPath = await ipcRenderer.invoke('select-folder');
      if (!folderPath) return;

      setIsProcessing(true);
      const result = await ipcRenderer.invoke('organize-folder', folderPath);
      
      if (result.success) {
        const newLog = {
          id: Date.now(),
          path: folderPath.split('\\').pop() || folderPath.split('/').pop(),
          count: result.count,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        setLogs(prev => [newLog, ...prev].slice(0, 10)); // Top 10 activities only
        setStats(prev => ({ 
          moved: prev.moved + result.count, 
          foldersProcessed: prev.foldersProcessed + 1 
        }));
        
        // Success par folder open karega
        await ipcRenderer.invoke('open-explorer', folderPath);
      }
    } catch (error) {
      console.error("Zenith Engine Error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="dashboard-layout">
      {/* --- LEFT SIDEBAR (Futuristic Glass) --- */}
      <aside className="sidebar">
        <div style={{ padding: '0 10px', marginBottom: '40px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="dot" style={{ width: '12px', height: '12px' }}></div>
            <h2 style={{ letterSpacing: '3px', margin: 0, fontSize: '1.5rem', fontWeight: '900' }}>ZENITH</h2>
          </div>
          <p style={{ fontSize: '10px', color: 'var(--text-dim)', marginTop: '5px' }}>PREMIUM SYSTEM v1.0.6</p>
        </div>

        <nav style={{ flexGrow: 1 }}>
          <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <LayoutDashboard size={20} /> Dashboard
          </div>
          <div className={`nav-item ${activeTab === 'scanner' ? 'active' : ''}`} onClick={() => setActiveTab('scanner')}>
            <FolderSearch size={20} /> Smart Scanner
          </div>
          <div className={`nav-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
            <Clock size={20} /> Activity Log
          </div>
          <div className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>
            <Settings size={20} /> System Config
          </div>
        </nav>

        <div className="nav-item" onClick={handleLogout} style={{ marginTop: 'auto', color: '#ef4444' }}>
          <LogOut size={20} /> Terminate Session
        </div>
      </aside>

      {/* --- MAIN PANEL --- */}
      <main className="main-panel">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontSize: '2rem', margin: 0 }}>System Initialized.</h1>
            <p style={{ color: 'var(--text-dim)' }}>Welcome back, <span style={{ color: 'var(--primary)' }}>{auth.currentUser?.displayName || 'Chief'}</span></p>
          </div>
          
          <div style={{ display: 'flex', gap: '15px' }}>
            <div className="icon-circle" style={{ width: '50px', height: '50px', border: '1px solid var(--glass-border)' }}>
              <Bell size={20} />
            </div>
            <div className="icon-circle" style={{ width: '50px', height: '50px', border: '1px solid var(--primary)', background: 'var(--glass)' }}>
              <User size={20} />
            </div>
          </div>
        </header>

        {/* Top Analytics Cards */}
        <div className="insight-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '30px' }}>
          <div className="glass-card" style={{ padding: '20px' }}>
            <Box size={20} color="var(--primary)" />
            <h3 style={{ margin: '10px 0 5px' }}>{stats.moved}</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Files Optimized</p>
          </div>
          <div className="glass-card" style={{ padding: '20px' }}>
            <Cpu size={20} color="#10b981" />
            <h3 style={{ margin: '10px 0 5px' }}>{stats.foldersProcessed}</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Operations Run</p>
          </div>
          <div className="glass-card" style={{ padding: '20px' }}>
            <ShieldCheck size={20} color="#f59e0b" />
            <h3 style={{ margin: '10px 0 5px' }}>Encrypted</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-dim)' }}>Data Security</p>
          </div>
        </div>

        {/* Main Automation Hub */}
        <div className="insight-grid">
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div 
              className={`scan-btn-large ${isProcessing ? 'processing' : ''}`} 
              onClick={!isProcessing ? handleOrganize : null}
              style={{ borderStyle: isProcessing ? 'solid' : 'dashed' }}
            >
              <div className="icon-circle" style={{ width: '70px', height: '70px', margin: '0 auto 20px', background: 'rgba(99, 102, 241, 0.1)' }}>
                <Zap size={30} fill={isProcessing ? 'var(--primary)' : 'none'} />
              </div>
              <h2 style={{ margin: '0 0 10px' }}>{isProcessing ? 'System Syncing...' : 'Initiate Smart Sort'}</h2>
              <p style={{ color: 'var(--text-dim)', fontSize: '14px' }}>AI will analyze extensions and categorize instantly.</p>
              
              {isProcessing && (
                <div className="progress-wrapper" style={{ margin: '20px auto' }}>
                  <div className="progress-track"><div className="progress-fill" style={{ width: '100%', transition: 'width 2s' }}></div></div>
                </div>
              )}
            </div>
          </div>

          <div className="glass-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ margin: 0 }}>Live Activity Feed</h3>
              <ArrowUpRight size={18} color="var(--primary)" />
            </div>
            <div className="activity-log">
              {logs.length > 0 ? logs.map(log => (
                <div key={log.id} className="log-entry">
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ color: 'white', fontWeight: '600' }}>📁 {log.path}</span>
                    <span style={{ fontSize: '11px' }}>Sorted {log.count} elements</span>
                  </div>
                  <span style={{ fontSize: '11px', color: 'var(--primary)' }}>{log.time}</span>
                </div>
              )) : (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-dim)' }}>
                  <p>No activity detected in current session.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;