import { useState, useRef } from "react";

// ─── Passcode (hardcoded, frontend-only) ───────────────────────────────────
const SECRET = "cyrel"; // change to her first name if desired

export default function PasscodeScreen({ onUnlock }) {
  const [value, setValue] = useState("");
  const [status, setStatus] = useState("idle"); // "idle" | "wrong" | "correct"
  const inputRef = useRef(null);

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

      {/* Card */}
      <div className={`passcode-card ${status === "correct" ? "bloom" : ""}`}>
        {/* Lock icon */}
        <div className={`lock-icon ${status === "wrong" ? "lock-wrong" : ""}`}>
          {status === "correct" ? "🔓" : "🔒"}
        </div>

        <h1 className="passcode-heading">For you</h1>
        <p className="passcode-subtext">
          Enter the secret to open your gift 💌
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
              autoFocus
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
            {status === "correct" ? "Opening… 🌸" : "Open your gift →"}
          </button>
        </form>

        <p className="passcode-hint">
          Hint: it's the name of someone very loved 💕
        </p>
      </div>
    </div>
  );
}
