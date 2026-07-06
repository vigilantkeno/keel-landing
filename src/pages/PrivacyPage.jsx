import LegalShell, { Section, P } from "../LegalShell";

export default function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy">
      <Section title="1. Overview">
        <P>
          This Privacy Policy describes how Plantly, LLC ("Plantly," "we," "us," or "our")
          collects, uses, and protects information when you visit getkeel.io, apply for Keel
          access, or use Keel (collectively, the "Service"). Keel is operated by Plantly, LLC.
        </P>
      </Section>

      <Section title="2. Information We Collect">
        <P>
          We may collect information you provide directly, such as your name, email address,
          company, role, CRM details, and other information submitted through waitlist or
          onboarding forms.
        </P>
        <P>
          If you opt in to SMS messaging, we collect your phone number and related consent
          records. We may also collect usage information, device and browser data, and
          technical logs needed to operate and secure the Service.
        </P>
      </Section>

      <Section title="3. How We Use Information">
        <P>
          We use information to provide, maintain, and improve Keel; review waitlist and
          founding-cohort applications; communicate with you about access and product updates;
          deliver operational SMS messages you have opted in to receive; protect the Service;
          and comply with legal obligations.
        </P>
      </Section>

      <Section title="4. SMS Consent and Phone Numbers">
        <P>
          SMS consent and phone numbers: If you opt in to receive SMS messages from Keel, we use your phone number to send operational text messages related to your use of Keel, such as debrief prompts, follow-up questions, coaching notifications, draft-ready notifications, and feedback requests.
        </P>
        <P>
          We do not sell, rent, or share SMS opt-in consent, phone numbers, or text messaging originator opt-in data with third parties or affiliates for their marketing or promotional purposes. We may share information with service providers only as needed to deliver and support Keel's messaging services.
        </P>
        <P>
          Message frequency may vary. Message and data rates may apply. Reply STOP to opt out.
          Reply HELP for help. Consent to receive SMS messages is not a condition of purchase.
        </P>
      </Section>

      <Section title="5. How We Share Information">
        <P>
          We do not sell your personal information. We may share information with service
          providers that help us host, secure, deliver messages, process forms, or support
          the Service, subject to appropriate contractual protections.
        </P>
        <P>
          We may also disclose information if required by law, to protect rights and safety,
          or in connection with a business transaction such as a merger or acquisition.
        </P>
      </Section>

      <Section title="6. Data Retention">
        <P>
          We retain information for as long as needed to provide the Service, comply with
          legal obligations, resolve disputes, and enforce agreements. Retention periods may
          vary based on the type of information and how it is used.
        </P>
      </Section>

      <Section title="7. Security">
        <P>
          We use reasonable administrative, technical, and organizational measures designed
          to protect information. No method of transmission or storage is completely secure.
        </P>
      </Section>

      <Section title="8. Your Choices">
        <P>
          You may opt out of operational SMS messages at any time by replying STOP. You may
          request access, correction, or deletion of certain information by contacting us,
          subject to applicable law and operational requirements.
        </P>
      </Section>

      <Section title="9. Children's Privacy">
        <P>
          The Service is not directed to children under 18, and we do not knowingly collect
          personal information from children.
        </P>
      </Section>

      <Section title="10. Changes">
        <P>
          We may update this Privacy Policy from time to time. The "Last Updated" date above
          reflects the most recent revision. Material changes will be posted on this page.
        </P>
      </Section>

      <Section title="11. Contact">
        <P>
          Privacy questions may be sent to{" "}
          <a href="mailto:hello@getkeel.io" style={{ color: "#FF5A1F" }}>hello@getkeel.io</a>.
        </P>
        <P>
          Keel is operated by Plantly, LLC.
        </P>
      </Section>
    </LegalShell>
  );
}
