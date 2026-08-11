"use client";

import LongformShell, { Section, P, Quote } from "../LongformShell";
import { F, O } from "../brand";

const MICRO_LINK = "#666";

function Belief({ title, children }) {
  return (
    <section style={{ marginBottom: 36 }}>
      <h2 style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 18,
        color: "#FFF", marginBottom: 12 }}>{title}</h2>
      <div style={{ fontFamily: F.sans, fontSize: 16, color: "#9A9A9A", lineHeight: 1.75 }}>
        {children}
      </div>
    </section>
  );
}

export default function ManifestoPage() {
  return (
    <LongformShell
      eyebrow="MANIFESTO"
      title="Intelligence without surveillance."
      lead="Give every seller a private, persistent AI partner that remembers what matters, acts with permission, and helps them move relationships forward—without turning their work into surveillance."
      meta="WHY KEEL EXISTS · SARA WORKS FOR YOU"
    >
      <Section title="Sales tech became inspection infrastructure">
        <P>
          Sales technology was supposed to help people sell.
        </P>
        <P>
          Instead, much of it became infrastructure for observing them.
        </P>
        <P>
          Log the call. Update the field. Record the activity. Enter the next step.
          Measure the rep.
        </P>
        <P>
          The seller does the work, and the system asks them to document the work
          so somebody else can inspect it.
        </P>
        <P>
          <span style={{ color: "#E8E8E8" }}>Keel starts from the opposite premise.</span>
          {" "}The system should work for the person doing the job.
        </P>
        <P>
          Sara is not another place to report what happened. She is a private,
          persistent business partner who helps you remember what happened,
          understand what changed, and decide what should happen next.
        </P>
        <P>
          Your working memory should not become your manager&apos;s surveillance feed.
        </P>
      </Section>

      <Belief title="We believe memory is earned.">
        <P>
          Sara should not remember everything simply because she can.
        </P>
        <P>
          Useful memory is intentional, attributable, and correctable.
          You should know what Sara knows. You should be able to change it.
          You should be able to remove it. And Sara should be able to explain
          why she believes it.
        </P>
        <Quote>
          Language can be generative. State must be trustworthy.
        </Quote>
      </Belief>

      <Belief title="We believe the individual should benefit first.">
        <P>
          Most enterprise systems capture information so the organization can
          observe the employee.
        </P>
        <P>
          Keel captures trusted context so the individual can become more capable.
        </P>
        <P>
          The purpose of memory is not what management can learn about the rep.
          It is what Sara can remember so the rep doesn&apos;t have to.
        </P>
      </Belief>

      <Belief title="We believe relationships are not rows in a CRM.">
        <P>
          They evolve. People change their minds. Meetings move. Objections emerge.
          Commitments are made. Champions leave. Deals stall. Trust grows.
        </P>
        <P>
          A useful assistant must understand those changes over time rather than
          accumulate an endless pile of notes — not only what is true, but what
          changed, what remains unresolved, what you promised, and what matters next.
        </P>
      </Belief>

      <Belief title="We believe there should be one Sara.">
        <P>
          Channels are interfaces. The relationship with Sara is the product.
        </P>
        <P>
          SMS should not have one memory and voice another. A conversation yesterday
          should matter tomorrow. A fact shared by voice should be available by text.
        </P>
      </Belief>

      <Belief title="We believe agency must grow with trust.">
        <P>
          Autonomy should not arrive as a switch labeled AI Agent. It should be
          earned through progressively delegated authority.
        </P>
        <Quote>
          First Sara remembers. Then she prepares. Then she notices. Then she
          recommends. And only with authority does she act.
        </Quote>
      </Belief>

      <Belief title="We believe the CRM can stay the system of record.">
        <P>
          People should not spend their day translating human relationships into
          database fields.
        </P>
        <P>
          Talk naturally. Let Sara maintain the minimum structured state necessary
          to help you. Then, where appropriate and permitted, let Keel interface
          with the systems the company requires.
        </P>
        <P>
          <span style={{ color: "#E8E8E8" }}>
            Sara becomes the system that understands what the record means to you.
          </span>
        </P>
      </Belief>

      <section style={{
        marginTop: 48,
        marginBottom: 40,
        padding: "28px 0",
        borderTop: "1px solid #1E1E1E",
        borderBottom: "1px solid #1E1E1E",
      }}>
        <div style={{ fontFamily: F.mono, fontSize: 10, color: O,
          letterSpacing: "0.22em", marginBottom: 14 }}>NORTH STAR</div>
        <p style={{ fontFamily: F.sans, fontSize: 18, color: "#F0F0F0",
          lineHeight: 1.65, margin: 0 }}>
          Sara should become a private, persistent business partner that remembers
          what you ask her to remember, understands how those things change over
          time, and increasingly handles the work around your relationships—without
          becoming another system that watches you.
        </p>
      </section>

      <section style={{ marginBottom: 48 }}>
        <div style={{ fontFamily: F.mono, fontSize: 10, color: O,
          letterSpacing: "0.22em", marginBottom: 14 }}>THE SARA COVENANT · PILOT EDITION</div>
        <h2 style={{ fontFamily: F.sans, fontWeight: 700, fontSize: 22,
          color: "#FFF", marginBottom: 16 }}>Sara works for you.</h2>
        <div style={{ fontFamily: F.sans, fontSize: 16, color: "#9A9A9A", lineHeight: 1.75 }}>
          <P>
            She will not intentionally turn your conversations into a management
            surveillance feed.
          </P>
          <P>
            She will distinguish what you told her from what she inferred.
          </P>
          <P>
            She will not silently take consequential actions beyond the authority
            you have given her.
          </P>
          <P>
            During the pilot, some interactions may be reviewed by Keel to improve
            Sara and keep the system safe.
          </P>
          <P>
            As Sara&apos;s memory capabilities expand, you will gain clearer ways to
            see, correct, and control what she remembers.
          </P>
        </div>
      </section>

      <p style={{ fontFamily: F.mono, fontSize: 9, color: "#444",
        letterSpacing: "0.12em", lineHeight: 1.7 }}>
        CANONICAL DOCTRINE LIVES WITH THE PRODUCT. THIS PAGE IS THE PUBLIC EXPRESSION.
        {" · "}
        <a href="/founders" style={{ color: MICRO_LINK }}>APPLY FOR EARLY ACCESS</a>
      </p>
    </LongformShell>
  );
}
