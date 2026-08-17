import React, { useState, useId } from "react";

/* ── 1. Cute SVG Rose & Petal Vector Artwork ── */
export function CuteRoseSvg({ size = 28, className = "", style = {} }) {
  const gradientId = useId().replace(/:/g, "_");
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`cute-rose-svg ${className}`}
      style={style}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`roseGrad1_${gradientId}`} cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor="#ffb3cb" />
          <stop offset="55%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="#e11d48" />
        </radialGradient>
        <radialGradient id={`roseGrad2_${gradientId}`} cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ffe4e6" />
          <stop offset="70%" stopColor="#fb7185" />
          <stop offset="100%" stopColor="#be123c" />
        </radialGradient>
        <linearGradient id={`leafGrad_${gradientId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="100%" stopColor="#16a34a" />
        </linearGradient>
        <filter id={`roseShadow_${gradientId}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#9f1239" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Leaves at the base */}
      <path
        d="M12 36C8 32 6 22 14 20C17 24 16 32 12 36Z"
        fill={`url(#leafGrad_${gradientId})`}
        opacity="0.9"
      />
      <path
        d="M36 36C40 32 42 22 34 20C31 24 32 32 36 36Z"
        fill={`url(#leafGrad_${gradientId})`}
        opacity="0.9"
      />
      <path
        d="M24 38C20 42 16 44 14 42C18 36 22 34 24 38Z"
        fill={`url(#leafGrad_${gradientId})`}
        opacity="0.8"
      />

      {/* Outer Layer Petals */}
      <g filter={`url(#roseShadow_${gradientId})`}>
        <path
          d="M24 8C14 8 8 16 10 26C12 34 20 40 24 40C28 40 36 34 38 26C40 16 34 8 24 8Z"
          fill={`url(#roseGrad1_${gradientId})`}
        />
        <path
          d="M16 14C11 19 12 30 20 34C13 30 11 20 16 14Z"
          fill="#f43f5e"
          opacity="0.4"
        />
        <path
          d="M32 14C37 19 36 30 28 34C35 30 37 20 32 14Z"
          fill="#be123c"
          opacity="0.3"
        />
        <path
          d="M18 10C24 6 30 10 32 15C28 12 20 12 18 10Z"
          fill="#fda4af"
          opacity="0.7"
        />

        {/* Middle Rose Petal Bloom Swirls */}
        <path
          d="M16 22C16 16 22 12 28 14C33 16 34 24 30 28C26 32 18 30 16 22Z"
          fill={`url(#roseGrad2_${gradientId})`}
        />
        <path
          d="M20 18C23 15 28 17 29 20C29 23 26 26 23 25C20 24 19 20 20 18Z"
          fill="#f43f5e"
        />
        <path
          d="M22 20C23 18 26 19 27 21C27 23 25 24 23 23C22 22 22 21 22 20Z"
          fill="#ffe4e6"
        />
      </g>

      {/* Dewdrop sparkle */}
      <circle cx="28" cy="18" r="1.5" fill="#ffffff" opacity="0.85" />
      <circle cx="17" cy="24" r="1" fill="#ffffff" opacity="0.65" />
    </svg>
  );
}

export function CutePetalSvg({ size = 20, className = "", style = {} }) {
  const gradientId = useId().replace(/:/g, "_");
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`cute-petal-svg ${className}`}
      style={style}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={`petalGrad_${gradientId}`} cx="35%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#ffe4e6" />
          <stop offset="40%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="#e11d48" />
        </radialGradient>
      </defs>
      <path
        d="M16 3C22 8 28 14 27 21C26 27 20 30 15 29C9 28 4 23 5 17C6 10 11 5 16 3Z"
        fill={`url(#petalGrad_${gradientId})`}
        filter="drop-shadow(0 2px 4px rgba(225, 29, 72, 0.2))"
      />
      <path
        d="M14 8C17 12 21 16 20 21"
        stroke="#ffffff"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}

export function CuteRosebudSvg({ size = 22, className = "", style = {} }) {
  const gradientId = useId().replace(/:/g, "_");
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`cute-rosebud-svg ${className}`}
      style={style}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`budGrad_${gradientId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fca5a5" />
          <stop offset="60%" stopColor="#e11d48" />
          <stop offset="100%" stopColor="#9f1239" />
        </linearGradient>
        <linearGradient id={`budLeafGrad_${gradientId}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>
      </defs>
      {/* Stem & Calyx */}
      <path
        d="M18 24C16 28 14 33 12 35"
        stroke={`url(#budLeafGrad_${gradientId})`}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M13 22C11 26 8 28 7 28C10 24 12 21 13 22Z"
        fill={`url(#budLeafGrad_${gradientId})`}
      />
      <path
        d="M23 22C25 26 28 28 29 28C26 24 24 21 23 22Z"
        fill={`url(#budLeafGrad_${gradientId})`}
      />
      {/* Bud Blossom */}
      <path
        d="M18 4C13 4 10 11 12 19C13 24 16 26 18 26C20 26 23 24 24 19C26 11 23 4 18 4Z"
        fill={`url(#budGrad_${gradientId})`}
        filter="drop-shadow(0 2px 5px rgba(225, 29, 72, 0.25))"
      />
      <path
        d="M15 8C18 5 21 6 22 10C22 15 19 19 16 20C14 17 14 12 15 8Z"
        fill="#fda4af"
        opacity="0.8"
      />
      <circle cx="19" cy="11" r="1" fill="#fff" opacity="0.8" />
    </svg>
  );
}

/* ── Helper to render particle icons ── */
function ParticleIcon({ type, size }) {
  switch (type) {
    case "rose":
      return <CuteRoseSvg size={size} />;
    case "petal":
      return <CutePetalSvg size={size} />;
    case "rosebud":
      return <CuteRosebudSvg size={size} />;
    case "cherry":
      return <span style={{ fontSize: `${size * 0.9}px`, lineHeight: 1 }}>🌸</span>;
    default:
      return <CuteRoseSvg size={size} />;
  }
}

/* ── 2. Ambient Dropping Roses Layer ── */
const AMBIENT_PARTICLES = [
  { id: 1, type: "rose", left: 6, size: 28, duration: 11, delay: -1.5, sway: 32, rotSpeed: 180 },
  { id: 2, type: "petal", left: 14, size: 22, duration: 8.5, delay: -4.2, sway: -25, rotSpeed: 320 },
  { id: 3, type: "rosebud", left: 22, size: 24, duration: 13, delay: -7.8, sway: 28, rotSpeed: -200 },
  { id: 4, type: "petal", left: 31, size: 18, duration: 7.8, delay: -2.1, sway: -35, rotSpeed: 270 },
  { id: 5, type: "rose", left: 39, size: 32, duration: 12.5, delay: -9.4, sway: 38, rotSpeed: 210 },
  { id: 6, type: "cherry", left: 47, size: 20, duration: 9.2, delay: -0.8, sway: -28, rotSpeed: -260 },
  { id: 7, type: "petal", left: 55, size: 24, duration: 10.4, delay: -5.5, sway: 30, rotSpeed: 290 },
  { id: 8, type: "rosebud", left: 63, size: 26, duration: 14, delay: -11.2, sway: -32, rotSpeed: -190 },
  { id: 9, type: "rose", left: 71, size: 30, duration: 11.8, delay: -3.6, sway: 36, rotSpeed: 230 },
  { id: 10, type: "petal", left: 79, size: 19, duration: 8.2, delay: -8.1, sway: -26, rotSpeed: 340 },
  { id: 11, type: "cherry", left: 87, size: 21, duration: 10, delay: -6.7, sway: 29, rotSpeed: -240 },
  { id: 12, type: "rose", left: 94, size: 26, duration: 12.2, delay: -2.9, sway: -34, rotSpeed: 200 },
  { id: 13, type: "petal", left: 10, size: 20, duration: 9.5, delay: -10.0, sway: 27, rotSpeed: -280 },
  { id: 14, type: "rosebud", left: 27, size: 23, duration: 13.5, delay: -5.1, sway: -30, rotSpeed: 220 },
  { id: 15, type: "petal", left: 44, size: 22, duration: 8.8, delay: -12.3, sway: 34, rotSpeed: 310 },
  { id: 16, type: "rose", left: 59, size: 29, duration: 11.5, delay: -7.0, sway: -38, rotSpeed: -210 },
  { id: 17, type: "petal", left: 75, size: 18, duration: 7.5, delay: -1.1, sway: 25, rotSpeed: 350 },
  { id: 18, type: "cherry", left: 83, size: 23, duration: 10.8, delay: -4.8, sway: -31, rotSpeed: -270 },
];

const BURST_PRESET_PARTICLES = [
  { id: "b1", type: "rose", left: 8, size: 30, duration: 6.2, delay: 0.05, sway: 45, rotSpeed: 380 },
  { id: "b2", type: "petal", left: 16, size: 24, duration: 5.5, delay: 0.22, sway: -35, rotSpeed: -420 },
  { id: "b3", type: "rosebud", left: 25, size: 26, duration: 7.0, delay: 0.1, sway: 50, rotSpeed: 310 },
  { id: "b4", type: "cherry", left: 34, size: 22, duration: 5.2, delay: 0.35, sway: -40, rotSpeed: 460 },
  { id: "b5", type: "rose", left: 43, size: 32, duration: 6.5, delay: 0.12, sway: 38, rotSpeed: -350 },
  { id: "b6", type: "petal", left: 52, size: 24, duration: 5.8, delay: 0.28, sway: -48, rotSpeed: 400 },
  { id: "b7", type: "rose", left: 61, size: 29, duration: 6.8, delay: 0.08, sway: 42, rotSpeed: 360 },
  { id: "b8", type: "rosebud", left: 70, size: 25, duration: 5.6, delay: 0.4, sway: -36, rotSpeed: -440 },
  { id: "b9", type: "petal", left: 78, size: 26, duration: 6.1, delay: 0.18, sway: 46, rotSpeed: 320 },
  { id: "b10", type: "cherry", left: 86, size: 22, duration: 5.4, delay: 0.3, sway: -38, rotSpeed: 480 },
  { id: "b11", type: "rose", left: 93, size: 28, duration: 6.6, delay: 0.14, sway: 40, rotSpeed: -370 },
  { id: "b12", type: "petal", left: 20, size: 22, duration: 5.9, delay: 0.25, sway: -32, rotSpeed: 390 },
  { id: "b13", type: "rosebud", left: 48, size: 27, duration: 6.7, delay: 0.16, sway: 44, rotSpeed: -340 },
  { id: "b14", type: "rose", left: 68, size: 31, duration: 6.3, delay: 0.2, sway: -46, rotSpeed: 410 },
];

export function DroppingRosesOverlay({ extraBurstCount = 0 }) {
  return (
    <div className="dropping-roses-container" aria-hidden="true">
      {/* 1. Constant Ambient Dropping Roses */}
      {AMBIENT_PARTICLES.map((p) => (
        <div
          key={p.id}
          className="dropping-rose-particle"
          style={{
            left: `${p.left}%`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            "--sway-x": `${p.sway}px`,
            "--rot-deg": `${p.rotSpeed}deg`,
          }}
        >
          <div className="dropping-rose-inner">
            <ParticleIcon type={p.type} size={p.size} />
          </div>
        </div>
      ))}

      {/* 2. Interactive Extra Burst Drops (re-triggered cleanly on each shower increment) */}
      {extraBurstCount > 0 && (
        <div key={`burst-wave-${extraBurstCount}`} className="dropping-burst-wave">
          {BURST_PRESET_PARTICLES.map((p) => (
            <div
              key={`${extraBurstCount}-${p.id}`}
              className="dropping-rose-particle is-burst"
              style={{
                left: `${p.left}%`,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
                "--sway-x": `${p.sway}px`,
                "--rot-deg": `${p.rotSpeed}deg`,
              }}
            >
              <div className="dropping-rose-inner">
                <ParticleIcon type={p.type} size={p.size} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── 3. Interactive Click/Tap Rose Petal Spawner Layer ── */
export function RoseClickOverlay({ spawns }) {
  if (!spawns || spawns.length === 0) return null;

  return (
    <div className="rose-click-overlay" aria-hidden="true">
      {spawns.map((s) => (
        <span
          key={s.id}
          className="rose-click-spark"
          style={{
            left: `${s.x}px`,
            top: `${s.y}px`,
            "--dx": `${s.dx}px`,
            "--dy": `${s.dy}px`,
            "--rot": `${s.rot}deg`,
            fontSize: `${s.size}px`,
          }}
        >
          {s.icon}
        </span>
      ))}
    </div>
  );
}

/* ── 4. Cute Floating "Drop Roses" Quick Action ── */
export function RoseShowerButton({ onShower, roseCount = 0 }) {
  const [isWiggling, setIsWiggling] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    setIsWiggling(true);
    setTimeout(() => setIsWiggling(false), 700);
    if (onShower) onShower();
  };

  return (
    <button
      type="button"
      className={`rose-shower-btn ${isWiggling ? "wobble-bloom" : ""}`}
      onClick={handleClick}
      aria-label="Drop roses for Krishna"
      title="Drop a shower of roses! 🌹"
    >
      <span className="rose-btn-icon" aria-hidden="true">
        🌹
      </span>
      <span className="rose-btn-label">Shower Roses</span>
      {roseCount > 0 && (
        <span className="rose-btn-badge" aria-hidden="true">
          +{roseCount}
        </span>
      )}
      <span className="rose-btn-sparkle" aria-hidden="true">
        ✨
      </span>
    </button>
  );
}
