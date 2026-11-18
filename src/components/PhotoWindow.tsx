"use client";

import { useId } from "react";

/**
 * The browser-window frame around each result's photo (Figma group
 * "background", e.g. node 427:1892 on result #3).
 *
 * Every result uses the same geometry; only the bar colour changes, so it is
 * drawn here once from the frame's own vector paths rather than shipped as
 * seven bitmaps. Paths, sizes and offsets are copied from the Figma node;
 * offsets are relative to the window's top-left at (40.755, 691.24) on the
 * 390x1180 page.
 *
 * Strokes are Figma's INSIDE strokes: a 2.719px stroke clipped by the shape
 * itself, which is what the masks reproduce.
 */
export const PHOTO_WINDOW = { x: 40.755, y: 691.24, w: 308.035, h: 363.56 } as const;

const OUTLINE = "#372A37";
const FIELD = "#FFF8E3";

const TOP =
  "M299.472 0H194.176C187.145 0 180.368 2.70547 175.181 7.58559L166.953 15.3273C161.636 20.3301 154.688 23.1025 147.481 23.1025H8.5629C3.83443 23.1025 0 27.0436 0 31.9036V71.6159H308.035V8.80338C308.035 3.94334 304.2 0.0022304 299.472 0.0022304V0Z";
const BOTTOM =
  "M0 0H308.035V18.8239C308.035 21.7693 305.652 24.1596 302.716 24.1596H5.31872C2.38268 24.1596 0 21.7693 0 18.8239V0Z";
const ADDRESS =
  "M3.37651 0H212.46C214.325 0 215.836 1.54768 215.836 3.45236V16.7784C215.836 18.6853 214.323 20.2308 212.46 20.2308H3.37651C1.51151 20.2308 0 18.6831 0 16.7784V3.45236C0 1.54547 1.51368 0 3.37651 0Z";
const PREV =
  "M8.72644 13.2585C8.61801 13.2585 8.50958 13.2252 8.41416 13.1543L0.219029 7.06994C0.0802386 6.96794 0 6.80386 0 6.6287C0 6.45353 0.0824072 6.29166 0.219029 6.18745L8.41416 0.103136C8.65271 -0.0720321 8.9845 -0.0188146 9.15799 0.222873C9.33148 0.466777 9.27726 0.806025 9.04089 0.98341L1.43778 6.62648L9.04089 12.2695C9.27943 12.4469 9.33148 12.7862 9.15799 13.0301C9.0539 13.1764 8.89125 13.254 8.72644 13.254V13.2585Z";
const NEXT =
  "M0.533982 13.2556C0.369168 13.2556 0.206522 13.178 0.102429 13.0317C-0.0710584 12.7878 -0.0168449 12.4485 0.219532 12.2711L7.82264 6.62807L0.219532 0.985005C-0.0190135 0.80762 -0.0710584 0.468369 0.102429 0.224464C0.275917 -0.0194406 0.607711 -0.0726547 0.846257 0.104731L9.04139 6.18904C9.18018 6.29104 9.26042 6.45512 9.26042 6.63029C9.26042 6.80545 9.17801 6.96732 9.04139 7.07153L0.846257 13.1558C0.750839 13.2268 0.642412 13.2601 0.533982 13.2601V13.2556Z";
const SEARCH_RING =
  "M6.05635 12.3832C4.50364 12.3832 2.95309 11.78 1.7712 10.5716C-0.590401 8.15695 -0.590401 4.22565 1.7712 1.81099C4.13281 -0.603664 7.97773 -0.603664 10.3393 1.81099C12.7009 4.22565 12.7009 8.15695 10.3393 10.5716C9.15745 11.78 7.6069 12.3832 6.05418 12.3832H6.05635ZM6.05635 1.08593C4.77688 1.08593 3.49958 1.58261 2.52371 2.57818C0.576305 4.56933 0.576305 7.80883 2.52371 9.79998C4.47111 11.7911 7.63943 11.7911 9.58683 9.79998C11.5342 7.80883 11.5342 4.56933 9.58683 2.57818C8.61313 1.58261 7.33366 1.08593 6.05418 1.08593H6.05635Z";
const SEARCH_HANDLE =
  "M17.4024 18.0773C17.2658 18.0773 17.1292 18.0241 17.0251 17.9177L10.0921 10.8289C9.88388 10.616 9.88388 10.2724 10.0921 10.0595C10.3003 9.84663 10.6364 9.84663 10.8446 10.0595L17.7776 17.1482C17.9858 17.3611 17.9858 17.7048 17.7776 17.9177C17.6735 18.0241 17.5369 18.0773 17.4002 18.0773H17.4024Z";

/** Absolutely placed child, in px relative to the window. */
function at(x: number, y: number, w: number, h: number): React.CSSProperties {
  return { position: "absolute", left: x, top: y, width: w, height: h, display: "block" };
}

export function PhotoWindow({ accent, photo, alt }: { accent: string; photo: string; alt: string }) {
  const id = useId().replace(/:/g, "");
  return (
    // Fills its parent, which ResultScreen places at PHOTO_WINDOW (so the
    // scroll-into-view reveal observes the window itself, not the page).
    <div className="photo-window" style={at(0, 0, PHOTO_WINDOW.w, PHOTO_WINDOW.h)}>
      {/* The photo runs from just under the title bar to the bottom bar. Its
          side borders are part of the image (they are the photo node's own
          inside stroke in Figma). */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photo} alt={alt} style={at(0, 70.76, 308, 269.5)} />

      <svg style={at(0, 0, 308.035, 71.6159)} viewBox="0 0 308.035 71.6159" aria-hidden>
        <defs>
          <path id={`${id}t`} d={TOP} />
          <mask id={`${id}tm`} fill="white"><use href={`#${id}t`} /></mask>
        </defs>
        <use href={`#${id}t`} fill={accent} />
        <path d={TOP} fill="none" stroke={OUTLINE} strokeWidth={2.71901} mask={`url(#${id}tm)`} />
      </svg>

      <svg style={at(0, 339.4, 308.035, 24.1596)} viewBox="0 0 308.035 24.1596" aria-hidden>
        <defs><mask id={`${id}bm`} fill="white"><path d={BOTTOM} /></mask></defs>
        <path d={BOTTOM} fill={accent} />
        <path d={BOTTOM} fill="none" stroke={OUTLINE} strokeWidth={2.71901} mask={`url(#${id}bm)`} />
      </svg>

      {/* Nav row: back / forward / search / address field / square. */}
      <svg style={at(12.67, 49.09, 9.26042, 13.2585)} viewBox="0 0 9.26042 13.2585" aria-hidden>
        <path d={PREV} fill={OUTLINE} />
      </svg>
      <svg style={at(35.3, 49.09, 9.26042, 13.2601)} viewBox="0 0 9.26042 13.2601" aria-hidden>
        <path d={NEXT} fill={OUTLINE} />
      </svg>
      <svg style={at(54.72, 45.32, 17.9338, 18.0773)} viewBox="0 0 17.9338 18.0773" aria-hidden>
        <path d={SEARCH_RING} fill={OUTLINE} />
        <path d={SEARCH_HANDLE} fill={OUTLINE} />
      </svg>
      <svg style={at(84.55, 44.49, 215.836, 20.2308)} viewBox="0 0 215.836 20.2308" aria-hidden>
        <defs><mask id={`${id}am`} fill="white"><path d={ADDRESS} /></mask></defs>
        <path d={ADDRESS} fill={FIELD} />
        <path d={ADDRESS} fill="none" stroke="black" strokeWidth={2} mask={`url(#${id}am)`} />
      </svg>
      <svg style={at(278.0, 10.62, 21.326, 21.8051)} viewBox="0 0 21.326 21.8051" aria-hidden>
        <path d="M0.500001 0.500031H20.826V21.3051H0.500001V0.500031Z" fill={FIELD} stroke="black" />
      </svg>
    </div>
  );
}
