import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

/* ═══════════════════════════════════════════════════════════════════
   ROSE CATCHER ARCADE MINI-GAME
   A quick, adorable 25-second arcade game for Phone & iPad.
   Catch falling roses, hearts, and airmail with a moving flower basket!
   ═══════════════════════════════════════════════════════════════════ */

const ITEMS_DEF = [
  { type: "rose", char: "🌹", points: 10, speed: 2.6, size: 28 },
  { type: "petal", char: "🌸", points: 5, speed: 2.2, size: 24 },
  { type: "heart", char: "💖", points: 25, speed: 3.2, size: 28 },
  { type: "letter", char: "💌", points: 50, speed: 3.5, size: 30 },
  { type: "drop", char: "🌧️", points: -10, speed: 2.8, size: 24 },
];

export default function RoseCatcherGame({ isOpen, onClose }) {
  const [gameState, setGameState] = useState("ready"); // 'ready' | 'playing' | 'gameover'
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [basketX, setBasketX] = useState(50); // percentage 0-100
  const [items, setItems] = useState([]);
  const [combo, setCombo] = useState(0);
  const [floatingTexts, setFloatingTexts] = useState([]);

  const gameLoopRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const containerRef = useRef(null);
  const basketXRef = useRef(50);

  basketXRef.current = basketX;

  // Start game
  const startGame = () => {
    setScore(0);
    setTimeLeft(25);
    setCombo(0);
    setItems([]);
    setFloatingTexts([]);
    setGameState("playing");
  };

  // Move basket via touch or mouse
  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(8, Math.min(92, ((clientX - rect.left) / rect.width) * 100));
    setBasketX(x);
  };

  const handlePointerDown = (e) => {
    handleMove(e.clientX);
  };

  const handlePointerMove = (e) => {
    if (gameState === "playing") {
      handleMove(e.clientX);
    }
  };

  // Spawn new falling item
  const spawnItem = useCallback(() => {
    const rand = Math.random();
    let template;
    if (rand < 0.45) template = ITEMS_DEF[0]; // Rose
    else if (rand < 0.7) template = ITEMS_DEF[1]; // Petal
    else if (rand < 0.85) template = ITEMS_DEF[2]; // Heart
    else if (rand < 0.93) template = ITEMS_DEF[3]; // Love Letter
    else template = ITEMS_DEF[4]; // Raindrop

    return {
      id: Math.random(),
      x: 10 + Math.random() * 80,
      y: -5,
      ...template,
    };
  }, []);

  // Timer countdown
  useEffect(() => {
    if (gameState !== "playing") return;

    timerIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current);
          setGameState("gameover");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerIntervalRef.current);
  }, [gameState]);

  // Main animation / physics loop
  useEffect(() => {
    if (gameState !== "playing") return;

    let lastSpawn = Date.now();

    const loop = () => {
      const now = Date.now();

      // Spawn rate
      if (now - lastSpawn > 480) {
        setItems((prev) => [...prev, spawnItem()]);
        lastSpawn = now;
      }

      setItems((prevItems) => {
        const nextItems = [];
        const currentBasket = basketXRef.current;

        for (const item of prevItems) {
          const nextY = item.y + item.speed;

          // Check catch collision with basket (bottom area y: 80% to 92%)
          if (nextY >= 82 && nextY <= 94) {
            const distance = Math.abs(item.x - currentBasket);
            if (distance < 14) {
              // Caught!
              const pts = item.points;
              setScore((s) => Math.max(0, s + pts));

              if (pts > 0) {
                setCombo((c) => c + 1);
              } else {
                setCombo(0);
              }

              // Floating score effect
              setFloatingTexts((ft) => [
                ...ft.slice(-6),
                {
                  id: Math.random(),
                  text: pts > 0 ? `+${pts}` : `${pts}`,
                  color: pts > 0 ? "#e84393" : "#747d8c",
                  x: currentBasket,
                  y: 78,
                },
              ]);
              continue; // don't keep item
            }
          }

          // Item reached bottom
          if (nextY > 105) {
            continue;
          }

          nextItems.push({ ...item, y: nextY });
        }

        return nextItems;
      });

      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);

    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState, spawnItem]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="game-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="game-modal-card"
          initial={{ scale: 0.9, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 30 }}
        >
          {/* Header */}
          <div className="game-modal-header">
            <div className="game-brand">
              <span className="game-brand-icon">🕹️</span>
              <span className="game-brand-title">Catch The Roses</span>
            </div>

            <button
              className="game-close-btn"
              onClick={onClose}
              aria-label="Close game"
            >
              ✕
            </button>
          </div>

          {/* Game Canvas Area */}
          <div
            ref={containerRef}
            className="game-playfield"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            style={{ touchAction: "none" }}
          >
            {/* Top Score HUD */}
            <div className="game-hud">
              <div className="hud-badge score-badge">
                <span>Score:</span>
                <strong>{score}</strong>
              </div>

              {combo > 2 && (
                <div className="hud-badge combo-badge">
                  <span>{combo}x Combo! 🔥</span>
                </div>
              )}

              <div className="hud-badge timer-badge">
                <span>⏳ {timeLeft}s</span>
              </div>
            </div>

            {/* Falling Items */}
            {items.map((item) => (
              <div
                key={item.id}
                className="game-falling-item"
                style={{
                  left: `${item.x}%`,
                  top: `${item.y}%`,
                  fontSize: `${item.size}px`,
                }}
              >
                {item.char}
              </div>
            ))}

            {/* Floating Score Indicators */}
            {floatingTexts.map((ft) => (
              <div
                key={ft.id}
                className="game-floating-pts"
                style={{
                  left: `${ft.x}%`,
                  top: `${ft.y}%`,
                  color: ft.color,
                }}
              >
                {ft.text}
              </div>
            ))}

            {/* Player's Flower Basket */}
            <div
              className="game-basket"
              style={{
                left: `${basketX}%`,
              }}
            >
              <div className="basket-inner">
                <span className="basket-emoji">🧺</span>
                <span className="basket-rose-fill">🌹</span>
              </div>
            </div>

            {/* Ready State Screen */}
            {gameState === "ready" && (
              <div className="game-overlay-screen">
                <span className="screen-big-icon">🌹🧺</span>
                <h3>Catch Krishna's Roses!</h3>
                <p>
                  Slide your finger or mouse left and right to catch falling roses &
                  hearts in 25 seconds!
                </p>
                <button className="game-start-btn" onClick={startGame}>
                  ▶ Play Now
                </button>
              </div>
            )}

            {/* Game Over / Victory Certificate */}
            {gameState === "gameover" && (
              <div className="game-overlay-screen victory-screen">
                <span className="screen-big-icon">🏆💖</span>
                <h3>Awesome Job Baby!</h3>
                <p className="victory-score-line">
                  You scored <strong>{score} Points</strong>!
                </p>
                <div className="love-rank-box">
                  <span className="rank-title">Rank: Queen of Eitan's Heart 👑</span>
                  <p className="rank-sub">
                    "Kahit ilang roses pa ang mahulog, you will always catch my whole
                    heart Krishna."
                  </p>
                </div>
                <div className="gameover-btns">
                  <button className="game-start-btn" onClick={startGame}>
                    🔄 Play Again
                  </button>
                  <button className="game-sub-btn" onClick={onClose}>
                    🌹 Back to Photobooth
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
