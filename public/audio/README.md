# Audio Fallback Directory

Place your hardcoded / offline `.mp3` files in this folder.

### Supported File Naming:
You can assign an `mp3` property in `src/components/MusicPlayer.jsx` to each song in your playlist:

```js
{
  id: "GnUW4AF1LZo",
  title: "Just the Way You Are",
  artist: "Bruno Mars",
  cover: "https://i.ytimg.com/vi/GnUW4AF1LZo/maxresdefault.jpg",
  mp3: "/audio/just_the_way_you_are.mp3", // <-- Local MP3 fallback
}
```

Or you can add a single `fallback.mp3` in this folder (`public/audio/fallback.mp3`) which will act as the global fallback whenever any YouTube stream fails or takes too long to load on slow networks.
