/* ═══════════════════════════════════════════════════════════════════
   PHOTOBOOTH MOTION HELPERS
   Small, isolated client-leaf components that add PHYSICAL tactility on
   top of the existing CSS keyframe language (frameIn / boothFade /
   blobDrift). These only animate transform + opacity, and every one
   collapses to static under prefers-reduced-motion.

   - ParallaxBlob  -> ambient blobs drift at their own depth as you scroll
   - Tilt          -> magnetic, cursor-following rotation (polaroid "held")
   - Settle        -> springy "laid onto the table" reveal on scroll entry
   ═══════════════════════════════════════════════════════════════════ */

import { useRef } from "react";
import {
  motion as Motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";

/* ─────────────────────────────────────────────────────────────
   PARALLAX BLOB
   Wraps one of the existing .blob divs and translates it up as the
   page scrolls, at a range you pick. The .blob keeps its own
   blobDrift keyframe inside, so the two transforms compose (separate
   elements, no conflict).
   ───────────────────────────────────────────────────────────── */
export function ParallaxBlob({ children, progress, range = 44, className = "" }) {
  const reduce = useReducedMotion();
  const y = useTransform(progress, [0, 1], [0, -range]);

  return (
    <Motion.div
      className={className}
      style={reduce ? undefined : { y }}
      aria-hidden="true"
    >
      {children}
    </Motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   TILT (magnetic)
   Pointer-following rotation so a card feels held up in the light.
   Uses motion values + springs, NOT useState, so nothing re-renders
   React on pointer move. Base CSS rotation stays on the outer card
   element; this wraps only the flowing content.
   ───────────────────────────────────────────────────────────── */
export function Tilt({ children, max = 6, className = "" }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);

  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const springX = useSpring(rotX, { stiffness: 130, damping: 14 });
  const springY = useSpring(rotY, { stiffness: 130, damping: 14 });

  function onPointerMove(e) {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotY.set(px * max);
    rotX.set(-py * max);
  }

  function onPointerLeave() {
    rotX.set(0);
    rotY.set(0);
  }

  return (
    <Motion.div
      ref={ref}
      className={className}
      style={{
        rotateX: springX,
        rotateY: springY,
        transformPerspective: 800,
        willChange: "transform",
      }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {children}
    </Motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SETTLE
   A spring that eases each card "onto the table" with a slight rise
   and a gentle scale, stagger-cued by `delay`. Fires once when the
   card scrolls into view. Reduced motion -> static.
   ───────────────────────────────────────────────────────────── */
export function Settle({ children, delay = 0, className = "" }) {
  const reduce = useReducedMotion();

  return (
    <Motion.div
      className={className}
      initial={
        reduce
          ? false
          : { opacity: 0, y: 34, scale: 0.96 }
      }
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ type: "spring", stiffness: 85, damping: 15, delay }}
    >
      {children}
    </Motion.div>
  );
}

