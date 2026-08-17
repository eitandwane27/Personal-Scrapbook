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
      style={reduce ? undefined : { y, willChange: "transform" }}
      aria-hidden="true"
    >
      {children}
    </Motion.div>
  );
}

/* ─────────────────────────────────────────────────────────────
   TILT (magnetic - desktop only)
   Pointer-following rotation on mouse hover.
   Bypasses calculation on touch screens for 60fps mobile scrolling.
   ───────────────────────────────────────────────────────────── */
export function Tilt({ children, max = 6, className = "" }) {
  const reduce = useReducedMotion();
  const ref = useRef(null);

  const rotX = useMotionValue(0);
  const rotY = useMotionValue(0);
  const springX = useSpring(rotX, { stiffness: 120, damping: 16 });
  const springY = useSpring(rotY, { stiffness: 120, damping: 16 });

  function onPointerMove(e) {
    if (reduce || !ref.current) return;
    // Skip on touch-based pointers to avoid touch lag on phones
    if (e.pointerType === "touch") return;

    const rect = ref.current.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
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
   Smooth upward ease on scroll down. Fires once (once: true)
   and stays permanently visible on the way up and down.
   ───────────────────────────────────────────────────────────── */
export function Settle({ children, delay = 0, className = "" }) {
  const reduce = useReducedMotion();

  return (
    <Motion.div
      className={className}
      initial={
        reduce
          ? false
          : { opacity: 0, y: 22 }
      }
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </Motion.div>
  );
}

