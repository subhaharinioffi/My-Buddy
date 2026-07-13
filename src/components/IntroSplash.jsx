import React, { useEffect, useState } from 'react';
import Logo from './Logo';

export default function IntroSplash({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('drawing'); // drawing, text, loaded
  const [isWarping, setIsWarping] = useState(false);
  const [portalActive, setPortalActive] = useState(false);

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

  // Handle Warp portal trigger
  useEffect(() => {
    if (progress === 100) {
      // Step 1: Laser scanner completes, begin warp zoom (300ms delay)
      const warpStartTimer = setTimeout(() => {
        setIsWarping(true);
      }, 200);

      // Step 2: Trigger full-screen warp slideup (1.1s delay)
      const portalTimer = setTimeout(() => {
        setPortalActive(true);
      }, 1000);

      // Step 3: Complete transition to App
      const finishTimer = setTimeout(() => {
        onComplete();
      }, 1800);

      return () => {
        clearTimeout(warpStartTimer);
        clearTimeout(portalTimer);
        clearTimeout(finishTimer);
      };
    }
  }, [progress, onComplete]);

  return (
    <div className={`splash-container ${portalActive ? 'splash-slideup' : ''}`}>
      
      {/* Holographic Laser Grid Scanner Sweep Line */}
      {!isWarping && <div className="hologram-scanner" />}

      {/* Holographic Concentric Expanding Rings */}
      {stage === 'loaded' && !isWarping && (
        <>
          <div className="hologram-ring-pulse" style={{ top: 'calc(50% - 165px)', left: 'calc(50% - 120px)' }} />
          <div className="hologram-ring-pulse hologram-ring-pulse-2" style={{ top: 'calc(50% - 165px)', left: 'calc(50% - 120px)' }} />
        </>
      )}

      {/* Outer wrapper that triggers full portal warp zoom */}
      <div 
        className={isWarping ? 'launching-warp' : ''}
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          width: '90%', 
          maxWidth: '400px',
          position: 'relative',
          transition: 'transform 0.4s ease',
          transformOrigin: '50% 32%' // Zoom centering on the robot's face
        }}
      >
        
        {/* Render Logo */}
        <Logo 
          showText={!isWarping} 
          animate={stage !== 'loaded'} 
          size={180} 
        />

        {/* Loader elements (hide during reassembly warp) */}
        {!isWarping && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
}
