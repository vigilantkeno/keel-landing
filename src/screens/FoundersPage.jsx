"use client";

import { useCallback, useEffect, useState } from "react";
import Mark from "../Mark";
import SiteFooter from "../SiteFooter";
import { O, BK, BK2, MICRO, F } from "../brand";
import { WaitlistForm, SuccessView, COUNTER_SEED } from "../App";
import HeroGlowGrid from "../HeroGlowGrid";

// Same local pattern as BlogShell.jsx / LegalShell.jsx — init to a constant
// (not window) so this still renders on the server.
function useMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768);
    fn();
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return mobile;
}

// Dedicated landing surface for /founders — every "Apply for Early Access"
// link off the blog points here now (see contract §5). Deliberately reuses
// the homepage's real WaitlistForm/SuccessView rather than a second form
// implementation. Simple by design — the homepage's own Founders Club
// teaser stays exactly as it is; this page can grow independently later.
export default function FoundersPage() {
  const mobile = useMobile();
  const [liveCount, setLiveCount] = useState(COUNTER_SEED);
  const [successNum, setSuccessNum] = useState(null);

  const handleSuccess = useCallback((num) => {
    if (typeof num === "number") setLiveCount(num);
    setSuccessNum(typeof num === "number" ? num : true);
  }, []);

  return (
    <main style={{ background: BK, color: "#F5F5F5", fontFamily: F.sans,
      minHeight: "100vh", WebkitFontSmoothing: "antialiased" }}>

      {successNum != null && (
        <SuccessView
          number={typeof successNum === "number" ? successNum : null}
          mobile={mobile}
          onClose={() => setSuccessNum(null)} />
      )}

      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: mobile ? "14px 20px" : "16px 48px", borderBottom: "1px solid #1C1C1C" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <Mark size={mobile ? 28 : 32} />
          <span style={{ fontFamily: F.sans, fontWeight: 600, fontSize: mobile ? 19 : 21,
            letterSpacing: "-0.025em", color: "#FFF" }}>keel</span>
        </a>
        <a href="/" style={{ fontFamily: F.mono, fontSize: 9, color: MICRO,
          letterSpacing: "0.18em", textDecoration: "none" }}>BACK TO SITE</a>
      </nav>

      <div style={{ position: "relative", overflow: "hidden" }}>
        {/* Triangle-tessellation texture with an ambient/cursor-tracked
            glow behind the headline — see HeroGlowGrid for the full
            treatment. Replaces the earlier flat radial spotlight. */}
        <HeroGlowGrid />
        <div style={{ position: "relative", maxWidth: 720, margin: "0 auto",
          padding: mobile ? "48px 20px 32px" : "72px 48px 40px" }}>
          <div style={{ fontFamily: F.mono, fontSize: mobile ? 9 : 10, color: O,
            letterSpacing: "0.22em", marginBottom: 16 }}>FOUNDERS CLUB · INVITE-REVIEWED</div>
          <h1 style={{ fontFamily: F.cond, fontWeight: 900, fontSize: mobile ? 38 : 64,
            lineHeight: 0.96, letterSpacing: "-0.01em", textTransform: "uppercase", color: "#FFF",
            marginBottom: 24 }}>
            We're not looking for users.<br />
            We want{" "}
            <span style={{ borderBottom: `3px solid ${O}`, paddingBottom: 4 }}>
              accomplices.
            </span>
          </h1>
          <p style={{ fontFamily: F.sans, fontSize: mobile ? 15 : 18, lineHeight: 1.75, color: "#8A8A8A",
            maxWidth: 560, marginBottom: 8 }}>
            Sara doesn't have a manual yet — she has the reps who are teaching her
            what to ask next. That's what Founders Club actually is. Not a beta.
            A small group deciding what this becomes before anyone else gets a vote.
          </p>
        </div>
      </div>

      <div style={{ borderTop: "1px solid #1A1A1A", padding: mobile ? "40px 20px" : "56px 48px",
        textAlign: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <div style={{ fontFamily: F.cond, fontWeight: 900, fontSize: mobile ? 42 : 58,
            color: "#FFF", letterSpacing: "0.02em", lineHeight: 1 }}>KISS</div>
          <div style={{ fontFamily: F.mono, fontSize: mobile ? 9 : 10, color: MICRO,
            letterSpacing: "0.22em", marginTop: 10, marginBottom: mobile ? 28 : 36 }}>
            KEEP IT SIMPLE, STUPID
          </div>
          <div style={{ display: "flex", justifyContent: "center",
            gap: mobile ? 32 : 56, marginBottom: mobile ? 24 : 32 }}>
            {/* Phone — a rep calls Sara. Hand-drawn, not from an icon set. */}
            <svg width={mobile ? 40 : 56} height={mobile ? 40 : 56} viewBox="0 0 48 48" fill="none"
              aria-hidden="true">
              <path d="M15 8c2 0 4 4 4 6s-2 3-2 4c1 3 4 6 7 7 1 0 2-2 4-2s6 2 6 4-3 5-5 5c-8 0-19-11-19-19 0-2 3-5 5-5Z"
                stroke={O} strokeWidth="2" strokeLinejoin="round" />
            </svg>
            {/* Chat — a rep texts Sara. */}
            <svg width={mobile ? 40 : 56} height={mobile ? 40 : 56} viewBox="0 0 48 48" fill="none"
              aria-hidden="true">
              <rect x="6" y="8" width="36" height="24" rx="4" stroke={O} strokeWidth="2" />
              <path d="M14 32v8l10-8" stroke={O} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
            </svg>
          </div>
          <p style={{ fontFamily: F.sans, fontSize: mobile ? 15 : 17, lineHeight: 1.7,
            color: "#8A8A8A", maxWidth: 480, margin: "0 auto" }}>
            Sara isn't an app. No dashboard to log into, no project to manage,
            nothing to install. You call her, or you text her. That's the
            whole interface — because that's the whole point.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: mobile ? "8px 20px 40px" : "16px 48px 56px" }}>
        <h2 style={{ fontFamily: F.cond, fontWeight: 800, fontSize: mobile ? 20 : 24, color: "#FFF",
          letterSpacing: "-0.01em", textTransform: "uppercase", marginBottom: 14 }}>
          Why it's invite-only, honestly
        </h2>
        <p style={{ fontFamily: F.sans, fontSize: mobile ? 14 : 16, lineHeight: 1.8, color: "#888",
          marginBottom: 0 }}>
          Not scarcity marketing — we're small enough that if you apply, one of
          us actually reads it. Every early conversation shapes what Sara asks
          next. Flood that with a thousand strangers and it stops working for
          anyone. So: reviewed applications, no self-serve signup, and a founder
          who'll be in the room while you're in the room.
        </p>
      </div>

      <div style={{ background: BK2, borderTop: "1px solid #1A1A1A",
        borderBottom: "1px solid #1A1A1A", padding: mobile ? "36px 20px" : "48px 48px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h2 style={{ fontFamily: F.cond, fontWeight: 800, fontSize: mobile ? 20 : 24, color: "#FFF",
            letterSpacing: "-0.01em", textTransform: "uppercase", marginBottom: 20 }}>
            Who this is (and isn't) for
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: mobile ? "1fr" : "1fr 1fr",
            gap: 24 }}>
            <div>
              <div style={{ fontFamily: F.mono, fontSize: 10, color: O,
                letterSpacing: "0.16em", marginBottom: 10 }}>THIS IS FOR YOU IF</div>
              <p style={{ fontFamily: F.sans, fontSize: 15, lineHeight: 1.8, color: "#999" }}>
                You're carrying 8–20 deals alone, most of your real selling
                happens off a recorded call, and you're tired of a stack built
                to watch you instead of help you.
              </p>
            </div>
            <div>
              <div style={{ fontFamily: F.mono, fontSize: 10, color: MICRO,
                letterSpacing: "0.16em", marginBottom: 10 }}>NOT YET, IF</div>
              <p style={{ fontFamily: F.sans, fontSize: 15, lineHeight: 1.8, color: "#999" }}>
                You run a 40-rep team with a real coaching motion and a
                dashboard everyone actually uses — Gong is good at that job.
                We're not trying to be a smaller version of it.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: mobile ? "40px 20px 56px" : "56px 48px 80px" }}>
        <div style={{ fontFamily: F.mono, fontSize: mobile ? 9 : 10, color: O,
          letterSpacing: "0.22em", marginBottom: 12 }}>APPLY</div>
        <h2 style={{ fontFamily: F.cond, fontWeight: 900, fontSize: mobile ? 28 : 36, color: "#FFF",
          letterSpacing: "-0.01em", textTransform: "uppercase", marginBottom: 16 }}>
          Your pipeline already knows<br />what's wrong with it.
        </h2>
        <p style={{ fontFamily: F.sans, fontSize: mobile ? 14 : 16, lineHeight: 1.75, color: "#8A8A8A",
          marginBottom: 32 }}>
          Come tell someone who's listening.
        </p>
        <WaitlistForm mobile={mobile} center={false}
          liveCount={liveCount} onSuccess={handleSuccess} />
      </div>

      <SiteFooter mobile={mobile} />
    </main>
  );
}
