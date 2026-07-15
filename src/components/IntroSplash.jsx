import React, { useEffect, useState } from 'react';
import Logo from './Logo';
import MagicRings from './MagicRings';

export default function IntroSplash({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('drawing'); // drawing, text, loaded

  useEffect(() => {
    // Stage 1: Draw the logo (1s)
    const drawTimer = setTimeout(() => {
      setStage('text');
    }, 1000);

    // Stage 2: Loaded (2.4s total)
    const loadTimer = setTimeout(() => {
      setStage('loaded');
    }, 2400);

    // Progress bar increment
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const increment = prev > 70 ? 6 : 4;
        return Math.min(prev + increment, 100);
      });
    }, 50);

    return () => {
      clearTimeout(drawTimer);
      clearTimeout(loadTimer);
      clearInterval(interval);
    };
  }, []);

  // Trigger onComplete instantly when progress hits 100%
  useEffect(() => {
    if (progress === 100) {
      onComplete();
    }
  }, [progress, onComplete]);

  return (
    <div className="splash-container" style={{ overflow: 'hidden' }}>
      
      {/* Background Magic Rings from React Bits */}
      <MagicRings 
        color="#00d2ff" 
        colorTwo="#7c3aed" 
        ringCount={8} 
        speed={1.2} 
        followMouse={true} 
        clickBurst={true} 
        opacity={0.8}
      />

      {/* Holographic Laser Grid Scanner Sweep Line */}
      <div className="hologram-scanner" />

      {/* Outer wrapper */}
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          width: '90%', 
          maxWidth: '400px',
          position: 'relative',
          zIndex: 10
        }}
      >
        
        {/* Render Logo */}
        <Logo 
          showText={true} 
          animate={stage !== 'loaded'} 
          size={180} 
        />

        {/* Loader elements */}
        <div className="splash-loader-bar" style={{ marginTop: '24px' }}>
          <div
            className="splash-loader-progress"
            style={{ width: `${progress}%` }}
          />
        </div>

        <button
          onClick={onComplete}
          className="btn-secondary"
          style={{
            marginTop: '32px',
            padding: '8px 16px',
            fontSize: '0.85rem',
            opacity: progress > 20 ? 0.7 : 0,
            pointerEvents: progress > 20 ? 'auto' : 'none',
            transition: 'opacity 0.5s ease',
            borderColor: 'rgba(0, 210, 255, 0.2)'
          }}
        >
          Skip Intro
        </button>
      </div>
    </div>
  );
}
