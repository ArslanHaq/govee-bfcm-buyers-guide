/**
 * Decorative media-player bar that fills the space the 3rd/4th answer would
 * occupy on the two-option Q2 screens (Figma 131:1629 / 1693 / 1757 / 1821).
 *
 * Measured from the renders: controls centred at x195 with a 54px pitch, a
 * 40px play disc, and a 314px track at x38. The whole group is the screen's
 * accent colour at ~0.38 over the body.
 */
export function PlayerWidget() {
  return (
    <div className="player" aria-hidden>
      <div className="player-controls">
        <svg viewBox="0 0 28 20" className="player-skip">
          <path d="M13 2 L2 10 L13 18 Z M26 2 L15 10 L26 18 Z" fill="currentColor" />
        </svg>
        <svg viewBox="0 0 40 40" className="player-play">
          <circle cx="20" cy="20" r="20" fill="currentColor" />
          <path d="M16 12 L29 20 L16 28 Z" fill="var(--body)" />
        </svg>
        <svg viewBox="0 0 28 20" className="player-skip">
          <path d="M2 2 L13 10 L2 18 Z M15 2 L26 10 L15 18 Z" fill="currentColor" />
        </svg>
      </div>
      <div className="player-track" />
      <div className="player-fill" />
    </div>
  );
}
