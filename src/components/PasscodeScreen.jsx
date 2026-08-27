import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import LoveNote from "./LoveNote";

// ─── Time Capsule Letter Content (Locked until Countdown Ends) ─────────────
// You can edit your personalized birthday message paragraphs here:
const TIME_CAPSULE_GREETING = "Dearest Krishna,";
const TIME_CAPSULE_BODY = [
  "Wow ang ganda ng music! Isa sa mga favorite ko yannn HAHAHA",
  "Hello bb! kmustaaaa ikawww? I hope you're doing well and happy. Minsan lang ako magganto kaya susulitin ko na chareng. And yes I lied, mahilig talaga ako sa letters HAHAHA pero eto na nga puro ako tawa e hahaha. First of all I hope you're doing fineee hindi kita nakalimutan syempre gagawin ko ba naman 'to kung nakalimutan kita. Miss na miss naaa kitaaa yieee 17 na syaaa malapit na sya maging fully adult HAHAH bsta ang ma aadvice ko lang sayo is always be careful kung sino nagiging kasama mo, wag ka magtitiwala agad kase baka abusuhin ang kabaitan mo hihi and take care of your health sabe nga nila diba healthy body == healthy mind HAHAHA para akong matanda dito.",
  "If you're asking kung kmusta na akooo, okay lang namannn as im writing this madami na akong activities na ginagawa so super busy lalo na sa school, pero keri naman kelangan gumraduate na tsaka mag work HAHAHA. Mdami ka pang oras para sa sarili mo always love yourself and enjoy your college lifeee! Bsta wag ka papatol sa mga gangsta2 please nakakaoffend saken yon chareng HAHAHA bsta im doing fineee, and if i know that you're fine too mas better hihi ",
  "But yeah, hanggang dito lang talaga yung makakaya ko munaaa kaya eeffortan ko onte as a birthday gift for uuu HAHAHA tska kung may makita ka man na boy na gusto mo na talaga please love him with the same depth as I loved you, deserve nya yon:) for me naman i'd probably remain single na muna siguro until I graduate then work onte then mag explore2 muna pero we never know kung anong plano saten ni Lord baka bukas mategi ako e chareng HAAHA",
  "I miss you so much na! Always be happy and be thankful with what u have ha kase u never know kung kelan kukunin sayo yon :) ayaw ko na magdrama chareng HAHAH bsta smile alwaysss and be safe especially when picking someone kilalanin mo muna sya and everything ha! Yon langgg! I'd probably not see u when u have someone na din siguro kase once i found out i uunfollow na kita para respeto na din sainyo hihi, bsta mag-iingat ka palage yon lang",
  "May all your birthday wishes come true, and I hope you have a wonderful day filled with joy, laughter, and love! They say prayer is the most genuine thing you can do to someone so I will always keep on praying for u, for ur success, your health and everything <3"
  ,"Happy 17th Birthday Krishna."
];
const TIME_CAPSULE_CLOSING = "Always yours,";
const TIME_CAPSULE_SIGNATURE = "Eitan";

// ─── Passcode (hardcoded, frontend-only) ───────────────────────────────────
const SECRET = "krishna";

// Target: Krishna's Birthday on September 13 (Philippine Time, UTC+8)
function getTargetBirthday() {
  const now = new Date();
  const currentYear = now.getFullYear();
  let target = new Date(`${currentYear}-09-13T00:00:00+08:00`);

  // If Sept 13 has already passed by more than 30 days, target next year
  if (now.getTime() - target.getTime() > 30 * 24 * 60 * 60 * 1000) {
    target = new Date(`${currentYear + 1}-09-13T00:00:00+08:00`);
  }
  return target;
}

function calculateTimeLeft(targetDate) {
  const now = new Date().getTime();
  const diff = targetDate.getTime() - now;

  if (diff <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isZero: true,
    };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    isZero: false,
  };
}

export default function PasscodeScreen({ onUnlock }) {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("idle"); // "idle" | "wrong" | "correct"
  const [activeTab, setActiveTab] = useState("note"); // "note" | "passcode"
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [musicStarted, setMusicStarted] = useState(false);
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [showLockedToast, setShowLockedToast] = useState(false);

  const inputRef = useRef(null);
  const musicIframeRef = useRef(null);
  const toastTimeoutRef = useRef(null);

  // Countdown State
  const [targetDate] = useState(() => getTargetBirthday());
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const isTimerZero = timeLeft.isZero;

  // Auto-dismiss or reset toast if lock status changes or on unmount
  useEffect(() => {
    if (isTimerZero) {
      setShowLockedToast(false);
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    }
  }, [isTimerZero]);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const handleLockedNoteClick = () => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setShowLockedToast(true);
    toastTimeoutRef.current = setTimeout(() => {
      setShowLockedToast(false);
    }, 4000);
  };

  // Post commands to hidden YouTube IFrame
  const postMusicCommand = useCallback((func, args = "") => {
    if (musicIframeRef.current?.contentWindow) {
      musicIframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: "command",
          func: func,
          args: args,
        }),
        "*",
      );
    }
  }, []);

  // Handle Note Opened -> Autoplay sweet background music & allow scrolling
  const handleNoteOpen = () => {
    setIsNoteOpen(true);
    setMusicStarted(true);
    setIsMusicPlaying(true);
    postMusicCommand("playVideo");
    // Retry once to ensure playback starts after gesture
    setTimeout(() => postMusicCommand("playVideo"), 500);
  };

  const handleNoteClose = () => {
    setIsNoteOpen(false);
  };

  const toggleMusic = () => {
    if (isMusicPlaying) {
      postMusicCommand("pauseVideo");
      setIsMusicPlaying(false);
    } else {
      postMusicCommand("playVideo");
      setIsMusicPlaying(true);
    }
  };

  function handleSubmit(e) {
    e.preventDefault();

    if (value.trim().toLowerCase() === SECRET.toLowerCase()) {
      setStatus("correct");
      // Let the bloom animation play before handing off
      setTimeout(() => onUnlock(), 900);
    } else {
      setStatus("wrong");
      setTimeout(() => {
        setStatus("idle");
        setValue("");
        inputRef.current?.focus();
      }, 600);
    }
  }

  const originUrl = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="passcode-root">
      {/* Ambient floating blobs */}
      <div className="blob blob-1" aria-hidden="true" />
      <div className="blob blob-2" aria-hidden="true" />
      <div className="blob blob-3" aria-hidden="true" />

      {/* Floating petals */}
      {[...Array(8)].map((_, i) => (
        <span key={i} className={`petal petal-${i + 1}`} aria-hidden="true">
          🌸
        </span>
      ))}

      {/* ── MAIN WRAPPER ── */}
      <div className="passcode-layout-wrapper">
        {/* ── 1. TOP NAVIGATION SWITCHER (TOP) ── */}
        <div className="passcode-tabs-nav" role="tablist" aria-label="Passcode views">
          <button
            type="button"
            className={`passcode-tab-btn ${activeTab === "note" ? "is-active" : ""}`}
            onClick={() => setActiveTab("note")}
            role="tab"
            aria-selected={activeTab === "note"}
          >
            <span className="tab-btn-icon">💌</span>
            <span className="tab-btn-text">A Special Letter</span>
            {!isTimerZero && <span className="tab-lock-badge" title="Locked until countdown ends">🔒</span>}
          </button>
          <button
            type="button"
            className={`passcode-tab-btn ${activeTab === "passcode" ? "is-active" : ""}`}
            onClick={() => setActiveTab("passcode")}
            role="tab"
            aria-selected={activeTab === "passcode"}
          >
            <span className="tab-btn-icon">🎁</span>
            <span className="tab-btn-text">Photobooth Gift</span>
          </button>
        </div>

        {/* ── 2. BIRTHDAY COUNTDOWN CARD (MIDDLE) ── */}
        <motion.div
          className="birthday-countdown-card"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="countdown-pill-tag">
            <span className="sparkle-icon">✨</span>
            <span>A SPECIAL MOMENT AWAITS</span>
            <span className="sparkle-icon">✨</span>
          </div>

          <h2 className="countdown-heading">
            {isTimerZero ? (
              <span className="birthday-celebrate-text">✨ The moment has arrived ✨</span>
            ) : (
              "Until the secret is revealed..."
            )}
          </h2>

          {!isTimerZero ? (
            <div className="countdown-tiles">
              <div className="countdown-tile">
                <span className="countdown-number">{String(timeLeft.days).padStart(2, "0")}</span>
                <span className="countdown-unit">DAYS</span>
              </div>
              <div className="countdown-sep">:</div>
              <div className="countdown-tile">
                <span className="countdown-number">{String(timeLeft.hours).padStart(2, "0")}</span>
                <span className="countdown-unit">HOURS</span>
              </div>
              <div className="countdown-sep">:</div>
              <div className="countdown-tile">
                <span className="countdown-number">{String(timeLeft.minutes).padStart(2, "0")}</span>
                <span className="countdown-unit">MINS</span>
              </div>
              <div className="countdown-sep">:</div>
              <div className="countdown-tile">
                <span className="countdown-number">{String(timeLeft.seconds).padStart(2, "0")}</span>
                <span className="countdown-unit">SECS</span>
              </div>
            </div>
          ) : (
            <div className="birthday-unlocked-banner">
              <span>🌹 The wait is over. Your letter is unlocked below. 🌹</span>
            </div>
          )}
        </motion.div>

        {/* ── 3. TAB CONTENT (BOTTOM) ── */}
        <div className="passcode-tab-content">
          {/* TAB 1: LOVE NOTE (LOCKED UNTIL COUNTDOWN REACHES 0) */}
          {activeTab === "note" && (
            <motion.div
              key="note-tab"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className="passcode-note-container"
            >
              <div className="note-status-header">
                {!isTimerZero ? (
                  <div className="note-locked-status-pill">
                    <span className="lock-icon-mini">🔒</span>
                    <span>Sealed in time • Unlocks when the countdown reaches 0</span>
                  </div>
                ) : (
                  <div className="note-unlocked-status-pill">
                    <span className="heart-icon-mini">✨</span>
                    <span>Unlocked! Tap the wax seal to unfold your letter & play music</span>
                  </div>
                )}
              </div>

              {/* Embedded Time Capsule Love Note with countdown lock & open/close callbacks */}
              <LoveNote
                isLocked={!isTimerZero}
                lockedMessage="<3"
                greeting={TIME_CAPSULE_GREETING}
                body={TIME_CAPSULE_BODY}
                closing={TIME_CAPSULE_CLOSING}
                signature={TIME_CAPSULE_SIGNATURE}
                onLockedClick={handleLockedNoteClick}
                onOpen={handleNoteOpen}
                onClose={handleNoteClose}
              />
            </motion.div>
          )}

          {/* TAB 2: PHOTOBOOTH PASSCODE CARD */}
          {activeTab === "passcode" && (
            <motion.div
              key="passcode-tab"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3 }}
              className={`passcode-card ${status === "correct" ? "bloom" : ""}`}
            >
              {/* Lock icon */}
              <div className={`lock-icon ${status === "wrong" ? "lock-wrong" : ""}`}>
                {status === "correct" ? "🔓" : "🔒"}
              </div>

              <h1 className="passcode-heading">For you</h1>
              <p className="passcode-subtext">
                Enter the secret to open your photobooth scrapbook 💌
              </p>

              <form onSubmit={handleSubmit} className="passcode-form">
                <div className={`input-wrapper ${status === "wrong" ? "shake" : ""}`}>
                  <input
                    ref={inputRef}
                    id="passcode-input"
                    type="text"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Your first name"
                    autoComplete="off"
                    className="passcode-input"
                    aria-label="Enter passcode"
                    disabled={status === "correct"}
                  />
                </div>

                {status === "wrong" && (
                  <p className="error-text" role="alert">
                    Hmm, that's not quite right 🥺
                  </p>
                )}

                <button
                  type="submit"
                  className="unlock-btn"
                  disabled={!value.trim() || status === "correct"}
                >
                  {status === "correct" ? "Opening scrapbook… 🌸" : "Open your gift →"}
                </button>
              </form>

              <p className="passcode-hint">
                Hint: it's the name of someone very loved 💕
              </p>
            </motion.div>
          )}
        </div>

        {/* ── FLOATING AUDIO PILL (Appears once note is opened) ── */}
        <AnimatePresence>
          {musicStarted && (
            <motion.div
              className="passcode-music-pill"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              <span className={`music-disc-icon ${isMusicPlaying ? "is-spinning" : ""}`}>
                🎵
              </span>
              <div className="music-pill-info">
                <span className="music-pill-track">Lover</span>
                <span className="music-pill-artist">Taylor Swift</span>
              </div>
              <button
                type="button"
                className="music-pill-btn"
                onClick={toggleMusic}
                aria-label={isMusicPlaying ? "Pause music" : "Play music"}
                title={isMusicPlaying ? "Pause music" : "Play music"}
              >
                {isMusicPlaying ? "⏸" : "▶"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── HIDDEN YOUTUBE PLAYER FOR NOTE AUTO-PLAY ── */}
        <div className="hidden-embed" aria-hidden="true">
          <iframe
            ref={musicIframeRef}
            width="0"
            height="0"
            src={`https://www.youtube.com/embed/uLL2xTK35Qc?enablejsapi=1&autoplay=0&playsinline=1&origin=${encodeURIComponent(originUrl)}`}
            title="Birthday Love Letter Music Player"
            frameBorder="0"
            allow="autoplay; encrypted-media; picture-in-picture"
          ></iframe>
        </div>
      </div>

      {/* ── TIME CAPSULE LOCKED NOTIFICATION (BOTTOM-RIGHT ONLY OF PASSCODESCREEN) ── */}
      <AnimatePresence>
        {!isTimerZero && showLockedToast && (
          <motion.div
            className="locked-envelope-toast"
            initial={{ opacity: 0, y: 35, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.92, transition: { duration: 0.2 } }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
            role="alert"
            aria-live="polite"
            onClick={() => setShowLockedToast(false)}
          >
            <div className="locked-toast-content">
              <div className="locked-toast-icon-box">
                <span className="locked-toast-icon">🔒</span>
              </div>
              <div className="locked-toast-body">
                <p className="locked-toast-title">Pinindot</p>
                <p className="locked-toast-msg">
                  Naka lock nga, wag mo pindutin AHAHA
                </p>
              </div>
              <button
                type="button"
                className="locked-toast-close"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowLockedToast(false);
                }}
                aria-label="Close notification"
              >
                ✕
              </button>
            </div>
            <div className="locked-toast-bar" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

