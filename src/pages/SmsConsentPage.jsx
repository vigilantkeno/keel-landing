import { useEffect, useState } from "react";
import Mark from "../Mark";
import SiteFooter from "../SiteFooter";
import { BK, BK2, F, GLOBAL_STYLE, MICRO, O } from "../brand";

function useMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return mobile;
}

const inputMock = {
  width: "100%",
  padding: "13px 14px",
  background: "#111",
  border: "1px solid #242424",
  color: "#666",
  fontSize: 14,
  fontFamily: F.sans,
  borderRadius: 0,
};

export default function SmsConsentPage() {
  const mobile = useMobile();

  useEffect(() => {
    document.title = "SMS Consent — keel";
  }, []);

  return (
    <div style={{ background: BK, color: "#F5F5F5", fontFamily: F.sans,
      minHeight: "100vh", WebkitFontSmoothing: "antialiased" }}>
      <style>{GLOBAL_STYLE}</style>

      <nav style={{ display: "flex", alignItems: "center",
        justifyContent: "space-between",
        padding: mobile ? "14px 20px" : "16px 48px",
        borderBottom: "1px solid #1C1C1C",
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(11,11,11,0.97)",
        backdropFilter: "blur(12px)" }}>
        <a href="/" style={{ display: "flex", alignItems: "center", gap: mobile ? 8 : 10,
          textDecoration: "none" }}>
          <Mark size={mobile ? 28 : 32} />
          <span style={{ fontFamily: F.sans, fontWeight: 600, fontSize: mobile ? 19 : 21,
            letterSpacing: "-0.025em", color: "#FFF" }}>keel</span>
        </a>
        {!mobile && (
          <span style={{ fontFamily: F.mono, fontSize: 9,
            color: MICRO, letterSpacing: "0.18em" }}>getkeel.io</span>
        )}
      </nav>

      <main style={{ maxWidth: 560, margin: "0 auto",
        padding: mobile ? "40px 20px 56px" : "56px 48px 72px" }}>
        <div style={{ fontFamily: F.mono, fontSize: 10, color: O,
          letterSpacing: "0.22em", marginBottom: 12 }}>10DLC REVIEW</div>
        <h1 style={{ fontFamily: F.cond, fontWeight: 900, fontSize: mobile ? 32 : 40,
          color: "#FFF", letterSpacing: "-0.01em", textTransform: "uppercase",
          marginBottom: 16, lineHeight: 1.05 }}>
          SMS Opt-In Disclosure
        </h1>
        <p style={{ fontFamily: F.sans, fontSize: mobile ? 14 : 15, color: MICRO,
          lineHeight: 1.75, marginBottom: 32 }}>
          This is the SMS opt-in disclosure shown to Keel users during authenticated
          onboarding before SMS messaging is enabled.
        </p>

        <div style={{ background: BK2, border: "1px solid #222",
          padding: mobile ? "24px 20px" : "32px 28px",
          boxShadow: "0 24px 48px rgba(0,0,0,0.45)" }}>
          <div style={{ fontFamily: F.mono, fontSize: 9, color: MICRO,
            letterSpacing: "0.16em", marginBottom: 20 }}>
            ONBOARDING · CONSENT SCREEN · PREVIEW
          </div>

          <h2 style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 20,
            color: "#F0F0F0", marginBottom: 14 }}>
            Enable Keel SMS
          </h2>
          <p style={{ fontFamily: F.sans, fontSize: 15, color: "#AAA",
            lineHeight: 1.75, marginBottom: 24 }}>
            Keel can send operational SMS messages related to your sales-call debriefs,
            follow-up prompts, coaching notifications, draft-ready notifications, and
            feedback requests.
          </p>

          <div style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: F.mono, fontSize: 9, color: MICRO,
              letterSpacing: "0.14em", marginBottom: 7 }}>
              MOBILE PHONE NUMBER
            </div>
            <input type="tel" readOnly disabled aria-readonly="true"
              placeholder="Mobile phone number"
              style={{ ...inputMock, cursor: "not-allowed", opacity: 0.85 }} />
          </div>

          <label style={{ display: "flex", gap: 12, alignItems: "flex-start",
            marginBottom: 28, cursor: "default" }}>
            <input type="checkbox" readOnly disabled aria-readonly="true"
              style={{ marginTop: 4, width: 16, height: 16, flexShrink: 0,
                accentColor: O, cursor: "not-allowed" }} />
            <span style={{ fontFamily: F.sans, fontSize: 14, color: "#AAA",
              lineHeight: 1.7 }}>
              I agree to receive operational SMS messages from Keel. Message frequency
              may vary. Message and data rates may apply. Reply STOP to opt out.
              Reply HELP for help. Consent is not a condition of purchase. See our{" "}
              <a href="https://getkeel.io/terms" style={{ color: O }}>Terms</a>
              {" "}and{" "}
              <a href="https://getkeel.io/privacy" style={{ color: O }}>Privacy Policy</a>.
            </span>
          </label>

          <div style={{ display: "flex", flexDirection: mobile ? "column" : "row",
            gap: 10 }}>
            <button type="button" disabled aria-disabled="true"
              style={{ flex: 1, background: O, color: "#000", border: "none",
                padding: "14px 18px", fontFamily: F.sans, fontWeight: 700,
                fontSize: 14, opacity: 0.55, cursor: "not-allowed" }}>
              Enable SMS
            </button>
            <button type="button" disabled aria-disabled="true"
              style={{ flex: 1, background: "transparent", color: MICRO,
                border: "1px solid #333", padding: "14px 18px",
                fontFamily: F.sans, fontWeight: 600, fontSize: 14,
                opacity: 0.55, cursor: "not-allowed" }}>
              Continue without SMS
            </button>
          </div>
        </div>

        <p style={{ fontFamily: F.mono, fontSize: 9, color: MICRO,
          letterSpacing: "0.12em", lineHeight: 1.6, marginTop: 24 }}>
          DISPLAY-ONLY PREVIEW · NO DATA COLLECTED ON THIS PAGE · KEEL IS OPERATED BY PLANTLY, LLC
        </p>
      </main>

      <SiteFooter mobile={mobile} />
    </div>
  );
}
