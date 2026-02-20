import React, { useState, useEffect } from 'react';
import { auth } from './firebase'; // Firebase config se auth import
import { onAuthStateChanged, signOut } from "firebase/auth";

// Sahi paths taaki "Module not found" error na aaye
import Auth from './Auth'; 
import Dashboard from './components/Dashboard'; 
import Footer from './components/Footer';

// Professional styling
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // User login status check karne ke liye hook
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Logout function
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  // Loading Screen jab app start ho rahi ho
  if (loading) {
    return (
      <div className="auth-wrapper">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <div className="icon-circle">⌛</div>
          <h2 style={{ color: 'white' }}>Initializing Zenith...</h2>
          <p style={{ color: '#94a3b8' }}>Please wait while we secure your session.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {user ? (
        /* --- Dashboard Layout (Jab user login ho) --- */
        <div className="dashboard-layout">
          {/* Top Navigation Bar */}
          <nav className="zenith-footer" style={{ 
            top: 0, 
            bottom: 'auto', 
            borderTop: 'none', 
            borderBottom: '1px solid var(--glass-border)',
            padding: '10px 40px',
            zIndex: 100
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="dot"></div>
              <span style={{ fontWeight: '800', letterSpacing: '1px', color: 'var(--primary)' }}>
                ZENITH FILE MANAGER
              </span>
            </div>
            
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>{user.email}</span>
              <button 
                onClick={handleLogout}
                className="zenith-btn"
                style={{ 
                  padding: '6px 15px', 
                  fontSize: '12px', 
                  width: 'auto',
                  marginTop: 0 
                }}
              >
                Logout
              </button>
            </div>
          </nav>

          {/* Main Content Area */}
          <main className="main-content" style={{ marginTop: '60px' }}>
            <Dashboard />
          </main>
          
          {/* System Status Footer */}
          <Footer />
        </div>
      ) : (
        /* --- Authentication Page (Jab login na ho) --- */
        <Auth onLoginSuccess={() => console.log("Access Granted to Zenith")} />
      )}
    </div>
  );
}

export default App;