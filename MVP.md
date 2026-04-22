# 💌 Love Letter App — MVP Reference

> A personal, aesthetic web experience built for a loved one. Soft & pastel, scrapbook-inspired, deployed on Netlify.

---

## 🎯 Concept

A private, passcode-locked web page that feels like a digital scrapbook love letter. She opens the link, enters a secret code, and is greeted with a beautiful landing page full of photos, a personal message, and a surprise song.

---

## 🛠️ Tech Stack

| Layer     | Tool                                                      |
| --------- | --------------------------------------------------------- |
| Framework | React + Vite                                              |
| Styling   | Tailwind v4 + custom CSS (animations, keyframes)          |
| Fonts     | Google Fonts — _Dancing Script_ (display) + _Lato_ (body) |
| Music     | YouTube IFrame API (hidden embed, surprise reveal)        |
| Deploy    | Netlify (drag & drop `dist/` folder)                      |

---

## ✅ Must-Have Features (MVP)

### 1. 🔒 Passcode Screen

- Soft pastel UI — pink/rose/beige tones
- Cute input field or keypad (letter-based or numeric)
- **Wrong code** → gentle shake animation + error message
- **Correct code** → smooth fade/bloom transition to landing page
- Passcode hardcoded in the app (frontend-only, no backend)

### 2. 🌸 Landing / Hero Page

- Animated name reveal (her name fades or types in)
- A short sweet headline message from you
- Soft floating elements in the background (petals, hearts, sparkles via CSS)
- Navigation or scroll cues to the sections below

### 3. 📸 Scrapbook Gallery

- Photos displayed as pinned polaroid/card style
- Slight random rotation on each card for a natural feel
- Handwritten-style font captions below each photo
- Tape or pin decorative element at the top of each card
- 4–8 photos hardcoded as local assets in `/public/photos/`

### 4. 💌 Love Note Card

- Styled like a folded letter or greeting card
- Personal message from you written inside
- Soft drop shadow, cream/blush background, serif font

### 5. 🎵 Ambient Music Player

- A sleek, aesthetic widget with spinning album art
- **Scroll Triggered**: Automatically begins playing when the user reaches the "Just You" collage section
- **Auto-Next**: Seamlessly plays the next track in the playlist when a song ends
- **Full Playlist**: Support for multiple curated YouTube tracks with metadata (title, artist, cover)
- **Controls**: Play/Pause, Next/Previous, and a subtle "Click to play" hint

---

## 🌷 Design System

### Color Palette (Soft & Pastel)

| Token           | Value     | Use                        |
| --------------- | --------- | -------------------------- |
| `--color-blush` | `#f9d5e5` | Primary background tint    |
| `--color-rose`  | `#e8a0bf` | Accents, buttons           |
| `--color-cream` | `#fff8f0` | Card backgrounds           |
| `--color-mauve` | `#c9a0c0` | Borders, subtle highlights |
| `--color-text`  | `#5c3d4e` | Main body text             |

### Typography

| Role            | Font             | Weight |
| --------------- | ---------------- | ------ |
| Display / Name  | _Dancing Script_ | 700    |
| Headings        | _Lato_           | 600    |
| Body / Captions | _Lato_           | 400    |

### Micro-Animations

- Floating petals — CSS `@keyframes` with `translateY` + `opacity`
- Card hover — `scale(1.03)` + shadow deepens
- Passcode shake — `keyframes` horizontal translate on error
- Page reveal — `opacity 0 → 1` + `translateY` bloom on unlock

---

## 📁 Folder Structure

```
perso-proj/
├── public/
│   └── photos/          ← Drop couple photos here (jpg/webp)
├── src/
│   ├── components/
│   │   ├── PasscodeScreen.jsx
│   │   ├── LandingPage.jsx
│   │   ├── ScrapbookGallery.jsx
│   │   ├── LoveNote.jsx
│   │   └── MusicPlayer.jsx
│   ├── App.jsx          ← Main state controller (locked/unlocked)
│   ├── index.css        ← Global styles + Tailwind imports + custom animations
│   └── main.jsx
├── MVP.md               ← This file
└── vite.config.js
```

---

## 🚀 Build & Deploy

```bash
# Dev
npm run dev

# Production build
npm run build

# Deploy → drag & drop the dist/ folder to Netlify
```

---

## 📋 Implementation Order

1. [x] Set up Tailwind v4 + Google Fonts in `index.css`
2. [x] Build `PasscodeScreen.jsx` with shake animation
3. [x] Wire up unlock state in `App.jsx` (locked/unlocked toggle)
4. [x] Build `LandingPage.jsx` with name reveal + floating petals
5. [x] Build `ScrapbookGallery.jsx` with scroll walkthrough & sticker collage
6. [x] Build `LoveNote.jsx` with floating glassmorphism styling
7. [x] Build `MusicPlayer.jsx` with auto-next & scroll-trigger logic
8. [x] Polish: mobile responsiveness, final asset updates

9. [ ] `npm run build` → Deploy to Netlify

---

## 🎀 Nice-to-Have (Phase 2)

- [ ] Film strip / photobooth strip layout variant
- [ ] "Our Timeline" section with milestones
- [ ] Seasonal theme updates (Valentine's, anniversary, etc.)
- [ ] Envelope open animation on Love Note card

---

> _Built with love, for love._ 💕
