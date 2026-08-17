import { useState, useEffect, useRef } from "react";
import { useScroll } from "motion/react";
import LoveNote from "./LoveNote";
import MusicPlayer from "./MusicPlayer";
import { ParallaxBlob, Tilt, Settle } from "./PhotoboothMotion";
import {
  DroppingRosesOverlay,
  RoseClickOverlay,
  RoseShowerButton,
} from "./DroppingRoses";
import { useRoseClickBurst } from "./useRoseClickBurst";
import {
  HeroRoseGarland,
  SectionRoseFlourish,
  RosePin,
} from "./RoseAccents";
import PhotoboothGalleryModal from "./PhotoboothGalleryModal";
import ScrapbookBuilder from "./ScrapbookBuilder";
import "../landing-responsive.css";

/* ═══════════════════════════════════════════════════════════════════
   EDIT ME
   Change these to fit your story. Everything visible on the page is
   driven from the constants below, so you never have to hunt through
   markup to change a word or a photo.
   ═══════════════════════════════════════════════════════════════════ */

const HER_NAME = "Krishna";
const SIGNER = "Eitan";

// Hero copy
const HERO_OVERLINE = "a photo booth, made just for you";
const HERO_TITLE = `For ${HER_NAME}`;
const HERO_SUBTITLE =
  "sa tingin mo magpapatalo ako hihihi";

// Section heading for the strip wall
const STRIPS_HEADING = "Hello baby ko!";
const PRINTS_HEADING = "I love youuuu!! I hope u like it!";

/* ───────────────────────────────────────────────────────────────────
   PHOTO STRIPS & PRINTS ADJUSTMENT GUIDE:
   Each frame / print can be customized with:
     • aspectRatio    : "4/3", "3/4", "1/1", "9/16", "auto", or any ratio string
     • objectPosition : "center", "center 20%", "top", "bottom", "50% 30%" (adjusts focal point/face crop)
     • objectFit      : "cover" (fills frame) or "contain" (shows full photo without crop)
     • scale          : 1, 1.05, 1.1 (fine-tune zoom level)
     • type (prints)  : "wide" (4:3), "tall" (3:4), "square" (1:1), "portrait" (9:16)
   ─────────────────────────────────────────────────────────────────── */

const photoStrips = [
  {
    id: 1,
    rotation: 5,
    frames: [
      {
        src: "/pics/01f7b79e-70f8-4bda-a374-de6104df88c7.jpg",
        caption: "the entrance",
        aspectRatio: "4/3",
        objectPosition: "center",
      },
      {
        src: "/pics/0eaa1001-2c59-4221-90c1-d3313a0beede.jpg",
        caption: "hello there",
        aspectRatio: "4/3",
        objectPosition: "center",
      },
      {
        src: "/pics/10f08b89-d210-47e4-879c-a79eeadb92f8.jpg",
        caption: "kiss bebe",
        aspectRatio: "3/4",
        objectPosition: "center 25%",
      },
      {
        src: "/pics/2d064e3f-904f-4d44-8b85-0bc23c89108b.jpg",
        caption: "kiss ule baby",
        aspectRatio: "3/4",
        objectPosition: "center 25%",
      },
    ],
  },
  {
    id: 2,
    rotation: -4,
    frames: [
      {
        src: "/pics/49e90812-ba47-4bd7-aba9-33601ceca9dc.jpg",
        caption: "before the flash",
        aspectRatio: "3/4",
        objectPosition: "center 20%",
      },
      {
        src: "/pics/4d07867d-05b2-47bc-b4d0-5d54711249a7.jpg",
        caption: "cutieeee",
        aspectRatio: "3/4",
        objectPosition: "center 25%",
      },
      {
        src: "/pics/75230ad6-5cb2-41d3-afa5-fc8347373fa8.jpg",
        caption: "hottt shetttt",
        aspectRatio: "3/4",
        objectPosition: "center 20%",
      },
      {
        src: "/pics/812759dd-8561-4530-8210-315ca96ef351.jpg",
        caption: "already iconic",
        aspectRatio: "4/3",
        objectPosition: "center",
      },
    ],
  },
  {
    id: 3,
    rotation: 3,
    frames: [
      {
        src: "/pics/85140f9b-34dc-42ff-9c28-e9efc55c8e46.jpg",
        caption: "frame one",
        aspectRatio: "3/4",
        objectPosition: "center 25%",
      },
      {
        src: "/pics/8a4a3c42-a28b-4960-afdf-049edae31684.jpg",
        caption: "frame two",
        aspectRatio: "3/4",
        objectPosition: "center 20%",
      },
      {
        src: "/pics/8a71da51-56e7-4b70-bc84-9281832e2900.jpg",
        caption: "frame three",
        aspectRatio: "3/4",
        objectPosition: "center 20%",
      },
      {
        src: "/pics/8bb5d337-bb4c-4065-9b83-24056ad3b89a.jpg",
        caption: "the winner",
        aspectRatio: "3/4",
        objectPosition: "center 25%",
      },
    ],
  },
];

/* ───────────────────────────────────────────────────────────────────
   PRINT WALL
   Tape-down prints with adjustable dimensions, aspect ratios, and focal points.
   ─────────────────────────────────────────────────────────────────── */
const prints = [
  {
    id: 1,
    src: "/pics/9538c5b0-432f-4b61-b8bd-26f119256565.jpg",
    rotation: -5,
    type: "portrait",
    aspectRatio: "3/4",
    objectPosition: "center 25%",
    note: "ganda babyyy",
  },
  {
    id: 2,
    src: "/pics/99a73939-f502-43af-8d83-591cf7251352.jpg",
    rotation: 4,
    type: "tall",
    aspectRatio: "3/4",
    objectPosition: "center 25%",
    note: "keep this one",
  },
  {
    id: 3,
    src: "/pics/9d4b5b4c-f295-4399-a719-013306d09f53.jpg",
    rotation: -3,
    type: "portrait",
    aspectRatio: "3/4",
    objectPosition: "center 25%",
    note: "oh pak",
  },
  {
    id: 4,
    src: "/pics/cba8ff8d-717c-4bfc-865b-1aac2abbed7a.jpg",
    rotation: 6,
    type: "wide",
    aspectRatio: "4/3",
    objectPosition: "center",
    note: "prettyyyy",
  },
  {
    id: 5,
    src: "/pics/ccadaa7a-65c3-4f44-92ea-ad5822aeaa14.jpg",
    rotation: -6,
    type: "tall",
    aspectRatio: "3/4",
    objectPosition: "center 25%",
    note: "yun oh",
  },
  {
    id: 6,
    src: "/pics/ce8e921a-5276-4412-82fa-52949abac59d.jpg",
    rotation: 3,
    type: "portrait",
    aspectRatio: "3/4",
    objectPosition: "center 25%",
    note: "my babyyy",
  },
  {
    id: 7,
    src: "/pics/e2a014fc-43fc-4d6a-8055-1c333ae8452e.jpg",
    rotation: -4,
    type: "tall",
    aspectRatio: "3/4",
    objectPosition: "center 25%",
    note: "cutieeee",
  },
  {
    id: 8,
    src: "/pics/f3149aac-ea41-4448-b9c0-2cee8b80af61.jpg",
    rotation: 5,
    type: "portrait",
    aspectRatio: "3/4",
    objectPosition: "center 25%",
    note: "unfiltered beauty",
  },
  {
    id: 9,
    src: "/pics/f9a9db27-7ee1-4f4f-9518-a12ba6c018ac.jpg",
    rotation: -2,
    type: "tall",
    aspectRatio: "3/4",
    objectPosition: "center 25%",
    note: "simply breathtaking",
  },
  {
    id: 10,
    src: "/pics/fc2ea9bf-c9a3-492c-bb12-5881b7c46a4d.jpg",
    rotation: 4,
    type: "portrait",
    aspectRatio: "3/4",
    objectPosition: "center 25%",
    note: "treasured forever",
  },
];

// Unified photo list for 3D flip lightbox navigation
const allPhotos = [
  ...photoStrips.flatMap((strip) =>
    strip.frames.map((frame) => ({
      ...frame,
      stripId: strip.id,
    })),
  ),
  ...prints.map((print) => ({
    ...print,
    caption: print.note,
  })),
];

export default function LandingPage() {
  const [showerCount, setShowerCount] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const { clickSpawns, triggerAt } = useRoseClickBurst();
  const observerRef = useRef(null);
  const rootRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    window.scrollTo(0, 0);

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            // Keep visible permanently once revealed - do not make photos disappear when scrolling up
            observerRef.current.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -20px 0px" },
    );

    const hiddenElements = document.querySelectorAll(".reveal-on-scroll");
    hiddenElements.forEach((el) => observerRef.current.observe(el));

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  const handlePointerDown = (e) => {
    // Spawn playful rose particles on click / tap anywhere on screen
    triggerAt(e.clientX, e.clientY);
  };

  const openLightboxBySrc = (src) => {
    const idx = allPhotos.findIndex((p) => p.src === src);
    if (idx !== -1) {
      setLightboxIndex(idx);
    }
  };

  const handleNextPhoto = () => {
    setLightboxIndex((prev) => (prev !== null ? (prev + 1) % allPhotos.length : 0));
  };

  const handlePrevPhoto = () => {
    setLightboxIndex((prev) =>
      prev !== null ? (prev - 1 + allPhotos.length) % allPhotos.length : 0,
    );
  };

  const currentLightboxPhoto =
    lightboxIndex !== null ? allPhotos[lightboxIndex] : null;

  return (
    <div
      className="landing-root photobooth"
      ref={rootRef}
      style={{ overflowX: "clip" }}
      onPointerDown={handlePointerDown}
    >
      {/* The booth takes its first flash of her arriving */}
      <div className="hero-flash" aria-hidden="true" />

      {/* Ambient Dropping Roses Layer (continuous drifting roses & petals) */}
      <DroppingRosesOverlay extraBurstCount={showerCount} />

      {/* Interactive Click / Tap Rose Sparkle Bursts */}
      <RoseClickOverlay spawns={clickSpawns} />

      {/* Booth ambience (blobs + petals, same language as the passcode) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <ParallaxBlob progress={scrollYProgress} range={-52}>
          <div className="blob blob-1" aria-hidden="true" />
        </ParallaxBlob>
        <ParallaxBlob progress={scrollYProgress} range={36}>
          <div className="blob blob-2" aria-hidden="true" />
        </ParallaxBlob>
      </div>

      {/* ── 1. HERO / BOOTH DOOR ── */}
      <header className="booth-hero">
        <div className="booth-sign" aria-hidden="true">
          <span>P</span>
          <span>H</span>
          <span>O</span>
          <span>TO</span>
          <span></span>
          <span>B</span>
          <span>O</span>
          <span>O</span>
          <span>T</span>
          <span>H</span>
        </div>

        <p className="booth-overline">{HERO_OVERLINE}</p>

        {/* Cute animated blooming rose garland crown framing the title */}
        <HeroRoseGarland />

        <h1 className="booth-title">{HERO_TITLE}</h1>
        <p className="booth-subtitle">{HERO_SUBTITLE}</p>

        <p className="booth-since">est. the day I got your name 🌹</p>

        {/* Photobooth reel tip */}
        <div className="hero-activity-pills">
          <span className="activity-pill-hint">
            ✨ Tap any photo to view in high-res & browse the photobooth reel!
          </span>
        </div>
      </header>

      {/* ── 2. PHOTO STRIP WALL ── */}
      <section className="strips-section reveal-on-scroll">
        <SectionRoseFlourish title={STRIPS_HEADING} className="heading-strip" />

        <div className="strips-grid">
          {photoStrips.map((strip, stripIndex) => (
            <div
              key={strip.id}
              className="film-strip"
              style={{ "--strip-rotation": `${strip.rotation}deg` }}
            >
              {/* Cute rose pin on film strip */}
              <RosePin variant="rose" />

              <div className="strip-clip" aria-hidden="true" />
              <div className="strip-perf" aria-hidden="true" />

              <Settle delay={stripIndex * 0.08}>
                <Tilt max={6} className="film-strip-tilt">
                  <div className="film-frames">
                    {strip.frames.map((frame, i) => (
                      <figure
                        key={i}
                        className="film-frame is-clickable"
                        style={{ animationDelay: `${i * 0.12}s` }}
                        onClick={(e) => {
                          e.stopPropagation();
                          openLightboxBySrc(frame.src);
                        }}
                        title="Tap to view photo in high-res"
                      >
                        <div
                          className="frame-image"
                          style={{
                            aspectRatio: frame.aspectRatio || "4/3",
                            ...(frame.frameStyle || {}),
                          }}
                        >
                          {frame.src ? (
                            <img
                              src={frame.src}
                              alt={frame.caption}
                              loading="lazy"
                              style={{
                                objectPosition: frame.objectPosition || "center",
                                objectFit: frame.objectFit || "cover",
                                transform: frame.scale ? `scale(${frame.scale})` : undefined,
                                ...(frame.imgStyle || {}),
                              }}
                            />
                          ) : (
                            <span className="placeholder-text">
                              your photo {strip.id}-{i + 1}
                            </span>
                          )}

                          <div className="frame-tap-indicator">
                            <span>🔍 View Photo</span>
                          </div>
                        </div>
                        <figcaption className="frame-caption">
                          {frame.caption}
                        </figcaption>
                      </figure>
                    ))}
                  </div>

                  <p className="strip-stamp">love, {SIGNER.toLowerCase()} 🌹</p>
                </Tilt>
              </Settle>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. PRINT WALL (Tape-down Polaroids) ── */}
      <section className="collage-section print-wall reveal-on-scroll">
        <SectionRoseFlourish title={PRINTS_HEADING} className="print-heading-wrapper" />

        <div className="print-grid">
          {prints.map((print, printIndex) => (
            <div
              key={print.id}
              className={`print-card print-${print.type || "tall"} is-clickable`}
              style={{ "--print-rotation": `${print.rotation}deg` }}
              onClick={(e) => {
                e.stopPropagation();
                openLightboxBySrc(print.src);
              }}
              title="Tap to view photo in high-res"
            >
              {/* Cute rose pin on print card */}
              <RosePin variant="bud" />

              <div className="print-tape" aria-hidden="true" />
              <Settle delay={printIndex * 0.08}>
                <Tilt max={8} className="print-card-tilt">
                  <div
                    className="print-image"
                    style={{
                      aspectRatio:
                        print.aspectRatio ||
                        (print.type === "portrait"
                          ? "9/16"
                          : print.type === "tall"
                          ? "3/4"
                          : print.type === "wide"
                          ? "4/3"
                          : "1/1"),
                      ...(print.imageStyle || {}),
                    }}
                  >
                    {print.src ? (
                      <img
                        src={print.src}
                        alt={print.note}
                        loading="lazy"
                        style={{
                          objectPosition: print.objectPosition || "center",
                          objectFit: print.objectFit || "cover",
                          transform: print.scale ? `scale(${print.scale})` : undefined,
                          ...(print.imgStyle || {}),
                        }}
                      />
                    ) : (
                      <span className="placeholder-text">
                        your photo {print.id}
                      </span>
                    )}

                    <div className="print-tap-indicator">
                      <span>✨ View Full</span>
                    </div>
                  </div>
                  <p className="print-note">{print.note}</p>
                </Tilt>
              </Settle>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. BUILDING MINI-GAME: PHOTOBOOTH SCRAPBOOK STUDIO ── */}
      <ScrapbookBuilder />

      {/* ── 5. LETTER (With Interactive Wax Seal) + MUSIC ── */}
      <section className="final-section reveal-on-scroll">
        <LoveNote />
        <MusicPlayer />
      </section>

      {/* ── 6. FOOTER ── */}
      <footer className="ending reveal-on-scroll">
        <SectionRoseFlourish title="to be continued" subtitle="hoping the next frame is ours." />
      </footer>

      {/* Floating "Shower Roses" Action Button */}
      <RoseShowerButton
        onShower={() => setShowerCount((prev) => prev + 1)}
        roseCount={showerCount}
      />

      {/* ── HIGH-RES PHOTOBOOTH GALLERY & REEL MODAL ── */}
      <PhotoboothGalleryModal
        photo={currentLightboxPhoto}
        allPhotos={allPhotos}
        currentIndex={lightboxIndex ?? 0}
        onClose={() => setLightboxIndex(null)}
        onSelectPhoto={(idx) => setLightboxIndex(idx)}
        onNext={handleNextPhoto}
        onPrev={handlePrevPhoto}
        hasPrev={allPhotos.length > 1}
        hasNext={allPhotos.length > 1}
      />
    </div>
  );
}
