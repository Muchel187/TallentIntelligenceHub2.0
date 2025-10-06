import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface InvitationEmailProps {
  employeeName: string;
  companyName: string;
  inviterName: string;
  invitationUrl: string;
  expiresAt: string;
}

export default function InvitationEmail({
  employeeName = 'Max Mustermann',
  companyName = 'Beispiel GmbH',
  inviterName = 'Anna Schmidt',
  invitationUrl = 'https://nobaexperts.com/invite/abc123',
  expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('de-DE'),
}: InvitationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Einladung zum Big Five Persönlichkeitstest von {companyName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Sie wurden eingeladen!</Heading>

          <Text style={text}>
            Hallo {employeeName},
          </Text>

          <Text style={text}>
            {inviterName} von <strong>{companyName}</strong> hat Sie eingeladen, an einer
            wissenschaftlich fundierten Persönlichkeitsanalyse teilzunehmen.
          </Text>

          <Section style={infoBox}>
            <Text style={infoTitle}>
              Was erwartet Sie?
            </Text>
            <ul style={list}>
              <li style={listItem}>Big Five Persönlichkeitstest (ca. 15 Minuten)</li>
              <li style={listItem}>Detaillierter persönlicher Report</li>
              <li style={listItem}>AI-basierte Entwicklungsempfehlungen</li>
              <li style={listItem}>Vertrauliche Auswertung</li>
            </ul>
          </Section>

          <Text style={text}>
            Ihre Privatsphäre ist uns wichtig: Nur Sie haben Zugriff auf Ihre vollständigen Ergebnisse.
            Ihr Arbeitgeber erhält nur aggregierte Team-Insights ohne persönliche Details.
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={invitationUrl}>
              Test jetzt starten
            </Button>
          </Section>

          <Text style={warning}>
            Diese Einladung ist gültig bis: <strong>{expiresAt}</strong>
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            Falls Sie diese Einladung nicht erwartet haben, können Sie diese E-Mail ignorieren.
          </Text>

          <Text style={footer}>
            <Link href="https://nobaexperts.com" style={link}>
              NOBA EXPERTS
            </Link>
            {' · '}
            <Link href="https://nobaexperts.com/privacy" style={link}>
              Datenschutz
            </Link>
            {' · '}
            <Link href="https://nobaexperts.com/support" style={link}>
              Support
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const h1 = {
  color: '#7c3aed',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  textAlign: 'center' as const,
};

const text = {
  color: '#334155',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
  padding: '0 40px',
};

const infoBox = {
  backgroundColor: '#faf5ff',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 40px',
  borderLeft: '4px solid #7c3aed',
};

const infoTitle = {
  color: '#581c87',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '0 0 12px 0',
};

const list = {
  paddingLeft: '20px',
  margin: '12px 0',
};

const listItem = {
  color: '#334155',
  fontSize: '15px',
  lineHeight: '24px',
  marginBottom: '8px',
};

const buttonContainer = {
  padding: '27px 0',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#7c3aed',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '200px',
  padding: '12px 0',
  margin: '0 auto',
};

const warning = {
  color: '#92400e',
  fontSize: '14px',
  textAlign: 'center' as const,
  backgroundColor: '#fef3c7',
  padding: '12px',
  borderRadius: '6px',
  margin: '24px 40px',
};

const hr = {
  borderColor: '#e2e8f0',
  margin: '20px 0',
};

const footer = {
  color: '#64748b',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center' as const,
  margin: '8px 0',
};

const link = {
  color: '#2563eb',
  textDecoration: 'underline',
};
