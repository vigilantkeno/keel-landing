"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import SiteFooter from "./SiteFooter";
import Mark from "./Mark";
import { O, OL, BK, BK2, MICRO, F } from "./brand";

/* ─── CONFIG ─────────────────────────────────────────────────────────────── */
const FORMSPREE_URL = "https://formspree.io/f/xpqogzeb";
const COUNTER_API   = "https://api.counterapi.dev/v1/getkeel/founding";
export const COUNTER_SEED  = 10; // floor matching approximate Formspree total; next submit = seed+1
const SHARE_URL     = "https://getkeel.io";
const SHOW_LIVE_COUNTER = false; // Re-enable when count exceeds 50; use GET COUNTER_API (not /up)

async function nextApplicationNumber() {
  const up = async () => {
    const res = await fetch(`${COUNTER_API}/up/`);
    if (!res.ok) throw new Error("counter up failed");
    const data = await res.json();
    return data.count;
  };

  let count = await up();
  // Bring a fresh/undersized counter up to the seed, then one more for this application
  while (count < COUNTER_SEED) {
    count = await up();
  }
  if (count === COUNTER_SEED) {
    // Seed represents existing submissions; this applicant is next
    count = await up();
  }
  return count;
}

/* ─── BRAND ──────────────────────────────────────────────────────────────── */
// Imported, not redeclared: this file previously kept a byte-identical copy of
// the brand tokens, which silently bypassed brand.js. That mattered the moment
// F moved to next/font CSS variables — the landing page kept requesting
// 'Barlow Condensed' by its original name, which next/font no longer registers,
// so the hero fell back to a system font and reflowed.

/* ─── LOGO ───────────────────────────────────────────────────────────────── */
// Mark and its path data live in ./Mark — this file previously carried a
// byte-identical duplicate whose module-level id counter incremented
// separately on server and client, producing mismatched SVG gradient ids and
// React hydration errors (#418/#423/#425) on every page load.

/* ─── HOOKS ──────────────────────────────────────────────────────────────── */
function useW() {
  const [w, setW] = useState(800);
  useEffect(() => {
    const fn = () => setW(window.innerWidth);
    fn(); window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);
  return w;
}

function useVis(threshold = 0.12) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const ob = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVis(true); },
      { threshold }
    );
    if (ref.current) ob.observe(ref.current);
    return () => ob.disconnect();
  }, []);
  return [ref, vis];
}

/* ─── LIVE COUNTER ───────────────────────────────────────────────────────── */
function LiveCounter({ target, style = {} }) {
  const [display, setDisplay] = useState(target);
  const prev = useRef(target);
  const raf  = useRef(null);
  const [ref, vis] = useVis(0.2);
  const initDone   = useRef(false);

  const animate = useCallback((from, to, dur = 1000) => {
    cancelAnimationFrame(raf.current);
    const start = performance.now();
    const tick  = (now) => {
      const t    = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(from + (to - from) * ease));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  }, []);

  // scroll-in initial count-up
  useEffect(() => {
    if (!vis || initDone.current) return;
    initDone.current = true;
    animate(0, target, 1400);
  }, [vis, target, animate]);

  // re-animate when target changes (new signup)
  useEffect(() => {
    if (!initDone.current) return;
    if (target === prev.current) return;
    animate(prev.current, target, 800);
    prev.current = target;
  }, [target, animate]);

  return (
    <span ref={ref} style={{ fontVariantNumeric:"tabular-nums", ...style }}>
      {display}
    </span>
  );
}

/* ─── SARA PHONE PREVIEW ─────────────────────────────────────────────────── */
function SaraPhonePreview({ mobile }) {
  const bubbles = [
    { who:"you", t:"Just left lunch with Dana Chen — VP Ops at Meridian. Interested in Q3 expansion. Card pic next." },
    { who:"sara", t:"Got it. Saved Dana Chen · Meridian · VP Ops. What did she push back on?" },
    { who:"you", t:"Budget timing. Said champion is hot but CFO hasn't seen numbers." },
    { who:"sara", t:"When do you talk to the CFO directly — not through the champion?" },
  ];

  return (
    <div style={{ background:"#0D0D0D", border:"1px solid #222",
      boxShadow:"0 32px 72px rgba(0,0,0,0.65)" }}>
      <div style={{ background:"#141414", borderBottom:"1px solid #222",
        padding:`${mobile?9:10}px 16px`,
        display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:7 }}>
          <Mark size={12} variant="dim"/>
          <span style={{ fontFamily:F.mono, fontSize:9,
            color:MICRO, letterSpacing:"0.16em" }}>
            SARA · TEXT
          </span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:6, height:6, borderRadius:"50%", background:O,
            animation:"blink 1.8s ease infinite" }}/>
          <span style={{ fontFamily:F.mono, fontSize:9,
            color:O, letterSpacing:"0.14em" }}>LIVE</span>
        </div>
      </div>

      <div style={{ padding: mobile?"16px 14px":"20px 18px",
        display:"flex", flexDirection:"column", gap:12 }}>
        {bubbles.map((b,i) => (
          <div key={i} style={{
            alignSelf: b.who==="you"?"flex-end":"flex-start",
            maxWidth:"88%",
            background: b.who==="you"?"#1A120C":"#141414",
            border: `1px solid ${b.who==="you"?`${O}44`:"#222"}`,
            padding:"10px 12px" }}>
            <div style={{ fontFamily:F.mono, fontSize:8,
              color: b.who==="you"?O:MICRO,
              letterSpacing:"0.14em", marginBottom:6 }}>
              {b.who==="you"?"YOU":"SARA"}
            </div>
            <div style={{ fontFamily:F.sans, fontSize: mobile?13:14,
              color: b.who==="you"?"#DDD":"#BBB", lineHeight:1.55 }}>
              {b.t}
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding:"12px 16px", background:"#0A0A0A",
        borderTop:"1px solid #1A1A1A",
        display:"flex", justifyContent:"space-between", alignItems:"center", gap:12 }}>
        <span style={{ fontFamily:F.mono, fontSize:9,
          color:MICRO, letterSpacing:"0.12em" }}>
          OR CALL · DUMP THE DRIVE HOME
        </span>
        <span style={{ fontFamily:F.mono, fontSize:9,
          color:O, letterSpacing:"0.12em" }}>
          24/7
        </span>
      </div>
    </div>
  );
}

/* ─── FORM PRIMITIVES ────────────────────────────────────────────────────── */
const inputBase = {
  width:"100%", padding:"13px 14px",
  background:"#111", border:"1px solid #242424",
  color:"#F0F0F0", fontSize:14,
  fontFamily:"'Plus Jakarta Sans',sans-serif",
  transition:"border-color 0.15s",
  WebkitAppearance:"none", borderRadius:0,
};

function Field({ label, children }) {
  return (
    <div>
      <div style={{ fontFamily:"'DM Mono',monospace", fontSize:9,
        color:MICRO, letterSpacing:"0.14em", marginBottom:7 }}>
        {label}
      </div>
      {children}
    </div>
  );
}

function Select({ value, onChange, children, ...rest }) {
  return (
    <select value={value} onChange={onChange}
      style={{ ...inputBase, cursor:"pointer",
        backgroundImage:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23555' d='M6 8L0 0h12z'/%3E%3C/svg%3E")`,
        backgroundRepeat:"no-repeat",
        backgroundPosition:"right 14px center",
        paddingRight:36, ...rest }}
      {...rest}>
      {children}
    </select>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   TWO-STEP WAITLIST FORM
   Step 1 — email (fast, low friction)
   Step 2 — qualifying info (company, role, deal load, CRM)
──────────────────────────────────────────────────────────────────────────────── */
export function WaitlistForm({ mobile, center, liveCount, onSuccess }) {
  const [step,   setStep]   = useState(1);
  const [email,  setEmail]  = useState("");
  const [fields, setFields] = useState({
    company: "", role: "", deals: "", crm: ""
  });
  const [status, setStatus] = useState("idle");

  const set = (k) => (e) => setFields(f => ({ ...f, [k]: e.target.value }));

  const step1Valid = email.trim().includes("@");
  const step2Valid = fields.company.trim() && fields.role && fields.deals && fields.crm;

  const submitAll = async () => {
    if (!step2Valid) return;
    setStatus("sending");
    try {
      const res = await fetch(FORMSPREE_URL, {
        method:"POST",
        headers:{ "Content-Type":"application/json","Accept":"application/json" },
        body: JSON.stringify({
          email: email.trim(),
          company: fields.company,
          role: fields.role,
          active_deals: fields.deals,
          crm: fields.crm,
          source: "getkeel.io",
          cohort: "founding",
        }),
      });
      if (!res.ok) throw new Error("formspree failed");

      let number = null;
      try {
        number = await nextApplicationNumber();
      } catch {}
      onSuccess?.(number);
    } catch {
      setStatus("idle");
    }
  };

  const sending = status === "sending";

  /* ── STEP 1 ── */
  if (step === 1) {
    return (
      <div style={{ maxWidth: center&&!mobile?440:"100%",
        margin: center&&!mobile?"0 auto":undefined }}>
        <div style={{ display:"flex", flexDirection: mobile?"column":"row",
          marginBottom:14,
          boxShadow: mobile?"none":`0 0 0 1px #2A2A2A` }}>
          <input id="cta-email" type="email"
            placeholder="your@company.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key==="Enter" && step1Valid && setStep(2)}
            style={{ ...inputBase, flex:1,
              border: mobile?"1px solid #2A2A2A":"1px solid transparent",
              borderBottom: mobile?"none":undefined,
              borderRight: mobile?undefined:"none",
              width: mobile?"100%":undefined }}
          />
          <button
            onClick={() => step1Valid && setStep(2)}
            onMouseEnter={e => {
              if (step1Valid) e.currentTarget.style.background = OL;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = step1Valid ? O : "transparent";
            }}
            style={{
              background: step1Valid ? O : "transparent",
              color: step1Valid ? "#000" : O,
              border: step1Valid ? "none" : `1px solid ${O}`,
              padding: mobile ? "16px" : "16px 28px",
              fontFamily: F.sans, fontWeight: 700, fontSize: 15,
              cursor: step1Valid ? "pointer" : "default",
              transition: "all 0.15s", whiteSpace: "nowrap",
              width: mobile ? "100%" : undefined,
              animation: step1Valid ? "orangeGlow 3s ease 2.5s infinite" : "none",
            }}>
            Apply for Early Access
          </button>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
          <div style={{ display:"flex", alignItems:"center", gap:14, flexWrap:"wrap",
            justifyContent: center&&!mobile?"center":undefined }}>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ display:"flex", gap:3 }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{ width:6, height:6, borderRadius:"50%",
                    background: i===0?O:"#2A2A2A",
                    animation: i===0?"blink 1.8s ease infinite":"none" }}/>
                ))}
              </div>
              <span style={{ fontFamily:F.mono, fontSize:10,
                color:MICRO, letterSpacing:"0.12em" }}>
                {SHOW_LIVE_COUNTER ? (
                  <><LiveCounter target={liveCount}/> reps have applied</>
                ) : (
                  "Founders Club seats are limited."
                )}
              </span>
            </div>
            <span style={{ fontFamily:F.mono, fontSize:9,
              color:MICRO, letterSpacing:"0.12em" }}>
              NO SPAM · NO CREDIT CARD
            </span>
          </div>
          <span style={{ fontFamily:F.mono, fontSize:9,
            color:MICRO, letterSpacing:"0.12em",
            textAlign: center&&!mobile?"center":undefined }}>
            We review applications weekly. You'll hear from a human.
          </span>
        </div>
      </div>
    );
  }

  /* ── STEP 2 ── */
  return (
    <div style={{ maxWidth: center&&!mobile?480:"100%",
      margin: center&&!mobile?"0 auto":undefined,
      background:BK2, border:"1px solid #222",
      padding: mobile?"20px":"28px",
      animation:"fadeUp 0.35s ease" }}>

      {/* Header */}
      <div style={{ display:"flex", alignItems:"flex-start",
        justifyContent:"space-between", marginBottom:22 }}>
        <div>
          <div style={{ fontFamily:F.mono, fontSize:9, color:O,
            letterSpacing:"0.2em", marginBottom:5 }}>
            STEP 2 OF 2 · MOVE UP THE LIST
          </div>
          <div style={{ fontFamily:F.sans, fontWeight:600,
            fontSize: mobile?14:15, color:"#CCC" }}>
            Answer a few quick questions to move up the list.
          </div>
          <div style={{ fontFamily:F.sans, fontSize:12,
            color:"#444", marginTop:3 }}>
            Applying as{" "}
            <span style={{ color:"#888" }}>{email}</span>
            {" "}·{" "}
            <button onClick={() => setStep(1)}
              style={{ background:"none", border:"none", color:MICRO,
                fontFamily:F.mono, fontSize:9, letterSpacing:"0.1em",
                cursor:"pointer", textDecoration:"underline",
                textDecorationColor:"#555" }}>
              change
            </button>
          </div>
        </div>
        {/* Step indicator */}
        <div style={{ display:"flex", gap:4, paddingTop:2 }}>
          {[1,2].map(s => (
            <div key={s} style={{ width: s===step?20:6, height:4,
              background: s<=step?O:"#2A2A2A",
              transition:"all 0.3s ease" }}/>
          ))}
        </div>
      </div>

      {/* Fields */}
      <div style={{ display:"flex", flexDirection:"column", gap:16,
        marginBottom:22 }}>

        <Field label="COMPANY">
          <input type="text"
            placeholder="Acme Corp"
            value={fields.company}
            onChange={set("company")}
            style={{ ...inputBase }}
          />
        </Field>

        <Field label="YOUR ROLE">
          <Select value={fields.role} onChange={set("role")}>
            <option value="" disabled>Select your role</option>
            <option value="ae">Account Executive</option>
            <option value="sr_ae">Senior Account Executive</option>
            <option value="enterprise_ae">Enterprise AE</option>
            <option value="manager">Sales Manager</option>
            <option value="vp">VP / Director of Sales</option>
            <option value="sdr_bdr">SDR / BDR</option>
            <option value="other">Other</option>
          </Select>
        </Field>

        <div style={{ display:"grid",
          gridTemplateColumns: mobile?"1fr":"1fr 1fr", gap:16 }}>
          <Field label="ACTIVE DEALS RIGHT NOW">
            <Select value={fields.deals} onChange={set("deals")}>
              <option value="" disabled>Select range</option>
              <option value="under5">Under 5</option>
              <option value="5to10">5 – 10</option>
              <option value="10to20">10 – 20</option>
              <option value="20plus">20+</option>
            </Select>
          </Field>

          <Field label="PRIMARY CRM">
            <Select value={fields.crm} onChange={set("crm")}>
              <option value="" disabled>Select CRM</option>
              <option value="salesforce">Salesforce</option>
              <option value="hubspot">HubSpot</option>
              <option value="pipedrive">Pipedrive</option>
              <option value="dynamics">MS Dynamics</option>
              <option value="other">Other / None</option>
            </Select>
          </Field>
        </div>
      </div>

      {/* Submit */}
      <button
        onClick={submitAll}
        disabled={!step2Valid || sending}
        onMouseEnter={e => { if(step2Valid&&!sending) e.currentTarget.style.background=OL; }}
        onMouseLeave={e => { e.currentTarget.style.background=step2Valid?O:"transparent"; }}
        style={{ width:"100%",
          background: step2Valid ? O : "transparent",
          color: step2Valid ? "#000" : O,
          border: step2Valid ? "none" : `1px solid ${O}`,
          padding:"16px",
          fontFamily:F.sans, fontWeight:700, fontSize:15,
          cursor: step2Valid&&!sending?"pointer":"default",
          transition:"all 0.15s",
          opacity: sending?0.6:1 }}>
        {sending ? "Saving your spot…" : "Join Founders Club"}
      </button>

      <div style={{ marginTop:12, fontFamily:F.mono, fontSize:9,
        color:MICRO, letterSpacing:"0.12em", textAlign:"center" }}>
        WE REVIEW EVERY APPLICATION · HELPS US PRIORITIZE YOUR ACCESS
      </div>
      <div style={{ marginTop:8, fontFamily:F.mono, fontSize:9,
        color:MICRO, letterSpacing:"0.12em", textAlign:"center" }}>
        We review applications weekly. You'll hear from a human.
      </div>
    </div>
  );
}

/* ─── SUCCESS VIEW ───────────────────────────────────────────────────────── */
export function SuccessView({ number, mobile, onClose }) {
  const shareText = `Just applied for early access to @getkeel — Sara, the 24/7 deal assistant for reps. ${SHARE_URL}`;
  const hasNumber = typeof number === "number" && number > 0;

  return (
    <div style={{ position:"fixed", inset:0, background:BK, zIndex:200,
      overflowY:"auto", animation:"fadeUp 0.45s ease" }}>

      <div style={{ display:"flex", alignItems:"center",
        justifyContent:"space-between",
        padding: mobile?"16px 20px":"18px 48px",
        borderBottom:"1px solid #1A1A1A",
        position:"sticky", top:0, background:BK, zIndex:10 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <Mark size={mobile?24:28}/>
          <span style={{ fontFamily:F.sans, fontWeight:600,
            fontSize: mobile?17:19, letterSpacing:"-0.025em" }}>keel</span>
        </div>
        <button onClick={onClose}
          style={{ background:"none", border:"1px solid #222", color:"#555",
            padding:"7px 14px", fontFamily:F.mono, fontSize:11,
            letterSpacing:"0.12em", cursor:"pointer" }}>
          BACK TO SITE
        </button>
      </div>

      <div style={{ maxWidth:560, margin:"0 auto",
        padding: mobile?"40px 20px 60px":"60px 24px 80px" }}>

        {/* Number hero */}
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <div style={{ fontFamily:F.mono, fontSize: mobile?11:12,
            color:O, letterSpacing:"0.3em", marginBottom:16 }}>
            APPLICATION RECEIVED · FOUNDERS CLUB
          </div>
          {hasNumber ? (
            <div style={{ fontFamily:F.cond, fontWeight:900,
              fontSize: mobile?80:112, color:"#FFF",
              letterSpacing:"-0.02em", lineHeight:0.88 }}>
              #{number}
            </div>
          ) : (
            <div style={{ fontFamily:F.cond, fontWeight:900,
              fontSize: mobile?42:56, color:"#FFF",
              letterSpacing:"-0.02em", lineHeight:1.05 }}>
              You&apos;re in the queue.
            </div>
          )}
          <div style={{ fontFamily:F.sans, fontSize: mobile?15:17,
            color:"#8A8A8A", marginTop:14, lineHeight:1.65 }}>
            {hasNumber
              ? <>Your application is #{number}. Early access is granted{" "}</>
              : <>Your application is in. Early access is granted{" "}</>}
            <span style={{ color:"#AAA", fontWeight:600 }}>in waves</span> as
            applications are reviewed.
          </div>
        </div>

        {/* What happens now */}
        <div style={{ background:BK2, border:"1px solid #1E1E1E",
          padding: mobile?"18px":"22px 24px", marginBottom:24 }}>
          <div style={{ fontFamily:F.mono, fontSize:11, color:O,
            letterSpacing:"0.18em", marginBottom:16 }}>WHAT HAPPENS NOW</div>
          {[
            { t:"We review your application",
              v:"Every application is reviewed by the founding team. We're looking for reps with real deal complexity, not just job titles." },
            { t:"We'll be in touch",
              v:"If you're a fit for Founders Club, we'll reach out to learn more about your deal motion before activating your access." },
            { t:"Founders Club access",
              v:"You're in early. Free while we build with you — no credit card, no trial games." },
          ].map(({ t, v }) => (
            <div key={t} style={{ display:"flex", gap:14,
              marginBottom:14, alignItems:"flex-start" }}>
              <div style={{ width:5, height:5, background:O,
                marginTop:7, flexShrink:0 }}/>
              <div>
                <div style={{ fontFamily:F.mono, fontSize:12,
                  color:"#AAA", letterSpacing:"0.1em", marginBottom:3 }}>{t}</div>
                <div style={{ fontFamily:F.sans, fontSize: mobile?15:16,
                  color:"#8A8A8A", lineHeight:1.65 }}>{v}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Share */}
        <div style={{ background:BK2, border:"1px solid #1E1E1E",
          padding: mobile?"18px":"22px 24px", marginBottom:24 }}>
          <div style={{ fontFamily:F.mono, fontSize:11, color:"#999",
            letterSpacing:"0.18em", marginBottom:8 }}>
            KNOW A REP WHO NEEDS THIS?
          </div>
          <div style={{ fontFamily:F.sans, fontSize: mobile?15:16,
            color:"#8A8A8A", lineHeight:1.65, marginBottom:16 }}>
            Referring a colleague who gets selected strengthens your
            position in the cohort. Send them the link.
          </div>
          <div style={{ display:"flex", flexDirection: mobile?"column":"row", gap:8 }}>
            <CopyButton text={SHARE_URL} label="COPY LINK" mobile={mobile}/>
            <SocialBtn href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`} label="𝕏 SHARE" mobile={mobile}/>
            <SocialBtn href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SHARE_URL)}`} label="in SHARE" mobile={mobile}/>
          </div>
        </div>

        {/* Sara preview */}
        <div style={{ background:"#0D0D0D", border:`1px solid ${O}33`,
          padding: mobile?"16px":"20px 22px" }}>
          <div style={{ fontFamily:F.mono, fontSize:11, color:O,
            letterSpacing:"0.16em", marginBottom:12 }}>
            SARA WOULD ASK YOU THIS
          </div>
          {[
            `"Who else needs to buy this — and have you talked to them, or only your champion?"`,
            `"What did they push back on that you smoothed over in your own head?"`,
            `"If this slips another two weeks, what actually breaks?"`,
          ].map((q,i) => (
            <div key={i} style={{ fontFamily:F.sans, fontSize: mobile?15:16,
              color:"#999", fontStyle:"italic", lineHeight:1.7,
              borderLeft:`2px solid #252525`, paddingLeft:12,
              marginBottom: i<2?10:0 }}>
              {q}
            </div>
          ))}
          <div style={{ marginTop:14, fontFamily:F.mono, fontSize:10,
            color:"#555", letterSpacing:"0.12em" }}>
            SARA · 24/7 DEAL ASSISTANT · GETKEEL.IO
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── SMALL UTILS ────────────────────────────────────────────────────────── */
function CopyButton({ text, label, mobile }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => {
      navigator.clipboard.writeText(text).then(() => {
        setCopied(true); setTimeout(() => setCopied(false), 2200);
      });
    }} style={{ background: copied?"#1A3A1A":"#111",
      border:`1px solid ${copied?"#2A5A2A":"#2A2A2A"}`,
      color: copied?"#4ADE80":"#888",
      padding: mobile?"12px 14px":"12px 18px",
      fontFamily:F.mono, fontSize:12, letterSpacing:"0.12em",
      cursor:"pointer", transition:"all 0.2s",
      display:"flex", alignItems:"center", gap:8,
      width: mobile?"100%":undefined,
      justifyContent: mobile?"center":undefined }}>
      <span>{copied?"✓":"⎘"}</span>
      <span>{copied?"COPIED!":label}</span>
    </button>
  );
}

function SocialBtn({ href, label, mobile }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      style={{ background:"#111", border:"1px solid #2A2A2A", color:"#888",
        padding:"12px 18px", fontFamily:F.mono, fontSize:12,
        letterSpacing:"0.12em", cursor:"pointer", textDecoration:"none",
        display:"flex", alignItems:"center", gap:8,
        justifyContent: mobile?"center":undefined,
        transition:"all 0.15s", width: mobile?"100%":undefined }}
      onMouseEnter={e => { e.currentTarget.style.borderColor="#3A3A3A"; e.currentTarget.style.color="#CCC"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor="#2A2A2A"; e.currentTarget.style.color="#888"; }}>
      {label}
    </a>
  );
}

function Badge() {
  return (
    <div style={{ display:"inline-flex", alignItems:"center", gap:10,
      background:"#130A04", border:`1px solid ${O}33`, padding:"9px 16px" }}>
      <div style={{ width:7, height:7, borderRadius:"50%", background:O,
        animation:"blink 1.8s ease infinite" }}/>
      <span style={{ fontFamily:F.mono, fontSize:10, color:O,
        letterSpacing:"0.18em" }}>
        EARLY ACCESS · APPLICATIONS OPEN
      </span>
    </div>
  );
}

/* ─── MAIN ───────────────────────────────────────────────────────────────── */
export default function LandingPage() {
  const w = useW();
  const m = w < 768;

  const [liveCount,    setLiveCount]    = useState(COUNTER_SEED);
  const [successNum,   setSuccessNum]   = useState(null); // number | true | null
  const [wIdx,         setWIdx]         = useState(0);
  const [openFaq,      setOpenFaq]      = useState(0);

  const HW = ["Clarity","That","Closes."];
  useEffect(() => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
    if (wIdx < HW.length) {
      const t = setTimeout(() => setWIdx(i => i+1), 180);
      return () => clearTimeout(t);
    }
  }, [wIdx]);

  const handleSuccess = useCallback((num) => {
    if (typeof num === "number") setLiveCount(num);
    setSuccessNum(typeof num === "number" ? num : true);
  }, []);

  const [painRef,  painVis]  = useVis();
  const [momentsRef, momentsVis] = useVis();
  const [howRef,   howVis]   = useVis();
  const [perksRef, perksVis] = useVis();
  const [faqRef,   faqVis]   = useVis();
  const [ctaRef,   ctaVis]   = useVis(0.08);

  const FAQS = [
    { q:"Is Sara always on?",
      a:"Once you're in — yes. Text or call anytime. Access itself is application-reviewed, not self-serve overnight. We activate you, then Sara's number is yours." },
    { q:"Will my manager see what I tell Sara?",
      a:"No. Sara reports to you. Nothing goes up the org chart unless you share it. We built Keel because reps are done with tools that help management at their expense." },
    { q:"How is this different from Gong or Chorus?",
      a:"Gong owns the recorded call — for your manager. Sara owns what happens after you hang up — for you. Hallway. Dinner. Drive home. Different moment. Different master." },
    { q:"Does she record my customer calls?",
      a:"Never. No bot in the meeting. No phone on the table. You reach out after — by text or call — and dump what matters." },
    { q:"Do I need a clean CRM?",
      a:"No. She works from what you tell her, not what Salesforce forgot. Messy CRM is the normal environment — not a blocker." },
    { q:"Do I need IT or my manager to sign up?",
      a:"No. Early access is individual. You apply, we review, we onboard you directly. Bring your team later if you want — after you've felt what Sara does for your own book." },
  ];

  return (
    // <main> not <div>: Lighthouse flagged the landing page as having no main
    // landmark, which screen-reader users rely on to skip to content. The
    // legal pages already use <main>; this brings the landing page in line.
    <main style={{ background:BK, color:"#F5F5F5",
      fontFamily:F.sans, minHeight:"100vh",
      WebkitFontSmoothing:"antialiased" }}>

      {successNum != null && (
        <SuccessView
          number={typeof successNum === "number" ? successNum : null}
          mobile={m}
          onClose={() => setSuccessNum(null)}/>
      )}

      <style>{`
        * { box-sizing:border-box; margin:0; padding:0; }
        @keyframes fadeUp    { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideIn   { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:translateX(0)} }
        @keyframes orangeGlow{ 0%,100%{box-shadow:0 0 0 0 rgba(255,90,31,0)} 50%{box-shadow:0 0 0 12px rgba(255,90,31,0.1)} }
        @keyframes blink     { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes wave      { 0%,100%{transform:scaleY(0.4)} 50%{transform:scaleY(1)} }
        .hw  { opacity:0; animation:slideIn 0.22s ease forwards; }
        .si  { opacity:0; transform:translateY(22px); transition:opacity 0.6s ease,transform 0.6s ease; }
        .si.v{ opacity:1; transform:translateY(0); }
        .sc  { opacity:0; transform:translateY(18px); transition:opacity 0.55s ease,transform 0.55s ease; }
        .sc.v{ opacity:1; transform:translateY(0); }
        input:focus, select:focus { border-color:#FF5A1F !important; outline:none; }
        input, select { -webkit-appearance:none; border-radius:0; }
        select option { background:#1A1A1A; color:#F0F0F0; }
        .faq-row { border-bottom:1px solid #1A1A1A; }
        .faq-row:first-child { border-top:1px solid #1A1A1A; }
      `}</style>

      {/* ── NAV ── */}
      <nav style={{ display:"flex", alignItems:"center",
        justifyContent:"space-between",
        padding: m?"14px 20px":"16px 48px",
        borderBottom:"1px solid #1C1C1C",
        position:"sticky", top:0, zIndex:50,
        background:"rgba(11,11,11,0.97)",
        backdropFilter:"blur(12px)",
        animation:"fadeUp 0.4s ease 0.05s both" }}>
        <div style={{ display:"flex", alignItems:"center", gap: m?8:10 }}>
          <Mark size={m?28:32}/>
          <span style={{ fontFamily:F.sans, fontWeight:600, fontSize: m?19:21,
            letterSpacing:"-0.025em", color:"#FFF" }}>keel</span>
        </div>
        <div style={{ display:"flex", alignItems:"center", gap: m?10:20 }}>
          <button
            onClick={() => document.getElementById("cta-email")?.focus()}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,90,31,0.12)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
            style={{ background:"transparent", color:O,
              border:`1px solid ${O}`,
              padding: m?"10px 16px":"11px 22px", fontFamily:F.sans,
              fontWeight:700, fontSize:13, cursor:"pointer",
              transition:"all 0.15s", letterSpacing:"0.01em",
              whiteSpace:"nowrap" }}>
            Apply for Early Access
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ padding: m?"52px 20px 56px":"96px 48px 88px",
        maxWidth:"1160px", margin:"0 auto" }}>
        <div style={{ display: m?"flex":"grid",
          flexDirection: m?"column":undefined,
          gridTemplateColumns: m?undefined:"1fr 1fr",
          gap: m?48:64, alignItems: m?undefined:"center" }}>

          <div>
            <div style={{ marginBottom: m?20:28,
              animation:"fadeUp 0.4s ease 0.15s both" }}>
              <Badge/>
            </div>
            <p style={{ fontFamily:F.sans, fontWeight:500, fontSize: m?15:16,
              color:"#444", lineHeight:1.5, fontStyle:"italic",
              marginBottom: m?18:22, animation:"fadeUp 0.4s ease 0.3s both" }}>
              "The CRM says it's closing. Sara has questions."
            </p>
            <h1 style={{ fontFamily:F.cond, fontWeight:900,
              fontSize: m?64:88, lineHeight:0.90, letterSpacing:"-0.01em",
              textTransform:"uppercase", marginBottom: m?22:32 }}>
              {HW.map((wd,i) => (
                <span key={wd} className="hw"
                  style={{ animationDelay:`${0.46+i*0.14}s`,
                    display: i===2?"block":"inline",
                    marginRight: i<2?"0.18em":0,
                    color: i===2?O:"#FFF",
                    marginTop: i===2?"0.04em":0 }}>
                  {wd}
                </span>
              ))}
            </h1>
            <p style={{ fontFamily:F.sans, fontWeight:400,
              fontSize: m?16:18, lineHeight:1.75, color:"#777",
              marginBottom: m?16:20, maxWidth:460,
              animation:"fadeUp 0.4s ease 0.95s both" }}>
              Meet{" "}
              <span style={{ color:"#FFF", fontWeight:600 }}>Sara</span>
              {" "}— your{" "}
              <span style={{ color:"#FFF", fontWeight:600 }}>24/7 deal assistant</span>.
              {" "}Text her from a conference lunch. Call her on the drive home.
              She helps you think the deal through and remembers what you ask
              her to — without recording the customer, and without reporting
              to your manager.
            </p>
            <div style={{ marginBottom: m?28:36,
              padding:"13px 18px", borderLeft:`2px solid #242424`,
              animation:"fadeUp 0.4s ease 1.0s both" }}>
              <div style={{ fontFamily:F.mono, fontSize:9, color:MICRO,
                letterSpacing:"0.14em", marginBottom:6 }}>BUILT FOR</div>
              <div style={{ fontFamily:F.sans, fontSize: m?13:14,
                color:MICRO, lineHeight:1.7 }}>
                Mid-market B2B AEs with 8–20 live deals — and a pipeline that
                moves in hallways, dinners, and car rides, not just CRM fields.
              </div>
            </div>
            <div style={{ animation:"fadeUp 0.4s ease 1.12s both" }}>
              <WaitlistForm mobile={m} liveCount={liveCount}
                onSuccess={handleSuccess}/>
            </div>
          </div>

          <div style={{ animation:"fadeUp 0.5s ease 0.8s both" }}>
            <SaraPhonePreview mobile={m}/>
            <div style={{ marginTop:10, fontFamily:F.mono,
              fontSize: m?8:9, color:MICRO,
              letterSpacing:"0.13em", textAlign:"right" }}>
              ONE NUMBER · TEXT OR CALL · ALWAYS YOURS
            </div>
          </div>
        </div>
      </section>

      {/* ── PAIN ── */}
      <section ref={painRef} style={{ background:BK2,
        borderTop:"1px solid #1A1A1A", borderBottom:"1px solid #1A1A1A",
        padding: m?"52px 20px":"80px 48px" }}>
        <div style={{ maxWidth:"1160px", margin:"0 auto" }}>
          <div className={`si${painVis?" v":""}`}
            style={{ fontFamily:F.mono, fontSize: m?9:10, color:MICRO,
              letterSpacing:"0.22em", marginBottom:12 }}>
            THE REAL GAP
          </div>
          <h2 className={`si${painVis?" v":""}`}
            style={{ fontFamily:F.cond, fontWeight:900, fontSize: m?36:48,
              color:"#FFF", letterSpacing:"-0.01em", textTransform:"uppercase",
              marginBottom: m?36:48, transitionDelay:"0.08s", maxWidth:720 }}>
            Your best deal moments<br/>
            <span style={{ color:O }}>leave no recording.</span>
          </h2>
          <div style={{ display:"flex", flexDirection: m?"column":"row", gap: m?0:3 }}>
            {[
              { n:"01",  h:"Hallway truth",
                b:"The useful stuff happens off the call. Dinner. Parking lot. Two minutes after you hang up.", d:0 },
              { n:"02", h:"Detail dies fast",
                b:"By the time you're at a laptop, half of it is gone. The CRM gets leftovers.", d:0.1 },
              { n:"03", h:"No bot can go there",
                b:"Recording isn't an option. Those moments produce zero help — unless you have someone to tell.", d:0.2 },
            ].map(({ n, h, b, d }) => (
              <div key={n} className={`sc${painVis?" v":""}`}
                style={{ flex:1, padding: m?"24px 0":"32px 28px",
                  background: m?"transparent":BK2,
                  border: m?"none":"1px solid #1E1E1E",
                  borderTop: m?"none":`3px solid ${O}`,
                  borderBottom: m?"1px solid #1E1E1E":"none",
                  paddingBottom: m?24:undefined,
                  transitionDelay:`${d}s` }}>
                <div style={{ fontFamily:F.mono, fontSize:10, color:O,
                  letterSpacing:"0.2em", marginBottom:16 }}>{n}</div>
                <div style={{ fontFamily:F.sans, fontWeight:700,
                  fontSize:15, color:"#AAA", marginBottom:10 }}>{h}</div>
                <div style={{ fontFamily:F.sans, fontSize:14,
                  color:MICRO, lineHeight:1.75 }}>{b}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MOMENTS ── */}
      <section ref={momentsRef} style={{ padding: m?"52px 20px":"80px 48px" }}>
        <div style={{ maxWidth:"1160px", margin:"0 auto" }}>
          <div className={`si${momentsVis?" v":""}`}
            style={{ fontFamily:F.mono, fontSize: m?9:10, color:MICRO,
              letterSpacing:"0.22em", marginBottom:12 }}>
            WHERE DEALS ACTUALLY MOVE
          </div>
          <h2 className={`si${momentsVis?" v":""}`}
            style={{ fontFamily:F.cond, fontWeight:900, fontSize: m?38:52,
              color:"#FFF", letterSpacing:"-0.01em", textTransform:"uppercase",
              marginBottom: m?16:20, transitionDelay:"0.08s" }}>
            She&apos;s there when<br/>
            <span style={{ color:O }}>the CRM isn&apos;t.</span>
          </h2>
          <p className={`si${momentsVis?" v":""}`}
            style={{ fontFamily:F.sans, fontSize: m?15:17, color:"#666",
              lineHeight:1.75, maxWidth:540, marginBottom: m?36:52,
              transitionDelay:"0.14s" }}>
            Text or call Sara the second a deal moment shows up in life —
            not when you finally get back to a laptop.
          </p>
          <div style={{ display:"grid",
            gridTemplateColumns: m?"1fr":"repeat(3,1fr)", gap: m?0:3 }}>
            {[
              { n:"01", h:"Conference lunch",
                b:"New contact. Real signal. Text Sara the name, company, and what they said — before it dies in Notes.", d:0 },
              { n:"02", h:"Sideline spark",
                b:"Kids' game. Airport. Hallway. A conversation opens a thread. Text Sara while it's still sharp.", d:0.1 },
              { n:"03", h:"Drive home",
                b:"Long ride after the client meeting. Call Sara. Dump it. She asks what you skipped — hands-free.", d:0.2 },
            ].map(({ n, h, b, d }) => (
              <div key={n} className={`sc${momentsVis?" v":""}`}
                style={{ padding: m?"20px 0 20px 20px":"32px 28px",
                  background: m?"transparent":BK2,
                  border: m?"none":"1px solid #1E1E1E",
                  borderLeft: m?`2px solid ${O}`:undefined,
                  marginBottom: m?4:0, transitionDelay:`${d}s` }}>
                <div style={{ fontFamily:F.mono, fontSize:10, color:O,
                  letterSpacing:"0.2em", marginBottom:16 }}>{n}</div>
                <div style={{ fontFamily:F.cond, fontWeight:800,
                  fontSize: m?22:24, color:"#FFF", letterSpacing:"-0.01em",
                  textTransform:"uppercase", marginBottom:12 }}>{h}</div>
                <div style={{ fontFamily:F.sans, fontSize:14,
                  color:"#666", lineHeight:1.75 }}>{b}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW SARA WORKS ── */}
      <section ref={howRef} style={{ background:BK2,
        borderTop:"1px solid #1A1A1A", borderBottom:"1px solid #1A1A1A",
        padding: m?"52px 20px":"80px 48px" }}>
        <div style={{ maxWidth:"1160px", margin:"0 auto" }}>
          <div className={`si${howVis?" v":""}`}
            style={{ fontFamily:F.mono, fontSize: m?9:10, color:MICRO,
              letterSpacing:"0.22em", marginBottom:12 }}>HOW SARA WORKS</div>
          <h2 className={`si${howVis?" v":""}`}
            style={{ fontFamily:F.cond, fontWeight:900, fontSize: m?40:54,
              color:"#FFF", letterSpacing:"-0.01em", textTransform:"uppercase",
              marginBottom: m?16:20, transitionDelay:"0.08s" }}>
            She doesn&apos;t monitor you.<br/>
            <span style={{ color:O }}>She thinks with you.</span>
          </h2>
          <p className={`si${howVis?" v":""}`}
            style={{ fontFamily:F.sans, fontSize: m?15:17, color:"#666",
              lineHeight:1.75, maxWidth:540, marginBottom: m?36:52,
              transitionDelay:"0.14s" }}>
            No app install. No meeting bot. A number you already know how to use.
          </p>
          <div style={{ display:"grid",
            gridTemplateColumns: m?"1fr":"repeat(3,1fr)", gap: m?0:3 }}>
            {[
              { n:"01", h:"Reach her",
                b:"Text or call the moment it happens — lunch, sideline, drive home. You bring the context.", d:0 },
              { n:"02", h:"She works it",
                b:"Asks what you skipped. Saves what you tell her to keep. Surfaces the gap between assumed and actual.", d:0.1 },
              { n:"03", h:"Stays yours",
                b:"No manager feed. No customer recording. Just you and Sara — on your phone, on your terms.", d:0.2 },
            ].map(({ n, h, b, d }) => (
              <div key={n} className={`sc${howVis?" v":""}`}
                style={{ padding: m?"20px 0 20px 20px":"32px 28px",
                  background: m?"transparent":"#0D0D0D",
                  border: m?"none":"1px solid #1E1E1E",
                  borderLeft: m?`2px solid ${O}`:undefined,
                  marginBottom: m?4:0, transitionDelay:`${d}s` }}>
                <div style={{ fontFamily:F.mono, fontSize:10, color:O,
                  letterSpacing:"0.2em", marginBottom:16 }}>{n}</div>
                <div style={{ fontFamily:F.cond, fontWeight:800,
                  fontSize: m?22:24, color:"#FFF", letterSpacing:"-0.01em",
                  textTransform:"uppercase", marginBottom:12 }}>{h}</div>
                <div style={{ fontFamily:F.sans, fontSize:14,
                  color:"#666", lineHeight:1.75 }}>{b}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOUNDERS CLUB ── */}
      <section ref={perksRef} style={{ padding: m?"52px 20px":"80px 48px" }}>
        <div style={{ maxWidth:"1160px", margin:"0 auto" }}>
          <div className={`si${perksVis?" v":""}`}
            style={{ fontFamily:F.mono, fontSize: m?9:10, color:MICRO,
              letterSpacing:"0.22em", marginBottom:12 }}>FOUNDERS CLUB</div>
          <h2 className={`si${perksVis?" v":""}`}
            style={{ fontFamily:F.cond, fontWeight:900, fontSize: m?38:50,
              color:"#FFF", letterSpacing:"-0.01em", textTransform:"uppercase",
              marginBottom: m?12:16, transitionDelay:"0.07s" }}>
            You&apos;re not a beta tester.<br/>
            <span style={{ borderBottom:`3px solid ${O}`, paddingBottom:4 }}>
              You&apos;re a co-builder.
            </span>
          </h2>
          <p className={`si${perksVis?" v":""}`}
            style={{ fontFamily:F.sans, fontSize: m?15:16, color:"#666",
              lineHeight:1.75, maxWidth:540, marginBottom: m?40:56,
              transitionDelay:"0.14s" }}>
            A tight group of quota-carrying reps shaping Sara before anyone
            else gets her number. Access is limited. Founders Club goes first.
          </p>
          <div style={{ display:"grid",
            gridTemplateColumns: m?"1fr":"repeat(3,1fr)", gap: m?0:3 }}>
            {[
              { n:"01", h:"Shape Sara",
                b:"Direct line to the founding team. Your feedback decides what she learns to ask next.", d:0 },
              { n:"02", h:"Founders Club perks",
                b:"Free while we build with you. No credit card. No trial clock. Early access that actually means early.", d:0.1 },
              { n:"03", h:"Rep-first. Always.",
                b:"Sara reports to you, not your manager. Everything stays with you first.",
                bold:"Your manager never sees what you tell Sara. Ever.", d:0.2 },
            ].map(({ n, h, b, bold, d }) => (
              <div key={n} className={`sc${perksVis?" v":""}`}
                style={{ padding: m?"20px 0 20px 20px":"32px 28px",
                  background: m?"transparent":BK2,
                  border: m?"none":"1px solid #1E1E1E",
                  borderLeft: m?`2px solid #252525`:undefined,
                  marginBottom: m?4:0, transitionDelay:`${d}s` }}>
                <div style={{ fontFamily:F.mono, fontSize:10, color:MICRO,
                  letterSpacing:"0.2em", marginBottom:16 }}>{n}</div>
                <div style={{ fontFamily:F.cond, fontWeight:800,
                  fontSize: m?22:24, color:"#FFF", letterSpacing:"-0.01em",
                  textTransform:"uppercase", marginBottom:12 }}>{h}</div>
                <div style={{ fontFamily:F.sans, fontSize:14,
                  color:"#666", lineHeight:1.75 }}>
                  {b}
                  {bold && (
                    <>
                      {" "}
                      <span style={{ fontWeight:700, color:"#AAA" }}>{bold}</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section ref={faqRef} style={{ background:BK2,
        borderTop:"1px solid #1A1A1A", borderBottom:"1px solid #1A1A1A",
        padding: m?"52px 20px":"80px 48px" }}>
        <div style={{ maxWidth:"680px", margin:"0 auto" }}>
          <div className={`si${faqVis?" v":""}`}
            style={{ fontFamily:F.mono, fontSize: m?9:10, color:MICRO,
              letterSpacing:"0.22em", marginBottom:12 }}>FAQ</div>
          <h2 className={`si${faqVis?" v":""}`}
            style={{ fontFamily:F.cond, fontWeight:900, fontSize: m?36:46,
              color:"#FFF", letterSpacing:"-0.01em", textTransform:"uppercase",
              marginBottom: m?36:48, transitionDelay:"0.08s" }}>
            Straight answers.
          </h2>
          {FAQS.map((f,i) => (
            <div key={i} className="faq-row">
              <button onClick={() => setOpenFaq(openFaq===i?null:i)}
                style={{ width:"100%", background:"none", border:"none",
                  padding: m?"18px 0":"20px 0",
                  display:"flex", justifyContent:"space-between",
                  alignItems:"center", cursor:"pointer", gap:16 }}>
                <span style={{ fontFamily:F.sans, fontWeight:600,
                  fontSize: m?15:16, color: openFaq===i?"#FFF":"#AAA",
                  textAlign:"left", lineHeight:1.4, transition:"color 0.2s" }}>
                  {f.q}
                </span>
                <span style={{ fontFamily:F.mono, fontSize:20,
                  color: openFaq===i?O:MICRO, flexShrink:0,
                  display:"inline-block",
                  transform: openFaq===i?"rotate(45deg)":"none",
                  transition:"all 0.22s" }}>+</span>
              </button>
              <div style={{ overflow:"hidden",
                maxHeight: openFaq===i?"400px":"0",
                transition:"max-height 0.35s ease",
                paddingBottom: openFaq===i?20:0 }}>
                <div style={{ fontFamily:F.sans, fontSize: m?14:15, color:MICRO,
                  lineHeight:1.75, paddingRight: m?0:40 }}>{f.a}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section ref={ctaRef}
        style={{ padding: m?"72px 20px 80px":"108px 48px",
          textAlign: m?undefined:"center" }}>
        <div style={{ maxWidth: m?"100%":600, margin:"0 auto" }}>
          <div className={`si${ctaVis?" v":""}`}
            style={{ fontFamily:F.mono, fontSize: m?9:10, color:MICRO,
              letterSpacing:"0.22em", marginBottom:24 }}>
            THE MOMENT YOU&apos;D FORGET BY FRIDAY
          </div>
          <h2 className={`si${ctaVis?" v":""}`}
            style={{ fontFamily:F.cond, fontWeight:900, fontSize: m?56:72,
              color:"#FFF", textTransform:"uppercase", letterSpacing:"-0.01em",
              lineHeight:0.91, marginBottom:24, transitionDelay:"0.08s" }}>
            Don&apos;t carry it<br/>
            <span style={{ color:O }}>alone.</span>
          </h2>
          <p className={`si${ctaVis?" v":""}`}
            style={{ fontFamily:F.sans, fontSize: m?15:17, color:"#666",
              lineHeight:1.8, marginBottom: m?36:44,
              transitionDelay:"0.16s", textAlign: m?"left":"center" }}>
            Limited early access. Apply now. We review every application —
            then you get Sara&apos;s number.
          </p>
          <div className={`si${ctaVis?" v":""}`}
            style={{ transitionDelay:"0.24s", textAlign: m?"left":undefined }}>
            <WaitlistForm mobile={m} center={!m}
              liveCount={liveCount} onSuccess={handleSuccess}/>
          </div>
        </div>
      </section>

      <SiteFooter mobile={m}/>
    </main>
  );
}
