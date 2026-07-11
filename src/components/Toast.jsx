import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, XCircle, Info, AlertTriangle, X } from 'lucide-react';

// ── Context ────────────────────────────────────────────────────────────────
const ToastContext = createContext(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within <ToastProvider>');
  return ctx;
};

// ── Config ─────────────────────────────────────────────────────────────────
const CONFIGS = {
  success: {
    icon: CheckCircle2,
    bar: '#10b981',
    bg: 'linear-gradient(135deg,#0f2027 0%,#1a2a1a 100%)',
    border: '#10b981',
    iconColor: '#10b981',
  },
  error: {
    icon: XCircle,
    bar: '#ef4444',
    bg: 'linear-gradient(135deg,#1f0a0a 0%,#2a1a1a 100%)',
    border: '#ef4444',
    iconColor: '#ef4444',
  },
  info: {
    icon: Info,
    bar: '#6366f1',
    bg: 'linear-gradient(135deg,#0f0f2e 0%,#1a1a3a 100%)',
    border: '#6366f1',
    iconColor: '#6366f1',
  },
  warning: {
    icon: AlertTriangle,
    bar: '#f59e0b',
    bg: 'linear-gradient(135deg,#1f1500 0%,#2a2000 100%)',
    border: '#f59e0b',
    iconColor: '#f59e0b',
  },
};

const DURATION = 3500;

// ── Single Toast card ───────────────────────────────────────────────────────
const ToastCard = ({ id, message, type = 'info', onDismiss }) => {
  const { icon: Icon, bar, bg, border, iconColor } = CONFIGS[type] || CONFIGS.info;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.88 }}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      style={{
        background: bg,
        border: `1px solid ${border}33`,
        boxShadow: `0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px ${border}22`,
        borderRadius: '14px',
        padding: '14px 16px 14px 14px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '10px',
        minWidth: '300px',
        maxWidth: '360px',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'default',
      }}
    >
      {/* Left accent bar */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0,
        width: '4px', background: bar, borderRadius: '14px 0 0 14px',
      }} />

      {/* Icon */}
      <div style={{ flexShrink: 0, marginTop: '1px', marginLeft: '4px' }}>
        <Icon size={20} color={iconColor} strokeWidth={2.2} />
      </div>

      {/* Message */}
      <p style={{
        flex: 1, margin: 0,
        fontSize: '13.5px', lineHeight: '1.5',
        color: '#f0f0f0', fontWeight: 500,
        fontFamily: '"Inter", system-ui, sans-serif',
      }}>
        {message}
      </p>

      {/* Dismiss button */}
      <button
        onClick={() => onDismiss(id)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: '#888', padding: '1px', flexShrink: 0, marginTop: '1px',
          display: 'flex', alignItems: 'center', transition: 'color .15s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#ccc'}
        onMouseLeave={e => e.currentTarget.style.color = '#888'}
        aria-label="Dismiss"
      >
        <X size={15} />
      </button>

      {/* Progress bar */}
      <motion.div
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: DURATION / 1000, ease: 'linear' }}
        style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: '3px', background: bar, transformOrigin: 'left',
          opacity: 0.5, borderRadius: '0 0 14px 14px',
        }}
      />
    </motion.div>
  );
};

// ── Provider ────────────────────────────────────────────────────────────────
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => dismiss(id), DURATION);
    return id;
  }, [dismiss]);

  // Convenience shortcuts
  toast.success = (msg) => toast(msg, 'success');
  toast.error   = (msg) => toast(msg, 'error');
  toast.info    = (msg) => toast(msg, 'info');
  toast.warning = (msg) => toast(msg, 'warning');

  return (
    <ToastContext.Provider value={toast}>
      {children}

      {/* Portal-like fixed container */}
      <div style={{
        position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
        zIndex: 99999,
        display: 'flex', flexDirection: 'column', gap: '10px',
        pointerEvents: 'none',
      }}>
        <AnimatePresence mode="popLayout">
          {toasts.map(t => (
            <div key={t.id} style={{ pointerEvents: 'auto' }}>
              <ToastCard {...t} onDismiss={dismiss} />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
