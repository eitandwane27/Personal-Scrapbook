import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SectionRoseFlourish } from "./RoseAccents";

/* ═══════════════════════════════════════════════════════════════════
   PHOTOBOOTH SCRAPBOOK STUDIO (Building Mini-Game)
   Allows Krishna to design and assemble her own custom Photobooth
   film strips, polaroids, and stickers, with instant high-res PNG export!
   ═══════════════════════════════════════════════════════════════════ */

const ALL_PHOTOS = [
  { src: "/pics/01f7b79e-70f8-4bda-a374-de6104df88c7.jpg", label: "Entrance" },
  { src: "/pics/0eaa1001-2c59-4221-90c1-d3313a0beede.jpg", label: "Smile" },
  { src: "/pics/10f08b89-d210-47e4-879c-a79eeadb92f8.jpg", label: "Kiss Bebe" },
  { src: "/pics/2d064e3f-904f-4d44-8b85-0bc23c89108b.jpg", label: "Kiss Ule" },
  { src: "/pics/49e90812-ba47-4bd7-aba9-33601ceca9dc.jpg", label: "Flash" },
  { src: "/pics/4d07867d-05b2-47bc-b4d0-5d54711249a7.jpg", label: "Cutie" },
  { src: "/pics/75230ad6-5cb2-41d3-afa5-fc8347373fa8.jpg", label: "Hot Shettt" },
  { src: "/pics/812759dd-8561-4530-8210-315ca96ef351.jpg", label: "Iconic" },
  { src: "/pics/85140f9b-34dc-42ff-9c28-e9efc55c8e46.jpg", label: "Pose 1" },
  { src: "/pics/8a4a3c42-a28b-4960-afdf-049edae31684.jpg", label: "Pose 2" },
  { src: "/pics/8a71da51-56e7-4b70-bc84-9281832e2900.jpg", label: "Pose 3" },
  { src: "/pics/8bb5d337-bb4c-4065-9b83-24056ad3b89a.jpg", label: "The Winner" },
  { src: "/pics/9538c5b0-432f-4b61-b8bd-26f119256565.jpg", label: "Ganda" },
  { src: "/pics/99a73939-f502-43af-8d83-591cf7251352.jpg", label: "Keepsake" },
  { src: "/pics/9d4b5b4c-f295-4399-a719-013306d09f53.jpg", label: "Oh Pak" },
  { src: "/pics/cba8ff8d-717c-4bfc-865b-1aac2abbed7a.jpg", label: "Pretty" },
  { src: "/pics/ccadaa7a-65c3-4f44-92ea-ad5822aeaa14.jpg", label: "Yun Oh" },
  { src: "/pics/ce8e921a-5276-4412-82fa-52949abac59d.jpg", label: "My Baby" },
  { src: "/pics/e2a014fc-43fc-4d6a-8055-1c333ae8452e.jpg", label: "Cute" },
  { src: "/pics/f3149aac-ea41-4448-b9c0-2cee8b80af61.jpg", label: "Unfiltered" },
  { src: "/pics/f9a9db27-7ee1-4f4f-9518-a12ba6c018ac.jpg", label: "Breathtaking" },
  { src: "/pics/fc2ea9bf-c9a3-492c-bb12-5881b7c46a4d.jpg", label: "Treasured" },
];

const THEMES = [
  { id: "blush", name: "Vintage Blush", bg: "#fdf2f7", text: "#632742", border: "#f3c7db" },
  { id: "noir", name: "Classic Noir", bg: "#1e171c", text: "#fff0f5", border: "#3d2e38" },
  { id: "lavender", name: "Lavender Glow", bg: "#f5f0fb", text: "#492d5c", border: "#dcc9f2" },
  { id: "cream", name: "Antique Cream", bg: "#fffaf2", text: "#5c3d2e", border: "#f0dfcb" },
  { id: "sakura", name: "Sakura Dream", bg: "#ffe8f1", text: "#7a274c", border: "#f7b2cf" },
];

const STICKER_PACK = [
  { id: "rose", char: "🌹", label: "Rose" },
  { id: "kiss", char: "💋", label: "Kiss" },
  { id: "sparkles", char: "✨", label: "Sparkles" },
  { id: "heart", char: "💖", label: "Heart" },
  { id: "camera", char: "📸", label: "Camera" },
  { id: "bow", char: "🎀", label: "Ribbon" },
  { id: "bear", char: "🧸", label: "Teddy" },
  { id: "letter", char: "💌", label: "Airmail" },
  { id: "strawberry", char: "🍓", label: "Berry" },
  { id: "crown", char: "👑", label: "Crown" },
  { id: "tag1", char: "BABY KO ❤", isText: true },
  { id: "tag2", char: "GANDANG BABAE ✨", isText: true },
  { id: "tag3", char: "MINE 🌹", isText: true },
];

const DEFAULT_FRAMES = [
  ALL_PHOTOS[2].src,
  ALL_PHOTOS[5].src,
  ALL_PHOTOS[7].src,
  ALL_PHOTOS[11].src,
];

const DEFAULT_CAPTION = "Krishna & Eitan 🌹";

const DEFAULT_STICKERS = [
  { id: 1, char: "🌹", x: 78, y: 14, rotate: 12, size: 28 },
  { id: 2, char: "💋", x: 16, y: 88, rotate: -15, size: 28 },
];

export default function ScrapbookBuilder() {
  const [slotCount, setSlotCount] = useState(4);
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
  const [frames, setFrames] = useState(DEFAULT_FRAMES);
  const [caption, setCaption] = useState(DEFAULT_CAPTION);
  const [stickers, setStickers] = useState(DEFAULT_STICKERS);
  const [activeSlotModal, setActiveSlotModal] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [draggingStickerId, setDraggingStickerId] = useState(null);
  const stripPreviewRef = useRef(null);

  // Update frames when slotCount changes
  const handleSlotCountChange = (count) => {
    setSlotCount(count);
    if (count === 3 && frames.length > 3) {
      setFrames(frames.slice(0, 3));
    } else if (count === 4 && frames.length < 4) {
      setFrames([...frames, ALL_PHOTOS[frames.length % ALL_PHOTOS.length].src]);
    }
  };

  // Replace photo in a specific slot
  const handleSelectPhoto = (photoSrc) => {
    if (activeSlotModal !== null) {
      const updated = [...frames];
      updated[activeSlotModal] = photoSrc;
      setFrames(updated);
      setActiveSlotModal(null);
    }
  };

  // Randomize all frames
  const handleRandomize = () => {
    const shuffled = [...ALL_PHOTOS].sort(() => Math.random() - 0.5);
    setFrames(shuffled.slice(0, slotCount).map((p) => p.src));
  };

  // Reset all stickers to initial default set
  const handleResetStickers = () => {
    setStickers([
      { id: Date.now() + 1, char: "🌹", x: 78, y: 14, rotate: 12, size: 28 },
      { id: Date.now() + 2, char: "💋", x: 16, y: 88, rotate: -15, size: 28 },
    ]);
  };

  // Clear all stickers
  const handleClearStickers = () => {
    setStickers([]);
  };

  // Master reset: restore layout, theme, photos, caption, and stickers to default
  const handleResetAll = () => {
    setSlotCount(4);
    setSelectedTheme(THEMES[0]);
    setFrames([...DEFAULT_FRAMES]);
    setCaption(DEFAULT_CAPTION);
    setStickers([
      { id: Date.now() + 1, char: "🌹", x: 78, y: 14, rotate: 12, size: 28 },
      { id: Date.now() + 2, char: "💋", x: 16, y: 88, rotate: -15, size: 28 },
    ]);
  };

  // Add a sticker onto the strip
  const handleAddSticker = (item) => {
    const newSticker = {
      id: Date.now(),
      char: item.char,
      isText: item.isText,
      x: 25 + Math.random() * 50,
      y: 20 + Math.random() * 55,
      rotate: (Math.random() - 0.5) * 30,
      size: item.isText ? 14 : 30,
    };
    setStickers((prev) => [...prev, newSticker]);
  };

  // Drag sticker handler with pointer capture
  const handlePointerDownSticker = (e, stk) => {
    // Ignore if clicking the remove button
    if (e.target.closest(".sticker-remove-tag")) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();

    if (!stripPreviewRef.current) return;
    const stripRect = stripPreviewRef.current.getBoundingClientRect();
    const startPointerX = e.clientX;
    const startPointerY = e.clientY;
    const startStkX = stk.x;
    const startStkY = stk.y;

    setDraggingStickerId(stk.id);

    const onPointerMove = (moveEvt) => {
      const deltaX = moveEvt.clientX - startPointerX;
      const deltaY = moveEvt.clientY - startPointerY;

      // Convert pixel delta to percentage of the live strip container
      const deltaPercentX = (deltaX / stripRect.width) * 100;
      const deltaPercentY = (deltaY / stripRect.height) * 100;

      // Clamp within the photobooth strip boundaries (2% to 90% horizontal, 2% to 94% vertical)
      const nextX = Math.max(2, Math.min(90, startStkX + deltaPercentX));
      const nextY = Math.max(2, Math.min(94, startStkY + deltaPercentY));

      setStickers((prev) =>
        prev.map((s) => (s.id === stk.id ? { ...s, x: nextX, y: nextY } : s))
      );
    };

    const onPointerUp = () => {
      setDraggingStickerId(null);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
  };

  // Remove sticker
  const handleRemoveSticker = (id) => {
    setStickers((prev) => prev.filter((s) => s.id !== id));
  };

  // Helper function to safely load image without CORS tainting issues on localhost
  const loadImage = (src) =>
    new Promise((resolve) => {
      const img = new Image();
      if (src.startsWith("http://") || src.startsWith("https://")) {
        img.crossOrigin = "anonymous";
      }
      img.onload = () => resolve(img);
      img.onerror = () => {
        // Fallback retry without crossOrigin
        const fallback = new Image();
        fallback.onload = () => resolve(fallback);
        fallback.onerror = () => resolve(null);
        fallback.src = src;
      };
      img.src = src;
    });

  // Export Photobooth Strip to Canvas & Trigger Download
  const handleDownloadStrip = async () => {
    setIsExporting(true);
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      // High-res output dimensions
      const stripWidth = 600;
      const frameHeight = 380;
      const padding = 40;
      const headerHeight = 60;
      const footerHeight = 110;
      const gap = 24;

      const totalHeight =
        padding * 2 +
        headerHeight +
        slotCount * frameHeight +
        (slotCount - 1) * gap +
        footerHeight;

      canvas.width = stripWidth;
      canvas.height = totalHeight;

      // Draw background
      ctx.fillStyle = selectedTheme.bg;
      ctx.fillRect(0, 0, stripWidth, totalHeight);

      // Draw border
      ctx.strokeStyle = selectedTheme.border;
      ctx.lineWidth = 12;
      ctx.strokeRect(6, 6, stripWidth - 12, totalHeight - 12);

      // Header text
      ctx.fillStyle = selectedTheme.text;
      ctx.font = "bold 22px Lato, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("PHOTOBOOTH EST. 2026", stripWidth / 2, padding + 35);

      // Draw each photo frame
      let currentY = padding + headerHeight;
      const frameW = stripWidth - padding * 2;

      for (let i = 0; i < slotCount; i++) {
        const imgSrc = frames[i];
        if (imgSrc) {
          const img = await loadImage(imgSrc);
          if (img) {
            // Draw photo with cover crop
            ctx.save();
            ctx.beginPath();
            ctx.roundRect(padding, currentY, frameW, frameHeight, 10);
            ctx.clip();

            // Calculate cover aspect ratio
            const imgAspect = img.width / img.height;
            const targetAspect = frameW / frameHeight;
            let sx, sy, sWidth, sHeight;

            if (imgAspect > targetAspect) {
              sHeight = img.height;
              sWidth = img.height * targetAspect;
              sx = (img.width - sWidth) / 2;
              sy = 0;
            } else {
              sWidth = img.width;
              sHeight = img.width / targetAspect;
              sx = 0;
              sy = (img.height - sHeight) / 2;
            }

            ctx.drawImage(img, sx, sy, sWidth, sHeight, padding, currentY, frameW, frameHeight);
            ctx.restore();

            // Frame outline
            ctx.strokeStyle = selectedTheme.border;
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.roundRect(padding, currentY, frameW, frameHeight, 10);
            ctx.stroke();
          }
        }
        currentY += frameHeight + gap;
      }

      // Draw custom footer caption
      ctx.fillStyle = selectedTheme.text;
      ctx.font = "bold 26px Dancing Script, cursive, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(caption || "Krishna & Eitan 🌹", stripWidth / 2, currentY + 45);

      ctx.font = "14px Lato, sans-serif";
      ctx.fillText("FOR KRISHNA KO ❤ WITH LOVE", stripWidth / 2, currentY + 75);

      // Draw stickers onto canvas
      stickers.forEach((stk) => {
        ctx.save();
        const px = (stk.x / 100) * stripWidth;
        const py = (stk.y / 100) * totalHeight;
        ctx.translate(px, py);
        ctx.rotate((stk.rotate * Math.PI) / 180);

        if (stk.isText) {
          ctx.fillStyle = "#ffffff";
          ctx.strokeStyle = "#e11d48";
          ctx.lineWidth = 3;
          ctx.font = "bold 14px sans-serif";
          ctx.strokeText(stk.char, 0, 0);
          ctx.fillText(stk.char, 0, 0);
        } else {
          ctx.font = `${(stk.size || 28) * 1.5}px sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(stk.char, 0, 0);
        }
        ctx.restore();
      });

      // Download file via Blob
      if (canvas.toBlob) {
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.download = `photobooth-strip-krishna-${Date.now()}.png`;
            link.href = url;
            document.body.appendChild(link);
            link.click();
            setTimeout(() => {
              link.remove();
              URL.revokeObjectURL(url);
            }, 1000);
          } else {
            // Fallback to dataURL
            const dataUrl = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.download = `photobooth-strip-krishna-${Date.now()}.png`;
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            setTimeout(() => link.remove(), 200);
          }
        }, "image/png");
      } else {
        const dataUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = `photobooth-strip-krishna-${Date.now()}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        setTimeout(() => link.remove(), 200);
      }
    } catch (err) {
      console.error("Failed to generate strip image:", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <section className="scrapbook-section reveal-on-scroll">
      <SectionRoseFlourish
        title="Photobooth Scrapbook Studio"
        subtitle="Build & customize our memories, add stickers, and print your personal photo strip! 📸✨"
        className="scrapbook-heading"
      />

      <div className="scrapbook-workspace">
        {/* ── LEFT: INTERACTIVE CONTROLS TOOLBAR ── */}
        <div className="scrapbook-sidebar">
          {/* Layout Selector */}
          <div className="control-group">
            <label className="control-label">1. Frame Layout</label>
            <div className="layout-btn-group">
              <button
                className={`layout-pill ${slotCount === 3 ? "is-active" : ""}`}
                onClick={() => handleSlotCountChange(3)}
              >
                🎞️ 3-Frame Strip
              </button>
              <button
                className={`layout-pill ${slotCount === 4 ? "is-active" : ""}`}
                onClick={() => handleSlotCountChange(4)}
              >
                🎞️ 4-Frame Strip
              </button>
            </div>
          </div>

          {/* Theme / Skin Selector */}
          <div className="control-group">
            <label className="control-label">2. Photobooth Colorway</label>
            <div className="theme-palette-row">
              {THEMES.map((th) => (
                <button
                  key={th.id}
                  className={`theme-circle-btn ${
                    selectedTheme.id === th.id ? "is-selected" : ""
                  }`}
                  style={{ backgroundColor: th.bg, borderColor: th.border }}
                  onClick={() => setSelectedTheme(th)}
                  title={th.name}
                  aria-label={th.name}
                >
                  {selectedTheme.id === th.id && (
                    <span style={{ color: th.text }}>✓</span>
                  )}
                </button>
              ))}
            </div>
            <span className="current-theme-name">{selectedTheme.name}</span>
          </div>

          {/* Sticker & Stamp Drawer */}
          <div className="control-group">
            <div className="control-header-row">
              <label className="control-label">3. Add Stickers & Stamps</label>
              <div className="sticker-action-links">
                <button
                  type="button"
                  className="sticker-header-btn"
                  onClick={handleResetStickers}
                  title="Reset stickers to default"
                >
                  ↺ Reset Stickers
                </button>
                {stickers.length > 0 && (
                  <button
                    type="button"
                    className="sticker-header-btn is-danger"
                    onClick={handleClearStickers}
                    title="Remove all stickers"
                  >
                    🗑️ Clear All
                  </button>
                )}
              </div>
            </div>
            <div className="stickers-tray">
              {STICKER_PACK.map((stk) => (
                <button
                  key={stk.id}
                  className={`sticker-pick-btn ${stk.isText ? "text-badge" : ""}`}
                  onClick={() => handleAddSticker(stk)}
                  title={`Add ${stk.char}`}
                >
                  {stk.char}
                </button>
              ))}
            </div>
            <p className="control-hint">
              ✨ Tap a sticker to add, then <strong>drag it anywhere</strong> on the photo strip!
            </p>
          </div>

          {/* Caption Input */}
          <div className="control-group">
            <label className="control-label">4. Handwritten Footer Text</label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Your custom message..."
              className="scrapbook-caption-input"
              maxLength={40}
            />
          </div>

          {/* Main Action Buttons */}
          <div className="scrapbook-actions">
            <button
              className="action-btn download-btn"
              onClick={handleDownloadStrip}
              disabled={isExporting}
            >
              {isExporting ? "⏳ Printing Strip..." : "🖨️ Download & Save Strip"}
            </button>

            <button
              className="action-btn random-btn"
              onClick={handleRandomize}
              title="Randomize photo frames"
            >
              🎲 Randomize Photos
            </button>

            <button
              className="action-btn reset-strip-btn"
              onClick={handleResetAll}
              title="Reset all settings to default"
            >
              ↺ Reset All
            </button>
          </div>
        </div>

        {/* ── RIGHT: LIVE INTERACTIVE PHOTO STRIP PREVIEW ── */}
        <div className="scrapbook-preview-wrapper">
          <div
            ref={stripPreviewRef}
            className="scrapbook-live-strip"
            style={{
              backgroundColor: selectedTheme.bg,
              borderColor: selectedTheme.border,
              color: selectedTheme.text,
            }}
          >
            {/* Vintage photobooth clip / hanging tape */}
            <div className="strip-top-clip" aria-hidden="true" />

            <div className="live-strip-header">
              <span className="live-strip-brand">PHOTOBOOTH 🌹</span>
              <span className="live-strip-sub">FOR KRISHNA</span>
            </div>

            {/* Photo Frames in the Strip */}
            <div className="live-strip-frames">
              {frames.slice(0, slotCount).map((src, index) => (
                <div
                  key={index}
                  className="live-strip-frame"
                  style={{ borderColor: selectedTheme.border }}
                  onClick={() => setActiveSlotModal(index)}
                  title="Tap to change photo"
                >
                  <img
                    src={src}
                    alt={`Slot ${index + 1}`}
                    className="live-frame-img"
                  />
                  <div className="frame-hover-overlay">
                    <span>🔄 Tap to Change</span>
                  </div>
                  <span className="frame-index-badge">{index + 1}</span>
                </div>
              ))}
            </div>

            {/* Draggable/Placeable Stickers Layer */}
            <div className="live-stickers-layer">
              {stickers.map((stk) => (
                <div
                  key={stk.id}
                  className={`live-placed-sticker ${
                    stk.isText ? "sticker-text-item" : ""
                  } ${draggingStickerId === stk.id ? "is-dragging" : ""}`}
                  style={{
                    left: `${stk.x}%`,
                    top: `${stk.y}%`,
                    transform: `rotate(${stk.rotate}deg)`,
                    fontSize: `${stk.size}px`,
                  }}
                  onPointerDown={(e) => handlePointerDownSticker(e, stk)}
                  title="Drag to reposition sticker"
                >
                  <span className="sticker-char-content">{stk.char}</span>
                  <button
                    type="button"
                    className="sticker-remove-tag"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveSticker(stk.id);
                    }}
                    onPointerDown={(e) => e.stopPropagation()}
                    aria-label="Remove sticker"
                    title="Remove sticker"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Custom Footer */}
            <div className="live-strip-footer">
              <p className="live-strip-caption">
                {caption || "Krishna & Eitan 🌹"}
              </p>
              <p className="live-strip-subcaption">est. the day i got your name</p>
            </div>
          </div>
        </div>
      </div>

      {/* Photo Picker Modal (When clicking a frame) */}
      <AnimatePresence>
        {activeSlotModal !== null && (
          <motion.div
            className="photo-picker-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveSlotModal(null)}
          >
            <motion.div
              className="photo-picker-dialog"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="picker-header">
                <h3>Choose Photo for Frame #{activeSlotModal + 1}</h3>
                <button
                  className="picker-close-btn"
                  onClick={() => setActiveSlotModal(null)}
                >
                  ✕
                </button>
              </div>

              <div className="picker-grid">
                {ALL_PHOTOS.map((p, idx) => (
                  <div
                    key={idx}
                    className="picker-thumb-card"
                    onClick={() => handleSelectPhoto(p.src)}
                  >
                    <img src={p.src} alt={p.label} />
                    <span className="picker-thumb-label">{p.label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
