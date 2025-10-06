import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface TestCompleteEmailProps {
  userName: string;
  testId: string;
  reportUrl: string;
}

export default function TestCompleteEmail({
  userName = 'Max Mustermann',
  testId = 'test_123',
  reportUrl = 'https://nobaexperts.com/report/test_123',
}: TestCompleteEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Ihr Big Five Persönlichkeitstest ist abgeschlossen</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Test abgeschlossen!</Heading>

          <Text style={text}>
            Hallo {userName},
          </Text>

          <Text style={text}>
            herzlichen Glückwunsch! Sie haben den Big Five Persönlichkeitstest erfolgreich abgeschlossen.
          </Text>

          <Text style={text}>
            Ihr Test wurde ausgewertet und Ihr persönlicher Report steht jetzt bereit.
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={reportUrl}>
              Report jetzt ansehen
            </Button>
          </Section>

          <Text style={text}>
            <strong>Test-ID:</strong> {testId}
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht direkt auf diese E-Mail.
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
  color: '#1e293b',
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

const buttonContainer = {
  padding: '27px 0',
  textAlign: 'center' as const,
};

const button = {
  backgroundColor: '#2563eb',
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
