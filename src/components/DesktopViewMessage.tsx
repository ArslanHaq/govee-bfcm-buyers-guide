import Image from "next/image";

/**
 * Shown above 768px. The design only exists at 390x720, so rather than
 * stretch it — which blew the background grid up to several times its
 * intended size and looked broken — the phone is shown as a phone: the real
 * cover inside a device frame, with the campaign's own type beside it.
 *
 * The backdrop grid is drawn in CSS at the scale it has on mobile, so it
 * reads as the same world rather than a zoomed-in crop.
 */
export function DesktopViewMessage() {
  return (
    <main className="dv">
      <div className="dv-grid" aria-hidden />

      <div className="dv-inner">
        <div className="dv-phone">
          <Image
            src="/plates/cover.webp"
            alt="Build Your Perfect Holiday Setup — the Govee holiday lighting guide"
            width={390}
            height={720}
            priority
            unoptimized
          />
        </div>

        <div className="dv-copy">
          <Image className="dv-logo" src="/icons/govee.png" alt="Govee" width={110} height={62} priority />

          <Image
            className="dv-headline"
            src="/art/cover/headline.svg"
            alt="Build Your Perfect Holiday Setup"
            width={315}
            height={91}
            priority
          />

          <p className="dv-lead">This guide is built for your phone.</p>
          <p className="dv-sub">
            Scan or open it on mobile, answer 2–3 quick questions, and find the
            holiday lighting that fits your home.
          </p>

          <div className="dv-badges">
            <Image src="/art/cover/Group 10879108.svg" alt="Starts Nov 19" width={116} height={71} />
            <Image src="/art/cover/Group 10879074.svg" alt="Up to 53% off" width={294} height={92} className="dv-offer" />
          </div>
        </div>
      </div>
    </main>
  );
}
