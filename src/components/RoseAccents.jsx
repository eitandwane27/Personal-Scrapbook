import React from "react";
import { CuteRoseSvg, CutePetalSvg, CuteRosebudSvg } from "./DroppingRoses";

/* ── 1. Hero Rose Crown / Garland ── */
export function HeroRoseGarland() {
  return (
    <div className="hero-rose-garland" aria-hidden="true">
      <div className="garland-side left">
        <CuteRosebudSvg size={24} className="garland-bud bud-1" />
        <CuteRoseSvg size={36} className="garland-rose rose-main" />
        <CutePetalSvg size={20} className="garland-petal petal-1" />
      </div>
      <div className="garland-center-sparkle">
        <span className="sparkle-star">✨</span>
      </div>
      <div className="garland-side right">
        <CutePetalSvg size={20} className="garland-petal petal-2" />
        <CuteRoseSvg size={36} className="garland-rose rose-main" />
        <CuteRosebudSvg size={24} className="garland-bud bud-2" />
      </div>
    </div>
  );
}

/* ── 2. Section Heading Animated Twin Roses ── */
export function SectionRoseFlourish({ title, subtitle, className = "" }) {
  return (
    <div className={`section-rose-flourish ${className}`}>
      <span className="flourish-rose flourish-left" aria-hidden="true">
        <CuteRosebudSvg size={26} />
      </span>
      <h2 className="flourish-title">{title}</h2>
      <span className="flourish-rose flourish-right" aria-hidden="true">
        <CuteRosebudSvg size={26} />
      </span>
      {subtitle && <p className="flourish-subtitle">{subtitle}</p>}
    </div>
  );
}

/* ── 3. Photo Strip / Print Card Animated Rose Sticker Pin ── */
export function RosePin({ variant = "rose", className = "" }) {
  return (
    <div className={`rose-pin-wrapper ${className}`} aria-hidden="true">
      {variant === "bud" ? (
        <CuteRosebudSvg size={22} className="rose-pin-icon" />
      ) : (
        <CuteRoseSvg size={24} className="rose-pin-icon" />
      )}
      <span className="rose-pin-glow" />
    </div>
  );
}

/* ── 4. Love Note Rose Corner Flourish ── */
export function LetterRoseAccent() {
  return (
    <div className="letter-rose-accent" aria-hidden="true">
      <CuteRoseSvg size={34} className="letter-rose-main" />
      <CutePetalSvg size={18} className="letter-petal-drift" />
      <CutePetalSvg size={16} className="letter-petal-drift-2" />
    </div>
  );
}
