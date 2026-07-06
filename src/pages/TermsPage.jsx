import LegalShell, { Section, P } from "../LegalShell";

export default function TermsPage() {
  return (
    <LegalShell title="Terms of Service">
      <Section title="1. Agreement">
        <P>
          These Terms of Service ("Terms") govern your access to and use of Keel,
          the website at getkeel.io, and related services (collectively, the "Service").
          Keel is operated by Plantly, LLC ("Plantly," "we," "us," or "our").
        </P>
        <P>
          By accessing or using the Service, you agree to these Terms. If you do not agree,
          do not use the Service.
        </P>
      </Section>

      <Section title="2. The Service">
        <P>
          Keel provides AI-assisted deal intelligence tools for B2B sales professionals,
          including post-call debriefs, coaching notifications, and related operational
          features. The Service is intended for business use by individual reps and teams.
        </P>
        <P>
          Features, availability, and access may change as Keel evolves through beta and
          general availability. We may modify, suspend, or discontinue any part of the Service
          at any time.
        </P>
      </Section>

      <Section title="3. Accounts and Eligibility">
        <P>
          You must provide accurate information when registering, applying for access, or
          using the Service. You are responsible for maintaining the confidentiality of your
          account credentials and for all activity under your account.
        </P>
        <P>
          You must be at least 18 years old and authorized to use the Service in connection
          with your professional role.
        </P>
      </Section>

      <Section title="4. Acceptable Use">
        <P>
          You agree not to misuse the Service, including by attempting unauthorized access,
          interfering with system integrity, scraping or reverse engineering the Service
          except as permitted by law, or using Keel in violation of applicable law or
          third-party rights.
        </P>
      </Section>

      <Section title="5. SMS Messaging Terms">
        <P>
          SMS Messaging Terms: By opting in to receive SMS messages from Keel, you agree to receive operational text messages related to your use of Keel, including sales-call debrief prompts, follow-up questions, coaching notifications, draft-ready notifications, and feedback requests.
        </P>
        <P>
          Message frequency may vary. Message and data rates may apply. Reply STOP to opt out. Reply HELP for help. Consent to receive SMS messages is not a condition of purchase.
        </P>
        <P>
          Keel sends operational SMS messages to opted-in users. We do not use SMS for
          unrelated marketing blasts, newsletters, or promotional campaigns. SMS opt-in consent
          and phone numbers are not sold, rented, or shared for third-party or affiliate
          marketing or promotional purposes.
        </P>
      </Section>

      <Section title="6. Intellectual Property">
        <P>
          The Service, including software, branding, content, and design, is owned by
          Plantly or its licensors and is protected by applicable intellectual property laws.
          These Terms do not grant you any ownership rights in the Service.
        </P>
      </Section>

      <Section title="7. Disclaimers">
        <P>
          The Service is provided on an "as is" and "as available" basis. To the fullest
          extent permitted by law, Plantly disclaims all warranties, whether express or
          implied, including implied warranties of merchantability, fitness for a particular
          purpose, and non-infringement.
        </P>
        <P>
          Keel provides AI-assisted insights and prompts. It does not guarantee deal
          outcomes, forecast accuracy, or business results.
        </P>
      </Section>

      <Section title="8. Limitation of Liability">
        <P>
          To the fullest extent permitted by law, Plantly will not be liable for any indirect,
          incidental, special, consequential, or punitive damages, or for any loss of profits,
          revenue, data, or business opportunities arising from or related to your use of the
          Service.
        </P>
      </Section>

      <Section title="9. Termination">
        <P>
          We may suspend or terminate access to the Service if you violate these Terms or if
          we discontinue the Service. You may stop using the Service at any time.
        </P>
      </Section>

      <Section title="10. Changes">
        <P>
          We may update these Terms from time to time. The "Last Updated" date above reflects
          the most recent revision. Continued use of the Service after changes become effective
          constitutes acceptance of the updated Terms.
        </P>
      </Section>

      <Section title="11. Contact">
        <P>
          Questions about these Terms may be sent to{" "}
          <a href="mailto:hello@getkeel.io" style={{ color: "#FF5A1F" }}>hello@getkeel.io</a>.
        </P>
        <P>
          Keel is operated by Plantly, LLC.
        </P>
      </Section>
    </LegalShell>
  );
}
