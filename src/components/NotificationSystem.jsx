import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Bell, X, Sparkles, Trophy, BookOpen, Flame, Smile, AlertCircle } from 'lucide-react';

const NotificationContext = createContext();

const FUN_MESSAGES = [
  {
    type: 'streak',
    icon: <Flame size={18} style={{ color: 'var(--accent-rose)' }} />,
    title: 'Hot Streak! 🔥',
    body: 'You are studying more consistently than a coffee-fueled developer. Keep it burning!'
  },
  {
    type: 'motivation',
    icon: <Sparkles size={18} style={{ color: 'var(--accent-indigo)' }} />,
    title: 'Brain Refueling 🧠',
    body: 'Hungry for knowledge? Your next study session is cooked and ready! Dive in.'
  },
  {
    type: 'focus',
    icon: <BookOpen size={18} style={{ color: 'var(--accent-emerald)' }} />,
    title: 'Focus Mode Activated! 🎯',
    body: 'Spotted: A genius in their natural habitat! The roadmap is waiting.'
  },
  {
    type: 'humor',
    icon: <Smile size={18} style={{ color: 'var(--accent-amber)' }} />,
    title: 'Knock Knock! 🚪',
    body: "Who's there? Success. Success who? Success is waiting for you to click 'Start Timer'!"
  },
  {
    type: 'alert',
    icon: <AlertCircle size={18} style={{ color: 'var(--accent-rose)' }} />,
    title: 'Cooling Fan Needed? 🧘‍♂️',
    body: 'Even supercomputers need cooling. Remember to blink, stretch, and take a sip of water!'
  },
  {
    type: 'trophy',
    icon: <Trophy size={18} style={{ color: 'var(--accent-amber)' }} />,
    title: 'Level Up! 🏆',
    body: "Your brain cells just completed a heavy lifting set. You're getting smarter by the minute!"
  }
];

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [history, setHistory] = useState([
    {
      id: 1,
      title: 'Welcome aboard! 👋',
      body: "My Buddy is ready to accompany your study journey. Let's create your first roadmap!",
      timestamp: new Date(Date.now() - 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      type: 'motivation'
    }
  ]);

  const addNotification = useCallback((title, body, type = 'motivation') => {
    const id = Date.now();
    const newNotif = {
      id,
      title,
      body,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };

    // Add to toast notifications
    setToasts((prev) => [...prev, newNotif]);
    // Add to history drawer
    setHistory((prev) => [newNotif, ...prev]);

    // Auto dismiss toast after 4.5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  }, []);

  const triggerRandomBuddyAlert = useCallback(() => {
    const randomMsg = FUN_MESSAGES[Math.floor(Math.random() * FUN_MESSAGES.length)];
    addNotification(randomMsg.title, randomMsg.body, randomMsg.type);
  }, [addNotification]);

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const markAllAsRead = () => {
    setHistory((prev) => prev.map((h) => ({ ...h, read: true })));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  // Setup periodic fun push notifications (like Swiggy/Zomato style hooks)
  useEffect(() => {
    // Trigger first random notification after 30 seconds, then every 90 seconds
    const firstTimer = setTimeout(() => {
      triggerRandomBuddyAlert();
    }, 30000);

    const interval = setInterval(() => {
      triggerRandomBuddyAlert();
    }, 90000);

    return () => {
      clearTimeout(firstTimer);
      clearInterval(interval);
    };
  }, [triggerRandomBuddyAlert]);

  return (
    <NotificationContext.Provider value={{
      toasts,
      history,
      addNotification,
      triggerRandomBuddyAlert,
      removeToast,
      markAllAsRead,
      clearHistory
    }}>
      {children}
      {/* Toast Render Overlay */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  return useContext(NotificationContext);
}

function ToastContainer({ toasts, onClose }) {
  if (toasts.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      maxWidth: '360px',
      width: 'calc(100vw - 48px)',
      pointerEvents: 'none'
    }}>
      {toasts.map((toast) => {
        let borderAccent = 'var(--accent-indigo)';
        let bgGradient = 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0.05) 100%)';
        
        if (toast.type === 'streak') {
          borderAccent = 'var(--accent-rose)';
          bgGradient = 'linear-gradient(135deg, rgba(244, 63, 94, 0.15) 0%, rgba(244, 63, 94, 0.05) 100%)';
        } else if (toast.type === 'focus') {
          borderAccent = 'var(--accent-emerald)';
          bgGradient = 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.05) 100%)';
        } else if (toast.type === 'trophy' || toast.type === 'humor') {
          borderAccent = 'var(--accent-amber)';
          bgGradient = 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.05) 100%)';
        }

        return (
          <div
            key={toast.id}
            style={{
              background: 'rgba(15, 23, 42, 0.85)',
              backdropFilter: 'blur(12px)',
              borderLeft: `4px solid ${borderAccent}`,
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              borderRight: '1px solid rgba(255, 255, 255, 0.05)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '16px',
              color: 'var(--text-primary)',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4)',
              display: 'flex',
              gap: '12px',
              pointerEvents: 'auto',
              animation: 'toastSlideIn 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Swiggy/Zomato style glow badge */}
            <div style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '80px',
              height: '80px',
              background: bgGradient,
              borderRadius: '50%',
              filter: 'blur(15px)',
              opacity: 0.8,
              zIndex: 0,
              pointerEvents: 'none'
            }} />

            {/* Icon */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              zIndex: 1,
              flexShrink: 0
            }}>
              {toast.type === 'streak' && <Flame size={18} style={{ color: 'var(--accent-rose)' }} />}
              {toast.type === 'motivation' && <Sparkles size={18} style={{ color: 'var(--accent-indigo)' }} />}
              {toast.type === 'focus' && <BookOpen size={18} style={{ color: 'var(--accent-emerald)' }} />}
              {toast.type === 'humor' && <Smile size={18} style={{ color: 'var(--accent-amber)' }} />}
              {toast.type === 'alert' && <AlertCircle size={18} style={{ color: 'var(--accent-rose)' }} />}
              {toast.type === 'trophy' && <Trophy size={18} style={{ color: 'var(--accent-amber)' }} />}
            </div>

            {/* Copy */}
            <div style={{ flex: 1, zIndex: 1, paddingRight: '12px' }}>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '4px', fontFamily: 'var(--font-family-title)' }}>
                {toast.title}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {toast.body}
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => onClose(toast.id)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                padding: '4px',
                zIndex: 1,
                alignSelf: 'flex-start',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'var(--transition-smooth)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
