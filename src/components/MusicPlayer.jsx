import React, { useState, useRef, useEffect } from "react";

const playlist = [
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
    id: "GnUW4AF1LZo",
    title: "Just the Way You Are",
    artist: "Bruno Mars",
    cover: "https://i.ytimg.com/vi/GnUW4AF1LZo/maxresdefault.jpg",
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

export default function MusicPlayer() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const iframeRef = useRef(null);
  const containerRef = useRef(null);

  const currentSong = playlist[currentIndex];

  // Handle song change
  useEffect(() => {
    if (isPlaying && iframeRef.current) {
      // Small delay to ensure iframe is loaded before playing
      const timer = setTimeout(() => {
        iframeRef.current.contentWindow.postMessage(
          '{"event":"command","func":"playVideo","args":""}',
          "*",
        );
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, isPlaying]);

  const togglePlay = () => {
    const player = iframeRef.current;
    if (!player) return;

    if (!isPlaying) {
      player.contentWindow.postMessage(
        '{"event":"command","func":"playVideo","args":""}',
        "*",
      );
      setIsPlaying(true);
    } else {
      player.contentWindow.postMessage(
        '{"event":"command","func":"pauseVideo","args":""}',
        "*",
      );
      setIsPlaying(false);
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % playlist.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
  };

  // Auto-next logic: Listen for messages from YouTube IFrame API
  useEffect(() => {
    const handleMessage = (event) => {
      // Only process messages that are strings and potentially from YouTube
      if (typeof event.data === "string") {
        try {
          const data = JSON.parse(event.data);
          // YouTube API sends 'onStateChange' with info: 0 when a video ends
          if (data.event === "onStateChange" && data.info === 0) {
            handleNext();
          }
        } catch (e) {
          // Ignore non-JSON messages
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []); // Empty dependency array means this listener is set up once

  // Auto-play logic: Start playing when the collage section scrolls into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsPlaying(true);
          // We only want to auto-play once when they reach the section
          observer.disconnect();
        }
      },
      { threshold: 0.1 }, // Trigger as soon as the section starts appearing
    );

    const target = document.querySelector(".collage-section");
    if (target) {
      observer.observe(target);
    }

    return () => observer.disconnect();
  }, []);

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
          <button className="nav-btn" onClick={handlePrev}>
            ⏮
          </button>
          <button className="play-btn" onClick={togglePlay}>
            {isPlaying ? "⏸" : "▶"}
          </button>
          <button className="nav-btn" onClick={handleNext}>
            ⏭
          </button>
        </div>

        {/* Hidden YouTube Embed */}
        <div className="hidden-embed">
          <iframe
            key={currentSong.id} // Re-mount iframe on song change to load new video
            ref={iframeRef}
            width="0"
            height="0"
            src={`https://www.youtube.com/embed/${currentSong.id}?enablejsapi=1&autoplay=${isPlaying ? 1 : 0}`}
            title="YouTube video player"
            frameBorder="0"
            allow="autoplay; encrypted-media"
          ></iframe>
        </div>
      </div>
    </div>
  );
}
