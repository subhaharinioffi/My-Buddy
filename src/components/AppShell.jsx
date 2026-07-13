import React, { useState, useEffect } from 'react';
import { useNotifications } from './NotificationSystem';
import Logo from './Logo';

import { 
  LayoutDashboard, 
  Map, 
  Calendar, 
  Newspaper, 
  Bell, 
  LogOut, 
  Sparkles, 
  User, 
  Smile, 
  Clock, 
  MessageSquare,
  X,
  Trash2,
  Check,
  Sun,
  Moon
} from 'lucide-react';

export default function AppShell({ 
  user, 
  onLogout, 
  activeTab, 
  setActiveTab, 
  stats, 
  children 
}) {
  const { history, markAllAsRead, clearHistory, addNotification } = useNotifications();
  const [showNotifications, setShowNotifications] = useState(false);
  const [buddyMessage, setBuddyMessage] = useState('');
  const [buddyExpression, setBuddyExpression] = useState('idle'); // idle, talking, happy, sleeping
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (nextTheme === 'light') {
      document.documentElement.classList.add('light-mode');
      addNotification(
        "Let There Be Light! ☀️", 
        "Buddy switched to Bright mode. Your eyes say thank you, and your study session is glowing!", 
        "motivation"
      );
    } else {
      document.documentElement.classList.remove('light-mode');
      addNotification(
        "Stealth Mode Engaged! 🥷", 
        "Going dark... time to focus in the shadows. Sleek and mysterious!", 
        "focus"
      );
    }
  };

  const unreadCount = history.filter(n => !n.read).length;

  // Custom Buddy comments based on screen and state
  const getBuddyComment = () => {
    const hour = new Date().getHours();
    
    // Time-based triggers
    if (hour >= 22) {
      setBuddyExpression('sleeping');
      return "It's getting late, partner! 🌙 Rest is just as important as studying. Don't burn the midnight oil!";
    }
    if (hour < 6) {
      setBuddyExpression('sleeping');
      return "Yawn... early bird gets the worm, but buddy is still half-asleep! 🥱 Let's ease into it.";
    }

    // Streak-based triggers
    if (stats.streak >= 5) {
      setBuddyExpression('happy');
      return `Whoa! A ${stats.streak}-day streak? You're studying harder than a server during Black Friday! 🔥`;
    }

    // View-based triggers
    switch (activeTab) {
      case 'dashboard':
        setBuddyExpression('happy');
        return `Hey ${user.username}! Let's crush today's goals. What are we studying first? 🚀`;
      case 'roadmap':
        setBuddyExpression('talking');
        return "Ah, mapping out the knowledge path! 🗺️ A solid roadmap turns a mountain into small hills. Let's take it node by node.";
      case 'planner':
        setBuddyExpression('talking');
        return "Setting up tasks and timers? ⏱️ Focus like a laser, but don't forget to stand up and stretch every now and then!";
      case 'updates':
        setBuddyExpression('happy');
        return "Time to read up on tech and productivity updates! 📰 Reading expands your horizon (and gives my databases a break!).";
      default:
        setBuddyExpression('idle');
        return "I'm right here if you need a boost of study energy, buddy! ⚡";
    }
  };

  const handleBuddyClick = () => {
    const comment = getBuddyComment();
    setBuddyMessage(comment);
    setShowSpeechBubble(true);
    if (buddyExpression === 'idle') {
      setBuddyExpression('talking');
      setTimeout(() => setBuddyExpression('idle'), 4000);
    }
  };

  // Autoclose speech bubble after 6 seconds
  useEffect(() => {
    if (showSpeechBubble) {
      const timer = setTimeout(() => {
        setShowSpeechBubble(false);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [showSpeechBubble]);

  // Periodic buddy greeting (every 120 seconds, Buddy prompts user)
  useEffect(() => {
    const timer = setTimeout(() => {
      // Small prompt after entry
      setBuddyMessage(`Welcome, ${user.username}! Let's make today count! Click me for tips. 🤖`);
      setBuddyExpression('happy');
      setShowSpeechBubble(true);
    }, 4000);

    const interval = setInterval(() => {
      if (!showSpeechBubble) {
        const comment = getBuddyComment();
        setBuddyMessage(comment);
        setShowSpeechBubble(true);
      }
    }, 180000); // 3 minutes

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [activeTab, user.username, stats.streak]);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'roadmap', label: 'Study Roadmap', icon: <Map size={20} /> },
    { id: 'planner', label: 'Study Planner', icon: <Calendar size={20} /> },
    { id: 'updates', label: 'Daily Updates', icon: <Newspaper size={20} /> },
  ];

  return (
    <div className="app-container">
      {/* SIDEBAR NAVIGATION */}
      <aside className="sidebar glass-panel" style={{ padding: '24px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px', padding: '0 4px' }}>
          <Logo showText={false} size={42} />
          <span className="logo-text" style={{
            fontFamily: 'var(--font-family-title)',
            fontWeight: 800,
            fontSize: '1.25rem',
            background: 'linear-gradient(to right, var(--text-primary), var(--accent-violet))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.5px'
          }}>
            My Buddy
          </span>
        </div>

        {/* Menu list */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          {navigationItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '12px 16px',
                  background: isActive ? 'rgba(99, 102, 241, 0.12)' : 'transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-muted)',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.95rem',
                  textAlign: 'left',
                  transition: 'var(--transition-smooth)',
                  borderLeft: isActive ? '3px solid var(--accent-indigo)' : '3px solid transparent',
                  paddingLeft: isActive ? '13px' : '16px'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'var(--text-muted)';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                {item.icon}
                <span className="nav-text">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User profile / Logout */}
        <div className="user-info" style={{
          padding: '16px 8px',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(99, 102, 241, 0.2))',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <User size={18} style={{ color: 'var(--accent-emerald)' }} />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {user.username}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {user.email}
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.85rem',
              cursor: 'pointer',
              padding: '6px 8px',
              borderRadius: '8px',
              transition: 'var(--transition-smooth)',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--accent-rose)';
              e.currentTarget.style.background = 'rgba(244, 63, 94, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-muted)';
              e.currentTarget.style.background = 'transparent';
            }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN VIEWPORT */}
      <div className="main-content">
        {/* HEADER BAR */}
        <header className="glass-panel" style={{
          position: 'fixed',
          top: 0,
          left: 'var(--sidebar-width)',
          right: 0,
          height: 'var(--header-height)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 40px',
          borderBottom: '1px solid var(--card-border)',
          zIndex: 90,
          background: 'var(--panel-bg)',
          backdropFilter: 'var(--glass-blur)'
        }}>
          <h2 style={{
            fontFamily: 'var(--font-family-title)',
            fontWeight: 800,
            fontSize: '1.45rem',
            color: 'var(--text-primary)',
            textTransform: 'capitalize'
          }}>
            {activeTab}
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* Quick streak display in header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(244, 63, 94, 0.08)',
              border: '1px solid rgba(244, 63, 94, 0.15)',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '0.82rem',
              color: '#fda4af',
              fontWeight: 600
            }}>
              <span>🔥</span>
              <span>{stats.streak} Day Streak</span>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--card-border)',
                padding: '10px',
                borderRadius: '12px',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'var(--transition-smooth)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--card-border)';
                e.currentTarget.style.color = 'var(--text-muted)';
              }}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Notification Bell */}
            <button
              onClick={() => setShowNotifications(true)}
              style={{
                position: 'relative',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--card-border)',
                padding: '10px',
                borderRadius: '12px',
                color: showNotifications ? 'var(--text-primary)' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'var(--transition-smooth)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--card-border)'}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: 'var(--accent-rose)',
                  color: '#fff',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 10px var(--accent-rose)',
                  animation: 'pulseGlow 2s infinite alternate'
                }}>
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* Tab Children viewport */}
        <main style={{ marginTop: '30px' }}>
          {children}
        </main>
      </div>

      {/* NOTIFICATION HISTORY SLIDE-OUT DRAWER */}
      {showNotifications && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
          zIndex: 999,
          display: 'flex',
          justifyContent: 'flex-end',
          animation: 'fadeIn 0.3s ease'
        }}>
          {/* Dismiss background click */}
          <div onClick={() => setShowNotifications(false)} style={{ flex: 1 }} />
          
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '380px',
            height: '100vh',
            borderLeft: '1px solid var(--card-border)',
            display: 'flex',
            flexDirection: 'column',
            animation: 'slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
            background: 'rgba(10, 15, 30, 0.95)'
          }}>
            {/* Drawer Header */}
            <div style={{
              padding: '24px 20px',
              borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Bell size={20} style={{ color: 'var(--accent-indigo)' }} />
                <h3 style={{ fontFamily: 'var(--font-family-title)', fontWeight: 800, fontSize: '1.2rem', color: '#fff' }}>Notifications</h3>
              </div>
              <button
                onClick={() => setShowNotifications(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Actions */}
            {history.length > 0 && (
              <div style={{
                padding: '12px 20px',
                background: 'rgba(0,0,0,0.15)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '0.8rem'
              }}>
                <button
                  onClick={() => { markAllAsRead(); addNotification("Inbox Cleared ✅", "All notifications marked as read.", "focus"); }}
                  style={{ background: 'transparent', border: 'none', color: 'var(--accent-indigo)', cursor: 'pointer', fontWeight: 600 }}
                >
                  Mark all as read
                </button>
                <button
                  onClick={clearHistory}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Trash2 size={12} /> Clear all
                </button>
              </div>
            )}

            {/* List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
              {history.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
                  <Smile size={32} style={{ marginBottom: '12px', strokeWidth: 1.5 }} />
                  <p style={{ fontSize: '0.9rem' }}>All caught up! Buddy has no alerts for you right now.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {history.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        padding: '14px',
                        background: item.read ? 'rgba(255, 255, 255, 0.02)' : 'rgba(99, 102, 241, 0.05)',
                        border: '1px solid',
                        borderColor: item.read ? 'rgba(255, 255, 255, 0.04)' : 'rgba(99, 102, 241, 0.15)',
                        borderRadius: '10px',
                        position: 'relative'
                      }}
                    >
                      {!item.read && (
                        <span style={{
                          position: 'absolute',
                          top: '16px',
                          right: '16px',
                          width: '6px',
                          height: '6px',
                          background: 'var(--accent-indigo)',
                          borderRadius: '50%'
                        }} />
                      )}
                      <div style={{ fontWeight: 650, fontSize: '0.88rem', color: '#fff', marginBottom: '4px', paddingRight: '12px' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '6px' }}>
                        {item.body}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {item.timestamp}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FLOATING INTERACTIVE BUDDY WIDGET (Bottom Right) */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 998,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        pointerEvents: 'none'
      }}>
        {/* Speech Bubble */}
        {showSpeechBubble && (
          <div style={{
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--accent-indigo)',
            borderRadius: '16px',
            padding: '12px 16px',
            marginBottom: '10px',
            maxWidth: '260px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            color: 'var(--text-primary)',
            fontSize: '0.85rem',
            lineHeight: 1.4,
            position: 'relative',
            pointerEvents: 'auto',
            animation: 'toastSlideIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
          }}>
            {buddyMessage}
            <button
              onClick={() => setShowSpeechBubble(false)}
              style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
            >
              <X size={12} />
            </button>
            {/* Bubble arrow */}
            <div style={{
              position: 'absolute',
              bottom: '-6px',
              right: '26px',
              width: '12px',
              height: '12px',
              background: 'rgba(15, 23, 42, 0.95)',
              borderBottom: '1px solid var(--accent-indigo)',
              borderRight: '1px solid var(--accent-indigo)',
              transform: 'rotate(45deg)'
            }} />
          </div>
        )}

        {/* Animated Buddy Trigger */}
        <button
          onClick={handleBuddyClick}
          style={{
            background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9), rgba(15, 23, 42, 0.9))',
            border: '1px solid var(--accent-indigo)',
            borderRadius: '50%',
            width: '60px',
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 10px 25px rgba(0,0,0,0.4), 0 0 15px var(--accent-indigo-glow)',
            animation: 'buddyFloat 4s ease-in-out infinite',
            pointerEvents: 'auto',
            transition: 'var(--transition-smooth)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent-indigo)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 210, 255, 0.5)';
            e.currentTarget.style.transform = 'scale(1.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent-indigo)';
            e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,0,0,0.4), 0 0 15px var(--accent-indigo-glow)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {/* Mini Robot Face */}
          <svg width="34" height="34" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="10" width="24" height="18" rx="5" fill="rgba(0, 210, 255, 0.1)" stroke="var(--accent-indigo)" strokeWidth="2" />
            <path d="M 18 10 L 18 4" stroke="var(--accent-indigo)" strokeWidth="2" />
            <circle cx="18" cy="3" r="2" fill={buddyExpression === 'sleeping' ? 'var(--accent-amber)' : 'var(--accent-cyan)'} />
            
            {/* Eyes based on expressions */}
            {buddyExpression === 'sleeping' ? (
              <>
                {/* Sleeping eyes - ZZZ arches */}
                <path d="M 11 19 Q 14 21 15 19" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" fill="none" />
                <path d="M 21 19 Q 24 21 25 19" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" fill="none" />
              </>
            ) : buddyExpression === 'happy' ? (
              <>
                {/* Happy upward arches */}
                <path d="M 11 19 Q 13 16 15 19" stroke="var(--accent-cyan)" strokeWidth="2.5" strokeLinecap="round" fill="none" style={{ filter: 'drop-shadow(0 0 2px var(--accent-cyan))' }} />
                <path d="M 21 19 Q 23 16 25 19" stroke="var(--accent-cyan)" strokeWidth="2.5" strokeLinecap="round" fill="none" style={{ filter: 'drop-shadow(0 0 2px var(--accent-cyan))' }} />
              </>
            ) : (
              <>
                {/* Regular circular eyes */}
                <circle cx="13" cy="18" r="2.5" fill="var(--accent-cyan)" style={{ filter: 'drop-shadow(0 0 2px var(--accent-cyan))' }} />
                <circle cx="23" cy="18" r="2.5" fill="var(--accent-cyan)" style={{ filter: 'drop-shadow(0 0 2px var(--accent-cyan))' }} />
              </>
            )}

            {/* Mouth */}
            {buddyExpression === 'sleeping' ? (
              <circle cx="18" cy="23" r="1.5" fill="var(--text-muted)" />
            ) : buddyExpression === 'talking' ? (
              <rect x="15" y="22" width="6" height="3" rx="1.5" fill="var(--accent-cyan)" style={{ filter: 'drop-shadow(0 0 1px var(--accent-cyan))' }} />
            ) : (
              <path d="M 15 22 Q 18 25 21 22" stroke="var(--accent-cyan)" strokeWidth="2" strokeLinecap="round" fill="none" style={{ filter: 'drop-shadow(0 0 1px var(--accent-cyan))' }} />
            )}

            {/* Side ears */}
            <rect x="3" y="15" width="3" height="8" rx="1.5" fill="var(--accent-violet)" />
            <rect x="30" y="15" width="3" height="8" rx="1.5" fill="var(--accent-violet)" />
          </svg>
        </button>
      </div>

      {/* Global CSS styles for drawer animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideLeft {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
