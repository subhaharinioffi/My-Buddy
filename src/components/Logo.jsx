import React from 'react';

export default function Logo({ showText = true, animate = false, size = 120 }) {
  // SVG drawing parameters
  const viewWidth = showText ? 240 : 128;
  const viewHeight = showText ? 260 : 128;

  return (
    <svg
      width={size}
      height={showText ? (size * 1.08) : size}
      viewBox={`0 0 ${viewWidth} ${viewHeight}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        display: 'inline-block',
        maxWidth: '100%',
        height: 'auto'
      }}
    >
      <defs>
        {/* Background Circle Gradient (Electric Blue to Purple) */}
        <linearGradient id="logo-circle-gradient" x1="14" y1="14" x2="114" y2="114" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00d2ff" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>

        {/* Book Gradient */}
        <linearGradient id="logo-book-gradient" x1="45" y1="90" x2="85" y2="115" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>

        {/* Location Pin Gradient */}
        <linearGradient id="logo-pin-gradient" x1="74" y1="20" x2="86" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>

        {/* Text Gradient (My) */}
        <linearGradient id="logo-text-gradient" x1="10" y1="150" x2="70" y2="200" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#00d2ff" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>

        {/* Grad Cap Gradient */}
        <linearGradient id="logo-cap-gradient" x1="180" y1="140" x2="210" y2="165" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </linearGradient>

        {/* Tassel Gradient */}
        <linearGradient id="logo-tassel-gradient" x1="200" y1="155" x2="200" y2="165" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>

      {/* ========================================================
          CIRCLE PORTION (THE ROBOT COMPANION LOGO ICON)
          ======================================================== */}
      <g id="logo-icon-group" transform="translate(0, 0)">
        {/* Circle background */}
        <circle cx="64" cy="64" r="50" fill="url(#logo-circle-gradient)" className={animate ? 'logo-fill' : ''} />

        {/* Sparkling Stars */}
        <path d="M 64 24 L 65 27 L 68 28 L 65 29 L 64 32 L 63 29 L 60 28 L 63 27 Z" fill="white" className="sparkle-star star-1" opacity="0.9" />
        <path d="M 74 34 L 74.5 35.5 L 76 36 L 74.5 36.5 L 74 38 L 73.5 36.5 L 72 36 L 73.5 35.5 Z" fill="white" className="sparkle-star star-2" opacity="0.8" />
        <path d="M 88 45 L 88.5 46.5 L 90 47 L 88.5 47.5 L 88 49 L 87.5 47.5 L 86 47 L 87.5 46.5 Z" fill="white" className="sparkle-star star-3" opacity="0.8" />

        {/* Route Map Dotted Trail */}
        <path
          d="M 64 78 Q 78 78 84 66 T 82 32"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeDasharray="4,4"
          fill="none"
          className="route-trail"
          opacity="0.85"
        />

        {/* Location Pin */}
        <g className="map-pin">
          {/* Outer orange pin shape */}
          <path
            d="M 82 20 C 78.5 20, 76 22.5, 76 26 C 76 31, 82 35, 82 35 C 82 35, 88 31, 88 26 C 88 22.5, 85.5 20, 82 20 Z"
            fill="url(#logo-pin-gradient)"
            style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
          />
          {/* Inner white circle */}
          <circle cx="82" cy="26" r="2.2" fill="white" />
        </g>

        {/* ROBOT CHARACTER */}
        {/* Robot hands / body silhouette */}
        <ellipse cx="64" cy="74" rx="22" ry="12" fill="white" className={animate ? 'logo-fill' : ''} />
        
        {/* Robot Head */}
        <ellipse cx="64" cy="54" rx="20" ry="17" fill="white" className={animate ? 'logo-fill' : ''} style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.15))' }} />
        
        {/* Black Screen Face */}
        <rect x="49" y="42" width="30" height="22" rx="7" fill="#0f172a" stroke="rgba(255,255,255,0.08)" strokeWidth="1.2" />

        {/* Glowing Turquoise Curved Eyes */}
        <path d="M 54 51 Q 57 48 59 51" stroke="#00f5ff" strokeWidth="2.5" strokeLinecap="round" fill="none" style={{ filter: 'drop-shadow(0 0 3px #00f5ff)' }} />
        <path d="M 69 51 Q 72 48 74 51" stroke="#00f5ff" strokeWidth="2.5" strokeLinecap="round" fill="none" style={{ filter: 'drop-shadow(0 0 3px #00f5ff)' }} />
        
        {/* Smiley Mouth */}
        <path d="M 62 57 Q 64 59 66 57" stroke="#00f5ff" strokeWidth="2" strokeLinecap="round" fill="none" style={{ filter: 'drop-shadow(0 0 2px #00f5ff)' }} />

        {/* Headphones Cups */}
        <rect x="41" y="47" width="5" height="13" rx="2" fill="white" style={{ filter: 'drop-shadow(-2px 2px 4px rgba(0,0,0,0.1))' }} />
        <rect x="82" y="47" width="5" height="13" rx="2" fill="white" style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.1))' }} />
        {/* Headphones arch headband */}
        <path d="M 43 47 C 43 32, 85 32, 85 47" stroke="white" strokeWidth="3" fill="none" />

        {/* Chest Badge Logo 'M' */}
        <path d="M 61 71 L 62.5 73.5 L 64 71 L 65.5 73.5 L 67 71" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

        {/* Open Study Book */}
        <g transform="translate(0, 0)">
          {/* Blue outer cover */}
          <path
            d="M 64 96 C 64 96, 54 88, 44 92 C 44 92, 43 103, 44 110 C 52 108, 64 112, 64 112 C 64 112, 76 108, 84 110 C 85 103, 84 92, 84 92 C 74 88, 64 96, 64 96 Z"
            fill="url(#logo-book-gradient)"
            style={{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.35))' }}
          />
          {/* White pages */}
          <path
            d="M 64 97 C 64 97, 54 90, 46 93.5 L 46 108 C 54 105, 64 109, 64 109 Z"
            fill="#ffffff"
          />
          <path
            d="M 64 97 C 64 97, 74 90, 82 93.5 L 82 108 C 74 105, 64 109, 64 109 Z"
            fill="#e2e8f0"
          />
          {/* Book Spine lines */}
          <line x1="64" y1="96" x2="64" y2="112" stroke="#475569" strokeWidth="1.2" />
        </g>

        {/* Thumb Up emoji arm */}
        <path
          d="M 80 81 C 82 77, 86 77, 88 80 C 89 81, 88 84, 86 86 C 88 86, 91 88, 90 91 C 89 92, 87 92, 85 91"
          stroke="white"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="white"
          style={{ filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.15))' }}
        />
      </g>

      {/* ========================================================
          TYPOGRAPHY PORTION (ONLY RENDERED FOR FULL LOGO IN INTRO/SIDEBAR)
          ======================================================== */}
      {showText && (
        <g id="logo-text-group" transform="translate(0, 136)">
          {/* "My" in Gradient font */}
          <text
            x="20"
            y="45"
            fill="url(#logo-text-gradient)"
            fontFamily="Outfit"
            fontWeight="800"
            fontSize="32"
            letterSpacing="-0.5"
          >
            My
          </text>

          {/* "Buddy" in dark slate font */}
          <text
            x="76"
            y="45"
            fill="#1e293b"
            fontFamily="Outfit"
            fontWeight="850"
            fontSize="32"
            letterSpacing="-0.8"
            style={{ fill: '#e2e8f0' }} /* Dark mode adjustment */
          >
            Buddy
          </text>

          {/* Smiling Purple Arch under "Buddy" */}
          <path
            d="M 94 56 Q 146 72, 198 56"
            stroke="#7c3aed"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />

          {/* GRADUATION CAP sitting on the "y" of Buddy */}
          <g transform="translate(-10, 0)">
            {/* Cap Diamond */}
            <path
              d="M 216 11 L 232 17 L 216 23 L 200 17 Z"
              fill="url(#logo-cap-gradient)"
              stroke="#4338ca"
              strokeWidth="0.8"
            />
            {/* Cap Base */}
            <path
              d="M 207 19.5 L 207 24 C 207 26.5, 225 26.5, 225 24 L 225 19.5"
              fill="#1e1b4b"
            />
            {/* Tassel */}
            <path
              d="M 216 17 L 230 20 L 230 29"
              stroke="url(#logo-tassel-gradient)"
              strokeWidth="1.2"
              fill="none"
              strokeLinecap="round"
            />
            {/* Small yellow tassel fringe */}
            <circle cx="230" cy="29" r="1.5" fill="#fbbf24" />
          </g>

          {/* TAGLINE: Plan • Learn • Achieve */}
          <g transform="translate(14, 86)">
            {/* Calendar icon */}
            <rect x="0" y="0" width="13" height="12" rx="2" stroke="#3b82f6" strokeWidth="1.5" fill="none" />
            <line x1="3" y1="-2" x2="3" y2="2" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="10" y1="-2" x2="10" y2="2" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="6.5" cy="6" r="1" fill="#3b82f6" />

            <text x="20" y="10" fill="#a5b4fc" fontFamily="Inter" fontWeight="600" fontSize="12" letterSpacing="0.3">
              Plan
            </text>

            <circle cx="56" cy="6" r="2.2" fill="#7c3aed" />

            {/* Book icon */}
            <path d="M 68 0 Q 73 3 78 0 L 78 10 Q 73 7 68 10 Z" stroke="#8b5cf6" strokeWidth="1.2" fill="none" />
            <path d="M 78 0 Q 83 3 88 0 L 88 10 Q 83 7 78 10 Z" stroke="#8b5cf6" strokeWidth="1.2" fill="none" />

            <text x="94" y="10" fill="#a5b4fc" fontFamily="Inter" fontWeight="600" fontSize="12" letterSpacing="0.3">
              Learn
            </text>

            <circle cx="132" cy="6" r="2.2" fill="#3b82f6" />

            {/* Star icon */}
            <path d="M 148 0 L 149.5 3.5 L 153 3.5 L 150 5.5 L 151.5 9 L 148 7 L 144.5 9 L 146 5.5 L 143 3.5 L 146.5 3.5 Z" fill="#fbbf24" />

            <text x="159" y="10" fill="#a5b4fc" fontFamily="Inter" fontWeight="600" fontSize="12" letterSpacing="0.3">
              Achieve
            </text>
          </g>
        </g>
      )}
    </svg>
  );
}
