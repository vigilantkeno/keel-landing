import { useState, useEffect, useRef, useCallback } from "react";

/* ─── CONFIG ─────────────────────────────────────────────────────────────── */
const FORMSPREE_URL = "https://formspree.io/f/xpqogzeb";
const BASE_DATE     = new Date("2026-07-03T00:00:00"); // UPDATE: set to today when you deploy
const BASE_COUNT    = 8;    // UPDATE: set to your real Formspree submission count
const DAILY_RATE    = 0;    // UPDATE: set to ~0.5-1.0 once you see consistent daily signups
const BETA_OPENS    = "August 2026";
const SHARE_URL     = "https://getkeel.io";

function getLiveCount() {
  const days = (Date.now() - BASE_DATE.getTime()) / 86400000;
  return Math.floor(BASE_COUNT + days * DAILY_RATE);
}

/* ─── BRAND ──────────────────────────────────────────────────────────────── */
const O   = "#FF5A1F";
const OL  = "#FF7A3D";
const BK  = "#0B0B0B";
const BK2 = "#0F0F0F";

const F = {
  sans: "'Plus Jakarta Sans',sans-serif",
  mono: "'DM Mono',monospace",
  cond: "'Barlow Condensed',sans-serif",
};

/* ─── LOGO ───────────────────────────────────────────────────────────────── */
const MP = [
  `M231.823730,630.155273 C229.436981,629.663818 228.952454,627.732056 228.075119,626.181152
   C203.553680,582.833374 179.057968,539.471069 154.537582,496.122681
   C138.711945,468.145325 122.853897,440.186310 107.011559,412.218353
   C106.359482,411.067169 105.533882,409.953430 106.170036,408.364899
   C107.570267,406.915070 109.577454,407.365204 111.257660,407.439606
   C126.588425,408.118408 141.900848,407.122009 157.221542,407.092712
   C158.721283,407.089844 160.222397,407.146484 161.720581,407.100739
   C168.360764,406.897888 172.464340,409.117310 176.122253,415.678436
   C199.474731,457.565582 222.693161,499.536896 247.005463,540.885010
   C252.744690,550.645813 258.067474,560.650940 263.634338,570.514038
   C264.861023,572.687317 265.298828,574.557739 263.863586,576.987427
   C254.037567,593.622314 244.373291,610.352661 234.616287,627.028564
   C233.961884,628.146973 232.975098,629.070923 231.823730,630.155273 Z`,
  `M302.681885,508.620178 C293.969940,523.546936 285.450745,538.162476 276.114349,554.179993
   C265.543518,535.485168 255.599564,517.899109 245.073486,499.283508
   C266.412018,499.283508 286.370880,499.283508 306.507935,499.283508
   C307.290192,503.267456 304.071716,505.391327 302.681885,508.620178 Z`,
];

let _gn = 0;
function Mark({ size = 36, variant = "grad" }) {
  const id = `mg${++_gn}`;
  const fill = variant === "dim"   ? "#2A2A2A"
             : variant === "white" ? "#FFF"
             : `url(#${id})`;
  return (
    <svg viewBox="98 400 218 238" width={size} height={size}
      style={{ display:"block", flexShrink:0 }}>
      <defs>
        <linearGradient id={id} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={OL}/>
          <stop offset="100%" stopColor="#CC3300"/>
        </linearGradient>
      </defs>
      {MP.map((d,i) => <path key={i} fill={fill} d={d}/>)}
    </svg>
  );
}

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

/* ─── SARA DEAL CARD ─────────────────────────────────────────────────────── */
function SaraDealCard({ mobile, revealed, onReveal }) {
  const [alertVisible, setAlertVisible] = useState(false);
  useEffect(() => {
    if (revealed) {
      const t = setTimeout(() => setAlertVisible(true), 900);
      return () => clearTimeout(t);
    } else {
      setAlertVisible(false);
    }
  }, [revealed]);

  return (
    <div onClick={!revealed ? onReveal : undefined}
      style={{ background:"#0D0D0D", border:`1px solid #222`,
        overflow:"hidden", boxShadow:"0 32px 72px rgba(0,0,0,0.65)",
        cursor: revealed?"default":"pointer", userSelect:"none" }}>

      <div style={{ background:"#141414", borderBottom:"1px solid #222",
        padding:`${mobile?9:10}px 16px`,
        display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:7 }}>
          <Mark size={12} variant="dim"/>
          <span style={{ fontFamily:F.mono, fontSize:9,
            color:"#3A3A3A", letterSpacing:"0.16em" }}>
            SARA SESSION · DEAL DEBRIEF
          </span>
        </div>
        <div style={{ display:"flex", gap:4 }}>
          {["#3A1F10","#3A3210","#0F2A1A"].map((c,i) =>
            <div key={i} style={{ width:8, height:8, borderRadius:"50%", background:c }}/>)}
        </div>
      </div>

      <div style={{ padding:`${mobile?14:18}px 16px 12px`,
        borderBottom:"1px solid #1A1A1A",
        display:"flex", justifyContent:"space-between" }}>
        <div>
          <div style={{ fontFamily:F.sans, fontWeight:700,
            fontSize: mobile?15:16, color:"#F2F2F2", marginBottom:5 }}>
            Workday Enterprise
          </div>
          <div style={{ fontFamily:F.mono, fontSize: mobile?8:9,
            color:"#444", letterSpacing:"0.1em" }}>
            NEGOTIATION · $148K ARR · DAY 91
          </div>
        </div>
        <div style={{ fontFamily:F.mono, fontSize:9, color:"#333",
          letterSpacing:"0.1em", lineHeight:1.5, textAlign:"right" }}>
          Q2 CLOSE<br/>TARGET
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr",
        position:"relative" }}>
        <div style={{ padding:`${mobile?16:20}px 14px`,
          borderRight:"1px solid #1A1A1A",
          opacity: revealed?0.22:1, transition:"opacity 0.9s ease" }}>
          <div style={{ fontFamily:F.mono, fontSize:9, color:"#555",
            letterSpacing:"0.14em", marginBottom:14 }}>YOUR PICTURE</div>
          {["On track.", "Champion engaged.", "Closing Q2."].map(t => (
            <div key={t} style={{ fontFamily:F.sans, fontSize: mobile?13:14,
              color:"#888", lineHeight:1.7, marginBottom:2 }}>{t}</div>
          ))}
        </div>
        <div style={{ padding:`${mobile?16:20}px 14px`,
          background: revealed?"#180C05":"transparent",
          opacity: revealed?1:0,
          transform: revealed?"translateY(0)":"translateY(10px)",
          transition:"all 0.75s ease" }}>
          <div style={{ fontFamily:F.mono, fontSize:9, color:O,
            letterSpacing:"0.14em", marginBottom:14 }}>SARA'S DEBRIEF</div>
          {[["CHAMPION","Silent 12 days"],["BUDGET","Reopened"],["COMPETITOR","Active"]].map(([k,v]) => (
            <div key={k} style={{ marginBottom:10 }}>
              <div style={{ fontFamily:F.mono, fontSize:8, color:"#3D3D3D",
                letterSpacing:"0.1em", marginBottom:2 }}>{k}</div>
              <div style={{ fontFamily:F.sans, fontWeight:600,
                fontSize: mobile?12:13, color:OL }}>{v}</div>
            </div>
          ))}
        </div>
        {!revealed && (
          <div style={{ position:"absolute", inset:0, display:"flex",
            alignItems:"center", justifyContent:"center",
            pointerEvents:"none", animation:"fadeUp 0.4s ease 1.5s both" }}>
            <div style={{ background:"rgba(11,11,11,0.92)",
              border:`1px solid ${O}55`, padding:"10px 18px",
              display:"flex", alignItems:"center", gap:8 }}>
              <span style={{ fontSize:14 }}>👆</span>
              <span style={{ fontFamily:F.mono, fontSize:9,
                color:O, letterSpacing:"0.14em" }}>TAP TO SEE WHAT SARA SEES</span>
            </div>
          </div>
        )}
      </div>

      <div style={{ padding:`${mobile?12:14}px 16px`,
        background: alertVisible?"#160703":"#0D0D0D",
        borderTop:"1px solid #1A1A1A",
        opacity: alertVisible?1:0,
        transform: alertVisible?"translateY(0)":"translateY(8px)",
        transition:"all 0.65s ease" }}>
        <div style={{ fontFamily:F.mono, fontSize:9, color:O,
          letterSpacing:"0.16em", marginBottom:6 }}>⚠ SARA ALERT · ACT NOW</div>
        <div style={{ fontFamily:F.sans, fontSize: mobile?13:13,
          color:"#777", lineHeight:1.65 }}>
          No champion contact in 12 days. Budget back under review.
          Sara flagged this 9 days ago. You're just seeing it now.
        </div>
      </div>
      <div style={{ padding:"9px 16px", background:"#0A0A0A" }}>
        <span style={{ fontFamily:F.mono, fontSize:8,
          color:"#252525", letterSpacing:"0.12em" }}>
          SARA SURFACES THE GAP BETWEEN ASSUMED AND ACTUAL
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
        color:"#555", letterSpacing:"0.14em", marginBottom:7 }}>
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
function WaitlistForm({ mobile, center, liveCount, onSuccess }) {
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
      await fetch(FORMSPREE_URL, {
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
          count: liveCount + 1,
        }),
      });
    } catch {}
    onSuccess && onSuccess(liveCount + 1);
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
            onMouseEnter={e => { if(step1Valid) e.currentTarget.style.background=OL; }}
            onMouseLeave={e => { e.currentTarget.style.background=step1Valid?O:"#3A2010"; }}
            style={{ background: step1Valid?O:"#3A2010",
              color: step1Valid?"#000":"#665544",
              border:"none", padding: mobile?"16px":"16px 28px",
              fontFamily:F.sans, fontWeight:700, fontSize:15,
              cursor: step1Valid?"pointer":"default",
              transition:"all 0.15s", whiteSpace:"nowrap",
              width: mobile?"100%":undefined,
              animation: step1Valid?"orangeGlow 3s ease 2.5s infinite":"none" }}>
            Join Waitlist
          </button>
        </div>
        {/* Counter row */}
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
              color:"#666", letterSpacing:"0.12em" }}>
              <LiveCounter target={liveCount}/> reps on the waitlist
            </span>
          </div>
          <span style={{ fontFamily:F.mono, fontSize:9,
            color:"#303030", letterSpacing:"0.12em" }}>
            NO SPAM · NO CREDIT CARD
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
              style={{ background:"none", border:"none", color:"#555",
                fontFamily:F.mono, fontSize:9, letterSpacing:"0.1em",
                cursor:"pointer", textDecoration:"underline",
                textDecorationColor:"#333" }}>
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
        onMouseLeave={e => { e.currentTarget.style.background=step2Valid?O:"#3A2010"; }}
        style={{ width:"100%", background: step2Valid?O:"#3A2010",
          color: step2Valid?"#000":"#665544",
          border:"none", padding:"16px",
          fontFamily:F.sans, fontWeight:700, fontSize:15,
          cursor: step2Valid&&!sending?"pointer":"default",
          transition:"all 0.15s",
          opacity: sending?0.6:1 }}>
        {sending ? "Saving your spot…" : "Claim My Founding Access"}
      </button>

      <div style={{ marginTop:12, fontFamily:F.mono, fontSize:9,
        color:"#2A2A2A", letterSpacing:"0.12em", textAlign:"center" }}>
        WE REVIEW EVERY APPLICATION · HELPS US PRIORITIZE YOUR ACCESS
      </div>
    </div>
  );
}

/* ─── SUCCESS VIEW ───────────────────────────────────────────────────────── */
function SuccessView({ number, mobile, onClose }) {
  const shareText = `Just applied for founding cohort access to @getkeel — AI deal intelligence built for reps, not managers. ${SHARE_URL}`;
  const calTitle  = encodeURIComponent("Keel Beta Launch — Founding Access");
  const calDate   = "20260818";
  const calURL    = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${calTitle}&dates=${calDate}/${calDate}&details=${encodeURIComponent(`You applied for founding cohort access. ${SHARE_URL}`)}`;

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
            padding:"7px 14px", fontFamily:F.mono, fontSize:9,
            letterSpacing:"0.12em", cursor:"pointer" }}>
          BACK TO SITE
        </button>
      </div>

      <div style={{ maxWidth:560, margin:"0 auto",
        padding: mobile?"40px 20px 60px":"60px 24px 80px" }}>

        {/* Number hero */}
        <div style={{ textAlign:"center", marginBottom:40 }}>
          <div style={{ fontFamily:F.mono, fontSize: mobile?9:10,
            color:O, letterSpacing:"0.3em", marginBottom:16 }}>
            APPLICATION RECEIVED · FOUNDING COHORT
          </div>
          <div style={{ fontFamily:F.cond, fontWeight:900,
            fontSize: mobile?80:112, color:"#FFF",
            letterSpacing:"-0.02em", lineHeight:0.88 }}>
            #{number}
          </div>
          <div style={{ fontFamily:F.sans, fontSize: mobile?15:17,
            color:"#555", marginTop:14, lineHeight:1.65 }}>
            Your application is #{number}. Beta opens{" "}
            <span style={{ color:"#AAA", fontWeight:600 }}>{BETA_OPENS}</span>.
          </div>
        </div>

        {/* What happens now */}
        <div style={{ background:BK2, border:"1px solid #1E1E1E",
          padding: mobile?"18px":"22px 24px", marginBottom:24 }}>
          <div style={{ fontFamily:F.mono, fontSize:9, color:O,
            letterSpacing:"0.18em", marginBottom:16 }}>WHAT HAPPENS NOW</div>
          {[
            { t:"We review your application",
              v:"Every application is reviewed by the founding team. We're looking for reps with real deal complexity, not just job titles." },
            { t:"We'll be in touch",
              v:"If you're a fit for the founding cohort, we'll reach out to learn more about your deal motion before activating your access." },
            { t:"Founding access is permanent",
              v:"Founding access is free for life. No trials, no expiry, no bait and switch — ever." },
          ].map(({ t, v }) => (
            <div key={t} style={{ display:"flex", gap:14,
              marginBottom:14, alignItems:"flex-start" }}>
              <div style={{ width:5, height:5, background:O,
                marginTop:7, flexShrink:0 }}/>
              <div>
                <div style={{ fontFamily:F.mono, fontSize:9,
                  color:"#555", letterSpacing:"0.1em", marginBottom:3 }}>{t}</div>
                <div style={{ fontFamily:F.sans, fontSize: mobile?13:14,
                  color:"#666", lineHeight:1.65 }}>{v}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Calendar */}
        <a href={calURL} target="_blank" rel="noopener noreferrer"
          style={{ display:"flex", alignItems:"center",
            justifyContent:"space-between",
            background:"#111", border:"1px solid #242424",
            padding: mobile?"14px 16px":"16px 20px",
            marginBottom:24, textDecoration:"none", transition:"border-color 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.borderColor="#3A3A3A"}
          onMouseLeave={e => e.currentTarget.style.borderColor="#242424"}>
          <div>
            <div style={{ fontFamily:F.sans, fontWeight:600,
              fontSize: mobile?14:15, color:"#CCC", marginBottom:3 }}>
              📅 Save the beta launch date
            </div>
            <div style={{ fontFamily:F.mono, fontSize:8,
              color:"#383838", letterSpacing:"0.1em" }}>
              ADD TO GOOGLE CALENDAR · {BETA_OPENS.toUpperCase()}
            </div>
          </div>
          <span style={{ fontFamily:F.mono, fontSize:16, color:"#333" }}>→</span>
        </a>

        {/* Share */}
        <div style={{ background:BK2, border:"1px solid #1E1E1E",
          padding: mobile?"18px":"22px 24px", marginBottom:24 }}>
          <div style={{ fontFamily:F.mono, fontSize:9, color:"#555",
            letterSpacing:"0.18em", marginBottom:8 }}>
            KNOW A REP WHO NEEDS THIS?
          </div>
          <div style={{ fontFamily:F.sans, fontSize: mobile?13:14,
            color:"#555", lineHeight:1.65, marginBottom:16 }}>
            Referring a colleague who gets selected strengthens your
            position in the cohort. Send them the link.
          </div>
          <div style={{ display:"flex", flexDirection: mobile?"column":"row", gap:8 }}>
            <CopyButton text={SHARE_URL} label="COPY LINK" mobile={mobile}/>
            <SocialBtn href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`} label="𝕏 SHARE"/>
            <SocialBtn href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(SHARE_URL)}`} label="in SHARE" mobile={mobile}/>
          </div>
        </div>

        {/* Sara preview */}
        <div style={{ background:"#0D0D0D", border:`1px solid ${O}33`,
          padding: mobile?"16px":"20px 22px" }}>
          <div style={{ fontFamily:F.mono, fontSize:9, color:O,
            letterSpacing:"0.16em", marginBottom:12 }}>
            SARA WOULD HAVE ASKED YOUR LAST DEAL THIS
          </div>
          {[
            `"When did you last speak with your economic buyer — not your champion?"`,
            `"Has the budget actually been approved, or are you assuming it has?"`,
            `"What would make them choose to do nothing at all?"`,
          ].map((q,i) => (
            <div key={i} style={{ fontFamily:F.sans, fontSize: mobile?13:14,
              color:"#555", fontStyle:"italic", lineHeight:1.7,
              borderLeft:`2px solid #252525`, paddingLeft:12,
              marginBottom: i<2?10:0 }}>
              {q}
            </div>
          ))}
          <div style={{ marginTop:14, fontFamily:F.mono, fontSize:8,
            color:"#2A2A2A", letterSpacing:"0.12em" }}>
            SARA · SOCRATIC ANALYSIS & REMOTE ASSISTANT · GETKEEL.IO
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
      fontFamily:F.mono, fontSize:10, letterSpacing:"0.12em",
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
        padding:"12px 18px", fontFamily:F.mono, fontSize:10,
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

function TrustPills({ center }) {
  return (
    <div style={{ display:"flex", gap:8, flexWrap:"wrap",
      justifyContent: center?"center":undefined }}>
      {[{l:"ROAD TO SOC2",i:"🔐"},{l:"PRIVACY FIRST",i:"🛡"},{l:"NO DATA SOLD",i:"🚫"}].map(({ l, i }) => (
        <div key={l} style={{ display:"inline-flex", alignItems:"center", gap:6,
          background:"#111", border:"1px solid #222", padding:"6px 12px" }}>
          <span style={{ fontSize:11 }}>{i}</span>
          <span style={{ fontFamily:F.mono, fontSize:8, color:"#444",
            letterSpacing:"0.14em" }}>{l}</span>
        </div>
      ))}
    </div>
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
        WAITLIST OPEN · BETA OPENS {BETA_OPENS.toUpperCase()}
      </span>
    </div>
  );
}

/* ─── MAIN ───────────────────────────────────────────────────────────────── */
export default function App() {
  const w = useW();
  const m = w < 768;

  const [liveCount,    setLiveCount]    = useState(getLiveCount);
  const [cardRevealed, setCardRevealed] = useState(false);
  const [successNum,   setSuccessNum]   = useState(null);
  const [wIdx,         setWIdx]         = useState(0);
  const [openFaq,      setOpenFaq]      = useState(null);

  const HW = ["Clarity","That","Closes."];
  useEffect(() => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
    if (wIdx < HW.length) {
      const t = setTimeout(() => setWIdx(i => i+1), 180);
      return () => clearTimeout(t);
    }
  }, [wIdx]);

  const handleSuccess = useCallback((num) => {
    setLiveCount(num);
    setSuccessNum(num);
  }, []);

  const [painRef,  painVis]  = useVis();
  const [howRef,   howVis]   = useVis();
  const [saraRef,  saraVis]  = useVis();
  const [perksRef, perksVis] = useVis();
  const [faqRef,   faqVis]   = useVis();
  const [ctaRef,   ctaVis]   = useVis(0.08);

  const FAQS = [
    { q:"Will my manager see what Sara flags?",
      a:"No. Sara reports to you, not your org chart. Everything she surfaces goes to you first — and only you, unless you choose to share it. We built Keel specifically because reps are exhausted by tools that help management at the rep's expense. That's not Sara." },
    { q:"How long does the debrief actually take?",
      a:"Two minutes. Sara asks three to four targeted questions right after your call — while the context is still fresh. No forms, no dashboards, no retrospective admin. You answer, she synthesizes, you move on. If it ever takes longer than two minutes, we've failed." },
    { q:"My CRM is a mess. Does Keel still work?",
      a:"Yes — and a messy CRM is exactly the environment Sara was designed for. She doesn't rely on your CRM being clean or current. She builds the picture from what you actually say in calls and debriefs, not from what's (or isn't) logged in Salesforce." },
    { q:"How is this different from Gong or Chorus?",
      a:"Gong and Chorus record and analyze calls for managers. Sara works for you. She doesn't score your performance or build reports for your VP — she asks the questions that surface what you're missing before it becomes a loss. Different tool, different master, different outcome." },
    { q:"Do I need IT or my manager involved to sign up?",
      a:"Not for the beta. Founding access is free, individual, and requires no organizational procurement. You sign up, we onboard you directly. If you want to bring your team in later, that's a conversation for after you've seen what Sara does for your own pipeline." },
  ];

  return (
    <div style={{ background:BK, color:"#F5F5F5",
      fontFamily:F.sans, minHeight:"100vh",
      WebkitFontSmoothing:"antialiased" }}>

      {successNum && (
        <SuccessView number={successNum} mobile={m}
          onClose={() => setSuccessNum(null)}/>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
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
          {!m && (
            <span style={{ fontFamily:F.mono, fontSize:9,
              color:"#333", letterSpacing:"0.18em" }}>getkeel.io</span>
          )}
          <button
            onClick={() => document.getElementById("cta-email")?.focus()}
            onMouseEnter={e => e.currentTarget.style.background=OL}
            onMouseLeave={e => e.currentTarget.style.background=O}
            style={{ background:O, color:"#000", border:"none",
              padding: m?"10px 16px":"11px 22px", fontFamily:F.sans,
              fontWeight:700, fontSize:13, cursor:"pointer",
              transition:"all 0.15s", letterSpacing:"0.01em",
              whiteSpace:"nowrap" }}>
            Join Waitlist
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
              marginBottom: m?16:20, maxWidth:440,
              animation:"fadeUp 0.4s ease 0.95s both" }}>
              Meet{" "}
              <span style={{ color:"#FFF", fontWeight:600 }}>Sara</span>
              {" "}— your AI deal companion who surfaces the gap between
              what you <span style={{ color:"#FFF", fontWeight:600 }}>think</span>
              {" "}is true and what{" "}
              <span style={{ color:"#FFF", fontWeight:600 }}>actually</span>
              {" "}is, before it costs you the deal.
            </p>
            <div style={{ marginBottom: m?28:36,
              padding:"13px 18px", borderLeft:`2px solid #242424`,
              animation:"fadeUp 0.4s ease 1.0s both" }}>
              <div style={{ fontFamily:F.mono, fontSize:9, color:"#444",
                letterSpacing:"0.14em", marginBottom:6 }}>BUILT FOR</div>
              <div style={{ fontFamily:F.sans, fontSize: m?13:14,
                color:"#555", lineHeight:1.7 }}>
                Mid-market B2B AEs carrying 8–20 active deals.
                If you've ever confidently sandbagged a deal that was already dead,{" "}
                <span style={{ color:"#AAA", fontWeight:600 }}>Sara is for you.</span>
              </div>
            </div>
            <div style={{ animation:"fadeUp 0.4s ease 1.12s both" }}>
              <WaitlistForm mobile={m} liveCount={liveCount}
                onSuccess={handleSuccess}/>
            </div>
          </div>

          <div style={{ animation:"fadeUp 0.5s ease 0.8s both" }}>
            <SaraDealCard mobile={m} revealed={cardRevealed}
              onReveal={() => setCardRevealed(true)}/>
            <div style={{ marginTop:10, fontFamily:F.mono,
              fontSize: m?8:9, color:"#272727",
              letterSpacing:"0.13em", textAlign:"right" }}>
              {cardRevealed
                ? "SARA SURFACED THIS BEFORE THE REP NOTICED"
                : "TAP THE CARD TO SEE WHAT SARA SEES"}
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
            style={{ fontFamily:F.mono, fontSize: m?9:10, color:"#555",
              letterSpacing:"0.22em", marginBottom: m?40:52 }}>
            THE PROBLEM WE'RE SOLVING
          </div>
          <div style={{ display:"flex", flexDirection: m?"column":"row", gap: m?0:3 }}>
            {[
              { n:"12",  h:"Active deals per rep",
                b:"You have real context on maybe 4. The rest run on memory, optimism, and assumption.", d:0 },
              { n:"3–4", h:"Deals lost per quarter to silent drift",
                b:"Not to better competitors. Lost because nobody asked the right question at the right moment.", d:0.1 },
              { n:"11",  h:"Days before the rep notices",
                b:"By day 11 the deal has already shifted. Sara would have flagged it on day 2.", d:0.2 },
            ].map(({ n, h, b, d }) => (
              <div key={n} className={`sc${painVis?" v":""}`}
                style={{ flex:1, padding: m?"24px 0":"32px 28px",
                  background: m?"transparent":BK2,
                  border: m?"none":"1px solid #1E1E1E",
                  borderTop: m?"none":`3px solid ${O}`,
                  borderBottom: m?"1px solid #1E1E1E":"none",
                  paddingBottom: m?24:undefined,
                  transitionDelay:`${d}s` }}>
                <div style={{ fontFamily:F.cond, fontWeight:900,
                  fontSize: m?56:68, color:"#FFF", letterSpacing:"-0.02em",
                  lineHeight:1, marginBottom:10 }}>{n}</div>
                <div style={{ fontFamily:F.sans, fontWeight:700,
                  fontSize:15, color:"#AAA", marginBottom:10 }}>{h}</div>
                <div style={{ fontFamily:F.sans, fontSize:14,
                  color:"#555", lineHeight:1.75 }}>{b}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW SARA WORKS ── */}
      <section ref={howRef} style={{ padding: m?"52px 20px":"80px 48px" }}>
        <div style={{ maxWidth:"1160px", margin:"0 auto" }}>
          <div className={`si${howVis?" v":""}`}
            style={{ fontFamily:F.mono, fontSize: m?9:10, color:"#555",
              letterSpacing:"0.22em", marginBottom:12 }}>HOW SARA WORKS</div>
          <h2 className={`si${howVis?" v":""}`}
            style={{ fontFamily:F.cond, fontWeight:900, fontSize: m?40:54,
              color:"#FFF", letterSpacing:"-0.01em", textTransform:"uppercase",
              marginBottom: m?16:20, transitionDelay:"0.08s" }}>
            She doesn't monitor you.<br/>
            <span style={{ color:O }}>She thinks with you.</span>
          </h2>
          <p className={`si${howVis?" v":""}`}
            style={{ fontFamily:F.sans, fontSize: m?15:17, color:"#666",
              lineHeight:1.75, maxWidth:540, marginBottom: m?36:52,
              transitionDelay:"0.14s" }}>
            Sara runs a 2-minute Socratic debrief after every call —
            asking the questions your brain skipped, surfacing what
            you already know but haven't said out loud.
          </p>
          <div style={{ display:"grid",
            gridTemplateColumns: m?"1fr":"repeat(3,1fr)", gap: m?0:3 }}>
            {[
              { n:"01", h:"Sara listens",
                b:"Connects to calls, emails, and CRM. No new tabs. No manual entry. She reads what you don't have time to track.", d:0 },
              { n:"02", h:"Sara asks",
                b:"2-minute Socratic debrief after every call. She exposes the gap between assumed and actual — in your own words.", d:0.1 },
              { n:"03", h:"Sara tells you first",
                b:"Not your manager. Not after forecast. You, first. She flags drift before it becomes a loss you can't recover.", d:0.2 },
            ].map(({ n, h, b, d }) => (
              <div key={n} className={`sc${howVis?" v":""}`}
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

      {/* ── TALK TO SARA ── */}
      <section ref={saraRef} style={{ background:BK2,
        borderTop:"1px solid #1A1A1A", borderBottom:"1px solid #1A1A1A",
        padding: m?"52px 20px":"80px 48px" }}>
        <div style={{ maxWidth:"1160px", margin:"0 auto" }}>
          <div className={`si${saraVis?" v":""}`}
            style={{ fontFamily:F.mono, fontSize: m?9:10, color:"#555",
              letterSpacing:"0.22em", marginBottom:12 }}>COMING SOON</div>
          <div style={{ display: m?"flex":"grid",
            flexDirection: m?"column":undefined,
            gridTemplateColumns: m?undefined:"1fr 1fr",
            gap: m?32:64, alignItems:"center" }}>
            <div>
              <h2 className={`si${saraVis?" v":""}`}
                style={{ fontFamily:F.cond, fontWeight:900, fontSize: m?38:52,
                  color:"#FFF", letterSpacing:"-0.01em", textTransform:"uppercase",
                  marginBottom: m?16:20, transitionDelay:"0.07s" }}>
                Talk to Sara<br/><span style={{ color:O }}>directly.</span>
              </h2>
              <p className={`si${saraVis?" v":""}`}
                style={{ fontFamily:F.sans, fontSize: m?15:16, color:"#666",
                  lineHeight:1.75, marginBottom: m?24:32, transitionDelay:"0.14s" }}>
                Starting {BETA_OPENS}, founding cohort reps can call Sara
                directly after any call for a live voice debrief. Ask her
                anything. She already knows the context.
              </p>
              <div className={`si${saraVis?" v":""}`}
                style={{ display:"inline-flex", alignItems:"center", gap:10,
                  background:"#130A04", border:`1px solid ${O}33`,
                  padding:"10px 16px", transitionDelay:"0.22s" }}>
                <div style={{ width:7, height:7, borderRadius:"50%", background:"#555" }}/>
                <span style={{ fontFamily:F.mono, fontSize:9, color:"#555",
                  letterSpacing:"0.16em" }}>
                  VOICE DEBRIEFS · {BETA_OPENS.toUpperCase()} · FOUNDING ONLY
                </span>
              </div>
            </div>
            <div className={`si${saraVis?" v":""}`} style={{ transitionDelay:"0.2s" }}>
              <div style={{ background:"#0D0D0D", border:"1px solid #1E1E1E",
                padding: m?"20px 18px":"28px 24px" }}>
                <div style={{ fontFamily:F.mono, fontSize:9, color:"#333",
                  letterSpacing:"0.16em", marginBottom:20 }}>
                  SARA · VOICE DEBRIEF · PREVIEW
                </div>
                <div style={{ display:"flex", gap:3, alignItems:"center",
                  height:40, marginBottom:20 }}>
                  {Array.from({ length: m?24:32 }, (_,i) => {
                    const h = [0.4,0.7,1,0.6,0.9,0.5,0.8,0.3,0.9,0.6,
                               1,0.4,0.7,0.5,0.9,0.3,0.8,0.6,1,0.5,
                               0.7,0.4,0.9,0.6,0.8,0.3,1,0.5,0.7,0.4,0.9,0.6][i%32];
                    return (
                      <div key={i} style={{ flex:1, background:"#252525",
                        height:`${h*100}%`, minWidth:2,
                        animation:`wave ${1.2+(i%4)*0.3}s ease-in-out ${i*0.05}s infinite` }}/>
                    );
                  })}
                </div>
                <div style={{ fontFamily:F.sans, fontSize: m?14:14, color:"#555",
                  fontStyle:"italic", lineHeight:1.7, marginBottom:16 }}>
                  "You mentioned the CFO was supportive — when was the last
                  time you heard that directly from her, not through your champion?"
                </div>
                <div style={{ fontFamily:F.mono, fontSize:9, color:"#2A2A2A",
                  letterSpacing:"0.12em" }}>SARA · 00:47 OF 2:00</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOUNDING COHORT ── */}
      <section ref={perksRef} style={{ padding: m?"52px 20px":"80px 48px" }}>
        <div style={{ maxWidth:"1160px", margin:"0 auto" }}>
          <div className={`si${perksVis?" v":""}`}
            style={{ fontFamily:F.mono, fontSize: m?9:10, color:"#555",
              letterSpacing:"0.22em", marginBottom:12 }}>FOUNDING COHORT</div>
          <h2 className={`si${perksVis?" v":""}`}
            style={{ fontFamily:F.cond, fontWeight:900, fontSize: m?38:50,
              color:"#FFF", letterSpacing:"-0.01em", textTransform:"uppercase",
              marginBottom: m?12:16, transitionDelay:"0.07s" }}>
            You're not a beta tester.<br/>
            <span style={{ color:O }}>You're a co-builder.</span>
          </h2>
          <p className={`si${perksVis?" v":""}`}
            style={{ fontFamily:F.sans, fontSize: m?15:16, color:"#666",
              lineHeight:1.75, maxWidth:540, marginBottom: m?40:56,
              transitionDelay:"0.14s" }}>
            A focused group of quota-carrying reps shaping Sara before
            anyone else sees her. Beta opens {BETA_OPENS}.
            Founding cohort gets access first.
          </p>
          <div style={{ display:"grid",
            gridTemplateColumns: m?"1fr":"repeat(3,1fr)", gap: m?0:3 }}>
            {[
              { n:"01", h:"Shape Sara",
                b:"Direct line to the founding team. Your feedback determines what Sara learns to ask next.", d:0 },
              { n:"02", h:"Free for life",
                b:"Founding reps lock in permanent free access. No credit card, no trial, no bait and switch.", d:0.1 },
              { n:"03", h:"Rep-first. Always.",
                b:"Sara reports to you, not your manager. Everything she surfaces goes to you first. Full stop.", d:0.2 },
            ].map(({ n, h, b, d }) => (
              <div key={n} className={`sc${perksVis?" v":""}`}
                style={{ padding: m?"20px 0 20px 20px":"32px 28px",
                  background: m?"transparent":BK2,
                  border: m?"none":"1px solid #1E1E1E",
                  borderLeft: m?`2px solid #252525`:undefined,
                  marginBottom: m?4:0, transitionDelay:`${d}s` }}>
                <div style={{ fontFamily:F.mono, fontSize:10, color:"#444",
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

      {/* ── FAQ ── */}
      <section ref={faqRef} style={{ background:BK2,
        borderTop:"1px solid #1A1A1A", borderBottom:"1px solid #1A1A1A",
        padding: m?"52px 20px":"80px 48px" }}>
        <div style={{ maxWidth:"680px", margin:"0 auto" }}>
          <div className={`si${faqVis?" v":""}`}
            style={{ fontFamily:F.mono, fontSize: m?9:10, color:"#555",
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
                  color: openFaq===i?O:"#333", flexShrink:0,
                  display:"inline-block",
                  transform: openFaq===i?"rotate(45deg)":"none",
                  transition:"all 0.22s" }}>+</span>
              </button>
              <div style={{ overflow:"hidden",
                maxHeight: openFaq===i?"400px":"0",
                transition:"max-height 0.35s ease",
                paddingBottom: openFaq===i?20:0 }}>
                <div style={{ fontFamily:F.sans, fontSize: m?14:15, color:"#555",
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
            style={{ fontFamily:F.mono, fontSize: m?9:10, color:"#444",
              letterSpacing:"0.22em", marginBottom:24 }}>
            THE DEAL YOU THINK YOU'RE WINNING
          </div>
          <h2 className={`si${ctaVis?" v":""}`}
            style={{ fontFamily:F.cond, fontWeight:900, fontSize: m?56:72,
              color:"#FFF", textTransform:"uppercase", letterSpacing:"-0.01em",
              lineHeight:0.91, marginBottom:24, transitionDelay:"0.08s" }}>
            Know before<br/>
            <span style={{ color:O }}>it's too late.</span>
          </h2>
          <p className={`si${ctaVis?" v":""}`}
            style={{ fontFamily:F.sans, fontSize: m?15:17, color:"#666",
              lineHeight:1.8, marginBottom: m?36:44,
              transitionDelay:"0.16s", textAlign: m?"left":"center" }}>
            Beta opens {BETA_OPENS}. Founding access is free, permanent,
            and limited. Applications are reviewed individually.
          </p>
          <div className={`si${ctaVis?" v":""}`}
            style={{ transitionDelay:"0.24s", textAlign: m?"left":undefined }}>
            <WaitlistForm mobile={m} center={!m}
              liveCount={liveCount} onSuccess={handleSuccess}/>
          </div>
          <div className={`si${ctaVis?" v":""}`}
            style={{ display:"flex", justifyContent: m?undefined:"center",
              marginTop:24, transitionDelay:"0.32s" }}>
            <TrustPills center={!m}/>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <div style={{ borderTop:"1px solid #1A1A1A",
        padding: m?"20px":"22px 48px" }}>
        <div style={{ display:"flex", justifyContent:"space-between",
          alignItems:"center", flexWrap:"wrap", gap:12,
          marginBottom:12, padding: m?"0 20px":undefined }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <Mark size={m?22:24}/>
            <span style={{ fontFamily:F.sans, fontWeight:600,
              fontSize: m?16:18, letterSpacing:"-0.025em", color:"#FFF" }}>keel</span>
          </div>
          <div style={{ fontFamily:F.mono, fontSize:9, color:"#2A2A2A",
            letterSpacing:"0.14em" }}>© 2026 KEEL · GETKEEL.IO</div>
        </div>
        <div style={{ padding: m?"0 20px":undefined }}>
          <TrustPills/>
        </div>
      </div>
    </div>
  );
}
