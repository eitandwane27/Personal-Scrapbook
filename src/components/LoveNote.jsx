import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LetterRoseAccent } from "./RoseAccents";

/* ═══════════════════════════════════════════════════════════════════
   LOVE LETTER - Interactive Envelope & Wax Seal Edition
   Vintage sealed envelope with breakable 3D wax seal that
   unfolds into stationery parchment paper in a modal overlay.
   ═══════════════════════════════════════════════════════════════════ */

const GREETING = "Dearest Krishna,";
const BODY = [
  "Syempre meron din ako, anong akala mo? magpapatalo ako HAHAHA",
  "Knowing you for a short amount of time was probably one of the most exciting and lovely experience that happened to me this year. I may be a little douchebag and annoying sometimes but I am really genuine with you Krishna.",
  "Im so sorry bb if makulit ako always, tinatry ko naman pigilan pero minsan may nasasabe talaga ako and parang im so worried na baka maging uncomfy ka hihi. Yon lang naman, hindi talaga ako marunong sa mga gantong eksena, astig ako e HAHAHA pero I hope that I can reciprocate your efforts and the love that you are giving me constantly.",
  "Thank you for bringing happiness into my life and thank you for being there when I needed you the most for a short amount of time. Know that this will not be the last token that I will be giving you, it's just what I can give for now so I hope you appreciate it :).",
  "I love you so much from the bottom of my heart.",
];
const CLOSING = "Always yours,";
const SIGNATURE = "Eitan";

// Synthesize a romantic acoustic chime on wax seal break
function playSealChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const now = ctx.currentTime;

    const freqs = [523.25, 659.25, 783.99, 1046.5];
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + i * 0.08);

      gain.gain.setValueAtTime(0, now + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.08, now + i * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.85);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.9);
    });
  } catch {
    // Graceful fallback
  }
}

export default function LoveNote({
  isLocked = false,
  lockedMessage = "🔒 Sealed in time • Unlocks when the countdown ends",
  onLockedClick,
  onOpen,
  onClose,
  greeting = GREETING,
  body = BODY,
  closing = CLOSING,
  signature = SIGNATURE,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCracking, setIsCracking] = useState(false);
  const [isLockedShaking, setIsLockedShaking] = useState(false);

  // Lock background scroll and listen for Escape key when modal is open
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleOpenEnvelope = () => {
    if (isLocked) {
      setIsLockedShaking(true);
      setTimeout(() => setIsLockedShaking(false), 600);
      onLockedClick?.();
      return;
    }

    if (isOpen) return;
    setIsCracking(true);
    playSealChime();

    setTimeout(() => {
      setIsOpen(true);
      setIsCracking(false);
      onOpen?.();
    }, 450);
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  return (
    <div className="letter-shell is-letter-sealed">
      {/* ── ENVELOPE COVER (Always accessible in-page) ── */}
      <motion.div
        className={`envelope-sealed-wrapper ${isLocked ? "is-locked-envelope" : ""} ${
          isLockedShaking ? "shake" : ""
        }`}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        onClick={handleOpenEnvelope}
        role="button"
        tabIndex={0}
        aria-label={isLocked ? "Love letter locked until countdown reaches 0" : "Tap wax seal to open love letter"}
      >
        <div className="envelope-pocket">
          <div className="envelope-flap" />
          <div className="envelope-lines" />

          {/* Vintage Postal Address on Envelope */}
          <div className="envelope-to-label">
            <span className="airmail-badge">
              {isLocked ? "🔒 TIME CAPSULE AIR MAIL" : "💌 SPECIAL AIR MAIL"}
            </span>
            <p className="recipient-name">To: My Dearest ❤</p>
            <p className="sender-note">From: Eitan</p>
          </div>

          {/* 3D Wax Seal with silk ribbon tail */}
          <div className={`letter-seal-wrapper ${isCracking ? "is-cracking" : ""} ${isLocked ? "is-seal-locked" : ""}`}>
            <div className="letter-ribbon-tail left" />
            <div className="letter-ribbon-tail right" />
            <div className={`letter-seal ${isLocked ? "letter-seal-locked" : ""}`}>
              <span className="seal-ring" />
              <span className="seal-icon">{isLocked ? "🔒" : "❤"}</span>
              <span className="seal-shine" />
            </div>
          </div>

          {/* Tap / Locked Prompt */}
          <div className="envelope-tap-prompt">
            {isLocked ? (
              <span className="locked-prompt-text">{lockedMessage}</span>
            ) : (
              <span>✨ Tap the wax seal to unfold letter ✨</span>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── OPENED STATIONERY PARCHMENT LETTER MODAL (Outside viewport layout) ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="letter-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleClose}
            role="dialog"
            aria-modal="true"
            aria-label="Dearest Krishna Love Letter"
          >
            <motion.div
              className="letter-modal-container"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="letter-paper-wrapper">
                {/* Decorative Washi Tape / Keepsake Pin */}
                <div className="letter-washi" aria-hidden="true" />

                {/* Re-seal / Close Modal Button */}
                <button
                  type="button"
                  className="letter-modal-close"
                  onClick={handleClose}
                  title="Close and fold letter (Esc)"
                >
                  ✉️ Fold Letter ✕
                </button>

                {/* Cute corner animated rose blossom */}
                <LetterRoseAccent />

                {/* Main Stationery Paper */}
                <div className="letter-paper">
                  {/* Subtle Vintage Postmark / Stamp */}
                  <div className="letter-postmark" aria-hidden="true">
                    <div className="postmark-stamp">
                      <span className="postmark-icon">💌</span>
                      <span className="postmark-title">AIR MAIL</span>
                      <span className="postmark-subtitle">FOR KRISHNA</span>
                    </div>
                    <div className="postmark-waves">
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>

                  {/* Delicate inner filigree frame */}
                  <div className="letter-inner-border" aria-hidden="true" />

                  {/* Letter Content */}
                  <div className="letter-content">
                    <p className="letter-greeting">
                      {greeting || <span className="letter-placeholder">Your greeting here</span>}
                    </p>

                    <div className="letter-body">
                      {body.length > 0 ? (
                        body.map((paragraph, i) => <p key={i}>{paragraph}</p>)
                      ) : (
                        <p className="letter-placeholder">Your message here</p>
                      )}
                    </div>

                    <div className="letter-sign-block">
                      <p className="letter-closing">
                        {closing || <span className="letter-placeholder">Closing line</span>}
                      </p>
                      <p className="letter-signature">
                        {signature || <span className="letter-placeholder">your name</span>}
                        <span className="signature-flourish" aria-hidden="true"> 🌹</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
