import React from "react";

export default function LoveNote() {
  return (
    <div className="love-note-container">
      <div className="love-note-card">
        {/* Decorative Envelope Seal or Stamp */}
        <div className="note-stamp">💌</div>

        <div className="note-content">
          <p className="note-greeting">Dearest Cyrel,</p>

          <div className="note-body">
            <p>
              Bahay-kubo, kahit munti Ang halaman doon ay sari-sari Singkamas at
              talong Sigarilyas at mani Sitaw, bataw, patani Kundol, patola,
              upo't kalabasa At tsaka mayro'n pang Labanos, mustasa Sibuyas,
              kamatis, bawang at luya Sa paligid-ligid ay puno ng linga
            </p>
            <p>
              Bahay-kubo kahit munti Ay matibay at tunay nating yaman
              Bahay-kubo, kahit munti Matatawag nating tahanan Haa-ah,
              la-la-la-la, la-la-la-la Ohh
            </p>
          </div>

          <p className="note-closing">With all my love,</p>
          <p className="note-signature">Eitan</p>
        </div>

        {/* Subtle decorative elements like a pressed flower or sticker */}
        <div className="note-decoration">🌸</div>
      </div>
    </div>
  );
}
