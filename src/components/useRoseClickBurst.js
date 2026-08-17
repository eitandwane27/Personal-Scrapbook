import { useState, useEffect, useCallback } from "react";

export function useRoseClickBurst() {
  const [clickSpawns, setClickSpawns] = useState([]);

  const triggerAt = useCallback((x, y) => {
    const particles = Array.from({ length: 6 }, (_, i) => {
      const angle = (i / 6) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const distance = Math.random() * 50 + 35;
      return {
        id: `${Date.now()}-${i}-${Math.random()}`,
        x,
        y,
        dx: Math.cos(angle) * distance,
        dy: Math.sin(angle) * distance - 25,
        rot: (Math.random() - 0.5) * 360,
        size: Math.floor(Math.random() * 10 + 18),
        icon: ["🌹", "🌸", "✨", "🥀", "💖"][Math.floor(Math.random() * 5)],
      };
    });

    setClickSpawns((prev) => [...prev.slice(-30), ...particles]);
  }, []);

  useEffect(() => {
    if (clickSpawns.length === 0) return;
    const timer = setTimeout(() => {
      setClickSpawns([]);
    }, 1400);
    return () => clearTimeout(timer);
  }, [clickSpawns.length]);

  return { clickSpawns, triggerAt };
}
