import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { LetterRoseAccent } from "./RoseAccents";

/* ═══════════════════════════════════════════════════════════════════
   LOVE LETTER - Interactive Envelope & Wax Seal Edition
   Vintage sealed envelope with breakable 3D wax seal that
   unfolds into stationery parchment paper on touch/click.
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

export default function LoveNote() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCracking, setIsCracking] = useState(false);

  const handleOpenEnvelope = () => {
    if (isOpen) return;
    setIsCracking(true);
    setTimeout(() => {
      setIsOpen(true);
      setIsCracking(false);
    }, 450);
  };

  const handleToggle = () => {
    if (!isOpen) {
      handleOpenEnvelope();
    } else {
      setIsOpen(false);
    }
  };

  return (
    <div className={`letter-shell ${isOpen ? "is-letter-open" : "is-letter-sealed"}`}>
      {/* ── ENVELOPE COVER (Shown when sealed) ── */}
      {!isOpen && (
        <motion.div
          className="envelope-sealed-wrapper"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          onClick={handleOpenEnvelope}
          role="button"
          tabIndex={0}
          aria-label="Tap wax seal to open love letter"
        >
          <div className="envelope-pocket">
            <div className="envelope-flap" />
            <div className="envelope-lines" />

            {/* Vintage Postal Address on Envelope */}
            <div className="envelope-to-label">
              <span className="airmail-badge">💌 SPECIAL AIR MAIL</span>
              <p className="recipient-name">To: My Dearest Krishna ❤</p>
              <p className="sender-note">From: Eitan (with all my love)</p>
            </div>

            {/* 3D Wax Seal with silk ribbon tail */}
            <div className={`letter-seal-wrapper ${isCracking ? "is-cracking" : ""}`}>
              <div className="letter-ribbon-tail left" />
              <div className="letter-ribbon-tail right" />
              <div className="letter-seal" title="Tap to break seal">
                <span className="seal-ring" />
                <span className="seal-icon">❤</span>
                <span className="seal-shine" />
              </div>
            </div>

            {/* Tap Hint */}
            <div className="envelope-tap-prompt">
              <span>✨ Tap the wax seal to open letter ✨</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* ── OPENED STATIONERY PARCHMENT LETTER ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="letter-paper-wrapper"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
          >
            {/* Decorative Washi Tape / Keepsake Pin */}
            <div className="letter-washi" aria-hidden="true" />

            {/* Re-seal Toggle Button */}
            <button
              className="reseal-btn"
              onClick={handleToggle}
              title="Close and re-seal envelope"
            >
              ✉️ Fold Letter
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
                  {GREETING || <span className="letter-placeholder">Your greeting here</span>}
                </p>

                <div className="letter-body">
                  {BODY.length > 0 ? (
                    BODY.map((paragraph, i) => <p key={i}>{paragraph}</p>)
                  ) : (
                    <p className="letter-placeholder">Your message here</p>
                  )}
                </div>

                <div className="letter-sign-block">
                  <p className="letter-closing">
                    {CLOSING || <span className="letter-placeholder">Closing line</span>}
                  </p>
                  <p className="letter-signature">
                    {SIGNATURE || <span className="letter-placeholder">your name</span>}
                    <span className="signature-flourish" aria-hidden="true"> 🌹</span>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
