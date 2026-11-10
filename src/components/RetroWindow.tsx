import type { ReactNode } from "react";

/**
 * The retro browser window that frames every screen.
 *
 * Geometry is lifted verbatim from the Figma vector exports so the notch,
 * corner radii and 2.6px outline match the design exactly:
 *   - chrome (title bar + nav row) ... 358 x 83.2325   node 131:1571
 *   - body ......................... 358 x 484.353     node 131:1568
 *   - bottom bar ................... 358 x 28.0784     node 131:1570
 *
 * Figma bakes the fill colour into each export. We strip it and drive both
 * fill and stroke from CSS custom properties instead, so one copy of the
 * geometry serves all nine screens.
 *
 * The three pieces overlap by design — chrome and bottom bar paint on top of
 * the body, which is why the body is rendered first.
 */

const CHROME_PATH =
  "M348.048 0H225.672C217.501 0 209.625 3.14432 203.597 8.81602L194.034 17.8135C187.855 23.6278 179.779 26.8499 171.404 26.8499H9.95187C4.4564 26.8499 0 31.4303 0 37.0786V83.2325H358V10.2314C358 4.58298 353.544 0.00259218 348.048 0.00259218V0Z";

const BODY_PATH =
  "M6.18146 0H351.819C355.232 0 358 4.42965 358 9.8939V474.459C358 479.923 355.232 484.353 351.819 484.353H6.18146C2.76753 484.353 0 479.923 0 474.459V9.8939C0 4.42965 2.76753 0 6.18146 0Z";

const FOOT_PATH =
  "M0 0H358V21.8773C358 25.3004 355.231 28.0784 351.819 28.0784H6.18146C2.76917 28.0784 0 25.3004 0 21.8773V0Z";

/** Stroke sits inside the shape in Figma, so we clip it to the path. */
function Piece({
  d,
  width,
  height,
  fill,
  className,
}: {
  d: string;
  width: number;
  height: number;
  fill: string;
  className?: string;
}) {
  const clip = `clip-${d.length}-${height}`;
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={className}
      aria-hidden
    >
      <defs>
        <clipPath id={clip}>
          <path d={d} />
        </clipPath>
      </defs>
      <path d={d} fill={fill} />
      <path
        d={d}
        fill="none"
        stroke="var(--border)"
        strokeWidth={5.2}
        clipPath={`url(#${clip})`}
      />
    </svg>
  );
}

export function RetroWindow({
  nav,
  children,
}: {
  /** The nav row rendered over the chrome: back/forward, search, address bar. */
  nav: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="retro-window">
      {/* Body first — chrome and foot overlap it. */}
      <Piece
        d={BODY_PATH}
        width={358}
        height={484.353}
        fill="var(--body)"
        className="rw-body"
      />
      <Piece
        d={CHROME_PATH}
        width={358}
        height={83.2325}
        fill="var(--accent)"
        className="rw-chrome"
      />
      <Piece
        d={FOOT_PATH}
        width={358}
        height={28.0784}
        fill="var(--accent)"
        className="rw-foot"
      />
      <div className="rw-nav">{nav}</div>
      <div className="rw-content">{children}</div>
    </div>
  );
}
