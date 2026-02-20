import React, { useState } from 'react';
import { auth, db } from './firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile,
  sendPasswordResetEmail 
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { Eye, EyeOff, Mail, Lock, User, UserPlus, LogIn, ShieldCheck, HelpCircle } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  // States for Input
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // 1. Forgot Password Logic
  const handleForgotPassword = async () => {
    if (!email) {
      setError("Pehle apni Email ID likhiye!");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset link aapki email par bhej diya gaya hai!");
      setError('');
    } catch (err) {
      setError("Error: " + err.message);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        if (password !== confirmPassword) {
          setError("Passwords match nahi ho rahe!");
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, { displayName: fullName });
        await setDoc(doc(db, "users", userCredential.user.uid), {
          uid: userCredential.user.uid,
          displayName: fullName,
          email: email,
          createdAt: new Date()
        });
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: '25px' }}>
          <div className="icon-circle" style={{ margin: '0 auto 15px', background: 'rgba(99, 102, 241, 0.1)' }}>
            <ShieldCheck size={32} color="var(--primary)" />
          </div>
          <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '800' }}>Zenith</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>
            {isLogin ? 'Welcome back, Chief' : 'Create your professional account'}
          </p>
        </div>

        {/* Error and Success Messages */}
        {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '0.8rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>{error}</div>}
        {message && <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '0.8rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>{message}</div>}

        <form onSubmit={handleAuth}>
          {!isLogin && (
            <div className="input-container">
              <User size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input className="zenith-input" style={{ paddingLeft: '45px' }} type="text" placeholder="Full Name" onChange={(e) => setFullName(e.target.value)} required />
            </div>
          )}

          <div className="input-container">
            <Mail size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            <input className="zenith-input" style={{ paddingLeft: '45px' }} type="email" placeholder="Email Address" onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="input-container">
            <Lock size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            <input className="zenith-input" style={{ paddingLeft: '45px' }} type={showPassword ? "text" : "password"} placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
            <div className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>

          {!isLogin && (
            <div className="input-container">
              <ShieldCheck size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input className="zenith-input" style={{ paddingLeft: '45px' }} type={showPassword ? "text" : "password"} placeholder="Confirm Password" onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
          )}

          {/* 2. Forgot Password Button (Only on Login Page) */}
          {isLogin && (
            <div style={{ textAlign: 'right', marginBottom: '15px' }}>
              <span 
                onClick={handleForgotPassword} 
                style={{ color: 'var(--text-dim)', fontSize: '0.8rem', cursor: 'pointer', transition: '0.3s' }}
                onMouseOver={(e) => e.target.style.color = 'var(--primary)'}
                onMouseOut={(e) => e.target.style.color = 'var(--text-dim)'}
              >
                Forgot Password?
              </span>
            </div>
          )}

          <button className="zenith-btn" type="submit">
            {isLogin ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <LogIn size={18} /> Login
              </span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <UserPlus size={18} /> Create Zenith Account
              </span>
            )}
          </button>
        </form>

        <div style={{ marginTop: '25px', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-dim)', fontSize: '14px' }}>
            {isLogin ? "New to Zenith?" : "Already have an account?"}
            <span 
              onClick={() => { setIsLogin(!isLogin); setError(''); setMessage(''); }} 
              style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: '600', marginLeft: '8px' }}
            >
              {isLogin ? "Sign Up Now" : "Log In"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;