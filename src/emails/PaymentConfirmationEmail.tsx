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

interface PaymentConfirmationEmailProps {
  userName: string;
  testId: string;
  amount: string;
  reportUrl: string;
  invoiceUrl?: string;
  date: string;
}

export default function PaymentConfirmationEmail({
  userName = 'Max Mustermann',
  testId = 'test_123',
  amount = '49,00 €',
  reportUrl = 'https://nobaexperts.com/report/test_123',
  invoiceUrl,
  date = new Date().toLocaleDateString('de-DE'),
}: PaymentConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Zahlungsbestätigung für Ihren Big Five Report</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Zahlung erfolgreich!</Heading>

          <Text style={text}>
            Hallo {userName},
          </Text>

          <Text style={text}>
            vielen Dank für Ihren Kauf! Ihre Zahlung wurde erfolgreich verarbeitet.
          </Text>

          <Section style={infoBox}>
            <Text style={infoText}>
              <strong>Betrag:</strong> {amount}
            </Text>
            <Text style={infoText}>
              <strong>Datum:</strong> {date}
            </Text>
            <Text style={infoText}>
              <strong>Test-ID:</strong> {testId}
            </Text>
          </Section>

          <Text style={text}>
            Sie haben jetzt vollen Zugriff auf:
          </Text>

          <ul style={list}>
            <li style={listItem}>Vollständigen Big Five Report mit detaillierten Interpretationen</li>
            <li style={listItem}>PDF-Download Ihres Reports</li>
            <li style={listItem}>7 Tage AI-Coach Chat (bis zu 50 Nachrichten)</li>
            <li style={listItem}>Persönliche Entwicklungsempfehlungen</li>
          </ul>

          <Section style={buttonContainer}>
            <Button style={button} href={reportUrl}>
              Zu Ihrem Report
            </Button>
          </Section>

          {invoiceUrl && (
            <Text style={text}>
              <Link href={invoiceUrl} style={link}>
                Rechnung herunterladen
              </Link>
            </Text>
          )}

          <Hr style={hr} />

          <Text style={footer}>
            Bei Fragen zu Ihrer Zahlung kontaktieren Sie bitte unseren Support unter{' '}
            <Link href="mailto:support@nobaexperts.com" style={link}>
              support@nobaexperts.com
            </Link>
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
            <Link href="https://nobaexperts.com/terms" style={link}>
              AGB
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
  color: '#10b981',
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
  backgroundColor: '#f8fafc',
  borderRadius: '8px',
  padding: '20px',
  margin: '24px 40px',
};

const infoText = {
  color: '#334155',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '8px 0',
};

const list = {
  paddingLeft: '60px',
  margin: '16px 0',
};

const listItem = {
  color: '#334155',
  fontSize: '16px',
  lineHeight: '26px',
  marginBottom: '8px',
};

const buttonContainer = {
  padding: '27px 0',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#10b981',
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
