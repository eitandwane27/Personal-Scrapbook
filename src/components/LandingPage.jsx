import { useEffect, useRef } from "react";
import LoveNote from "./LoveNote";
import MusicPlayer from "./MusicPlayer";

// ─── Photo Data (JSON format for easy editing) ──────────────────────────────
// Leave the `src` empty strings as placeholders. When you have the photos,
// just place them in the /public folder and update the src (e.g., "/photos/pic1.jpg")
const scrapbookPhotos = [
  {
    id: 1,
    src: "pics/ccadaa7a-65c3-4f44-92ea-ad5822aeaa14.jpg",
    caption: "Our first date...",
    description:
      "The moment everything changed. I still remember exactly how you looked.",
    rotation: -4,
  },
  {
    id: 2,
    src: "",
    caption: "That time we...",
    description:
      "Lost in our own little world, oblivious to everything else around us.",
    rotation: 3,
  },
  {
    id: 3,
    src: "",
    caption: "A beautiful memory",
    description:
      "Every second with you feels like a scene from my favorite movie.",
    rotation: -2,
  },
  {
    id: 4,
    src: "",
    caption: "Just us 💕",
    description: "No matter where we are, as long as I'm with you, I'm home.",
    rotation: 5,
  },
];

const soloPhotos = [
  {
    id: 1,
    rotation: -6,
    type: "polaroid",
    sticker: "✨",
    stickerPos: "-top-6 -left-6",
  },
  {
    id: 2,
    rotation: 3,
    type: "tape",
    sticker: "💖",
    stickerPos: "-bottom-5 -right-5",
  },
  {
    id: 3,
    rotation: -2,
    type: "polaroid",
    sticker: "🌸",
    stickerPos: "-top-4 -right-8",
  },
  {
    id: 4,
    rotation: 6,
    type: "tape",
    sticker: "🎀",
    stickerPos: "-bottom-6 -left-4",
  },
  {
    id: 5,
    rotation: -4,
    type: "polaroid",
    sticker: "🦋",
    stickerPos: "-top-8 left-[40%]",
  },
  {
    id: 6,
    rotation: 2,
    type: "tape",
    sticker: "🌷",
    stickerPos: "-bottom-4 right-[40%]",
  },
];

export default function LandingPage() {
  const observerRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Setup intersection observer for scroll animations
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          } else {
            entry.target.classList.remove("is-visible");
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: "0px 0px -50px 0px",
      },
    );

    const hiddenElements = document.querySelectorAll(".reveal-on-scroll");
    hiddenElements.forEach((el) => observerRef.current.observe(el));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return (
    <div className="landing-root">
      {/* Background Ambience (Reusing the petals from PasscodeScreen) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="blob blob-1" aria-hidden="true" />
        <div className="blob blob-2" aria-hidden="true" />
        {[...Array(6)].map((_, i) => (
          <span key={i} className={`petal petal-${i + 1}`} aria-hidden="true">
            🌸
          </span>
        ))}
      </div>

      {/* Hero Section */}
      <header className="hero-section">
        <div className="scroll-indicator">
          <div className="mouse"></div>
          <p>scroll slowly</p>
        </div>

        <h1 className="hero-title">
          Hello, <span className="highlight">Cyrel</span>
        </h1>
        <p className="hero-subtitle">
          I made this little space just for us. A digital scrapbook of our
          moments, because you deserve something as beautiful as you are. Keep
          scrolling... ✨
        </p>
      </header>

      {/* Walkthrough Gallery */}
      <div className="walkthrough-container">
        {/* The central connecting timeline thread */}
        <div className="timeline-thread"></div>

        {scrapbookPhotos.map((photo, index) => {
          const isEven = index % 2 === 0;
          return (
            <section
              key={photo.id}
              className="walkthrough-step reveal-on-scroll"
            >
              <div
                className={`step-content ${isEven ? "layout-left" : "layout-right"}`}
              >
                {/* Text Block - High-Craft Typography */}
                <div className="step-text-block">
                  <span className="step-number">0{index + 1}</span>
                  <div className="step-text-inner">
                    <h2 className="step-caption">{photo.caption}</h2>
                    <p className="step-description">{photo.description}</p>
                  </div>
                </div>

                {/* Image Block */}
                <div className="step-image-block">
                  <div
                    className="polaroid-card walkthrough-card"
                    style={{ "--target-rotation": `${photo.rotation}deg` }}
                  >
                    {/* Washi tape detail */}
                    <div className="washi-tape"></div>

                    <div className="polaroid-image-container">
                      {photo.src ? (
                        <img
                          src={photo.src}
                          alt={photo.caption}
                          loading="lazy"
                        />
                      ) : (
                        <span className="placeholder-text">
                          [ Image Placeholder {index + 1} ]
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Timeline Node */}
                <div className="timeline-node"></div>
              </div>
            </section>
          );
        })}
      </div>

      {/* Canva-style Solo Scrapbook Section */}
      <section className="collage-section reveal-on-scroll">
        <h2 className="collage-title">Just You 💖</h2>
        <div className="collage-grid">
          {soloPhotos.map((photo) => (
            <div
              key={photo.id}
              className={`collage-item ${photo.type === "polaroid" ? "collage-polaroid" : "collage-tape-photo"}`}
              style={{ "--target-rotation": `${photo.rotation}deg` }}
            >
              {photo.type === "tape" && <div className="washi-tape"></div>}

              <div className="collage-image-container">
                <span className="placeholder-text">
                  [ Just You {photo.id} ]
                </span>
              </div>

              <span className={`collage-sticker ${photo.stickerPos}`}>
                {photo.sticker}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Final Message Section (Step 6 & 7) */}
      <section className="final-section-wrapper reveal-on-scroll">
        <LoveNote />
        <MusicPlayer />
      </section>

      {/* Footer hint */}
      <footer className="reveal-on-scroll ending-message">
        <h3 className="ending-title">To be continued...</h3>
        <p className="ending-subtitle">Our story is just beginning. 💌</p>
      </footer>
    </div>
  );
}
