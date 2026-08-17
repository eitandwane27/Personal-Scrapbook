import React, { useState, useRef, useEffect, useCallback } from "react";

// Default fallback audio if a YouTube track is slow or fails
const DEFAULT_FALLBACK_MP3 =
  "/audio/Jolianne, Arthur Nery  Palayo Sa Mundo (Official Lyric Video).mp3";
// Max milliseconds to wait for YouTube to start playing before falling back to local MP3
const YOUTUBE_TIMEOUT_MS = 4500;

const playlist = [
  // ─── 2 Hardcoded MP3 Songs (Play First on Login) ───
  {
    id: "173SbLSn620",
    title: "Palayo Sa Mundo",
    artist: "Jolianne, Arthur Nery",
    cover: "https://i.ytimg.com/vi/173SbLSn620/maxresdefault.jpg",
    mp3: "/audio/Jolianne, Arthur Nery  Palayo Sa Mundo (Official Lyric Video).mp3",
  },
  {
    id: "j97SIWer-aY",
    title: "Lagi",
    artist: "Skusta Clee",
    cover: "https://i.ytimg.com/vi/j97SIWer-aY/maxresdefault.jpg",
    mp3: "/audio/Skusta Clee - Lagi (Official Music Video).mp3",
  },

  // ─── YouTube Streaming Playlist ───
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

export default function MusicPlayer({ autoPlay = true }) {
  // Start with Jolianne, Arthur Nery - Palayo Sa Mundo as the first song
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isFallbackActive, setIsFallbackActive] = useState(false);

  const iframeRef = useRef(null);
  const audioRef = useRef(null);
  const containerRef = useRef(null);
  const fallbackTimerRef = useRef(null);

  const currentSong = playlist[currentIndex];
  const isDirectMp3 = Boolean(currentSong.mp3);
  const activeAudioSrc = currentSong.mp3 || DEFAULT_FALLBACK_MP3;
  const isUsingAudioElement = isDirectMp3 || isFallbackActive;

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

  // Switch to HTML5 MP3 fallback if YouTube stream fails or times out
  const switchToFallback = useCallback(() => {
    setIsFallbackActive(true);
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: "command", func: "pauseVideo", args: "" }),
        "*",
      );
    }
    if (audioRef.current && isPlaying) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch((err) => {
        console.warn("Audio playback notice:", err);
      });
    }
  }, [isPlaying]);

  // Handle play / pause and track changes
  useEffect(() => {
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }

    if (isPlaying) {
      if (isDirectMp3) {
        // Direct MP3 track: play immediately via HTML5 audio
        if (iframeRef.current?.contentWindow) {
          postPlayerCommand("pauseVideo");
        }
        audioRef.current
          ?.play()
          .catch((err) => console.warn("Audio play warning:", err));
      } else if (isFallbackActive) {
        // YouTube track with active fallback: play fallback MP3
        if (iframeRef.current?.contentWindow) {
          postPlayerCommand("pauseVideo");
        }
        audioRef.current
          ?.play()
          .catch((err) => console.warn("Fallback play warning:", err));
      } else {
        // YouTube track: pause HTML5 audio, command YouTube to play
        if (audioRef.current) {
          audioRef.current.pause();
        }
        postPlayerCommand("playVideo");
        const timer1 = setTimeout(() => postPlayerCommand("playVideo"), 300);
        const timer2 = setTimeout(() => postPlayerCommand("playVideo"), 800);

        // Fallback watchdog for slow connection on YouTube streams
        fallbackTimerRef.current = setTimeout(() => {
          console.info(
            "YouTube stream took too long to load. Switching to MP3 fallback.",
          );
          switchToFallback();
        }, YOUTUBE_TIMEOUT_MS);

        return () => {
          clearTimeout(timer1);
          clearTimeout(timer2);
          if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
        };
      }
    } else {
      // Paused state
      if (audioRef.current) {
        audioRef.current.pause();
      }
      postPlayerCommand("pauseVideo");
    }
  }, [
    currentIndex,
    isPlaying,
    isDirectMp3,
    isFallbackActive,
    postPlayerCommand,
    switchToFallback,
  ]);

  const togglePlay = () => {
    if (!isPlaying) {
      if (isUsingAudioElement) {
        audioRef.current?.play().catch((err) => console.warn(err));
      } else {
        postPlayerCommand("playVideo");
      }
      setIsPlaying(true);
    } else {
      if (isUsingAudioElement) {
        audioRef.current?.pause();
      } else {
        postPlayerCommand("pauseVideo");
      }
      setIsPlaying(false);
    }
  };

  const handleNext = useCallback(() => {
    setIsFallbackActive(false);
    setCurrentIndex((prev) => (prev + 1) % playlist.length);
  }, []);

  const handlePrev = useCallback(() => {
    setIsFallbackActive(false);
    setCurrentIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
  }, []);

  // Listen for messages from YouTube IFrame API
  useEffect(() => {
    const handleMessage = (event) => {
      if (typeof event.data === "string") {
        try {
          const data = JSON.parse(event.data);

          // Video confirmed playing -> cancel fallback watchdog
          if (
            (data.event === "onStateChange" && data.info === 1) ||
            (data.event === "infoDelivery" && data.info?.playerState === 1)
          ) {
            if (fallbackTimerRef.current) {
              clearTimeout(fallbackTimerRef.current);
              fallbackTimerRef.current = null;
            }
          }

          // YouTube track ended -> advance to next track
          if (data.event === "onStateChange" && data.info === 0) {
            handleNext();
          }

          // YouTube error on a YouTube stream -> switch to fallback
          if (data.event === "onError" && !isDirectMp3) {
            console.warn(
              "YouTube player error event:",
              data.info,
              "- switching to fallback.",
            );
            switchToFallback();
          }
        } catch {
          // Ignore non-JSON messages
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleNext, isDirectMp3, switchToFallback]);

  const handleIframeLoad = () => {
    if (isPlaying && !isDirectMp3 && !isFallbackActive) {
      postPlayerCommand("playVideo");
    }
  };

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
              <span className="music-emoji">🎵</span>
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
            className="nav-btn"
            onClick={handlePrev}
            aria-label="Previous song"
          >
            ⏮
          </button>
          <button
            className="play-btn"
            onClick={togglePlay}
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>
          <button
            className="nav-btn"
            onClick={handleNext}
            aria-label="Next song"
          >
            ⏭
          </button>
        </div>

        {/* Hidden YouTube Embed (Used for YouTube tracks) */}
        {!isDirectMp3 && !isFallbackActive && (
          <div className="hidden-embed">
            <iframe
              key={currentSong.id} // Re-mount iframe on song change to load new video
              ref={iframeRef}
              width="0"
              height="0"
              src={`https://www.youtube.com/embed/${currentSong.id}?enablejsapi=1&autoplay=${isPlaying ? 1 : 0}&playsinline=1`}
              title="YouTube video player"
              frameBorder="0"
              allow="autoplay; encrypted-media; picture-in-picture"
              onLoad={handleIframeLoad}
            ></iframe>
          </div>
        )}

        {/* Native HTML5 Audio Element (For hardcoded MP3s & fallback mode) */}
        <audio
          ref={audioRef}
          src={activeAudioSrc}
          preload="auto"
          onEnded={handleNext}
          onError={(e) => {
            if (activeAudioSrc !== DEFAULT_FALLBACK_MP3) {
              e.currentTarget.src = DEFAULT_FALLBACK_MP3;
              if (isPlaying && isUsingAudioElement) {
                e.currentTarget.play().catch(() => {});
              }
            }
          }}
        />
      </div>
    </div>
  );
}
