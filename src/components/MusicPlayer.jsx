import React, { useState, useRef, useEffect, useCallback } from "react";

const playlist = [
  {
    id: "uLL2xTK35Qc",
    title: "Lover",
    artist: "Taylor Swift",
    cover: "https://i.ytimg.com/vi/uLL2xTK35Qc/maxresdefault.jpg",
  },
  {
    id: "173SbLSn620",
    title: "Palayo Sa Mundo",
    artist: "Jolianne, Arthur Nery",
    cover: "https://i.ytimg.com/vi/173SbLSn620/maxresdefault.jpg",
  },
  {
    id: "j97SIWer-aY",
    title: "Lagi",
    artist: "Skusta Clee",
    cover: "https://i.ytimg.com/vi/j97SIWer-aY/maxresdefault.jpg",
  },
  {
    id: "GnUW4AF1LZo",
    title: "Just the Way You Are",
    artist: "Bruno Mars",
    cover: "https://i.ytimg.com/vi/GnUW4AF1LZo/maxresdefault.jpg",
  },
  {
    id: "eAQAAKON87Y",
    title: "One Less Lonely Girl",
    artist: "Justin Bieber",
    cover: "https://i.ytimg.com/vi/eAQAAKON87Y/maxresdefault.jpg",
  },
  {
    id: "aC9HkZW2hZk",
    title: "Cruel Summer",
    artist: "Taylor Swift",
    cover: "https://i.ytimg.com/vi/aC9HkZW2hZk/maxresdefault.jpg",
  },
  {
    id: "6vzaFiMrPPY",
    title: "twilight zone",
    artist: "Ariana Grande",
    cover: "https://i.ytimg.com/vi/6vzaFiMrPPY/maxresdefault.jpg",
  },
  {
    id: "sEPXrepgujY",
    title: "Style",
    artist: "Taylor Swift",
    cover: "https://i.ytimg.com/vi/sEPXrepgujY/maxresdefault.jpg",
  },
  {
    id: "HaZRGYd9mh4",
    title: "lowkey",
    artist: "NIKI",
    cover: "https://i.ytimg.com/vi/HaZRGYd9mh4/maxresdefault.jpg",
  },
  {
    id: "6eW99oNNRvI",
    title: "Love Me Like You Do",
    artist: "Ellie Goulding",
    cover: "https://i.ytimg.com/vi/6eW99oNNRvI/maxresdefault.jpg",
  },
  {
    id: "SA3ZaJaW98w",
    title: "Marvin Gaye",
    artist: "Charlie Puth ft. Meghan Trainor",
    cover: "https://i.ytimg.com/vi/SA3ZaJaW98w/maxresdefault.jpg",
  },
  {
    id: "yEA3qaB0dH8",
    title: "Stuck with U",
    artist: "Ariana Grande & Justin Bieber",
    cover: "https://i.ytimg.com/vi/yEA3qaB0dH8/maxresdefault.jpg",
  },
  {
    id: "T1Fk1jdtGx0",
    title: "All I Ever Need",
    artist: "Austin Mahone",
    cover: "https://i.ytimg.com/vi/T1Fk1jdtGx0/maxresdefault.jpg",
  },
];

function PrevIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="control-icon"
    >
      <path d="M6 6a1 1 0 0 1 2 0v12a1 1 0 0 1-2 0V6zm3.2 6.74a1 1 0 0 1 0-1.48l8.2-6.56A1 1 0 0 1 19 5.48v13.04a1 1 0 0 1-1.6.8l-8.2-6.58z" />
    </svg>
  );
}

function NextIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="control-icon"
    >
      <path d="M18 6a1 1 0 0 0-2 0v12a1 1 0 0 0 2 0V6zm-3.2 6.74a1 1 0 0 0 0-1.48L6.6 4.7A1 1 0 0 0 5 5.48v13.04a1 1 0 0 0 1.6.8l8.2-6.58z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="control-icon play-icon-svg"
      style={{ transform: "translateX(1px)" }}
    >
      <path d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.3-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="control-icon"
    >
      <rect x="6.5" y="5" width="3.5" height="14" rx="1.5" />
      <rect x="14" y="5" width="3.5" height="14" rx="1.5" />
    </svg>
  );
}

function MusicNoteIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className="music-note-svg"
    >
      <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
    </svg>
  );
}

export default function MusicPlayer({ autoPlay = true }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const iframeRef = useRef(null);
  const containerRef = useRef(null);

  const currentSong = playlist[currentIndex];

  const postPlayerCommand = useCallback((func, args = "") => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: "command",
          func: func,
          args: args,
        }),
        "*",
      );
    }
  }, []);

  // Sync play/pause commands with YouTube IFrame
  useEffect(() => {
    if (isPlaying) {
      postPlayerCommand("playVideo");
      const timer1 = setTimeout(() => postPlayerCommand("playVideo"), 400);
      const timer2 = setTimeout(() => postPlayerCommand("playVideo"), 1000);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else {
      postPlayerCommand("pauseVideo");
    }
  }, [currentIndex, isPlaying, postPlayerCommand]);

  const togglePlay = () => {
    if (!isPlaying) {
      postPlayerCommand("playVideo");
      setIsPlaying(true);
    } else {
      postPlayerCommand("pauseVideo");
      setIsPlaying(false);
    }
  };

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % playlist.length);
  }, []);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
  }, []);

  // Listen for messages from YouTube IFrame API
  useEffect(() => {
    const handleMessage = (event) => {
      if (typeof event.data === "string") {
        try {
          const data = JSON.parse(event.data);

          // Track ended -> advance to next track automatically
          if (data.event === "onStateChange" && data.info === 0) {
            handleNext();
          }

          // Error on video (e.g. region restricted or deleted) -> skip to next track
          if (data.event === "onError") {
            console.warn("YouTube video playback error, advancing to next song...");
            const skipTimer = setTimeout(() => handleNext(), 1200);
            return () => clearTimeout(skipTimer);
          }
        } catch {
          // Ignore non-JSON messages
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleNext]);

  const handleIframeLoad = () => {
    if (isPlaying) {
      postPlayerCommand("playVideo");
    }
  };

  const originUrl = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="music-player-container" ref={containerRef}>
      <div className="music-player-widget">
        {/* Album Art / Aesthetic Circle */}
        <div className={`album-art ${isPlaying ? "is-spinning" : ""}`}>
          <div className="album-inner">
            {currentSong.cover ? (
              <img
                src={currentSong.cover}
                alt={currentSong.title}
                className="album-cover-img"
                onError={(e) => {
                  e.currentTarget.src = `https://i.ytimg.com/vi/${currentSong.id}/hqdefault.jpg`;
                }}
              />
            ) : (
              <div className="music-emoji">
                <MusicNoteIcon />
              </div>
            )}
          </div>
        </div>

        <div className="music-info">
          <h4 className="song-title">{currentSong.title}</h4>
          <p className="song-artist">{currentSong.artist}</p>
        </div>

        {/* Player Controls */}
        <div className="player-controls">
          <button
            type="button"
            className="nav-btn"
            onClick={handlePrev}
            aria-label="Previous song"
            title="Previous track"
          >
            <PrevIcon />
          </button>
          <button
            type="button"
            className="play-btn"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button
            type="button"
            className="nav-btn"
            onClick={handleNext}
            aria-label="Next song"
            title="Next track"
          >
            <NextIcon />
          </button>
        </div>

        {/* Hidden YouTube Embed */}
        <div className="hidden-embed">
          <iframe
            key={currentSong.id}
            ref={iframeRef}
            width="0"
            height="0"
            src={`https://www.youtube.com/embed/${currentSong.id}?enablejsapi=1&autoplay=${isPlaying ? 1 : 0}&playsinline=1&origin=${encodeURIComponent(originUrl)}`}
            title="YouTube music player"
            frameBorder="0"
            allow="autoplay; encrypted-media; picture-in-picture"
            onLoad={handleIframeLoad}
          ></iframe>
        </div>
      </div>
    </div>
  );
}
