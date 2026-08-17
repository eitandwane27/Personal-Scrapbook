import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

/* ═══════════════════════════════════════════════════════════════════
   PHOTOBOOTH GALLERY MODAL & HIGH-RES REEL
   A cinematic, distraction-free photo inspector and filmstrip scrubber.
   Features:
     • High-Res image viewer with ambient darkroom backdrop
     • Interactive bottom filmstrip thumbnail reel for quick hopping
     • Click-to-zoom (1x / 1.8x) with pan/drag capability
     • Direct photo download (JPG/PNG) & Fullscreen toggle
     • Heart / Rose burst reaction with floating petals
     • Keyboard navigation (Arrow keys, Esc, Z for zoom)
     • Touch swipe left/right for mobile & tablet
   ═══════════════════════════════════════════════════════════════════ */

export default function PhotoboothGalleryModal({
  photo,
  allPhotos = [],
  currentIndex = 0,
  onClose,
  onSelectPhoto,
  onNext,
  onPrev,
  hasPrev = true,
  hasNext = true,
}) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [reactions, setReactions] = useState([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const filmstripRef = useRef(null);
  const imageContainerRef = useRef(null);

  // Reset zoom when switching photos
  useEffect(() => {
    setIsZoomed(false);
  }, [photo?.src]);

  // Auto-scroll active thumbnail into view in the bottom filmstrip
  useEffect(() => {
    if (!filmstripRef.current || currentIndex < 0) return;
    const activeThumb = filmstripRef.current.querySelector(
      `[data-index="${currentIndex}"]`,
    );
    if (activeThumb) {
      activeThumb.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    if (!photo) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (isZoomed) {
          setIsZoomed(false);
        } else {
          onClose();
        }
      } else if (e.key === "ArrowRight" && hasNext) {
        onNext();
      } else if (e.key === "ArrowLeft" && hasPrev) {
        onPrev();
      } else if (e.key.toLowerCase() === "z") {
        setIsZoomed((prev) => !prev);
      } else if (e.key.toLowerCase() === "f") {
        toggleFullscreen();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [photo, isZoomed, onClose, onNext, onPrev, hasNext, hasPrev]);

  // Touch swipe handling for mobile
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      setTouchStart(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = (e) => {
    if (touchStart === null || isZoomed) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    // Minimum swipe threshold
    if (diff > 45 && hasNext) {
      onNext();
    } else if (diff < -45 && hasPrev) {
      onPrev();
    }
    setTouchStart(null);
  };

  // Trigger floating heart / rose reaction
  const triggerReaction = (e) => {
    e?.stopPropagation();
    const id = Date.now() + Math.random();
    const icons = ["🌹", "💖", "✨", "🥰", "📸", "💐"];
    const icon = icons[Math.floor(Math.random() * icons.length)];
    const x = (Math.random() - 0.5) * 160;
    const y = -120 - Math.random() * 100;

    setReactions((prev) => [...prev, { id, icon, x, y }]);
    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== id));
    }, 1400);
  };

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  // Reliable photo download (Blob URL + fallback)
  const handleDownloadPhoto = async (e) => {
    e?.stopPropagation();
    if (!photo?.src) return;

    const filename = `photobooth-${(photo.caption || "memory")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")}-${currentIndex + 1}.jpg`;

    try {
      const response = await fetch(photo.src);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        link.remove();
        URL.revokeObjectURL(url);
      }, 1000);
    } catch (err) {
      // Fallback
      const link = document.createElement("a");
      link.href = photo.src;
      link.download = filename;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      setTimeout(() => link.remove(), 200);
    }
  };

  if (!photo) return null;

  const caption = photo.caption || photo.note || "Photobooth Memory";
  const totalPhotos = allPhotos.length || 1;
  const currentNum = currentIndex >= 0 ? currentIndex + 1 : 1;

  return (
    <AnimatePresence>
      <motion.div
        className="gallery-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Ambient Blurred Background from Current Photo */}
        <div
          className="gallery-ambient-blur"
          style={{ backgroundImage: `url(${photo.src})` }}
          aria-hidden="true"
        />

        {/* ── TOP CONTROL BAR ── */}
        <header
          className="gallery-top-bar"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="gallery-meta-badge">
            <span className="meta-icon">📸</span>
            <span className="meta-counter">
              {currentNum} / {totalPhotos}
            </span>
            <span className="meta-divider">•</span>
            <span className="meta-caption">{caption}</span>
          </div>

          <div className="gallery-top-actions">
            {/* Zoom In/Out Toggle */}
            <button
              className={`gallery-tool-btn ${isZoomed ? "is-active" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setIsZoomed((prev) => !prev);
              }}
              title={isZoomed ? "Reset Zoom (Z)" : "Zoom In (Z)"}
              aria-label="Toggle zoom"
            >
              {isZoomed ? "🔍 Zoom Out" : "🔍 Zoom In"}
            </button>

            {/* Heart / Rose Reaction Button */}
            <button
              className="gallery-tool-btn reaction-btn"
              onClick={triggerReaction}
              title="Send Love & Roses"
              aria-label="Send Reaction"
            >
              🌹 Love
            </button>

            {/* Direct Download Button */}
            <button
              className="gallery-tool-btn download-tool-btn"
              onClick={handleDownloadPhoto}
              title="Download High-Res Photo"
              aria-label="Download Photo"
            >
              ⬇️ Save Photo
            </button>

            {/* Fullscreen Toggle Button */}
            <button
              className="gallery-tool-btn fullscreen-btn"
              onClick={(e) => {
                e.stopPropagation();
                toggleFullscreen();
              }}
              title="Toggle Fullscreen (F)"
              aria-label="Toggle Fullscreen"
            >
              {isFullscreen ? "🗗" : "⛶"}
            </button>

            {/* Close Button */}
            <button
              className="gallery-close-btn"
              onClick={onClose}
              title="Close Viewer (Esc)"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </header>

        {/* ── FLOATING REACTION BURSTS ── */}
        <div className="gallery-reactions-container" aria-hidden="true">
          {reactions.map((r) => (
            <motion.span
              key={r.id}
              className="floating-reaction-item"
              initial={{ opacity: 1, scale: 0.6, x: 0, y: 0 }}
              animate={{
                opacity: 0,
                scale: 1.5,
                x: r.x,
                y: r.y,
                rotate: (Math.random() - 0.5) * 45,
              }}
              transition={{ duration: 1.3, ease: "easeOut" }}
            >
              {r.icon}
            </motion.span>
          ))}
        </div>

        {/* ── MAIN STAGE (Center Image Viewer) ── */}
        <div
          className="gallery-main-stage"
          onClick={(e) => e.stopPropagation()}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Previous Photo Button (Desktop/Tablet) */}
          {hasPrev && (
            <button
              className="gallery-nav-arrow prev"
              onClick={(e) => {
                e.stopPropagation();
                onPrev();
              }}
              aria-label="Previous photo"
              title="Previous (Left Arrow)"
            >
              ‹
            </button>
          )}

          {/* Photo Frame Container */}
          <div
            className={`gallery-image-wrapper ${isZoomed ? "is-zoomed" : ""}`}
            ref={imageContainerRef}
            onClick={() => setIsZoomed((prev) => !prev)}
            title={isZoomed ? "Click to reset zoom" : "Click to zoom in"}
          >
            <motion.div
              key={photo.src}
              className="gallery-photo-card"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
            >
              <div className="gallery-photo-inner">
                <img
                  src={photo.src}
                  alt={caption}
                  className={`gallery-main-img ${isZoomed ? "zoomed-in" : ""}`}
                  style={{
                    objectPosition: photo.objectPosition || "center",
                    objectFit: isZoomed ? "contain" : (photo.objectFit || "contain"),
                  }}
                  draggable={false}
                />
              </div>

              {/* Minimalist Photo Tag / Footer */}
              <div className="gallery-photo-tag">
                <span className="tag-sparkle">✨</span>
                <span className="tag-title">{caption}</span>
                <span className="tag-hint">
                  {isZoomed ? "Tap to zoom out" : "Tap image to zoom"}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Next Photo Button (Desktop/Tablet) */}
          {hasNext && (
            <button
              className="gallery-nav-arrow next"
              onClick={(e) => {
                e.stopPropagation();
                onNext();
              }}
              aria-label="Next photo"
              title="Next (Right Arrow)"
            >
              ›
            </button>
          )}
        </div>

        {/* ── BOTTOM FILMSTRIP THUMBNAIL REEL ── */}
        <footer
          className="gallery-filmstrip-tray"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="filmstrip-label">
            <span>🎞️ PHOTO REEL</span>
            <span className="filmstrip-sub">({totalPhotos} frames)</span>
          </div>

          <div className="filmstrip-scroll-track" ref={filmstripRef}>
            {allPhotos.map((item, idx) => {
              const isActive = idx === currentIndex;
              return (
                <button
                  key={`${item.src}-${idx}`}
                  data-index={idx}
                  className={`filmstrip-thumb-btn ${isActive ? "is-active" : ""}`}
                  onClick={() => onSelectPhoto(idx)}
                  title={`Frame ${idx + 1}: ${item.caption || item.note || "Photo"}`}
                  aria-label={`Jump to photo ${idx + 1}`}
                >
                  <img
                    src={item.src}
                    alt=""
                    className="filmstrip-thumb-img"
                    loading="lazy"
                  />
                  <span className="filmstrip-thumb-number">{idx + 1}</span>
                  {isActive && <div className="filmstrip-active-glow" />}
                </button>
              );
            })}
          </div>
        </footer>
      </motion.div>
    </AnimatePresence>
  );
}
