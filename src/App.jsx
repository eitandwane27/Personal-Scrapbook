import { useState, useEffect } from "react";
import PasscodeScreen from "./components/PasscodeScreen";
import LandingPage from "./components/LandingPage";

import "./scrollbar.css";

function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [rotation, setRotation] = useState(0);

  // Initialize theme from system preference or localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;

    const applyTheme = () => {
      setIsDark(newDark);
      setRotation((prev) => prev + 360);
      if (newDark) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    };

    if (document.startViewTransition) {
      document.startViewTransition(applyTheme);
    } else {
      applyTheme();
    }
  };

  return (
    <>
      {/* Theme Toggle Button - Global */}
      <button
        onClick={toggleTheme}
        className="theme-toggle"
        aria-label="Toggle Dark Mode"
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: `rotate(${rotation}deg)`,
            transition: "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          {isDark ? "☀️" : "🌙"}
        </span>
      </button>

      {!unlocked ? (
        <PasscodeScreen onUnlock={() => setUnlocked(true)} />
      ) : (
        <LandingPage />
      )}
    </>
  );
}

export default App;
