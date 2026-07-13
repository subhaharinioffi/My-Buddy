import React, { useState } from 'react';
import { LogIn, UserPlus, Sparkles, ShieldCheck } from 'lucide-react';

export default function AuthScreen({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password || (!isLogin && !username)) {
      setMessage('Please fill out all fields. Buddy is watching! 👀');
      return;
    }
    
    setIsLoading(true);
    setMessage('');

    setTimeout(() => {
      setIsLoading(false);
      onLogin({
        username: isLogin ? email.split('@')[0] : username,
        email: email,
        avatarUrl: null
      });
    }, 1200);
  };

  const handleGuestLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin({
        username: 'Scholar Buddy',
        email: 'scholar@mybuddy.edu',
        isGuest: true
      });
    }, 600);
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background blur decorative circles */}
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '15%',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0) 70%)',
        animation: 'pulseGlow 6s infinite alternate',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '15%',
        width: '350px',
        height: '350px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0) 70%)',
        animation: 'pulseGlow 8s infinite alternate-reverse',
        pointerEvents: 'none'
      }} />

      <div className="glass-card" style={{
        width: '100%',
        maxWidth: '440px',
        position: 'relative',
        zIndex: 10,
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2))',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            marginBottom: '16px'
          }}>
            <Sparkles size={28} className="text-indigo" style={{ color: '#6366f1' }} />
          </div>
          <h2 style={{
            fontFamily: 'var(--font-family-title)',
            fontSize: '1.85rem',
            fontWeight: 800,
            background: 'linear-gradient(to right, #ffffff, #a5b4fc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '6px'
          }}>
            Welcome to My Buddy
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            {isLogin ? 'Log in to sync your study roadmap & stats' : 'Sign up to begin your learning journey'}
          </p>
        </div>

        {/* Tab Selection */}
        <div style={{
          display: 'flex',
          background: 'rgba(0, 0, 0, 0.25)',
          padding: '4px',
          borderRadius: '10px',
          marginBottom: '24px',
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <button
            onClick={() => { setIsLogin(true); setMessage(''); }}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              background: isLogin ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
              color: isLogin ? '#fff' : 'var(--text-muted)',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'var(--transition-smooth)',
              border: isLogin ? '1px solid rgba(99, 102, 241, 0.25)' : '1px solid transparent'
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => { setIsLogin(false); setMessage(''); }}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              background: !isLogin ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
              color: !isLogin ? '#fff' : 'var(--text-muted)',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'var(--transition-smooth)',
              border: !isLogin ? '1px solid rgba(99, 102, 241, 0.25)' : '1px solid transparent'
            }}
          >
            Register
          </button>
        </div>

        {/* Status Message */}
        {message && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.25)',
            color: '#fda4af',
            padding: '12px',
            borderRadius: '10px',
            marginBottom: '20px',
            fontSize: '0.85rem',
            lineHeight: 1.4
          }}>
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="input-group">
              <input
                type="text"
                className="input-field"
                placeholder=" "
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
              <label className="input-label">Username</label>
            </div>
          )}

          <div className="input-group">
            <input
              type="email"
              className="input-field"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            <label className="input-label">Email Address</label>
          </div>

          <div className="input-group" style={{ marginBottom: '28px' }}>
            <input
              type="password"
              className="input-field"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
            <label className="input-label">Password</label>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
            style={{ width: '100%', justifyContent: 'center', padding: '14px', marginBottom: '16px' }}
          >
            {isLoading ? (
              <span className="shimmer-loader" style={{ display: 'inline-block', width: '20px', height: '20px', border: '2.5px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'ringSpin 0.8s linear infinite' }} />
            ) : isLogin ? (
              <>
                <LogIn size={18} /> Sign In to Dashboard
              </>
            ) : (
              <>
                <UserPlus size={18} /> Create Account
              </>
            )}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', color: 'var(--text-muted)' }}>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
          <span style={{ padding: '0 12px', fontSize: '0.8rem' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.06)' }} />
        </div>

        {/* Guest Access */}
        <button
          onClick={handleGuestLogin}
          className="btn-secondary"
          disabled={isLoading}
          style={{
            width: '100%',
            justifyContent: 'center',
            padding: '12px',
            borderColor: 'rgba(16, 185, 129, 0.2)',
            background: 'rgba(16, 185, 129, 0.04)'
          }}
        >
          <ShieldCheck size={18} style={{ color: 'var(--accent-emerald)' }} />
          <span style={{ color: 'var(--accent-emerald)' }}>Explore as Guest (Instant Access)</span>
        </button>
      </div>
    </div>
  );
}
