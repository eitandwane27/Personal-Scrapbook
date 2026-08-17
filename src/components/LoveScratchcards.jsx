import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SectionRoseFlourish } from "./RoseAccents";

/* ═══════════════════════════════════════════════════════════════════
   LOVE SCRATCHCARDS MINI-GAME
   Interactive metallic rose-gold scratchcards for Phone & iPad.
   Features:
     • Real-time HTML5 Canvas scratching with finger or mouse stylus
     • Smooth particle burst on reveal threshold (>= 45%)
     • Voucher status tracker (Claimed, Redeemed, Stamped)
     • Romantic customizable vouchers
   ═══════════════════════════════════════════════════════════════════ */

const COUPONS = [
  {
    id: "icecream",
    badge: "Food & Cravings",
    icon: "🍦",
    title: "Late-Night Food & Ice Cream Run",
    subtitle: "Valid anytime Krishna gets hungry or wants sweets!",
    details:
      "No questions asked! Eitan will drive, pay, and get whatever cravings you want—whether it's midnight fries, matcha ice cream, or milk tea.",
    color: "from-pink-500/20 to-rose-400/20",
    stampCode: "CRV-992",
  },
  {
    id: "massage",
    badge: "Relaxation & Care",
    icon: "💆‍♀️",
    title: "Unlimited Massage & Cuddle Session",
    subtitle: "For stressful or exhausting days.",
    details:
      "Full shoulder, back, and head massage with warm soothing hugs until you fall asleep comfortably. Zero time limit!",
    color: "from-purple-500/20 to-pink-400/20",
    stampCode: "RLX-108",
  },
  {
    id: "yesday",
    badge: "VIP Master Pass",
    icon: "👑",
    title: "The 'Eitan Says YES to Everything' Pass",
    subtitle: "24-hour supreme power voucher!",
    details:
      "For one whole day, Eitan cannot say no to your restaurant choice, outfit critiques, playlist takeovers, or date ideas. Your wish is my command!",
    color: "from-amber-500/20 to-rose-400/20",
    stampCode: "YES-777",
  },
  {
    id: "mystery",
    badge: "Surprise Adventure",
    icon: "🌹",
    title: "Mystery Surprise Date Night",
    subtitle: "100% planned and treated by Eitan.",
    details:
      "You don't have to plan anything. Just dress up, look pretty as always, and get ready for a memorable surprise date planned with all my heart.",
    color: "from-rose-500/20 to-mauve/20",
    stampCode: "DAT-520",
  },
];

function ScratchCanvas({ onReveal, isRevealed }) {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const lastPoint = useRef(null);
  const revealedRef = useRef(isRevealed);

  revealedRef.current = isRevealed;

  // Initialize the scratch surface on mount or resize
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();

    // High DPI canvas rendering for sharp retina displays on iPhone / iPad
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    if (isRevealed) {
      ctx.clearRect(0, 0, rect.width, rect.height);
      return;
    }

    // Draw glamorous Rose-Gold metallic gradient foil
    const grad = ctx.createLinearGradient(0, 0, rect.width, rect.height);
    grad.addColorStop(0, "#d885a3");
    grad.addColorStop(0.3, "#fcd6e3");
    grad.addColorStop(0.5, "#e59ab7");
    grad.addColorStop(0.7, "#fdf0f4");
    grad.addColorStop(1, "#c97598");

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Add subtle shimmer polka texture & border
    ctx.fillStyle = "rgba(255, 255, 255, 0.28)";
    for (let x = 12; x < rect.width; x += 22) {
      for (let y = 12; y < rect.height; y += 22) {
        ctx.beginPath();
        ctx.arc(x, y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Centered foil text instructions
    ctx.fillStyle = "#632742";
    ctx.font = "bold 13px Lato, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✨ SCRATCH WITH FINGER ✨", rect.width / 2, rect.height / 2 - 8);
    ctx.font = "11px Lato, sans-serif";
    ctx.fillStyle = "#8a3d5e";
    ctx.fillText("to reveal your love coupon", rect.width / 2, rect.height / 2 + 12);
  }, [isRevealed]);

  useEffect(() => {
    initCanvas();
    const handleResize = () => initCanvas();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [initCanvas]);

  // Check scratch percentage
  const checkScratchPercentage = useCallback(() => {
    if (revealedRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width;
    const h = canvas.height;

    // Sample pixels across a 16x16 grid for fast 60fps calculation
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;
    const step = Math.floor(data.length / (16 * 16 * 4));
    let transparentCount = 0;
    let totalSamples = 0;

    for (let i = 3; i < data.length; i += step * 4) {
      totalSamples++;
      if (data[i] === 0) {
        transparentCount++;
      }
    }

    const percent = transparentCount / totalSamples;
    if (percent >= 0.42 && !revealedRef.current) {
      revealedRef.current = true;
      // Auto clear smoothly
      ctx.clearRect(0, 0, w / dpr, h / dpr);
      onReveal();
    }
  }, [onReveal]);

  const scratch = (clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas || revealedRef.current) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI * 2);
    ctx.fill();

    if (lastPoint.current) {
      ctx.lineWidth = 44;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    lastPoint.current = { x, y };
    checkScratchPercentage();
  };

  const handlePointerDown = (e) => {
    if (revealedRef.current) return;
    isDrawing.current = true;
    lastPoint.current = null;
    scratch(e.clientX, e.clientY);
  };

  const handlePointerMove = (e) => {
    if (!isDrawing.current || revealedRef.current) return;
    scratch(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    isDrawing.current = false;
    lastPoint.current = null;
  };

  return (
    <canvas
      ref={canvasRef}
      className={`scratch-canvas ${isRevealed ? "is-cleared" : ""}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={{ touchAction: "none" }}
    />
  );
}

export default function LoveScratchcards() {
  const [revealedCards, setRevealedCards] = useState({});
  const [redeemedCards, setRedeemedCards] = useState({});
  const [toastMessage, setToastMessage] = useState(null);

  const handleReveal = (id) => {
    setRevealedCards((prev) => ({ ...prev, [id]: true }));
    showToast("🎉 Coupon Unlocked! Ready to claim anytime ❤");
  };

  const handleRedeem = (coupon) => {
    setRedeemedCards((prev) => ({ ...prev, [coupon.id]: true }));
    showToast(`🌹 "${coupon.title}" redeemed! Eitan has been notified!`);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3800);
  };

  const handleRevealAll = () => {
    const all = {};
    COUPONS.forEach((c) => (all[c.id] = true));
    setRevealedCards(all);
    showToast("✨ All Love Vouchers have been revealed!");
  };

  return (
    <section className="scratchcards-section reveal-on-scroll">
      <SectionRoseFlourish
        title="Love Vouchers & Scratchcards"
        subtitle="Scratch with your finger to reveal your special perks from Eitan 🌹"
        className="scratchcards-heading"
      />

      {/* Floating Action Hint */}
      <div className="scratchcards-controls">
        <button
          className="reveal-all-btn"
          onClick={handleRevealAll}
          title="Instant Reveal All"
        >
          ✨ Instant Reveal All
        </button>
      </div>

      {/* Grid of Scratchable Vouchers */}
      <div className="scratchcards-grid">
        {COUPONS.map((coupon, index) => {
          const isRevealed = Boolean(revealedCards[coupon.id]);
          const isRedeemed = Boolean(redeemedCards[coupon.id]);

          return (
            <motion.div
              key={coupon.id}
              className={`scratchcard-ticket ${isRevealed ? "is-unlocked" : ""} ${
                isRedeemed ? "is-redeemed" : ""
              }`}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              {/* Ticket Stamp & Perforated Edges */}
              <div className="ticket-edge top" aria-hidden="true" />
              <div className="ticket-edge bottom" aria-hidden="true" />

              {/* Card Secret Reward Content */}
              <div className="ticket-inner">
                <div className="ticket-header">
                  <span className="ticket-badge">{coupon.badge}</span>
                  <span className="ticket-stamp-code">NO. {coupon.stampCode}</span>
                </div>

                <div className="ticket-body">
                  <div className="ticket-icon">{coupon.icon}</div>
                  <h3 className="ticket-title">{coupon.title}</h3>
                  <p className="ticket-subtitle">{coupon.subtitle}</p>
                  <p className="ticket-details">{coupon.details}</p>
                </div>

                <div className="ticket-footer">
                  {isRedeemed ? (
                    <div className="redeemed-stamp" aria-label="Redeemed with love">
                      <span>❤ REDEEMED ❤</span>
                    </div>
                  ) : isRevealed ? (
                    <button
                      className="redeem-btn"
                      onClick={() => handleRedeem(coupon)}
                    >
                      🎁 Claim & Use Voucher
                    </button>
                  ) : (
                    <span className="scratch-hint">👆 Scratch foil to reveal</span>
                  )}
                </div>
              </div>

              {/* Scratchable Foil Canvas Overlay */}
              {!isRedeemed && (
                <ScratchCanvas
                  isRevealed={isRevealed}
                  onReveal={() => handleReveal(coupon.id)}
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Toast Notification Alert */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            className="love-toast"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
          >
            <span className="toast-icon">💌</span>
            <span className="toast-text">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
