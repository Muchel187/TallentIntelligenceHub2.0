# Anforderungsanalyse: NOBA Experts Plattform
## Vollständige Spezifikation für Neuentwicklung

**Version:** 2.0
**Datum:** 2025-10-06
**Status:** Bereit für externe Entwicklung
**Autor:** Systemarchitekt-Analyse

---

## 1. Vision & Projektziele

### 1.1 Projektname
**NOBA EXPERTS** - Scientific Personality Assessment Platform

### 1.2 Kurzbeschreibung
NOBA Experts ist eine wissenschaftlich fundierte Big Five Persönlichkeitstest-Plattform mit KI-gestützter Auswertung und umfassendem HR-Analytics-System. Die Plattform richtet sich an individuelle Nutzer (B2C) für Karriereentwicklung und an Unternehmen (B2B) für datenbasierte Personalentwicklung.

### 1.3 Kernziele der Neuentwicklung

1. **Moderne, wartbare Architektur**
   - Klare Trennung Frontend/Backend
   - Microservice-ready Design
   - Comprehensive Test-Coverage (>80%)
   - API-First Ansatz

2. **Skalierbarkeit**
   - Support für 100.000+ Tests/Monat
   - Multi-Tenant-Architektur für B2B
   - Horizontale Skalierung
   - CDN-Integration für Static-Assets

3. **Verbesserte Performance**
   - <2s Ladezeiten
   - Lazy-Loading für alle Komponenten
   - Optimierte Datenbankabfragen
   - Redis-Caching für Reports

4. **Enterprise-Ready Features**
   - White-Label-Capability
   - SSO-Integration (SAML, OAuth)
   - Erweiterte Role-Based-Access-Control
   - Audit-Logging

5. **Mobile-First UI/UX**
   - Native Mobile-App (React Native)
   - Offline-Mode für Tests
   - Push-Notifications
   - Accessibility (WCAG 2.1 AA)

6. **Compliance & Sicherheit**
   - DSGVO-konform by Design
   - ISO 27001-Vorbereitung
   - SOC 2 Type II-Readiness
   - Penetration-Test-Ready

---

## 2. Funktionale Anforderungen (User Stories)

### 2.1 B2C - Individuelle Nutzer

#### Benutzerauthentifizierung

**US-001:** Als ein Besucher möchte ich mich via Email/Passwort registrieren, damit ich meine Test-Ergebnisse dauerhaft speichern kann.
- Validierung: Email-Format, Passwort-Stärke (min. 8 Zeichen, 1 Ziffer, 1 Großbuchstabe)
- Email-Verification per Link
- Auto-Login nach erfolgreicher Registration

**US-002:** Als ein Besucher möchte ich mich via Google OAuth anmelden, damit ich keinen separaten Account erstellen muss.
- Google OAuth 2.0 Integration
- Auto-Account-Creation bei Erstanmeldung
- Profile-Sync (Name, Email, Avatar)

**US-003:** Als ein registrierter Nutzer möchte ich mein Passwort zurücksetzen können, damit ich wieder Zugang zu meinem Account bekomme.
- Forgot-Password-Flow
- Time-Limited Reset-Token (1 Stunde)
- Email mit Reset-Link

#### Test-Durchführung

**US-004:** Als ein authentifizierter Nutzer möchte ich meine persönlichen Details (Alter, Job, Branche, Karriereziel) eingeben, damit meine Auswertung personalisiert wird.
- Formular mit Validierung
- Optional: Autocomplete für Job-Titel und Branchen
- Speicherung für spätere Analysen

**US-005:** Als ein Nutzer möchte ich den Big Five Persönlichkeitstest mit 119 Fragen absolvieren, damit ich mein Persönlichkeitsprofil erhalte.
- 5-Punkt Likert-Skala (Stimme gar nicht zu → Stimme voll zu)
- Dimensionen: Openness (O), Conscientiousness (C), Extraversion (E), Agreeableness (A), Neuroticism (N)
- Progress-Bar mit Prozentanzeige
- Navigation: Vor/Zurück zwischen Fragen
- Mobile-optimierte Darstellung

**US-006:** Als ein authentifizierter Nutzer möchte ich meinen Test-Fortschritt automatisch speichern lassen, damit ich bei Unterbrechung weitermachen kann.
- Auto-Save nach jeder beantworteten Frage
- Resume-Button auf Landing Page
- Anzeige des gespeicherten Fortschritts (z.B. "75 von 119 Fragen beantwortet")

**US-007:** Als ein Nutzer möchte ich nach Test-Abschluss sofort eine Email mit einem Link zu meinen Ergebnissen erhalten, damit ich diese später abrufen kann.
- Email mit Test-ID und direktem Report-Link
- Absender: auswertung@noba-experts.de
- Personalisierte Anrede

#### Report & Auswertung

**US-008:** Als ein Nutzer möchte ich einen interaktiven Report mit visualisierten Big Five Scores sehen, damit ich mein Persönlichkeitsprofil verstehe.
- Radar-Chart oder Bar-Chart für alle 5 Dimensionen
- Score-Range: 24-120 pro Dimension
- Farbcodierung: Niedrig (<60), Durchschnitt (60-90), Hoch (>90)
- Textuelle Interpretation pro Dimension (3-4 Sätze)
- Karriere-Relevanz-Abschnitt
- Mobile-responsive

**US-009:** Als ein Nutzer möchte ich meinen Report als PDF herunterladen, damit ich ihn offline nutzen oder teilen kann.
- PDF-Generation-Button
- Payment-Gate: Kostenlos für bezahlte Tests, €49 für unbezahlte
- Hochwertiges Layout (Logo, Branding, professionell)
- Caching: Einmal generiert, nicht neu erstellen

**US-010:** Als ein zahlender Nutzer möchte ich einen KI-gestützten Chat-Coach nutzen, damit ich individuelle Karrierefragen klären kann.
- Chat-Modal über Report-Seite
- Authentifizierung erforderlich
- Context-Aware: Kennt Big Five Scores und User-Details
- Chat-History persistent gespeichert
- 7-Tage-Zugang nach Payment
- Max. 50 Nachrichten pro Test

#### Payment

**US-011:** Als ein Nutzer möchte ich via Stripe bezahlen (Kreditkarte, Klarna), damit ich Zugang zu Premium-Features bekomme.
- Stripe Checkout Session
- Preis: €49,00
- Payment-Methods: Card, Klarna, SEPA (optional)
- Success-URL: /payment-success?testId=...
- Cancel-URL: /report/[testId]

**US-012:** Als ein Nutzer möchte ich nach erfolgreicher Zahlung automatisch freigeschaltet werden, damit ich sofort auf PDF und Chat zugreifen kann.
- Stripe Webhook-Integration
- Auto-Update: results.paid = TRUE
- Email-Confirmation mit erweiterten Zugangs-Details

**US-013:** Als ein Nutzer möchte ich einen Voucher-Code einlösen können, damit ich kostenlosen Zugang erhalte.
- Voucher-Input-Feld bei Test-Submission
- Validierung: Gültigkeit, Max-Uses, Expiry
- Auto-Payment-Unlock bei gültigem Code

#### Account-Management

**US-014:** Als ein registrierter Nutzer möchte ich alle meine vergangenen Test-Ergebnisse in einem Dashboard sehen, damit ich meine Entwicklung nachvollziehen kann.
- Liste aller Tests mit Datum und Scores
- Direkt-Links zu Reports
- Download-Buttons für PDFs
- Vergleichs-Funktion (optional)

**US-015:** Als ein Nutzer möchte ich meine Kontodaten (Name, Email, Passwort) ändern können, damit ich mein Profil aktuell halte.
- Edit-Profile-Seite
- Email-Change mit Verification
- Password-Change mit aktuellem Passwort-Check
- Avatar-Upload (optional)

**US-016:** Als ein Nutzer möchte ich meinen Account und alle Daten löschen können, damit ich mein Recht auf Vergessen ausüben kann (DSGVO).
- Account-Deletion-Button in Settings
- Confirmation-Dialog mit Passwort-Eingabe
- Vollständige Daten-Löschung aus DB
- Email-Confirmation

---

### 2.2 B2B - Unternehmenskunden

#### Company-Setup

**US-017:** Als ein Unternehmensadministrator möchte ich ein Company-Profil erstellen, damit ich meine Organisation verwalten kann.
- Firmendaten: Name, Domain, Branche, Größe
- Subscription-Plan-Wahl (Basic, Professional, Enterprise)
- Auto-Account-Erstellung als Owner-Role

**US-018:** Als ein Company-Owner möchte ich weitere Admins hinzufügen, damit mehrere Personen das System verwalten können.
- Admin-Rollen: Owner, Admin, HR Manager, Team Lead
- Email-basierte Invitation
- Rollenspezifische Berechtigungen

**US-019:** Als ein Company-Admin möchte ich Abteilungen anlegen, damit ich meine Organisationsstruktur abbilden kann.
- Department-Name, Beschreibung
- Manager-Assignment
- Hierarchie: Parent-Departments (optional)

#### Employee-Management

**US-020:** Als ein Company-Admin möchte ich Mitarbeiter manuell hinzufügen, damit diese den Test absolvieren können.
- Formular: Email, Vorname, Nachname, Position, Abteilung, Level
- Auto-Test-ID-Generierung
- Optional: Sofortige Einladungs-Email

**US-021:** Als ein Company-Admin möchte ich Mitarbeiter via CSV-Import hochladen, damit ich schnell viele Employees anlegen kann.
- CSV-Upload mit Template-Download
- Validierung: Email-Format, Duplikate
- Bulk-Insert mit Progress-Bar
- Error-Report bei fehlgeschlagenen Zeilen

**US-022:** Als ein Company-Admin möchte ich Einladungs-Emails an Mitarbeiter senden, damit diese den Test absolvieren.
- Bulk-Select von Employees
- Email-Template mit personalisierten Test-Links
- Token-basierte URLs (Expiry: 30 Tage)
- Erinnerungs-Emails (optional)

**US-023:** Als ein eingeladener Employee möchte ich via Invitation-Link den Test absolvieren, damit meine Ergebnisse automatisch mit meinem Arbeitgeber verknüpft werden.
- Token-Validation
- Auto-Account-Creation (ohne separate Registration)
- Test-Flow identisch zu B2C
- Auto-Linking: Employee ↔ Test-Result

**US-024:** Als ein Company-Admin möchte ich den Test-Status meiner Mitarbeiter sehen, damit ich nachvollziehen kann, wer noch ausstehend ist.
- Employee-Liste mit Status-Column (Pending, In Progress, Completed)
- Filter nach Status
- Sort nach Completion-Date
- Reminder-Button für Pending-Employees

**US-025:** Als ein Company-Admin möchte ich einzelne Mitarbeiter löschen können, damit ich ausgeschiedene Personen entfernen kann.
- Delete-Button in Employee-Liste
- Confirmation-Dialog
- Soft-Delete vs. Hard-Delete-Option
- Cascade: Test-Daten behalten oder löschen

#### Dashboard & Analytics

**US-026:** Als ein Company-Admin möchte ich ein Dashboard mit KPIs sehen, damit ich einen Überblick über mein Team erhalte.
- KPIs:
  - Completion Rate (%)
  - Durchschnittliche Big Five Scores
  - Team Health Score (kombinierte Metrik)
  - Anzahl ausstehender Tests
- Zeitfilter: Letzte 7 Tage, 30 Tage, 6 Monate
- Department-Filter

**US-027:** Als ein Company-Admin möchte ich Team-Persönlichkeitsprofile visualisiert sehen, damit ich Stärken und Schwächen erkenne.
- Aggregierte Big Five Scores pro Department
- Distribution-Charts (wie viele Employees in welchem Range)
- Team-Strengths & Team-Challenges als Textausgabe
- Vergleich mit Branchen-Benchmarks (optional)

**US-028:** Als ein Company-Admin möchte ich eine Team-Kompatibilitäts-Matrix sehen, damit ich potenzielle Konflikte identifiziere.
- Matrix: Alle Employees × Alle Employees
- Compatibility-Score: 0-100%
- Farbcodierung: Grün (>80%), Gelb (60-80%), Rot (<60%)
- Click auf Zelle: Detaillierte Analyse
- Filter nach Department

**US-029:** Als ein Company-Admin möchte ich Retention-Risk-Reports generieren, damit ich gefährdete Mitarbeiter frühzeitig identifiziere.
- Risk-Factors:
  - Hohes Neurotizismus + Niedriges Engagement
  - Niedriges Conscientiousness + Fehlzeiten
  - Skill-Gaps + Keine Entwicklungspläne
- Risk-Level: Niedrig, Mittel, Hoch
- Sortierung nach Risk-Score
- Export als PDF

**US-030:** Als ein Company-Admin möchte ich Reports als PDF oder CSV exportieren, damit ich diese extern nutzen kann.
- Export-Button in Dashboard
- Format-Wahl: PDF (formatiert), CSV (Rohdaten)
- Email-Versand bei großen Exporten
- DSGVO-konform: Anonymisierungs-Option

#### HR-Features

**US-031:** Als ein Company-Admin möchte ich Unternehmensziele (OKRs) anlegen und tracken, damit ich die Zielerreichung überwache.
- OKR-Formular: Titel, Beschreibung, Target-Date, Department
- Progress-Tracking (0-100%)
- Status: Not Started, In Progress, Completed, Cancelled
- Personality-basierte Empfehlungen (z.B. "Team hat hohe O → Innovation-Goal passt")

**US-032:** Als ein Company-Admin möchte ich Mood-Surveys durchführen, damit ich die Team-Stimmung überwache.
- Einfacher Mood-Score (1-10) pro Employee
- Optional: Feedback-Textfeld
- Trend-Analyse über Zeit
- Alert-System bei negativen Trends

**US-033:** Als ein Company-Admin möchte ich Entwicklungspläne für Mitarbeiter erstellen, damit ich gezielte Fördermaßnahmen plane.
- Formular: Employee-Auswahl, Skill-Gaps (JSON), Training-Plan, Career-Path
- Personality-basierte Empfehlungen (z.B. "Hohes O → Kreativitäts-Workshops")
- Review-Date-Tracking
- Export als PDF für 1-on-1-Meetings

#### Integration-Management

**US-034:** Als ein Company-Admin möchte ich Slack integrieren, damit Test-Ergebnisse automatisch in Channels gepostet werden.
- OAuth-Flow: Slack-App-Installation
- Channel-Auswahl für Notifications
- Events: Test-Completed, New-Employee
- Test-Connection-Button

**US-035:** Als ein Company-Admin möchte ich Microsoft Teams integrieren, damit ich NOBA-Daten in Teams nutzen kann.
- OAuth-Flow: MS Teams App
- Bot-Integration für Notifications
- Webhook-Configuration

**US-036:** Als ein Company-Admin möchte ich Personio (HR-System) integrieren, damit Employee-Daten synchronisiert werden.
- API-Key-Input
- Mapping: Personio-Felder ↔ NOBA-Felder
- Sync-Frequency: Täglich, Wöchentlich, Manuell
- Conflict-Resolution: Personio führt vs. NOBA führt

**US-037:** Als ein Company-Admin möchte ich JIRA integrieren, damit ich Team-Kompatibilität für Projekt-Teams analysiere.
- OAuth-Flow: JIRA App
- Project-Import
- Team-Composition-Analyse basierend auf JIRA-Assignments

**US-038:** Als ein Company-Admin möchte ich sicherstellen, dass alle API-Credentials verschlüsselt gespeichert werden, damit Datensicherheit gewährleistet ist.
- AES-256-CBC Verschlüsselung
- Encryption-Key in Environment-Variable
- IV (Initialization Vector) pro Credential
- Kein Plaintext-Logging

**US-039:** Als ein Company-Admin möchte ich Webhooks konfigurieren, damit externe Systeme bei Events benachrichtigt werden.
- Webhook-URL-Input
- Event-Selection: employee.added, test.completed, report.generated
- Webhook-Secret für Signature-Verification
- Retry-Logic bei Failures
- Activity-Log

---

### 2.3 Admin - Super Administrator

#### System-Monitoring

**US-040:** Als ein Super-Admin möchte ich ein Master-Dashboard sehen, damit ich die gesamte Plattform überwache.
- Metriken:
  - Total Tests (B2C + B2B)
  - Active Companies
  - Total Revenue
  - System-Health (DB, API-Latency, Error-Rate)
- Real-time Updates
- Filter nach Zeitraum

**US-041:** Als ein Super-Admin möchte ich alle Test-Ergebnisse einsehen können, damit ich Support-Anfragen bearbeiten kann.
- Suchfunktion: Email, Test-ID
- Filter nach Status (paid, unpaid)
- Detail-View mit Full-Report
- Export-Funktionen
- Anonymisierungs-Option

#### Company-Management

**US-042:** Als ein Super-Admin möchte ich Companies manuell erstellen und verwalten, damit ich Enterprise-Kunden onboarden kann.
- Company-CRUD
- Subscription-Plan-Assignment
- Max-Employees-Limit
- Admin-User-Assignment
- Billing-Override (Rabatte, Custom-Pricing)

**US-043:** Als ein Super-Admin möchte ich Company-Subscriptions upgraden/downgraden, damit ich Vertragswechsel abbilden kann.
- Plan-Change-Button
- Effective-Date-Selection
- Prorated-Billing-Calculation (optional)
- Email-Notification an Company-Owner

#### Voucher-Management

**US-044:** Als ein Super-Admin möchte ich Voucher-Codes erstellen, damit ich Marketing-Kampagnen unterstützen kann.
- Formular: Code, Description, Valid-Until, Max-Uses
- Bulk-Creation via CSV
- Auto-Code-Generation (optional)
- Usage-Tracking

**US-045:** Als ein Super-Admin möchte ich Voucher-Usage tracken, damit ich den Erfolg von Kampagnen messe.
- Liste mit Current-Uses / Max-Uses
- Filter nach Status (Active, Expired, Maxed-Out)
- Export als CSV
- Delete-Funktion für abgelaufene Vouchers

#### User-Management

**US-046:** Als ein Super-Admin möchte ich User-Accounts sperren oder löschen können, damit ich Missbrauch verhindern kann.
- User-Search (Email, Name)
- Actions: Suspend, Delete, Unlink-Results
- Confirmation-Dialogs
- Audit-Log für Admin-Actions

---

### 2.4 Mobile-App (Native)

**US-047:** Als ein Mobile-User möchte ich die App aus dem App Store/Play Store installieren, damit ich bequem auf meinem Smartphone testen kann.
- React Native App
- iOS + Android Support
- App-Name: NOBA Experts
- Deep-Links zu Test-IDs

**US-048:** Als ein Mobile-User möchte ich den Test offline absolvieren können, damit ich unabhängig von Internetverbindung bin.
- Offline-Mode: Test-Daten im Local-Storage
- Sync bei nächster Verbindung
- Progress-Indicator während Sync

**US-049:** Als ein Mobile-User möchte ich Push-Notifications erhalten, damit ich an ausstehende Tests erinnert werde.
- Push-Token-Registration
- Events: Test-Reminder (3 Tage nach Start), Report-Ready, Chat-Message
- Opt-In/Opt-Out in Settings

---

## 3. Nicht-funktionale Anforderungen

### 3.1 Performance

**NFR-001: Ladezeiten**
- Landing Page: <2 Sekunden
- Test-Seite: <1,5 Sekunden
- Report-Seite: <3 Sekunden (inkl. Charts)
- Dashboard: <2 Sekunden
- Mobile: <3 Sekunden (3G-Netzwerk)

**NFR-002: API-Response-Zeiten**
- GET-Requests: <500ms (P95)
- POST-Requests: <1s (P95)
- PDF-Generation: <5s
- KI-Chat-Response: <3s

**NFR-003: Datenbankabfragen**
- Simple Queries: <100ms
- Aggregations: <500ms
- Indexierung auf: email, testId, company_id, user_id

**NFR-004: Concurrent-Users**
- Support für 1.000+ gleichzeitige Tests
- Load-Balancing bei >500 Requests/min
- Auto-Scaling ab 70% CPU-Auslastung

**NFR-005: Caching**
- Redis für Reports (TTL: 24h)
- CDN für Static-Assets
- Browser-Caching für Images/CSS/JS

### 3.2 Sicherheit

**NFR-006: Passwort-Sicherheit**
- bcrypt mit Salt-Rounds: 12
- Min. 8 Zeichen, 1 Ziffer, 1 Großbuchstabe, 1 Sonderzeichen
- No Common-Passwords-List (z.B. "Password123!")

**NFR-007: Session-Management**
- JWT-Tokens mit 7-Tage-Expiry
- Refresh-Tokens mit 30-Tage-Expiry
- HTTPS-Only Cookies
- CSRF-Protection via SameSite-Cookie

**NFR-008: SQL-Injection-Prevention**
- Prepared Statements überall
- ORM mit Parameterized-Queries
- Input-Sanitization auf allen Endpoints

**NFR-009: XSS-Prevention**
- Output-Encoding für alle User-Inputs
- Content-Security-Policy Header
- DOMPurify für HTML-Content

**NFR-010: API-Rate-Limiting**
- 100 Requests/Minute pro IP
- 1000 Requests/Stunde pro User
- 429-Response bei Überschreitung

**NFR-011: Datenverschlüsselung**
- TLS 1.3 für alle Connections
- AES-256 für API-Credentials in DB
- Encryption-at-Rest für sensitive Daten

**NFR-012: DSGVO-Compliance**
- Opt-In für Marketing-Emails
- Right-to-Access: User kann alle Daten exportieren
- Right-to-Deletion: Vollständige Daten-Löschung
- Data-Minimization: Nur notwendige Daten sammeln
- Privacy-by-Design

**NFR-013: Audit-Logging**
- Log aller Admin-Actions (Who, What, When)
- Retention: 12 Monate
- Immutable-Logs (Write-Only)

### 3.3 Skalierbarkeit

**NFR-014: Horizontale Skalierung**
- Stateless-Backend (keine Session-Affinity)
- Load-Balancer mit Round-Robin
- Auto-Scaling-Groups (Kubernetes oder AWS ECS)

**NFR-015: Datenbank-Skalierung**
- Read-Replicas für Reporting-Queries
- Connection-Pooling (Min: 10, Max: 100)
- Sharding nach company_id (ab 1M+ Tests)

**NFR-016: File-Storage**
- S3 oder ähnlicher Object-Storage für PDFs
- CloudFront/CDN für Auslieferung
- Signed-URLs für Private-Access

**NFR-017: Background-Jobs**
- Queue-System (z.B. BullMQ, RabbitMQ)
- Jobs: PDF-Generation, Email-Versand, Report-Generation
- Retry-Logic bei Failures
- Dead-Letter-Queue

### 3.4 Benutzerfreundlichkeit (Usability)

**NFR-018: Mobile-First-Design**
- Responsive-Layout für alle Breakpoints (320px - 1920px)
- Touch-optimierte Buttons (Min. 44x44px)
- Swipe-Gestures auf Mobile

**NFR-019: Accessibility (WCAG 2.1 AA)**
- Keyboard-Navigation für alle Funktionen
- Screen-Reader-Support (aria-labels)
- Kontrast-Ratio: Min. 4.5:1
- Focus-Indicators sichtbar

**NFR-020: Internationalization (i18n)**
- Multi-Language-Support: DE, EN (min.)
- Locale-basierte Datumsformate
- Currency-Conversion für Payments
- RTL-Support (optional für Arabisch)

**NFR-021: Error-Handling**
- User-freundliche Fehlermeldungen (keine Stack-Traces)
- Toast-Notifications für Success/Error
- Fallback-UIs bei Failures
- Graceful-Degradation

**NFR-022: Ladezeiten-Feedback**
- Skeleton-Screens während Laden
- Progress-Bars bei langen Operationen
- Spinner mit geschätzter Restzeit

### 3.5 Wartbarkeit

**NFR-023: Code-Qualität**
- ESLint + Prettier für Code-Style
- TypeScript Strict-Mode
- SonarQube-Score: A
- Max. Cyclomatic-Complexity: 10

**NFR-024: Test-Coverage**
- Unit-Tests: >80% Coverage
- Integration-Tests für alle API-Endpoints
- E2E-Tests für kritische User-Flows
- Smoke-Tests in CI/CD

**NFR-025: Dokumentation**
- API-Dokumentation via OpenAPI/Swagger
- README mit Setup-Instructions
- Architecture-Decision-Records (ADRs)
- Code-Kommentare für komplexe Logik

**NFR-026: CI/CD**
- Automated-Tests bei jedem Commit
- Deployment-Pipeline: Dev → Staging → Prod
- Blue-Green-Deployment
- Rollback-Mechanismus

**NFR-027: Monitoring & Logging**
- Centralized-Logging (z.B. ELK-Stack)
- Application-Performance-Monitoring (z.B. Datadog, New Relic)
- Error-Tracking (z.B. Sentry)
- Uptime-Monitoring (z.B. Pingdom)

### 3.6 Kompatibilität

**NFR-028: Browser-Support**
- Chrome (letzte 2 Versionen)
- Firefox (letzte 2 Versionen)
- Safari (letzte 2 Versionen)
- Edge (letzte 2 Versionen)
- Mobile-Browsers: Chrome Mobile, Safari iOS

**NFR-029: Mobile-OS-Support**
- iOS: 14+
- Android: 10+

**NFR-030: Betriebssysteme (Backend)**
- Linux (Ubuntu 22.04+)
- Docker-Container (platform-agnostic)

---

## 4. Datenmodell & Datenbankdesign

### 4.1 Entitäten-Übersicht

1. **User** - Endbenutzer-Account
2. **TestResult** - Big Five Test-Ergebnis
3. **UserTestLink** - Verknüpfung User ↔ Test
4. **ChatHistory** - KI-Chat-Konversationen
5. **TestProgress** - Gespeicherter Test-Fortschritt
6. **ChatAccess** - Chat-Zugangs-Tracking
7. **Company** - Unternehmens-Profil
8. **CompanyAdmin** - Company-Administrator
9. **Department** - Abteilung
10. **Employee** - Mitarbeiter
11. **EmployeeInvitation** - Einladungs-Token
12. **EmployeeTest** - Employee ↔ Test Verknüpfung
13. **Objective** - Unternehmensziele (OKRs)
14. **MoodSurvey** - Stimmungsbarometer
15. **DevelopmentPlan** - Entwicklungsplan
16. **TeamAnalytics** - Aggregierte Team-Metriken
17. **Integration** - Externe API-Integration
18. **Webhook** - Webhook-Configuration
19. **IntegrationLog** - Integration-Activity-Log
20. **Voucher** - Gutschein-Codes
21. **Account** - OAuth-Accounts (NextAuth)
22. **Session** - User-Sessions (NextAuth)
23. **VerificationToken** - Email-Verification (NextAuth)

### 4.2 Detaillierte Entitäten

#### 4.2.1 User
```typescript
interface User {
  id: string;                    // UUID
  email: string;                 // UNIQUE, NOT NULL
  name: string | null;
  password: string | null;       // bcrypt hash (null bei OAuth)
  emailVerified: Date | null;
  image: string | null;          // Avatar-URL
  createdAt: Date;
  updatedAt: Date;
}
```

**Beziehungen:**
- Ein User hat viele TestResults (via UserTestLink)
- Ein User hat viele Accounts (OAuth)
- Ein User hat viele Sessions

#### 4.2.2 TestResult
```typescript
interface TestResult {
  id: number;                    // AUTO_INCREMENT PRIMARY KEY
  testId: string;                // UNIQUE, VARCHAR(255)
  completedAt: Date;
  scores: {                      // JSON
    O: number;                   // Openness (24-120)
    C: number;                   // Conscientiousness
    E: number;                   // Extraversion
    A: number;                   // Agreeableness
    N: number;                   // Neuroticism
  };
  rawAnswers: Array<{            // JSON
    questionId: number;
    score: number;               // 1-5
  }>;
  userDetails: {                 // JSON
    age: number;
    currentJob: string;
    experienceLevel: string;
    industry: string;
    careerGoal: string;
    biggestChallenge: string;
    workEnvironment: string;
  };
  email: string;                 // NOT NULL (für non-auth users)
  paid: boolean;                 // DEFAULT FALSE
  voucher: string | null;        // Voucher-Code
  reportHtml: string | null;     // Cached KI-Report
  reportGeneratedAt: Date | null;
}
```

**Beziehungen:**
- Viele-zu-Viele mit User (via UserTestLink)
- Ein TestResult hat viele ChatHistory-Einträge

#### 4.2.3 UserTestLink
```typescript
interface UserTestLink {
  id: number;
  userId: string;                // FOREIGN KEY → users.id
  testId: string;                // FOREIGN KEY → test_results.testId
  createdAt: Date;
  // UNIQUE (userId, testId)
}
```

#### 4.2.4 ChatHistory
```typescript
interface ChatHistory {
  id: number;
  testId: string;                // FOREIGN KEY
  role: 'user' | 'assistant' | 'system';
  content: string;               // TEXT
  timestamp: Date;
  // INDEX on testId
}
```

#### 4.2.5 TestProgress
```typescript
interface TestProgress {
  id: number;
  userId: string;                // FOREIGN KEY
  progressId: string;            // UNIQUE
  currentQuestionIndex: number;
  answers: Array<{               // JSON
    questionId: number;
    score: number;
  }>;
  userDetails: object;           // JSON
  updatedAt: Date;
}
```

#### 4.2.6 ChatAccess
```typescript
interface ChatAccess {
  id: number;
  testId: string;                // FOREIGN KEY
  email: string;
  accessGrantedAt: Date;
  expiresAt: Date;               // +7 days
  // UNIQUE (testId, email)
}
```

#### 4.2.7 Company
```typescript
interface Company {
  id: number;
  name: string;                  // NOT NULL
  domain: string | null;
  industry: string | null;
  size: '1-10' | '10-50' | '50-200' | '200-1000' | '1000+';
  subscriptionStatus: 'trial' | 'active' | 'suspended' | 'cancelled';
  subscriptionPlan: 'basic' | 'professional' | 'enterprise';
  maxEmployees: number;          // DEFAULT 10
  billingEmail: string | null;
  logo: string | null;           // URL
  createdAt: Date;
  updatedAt: Date;
}
```

**Beziehungen:**
- Ein Company hat viele Admins
- Ein Company hat viele Departments
- Ein Company hat viele Employees
- Ein Company hat viele Integrations

#### 4.2.8 CompanyAdmin
```typescript
interface CompanyAdmin {
  id: number;
  companyId: number;             // FOREIGN KEY
  userId: string;                // FOREIGN KEY
  email: string;                 // NOT NULL (primary auth)
  role: 'owner' | 'admin' | 'hr_manager' | 'team_lead';
  permissions: string[];         // JSON Array
  createdAt: Date;
  // UNIQUE (companyId, userId)
}
```

#### 4.2.9 Department
```typescript
interface Department {
  id: number;
  companyId: number;             // FOREIGN KEY
  name: string;                  // NOT NULL
  description: string | null;
  managerId: string | null;      // FOREIGN KEY → users.id
  parentDepartmentId: number | null; // FOREIGN KEY → self
  createdAt: Date;
}
```

#### 4.2.10 Employee
```typescript
interface Employee {
  id: number;
  companyId: number;             // FOREIGN KEY
  departmentId: number | null;   // FOREIGN KEY
  email: string;                 // NOT NULL
  firstName: string;
  lastName: string;
  position: string | null;
  level: 'junior' | 'mid' | 'senior' | 'lead' | 'manager' | 'executive';
  employmentType: 'full_time' | 'part_time' | 'contract' | 'intern';
  startDate: Date | null;
  testId: string | null;         // FOREIGN KEY → test_results.testId
  testCompleted: boolean;        // DEFAULT FALSE
  testCompletedAt: Date | null;
  lastTestReminder: Date | null;
  status: 'active' | 'inactive' | 'on_leave';
  createdAt: Date;
  updatedAt: Date;
  // UNIQUE (companyId, email)
}
```

#### 4.2.11 EmployeeInvitation
```typescript
interface EmployeeInvitation {
  id: number;
  companyId: number;             // FOREIGN KEY
  email: string;
  token: string;                 // UNIQUE
  expiresAt: Date;               // +30 days
  acceptedAt: Date | null;
  createdBy: string;             // userId
  createdAt: Date;
}
```

#### 4.2.12 EmployeeTest
```typescript
interface EmployeeTest {
  id: number;
  employeeId: number;            // FOREIGN KEY
  testId: string;                // FOREIGN KEY
  completedAt: Date;
  scores: {                      // JSON
    O: number;
    C: number;
    E: number;
    A: number;
    N: number;
  };
}
```

#### 4.2.13 Objective
```typescript
interface Objective {
  id: number;
  companyId: number;             // FOREIGN KEY
  departmentId: number | null;   // FOREIGN KEY (null = company-wide)
  title: string;                 // NOT NULL
  description: string | null;
  targetDate: Date;
  status: 'not_started' | 'in_progress' | 'completed' | 'cancelled';
  progress: number;              // 0-100
  createdBy: string;             // userId
  createdAt: Date;
  updatedAt: Date;
}
```

#### 4.2.14 MoodSurvey
```typescript
interface MoodSurvey {
  id: number;
  companyId: number;             // FOREIGN KEY
  employeeId: number;            // FOREIGN KEY
  moodScore: number;             // 1-10
  feedback: string | null;       // TEXT
  surveyDate: Date;
  createdAt: Date;
}
```

#### 4.2.15 DevelopmentPlan
```typescript
interface DevelopmentPlan {
  id: number;
  companyId: number;             // FOREIGN KEY
  employeeId: number;            // FOREIGN KEY
  skillGaps: string[];           // JSON Array
  trainingPlan: {                // JSON
    courses: string[];
    timeline: string;
  };
  careerPath: string;
  nextReviewDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

#### 4.2.16 TeamAnalytics
```typescript
interface TeamAnalytics {
  id: number;
  companyId: number;             // FOREIGN KEY
  departmentId: number | null;   // FOREIGN KEY (null = company-wide)
  analysisDate: Date;
  totalEmployees: number;
  testsCompleted: number;
  avgOpenness: number;           // DECIMAL(5,2)
  avgConscientiousness: number;
  avgExtraversion: number;
  avgAgreeableness: number;
  avgNeuroticism: number;
  moodScore: number | null;      // DECIMAL(5,2)
  engagementLevel: number | null;
  retentionRisk: number | null;
  innovationPotential: number | null;
  leadershipReadiness: number | null;
  teamStrengths: string[];       // JSON
  teamChallenges: string[];      // JSON
  recommendations: string[];     // JSON
  createdAt: Date;
}
```

#### 4.2.17 Integration
```typescript
interface Integration {
  id: number;
  companyId: number;             // FOREIGN KEY
  integrationType: 'slack' | 'microsoft' | 'google' | 'personio' | 'jira' | 'other';
  integrationName: string;
  credentials: string;           // TEXT (AES-256 encrypted JSON)
  config: {                      // JSON
    syncFrequency: 'hourly' | 'daily' | 'weekly' | 'manual';
    enabledFeatures: string[];
  };
  isActive: boolean;             // DEFAULT FALSE
  connectionStatus: 'connected' | 'disconnected' | 'error';
  lastSyncAt: Date | null;
  lastError: string | null;      // TEXT
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;             // userId
  // UNIQUE (companyId, integrationType)
}
```

#### 4.2.18 Webhook
```typescript
interface Webhook {
  id: number;
  companyId: number;             // FOREIGN KEY
  integrationId: number;         // FOREIGN KEY
  webhookUrl: string;            // VARCHAR(500)
  webhookSecret: string;         // For signature verification
  events: string[];              // JSON Array ["employee.added", "test.completed"]
  isActive: boolean;             // DEFAULT TRUE
  lastTriggeredAt: Date | null;
  failureCount: number;          // DEFAULT 0
  createdAt: Date;
}
```

#### 4.2.19 IntegrationLog
```typescript
interface IntegrationLog {
  id: number;
  companyId: number;             // FOREIGN KEY
  integrationId: number;         // FOREIGN KEY
  action: string;                // VARCHAR(100)
  details: object;               // JSON
  status: 'success' | 'error';
  createdAt: Date;
  // INDEX on (companyId, createdAt)
}
```

#### 4.2.20 Voucher
```typescript
interface Voucher {
  id: number;
  code: string;                  // UNIQUE, VARCHAR(50)
  description: string | null;    // TEXT
  validUntil: Date;
  maxUses: number;
  currentUses: number;           // DEFAULT 0
  createdBy: string;             // userId
  createdAt: Date;
}
```

#### 4.2.21 Account (NextAuth)
```typescript
interface Account {
  id: string;
  userId: string;                // FOREIGN KEY
  type: string;                  // 'oauth', 'email'
  provider: string;              // 'google', 'credentials'
  providerAccountId: string;
  refresh_token: string | null;
  access_token: string | null;
  expires_at: number | null;
  token_type: string | null;
  scope: string | null;
  id_token: string | null;
  session_state: string | null;
}
```

#### 4.2.22 Session (NextAuth)
```typescript
interface Session {
  id: string;
  sessionToken: string;          // UNIQUE
  userId: string;                // FOREIGN KEY
  expires: Date;
}
```

#### 4.2.23 VerificationToken (NextAuth)
```typescript
interface VerificationToken {
  identifier: string;            // Email
  token: string;                 // UNIQUE
  expires: Date;
}
```

### 4.3 Datenbank-Indizes

**Performance-kritische Indizes:**
```sql
-- Users
CREATE INDEX idx_users_email ON users(email);

-- TestResults
CREATE INDEX idx_results_testid ON test_results(testId);
CREATE INDEX idx_results_email ON test_results(email);
CREATE INDEX idx_results_completed_at ON test_results(completedAt);

-- UserTestLinks
CREATE INDEX idx_user_test_links_userid ON user_test_links(userId);
CREATE INDEX idx_user_test_links_testid ON user_test_links(testId);

-- ChatHistory
CREATE INDEX idx_chat_history_testid ON chat_history(testId);
CREATE INDEX idx_chat_history_timestamp ON chat_history(timestamp);

-- Companies
CREATE INDEX idx_companies_domain ON companies(domain);

-- CompanyAdmins
CREATE INDEX idx_company_admins_email ON company_admins(email);
CREATE INDEX idx_company_admins_companyid ON company_admins(companyId);

-- Employees
CREATE INDEX idx_employees_companyid ON company_employees(companyId);
CREATE INDEX idx_employees_email ON company_employees(email);
CREATE INDEX idx_employees_testid ON company_employees(testId);
CREATE INDEX idx_employees_department ON company_employees(departmentId);

-- Integrations
CREATE INDEX idx_integrations_companyid ON company_integrations(companyId);
CREATE INDEX idx_integrations_type ON company_integrations(integrationType);

-- IntegrationLogs
CREATE INDEX idx_integration_logs_company_date ON integration_logs(companyId, createdAt);
```

### 4.4 Datenbank-Constraints

**Foreign Keys mit Cascade:**
```sql
-- UserTestLinks
ALTER TABLE user_test_links
  ADD CONSTRAINT fk_user_test_links_userid
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE user_test_links
  ADD CONSTRAINT fk_user_test_links_testid
  FOREIGN KEY (testId) REFERENCES test_results(testId) ON DELETE CASCADE;

-- Employees
ALTER TABLE company_employees
  ADD CONSTRAINT fk_employees_companyid
  FOREIGN KEY (companyId) REFERENCES companies(id) ON DELETE CASCADE;

ALTER TABLE company_employees
  ADD CONSTRAINT fk_employees_departmentid
  FOREIGN KEY (departmentId) REFERENCES company_departments(id) ON DELETE SET NULL;
```

---

## 5. Empfehlung für den Technologie-Stack

### 5.1 Frontend

**Framework:** **React 18+ mit Next.js 14**

**Begründung:**
- Server-Side-Rendering (SSR) für SEO und Performance
- Static-Site-Generation (SSG) für Landing Pages
- API-Routes für Backend-Logic
- Incremental-Static-Regeneration (ISR) für Caching
- Built-in Image-Optimization
- TypeScript-First
- Große Community, exzellente Dokumentation
- Optimal für B2B-Dashboards mit complex data-fetching

**UI-Libraries:**
- **Tailwind CSS** - Utility-First CSS, hochgradig anpassbar
- **Radix UI / Headless UI** - Accessible Components (WCAG 2.1)
- **Framer Motion** - Animationen
- **Recharts / Chart.js** - Datenvisualisierung
- **React Hook Form** - Formular-Handling mit Validation
- **Zod** - Schema-Validation (TypeScript-first)

**State-Management:**
- **Zustand** oder **Redux Toolkit** (für komplexe B2B-Dashboards)
- **React Query / TanStack Query** - Server-State-Management, Caching

**Internationalization:**
- **next-intl** - i18n für Next.js

### 5.2 Backend

**Framework:** **Node.js 20+ mit Fastify oder NestJS**

**Begründung:**
- **Fastify:** Schnellste Node.js-Framework, Built-in-Validation, Schema-based
- **NestJS:** Enterprise-Grade, TypeScript-Native, Modular-Architecture, Dependency-Injection
- Shared-Language mit Frontend (TypeScript)
- Große Package-Ecosystem
- Horizontal-Scalability
- Microservice-Ready

**Alternative:** **Go mit Gin oder Echo**
- Höhere Performance (10x vs. Node.js)
- Bessere Concurrency
- Kleinere Binary-Sizes
- Aber: Kleinerer Talent-Pool, weniger Libraries

**Empfehlung:** **NestJS** für Enterprise-Features, **Fastify** für Performance-kritische Services

### 5.3 Datenbank

**Primary-Database:** **PostgreSQL 15+**

**Begründung:**
- Robuste JSONB-Support für flexible Schemas (scores, userDetails)
- Advanced-Indexing (GIN, BRIN) für große Datasets
- Full-Text-Search
- Row-Level-Security (RLS) für Multi-Tenancy
- Mature-Replication (Streaming, Logical)
- Excellent-TypeScript-ORMs (Prisma, TypeORM)
- Open-Source, kein Vendor-Lock-In

**Alternativen:**
- **MySQL 8+:** Bereits verwendet, gute Performance, aber schwächerer JSON-Support
- **MongoDB:** NoSQL, flexibel, aber ACID-Garantien schwächer (nicht für Payments)

**Caching-Layer:** **Redis 7+**
- Reports-Caching
- Session-Storage
- Rate-Limiting-Counters
- Background-Job-Queue (BullMQ)

### 5.4 ORM / Database-Tooling

**ORM:** **Prisma**

**Begründung:**
- Type-Safe-Queries (automatisch generiert)
- Schema-First-Approach
- Built-in-Migrations
- Excellent-Developer-Experience
- Auto-Completion im IDE
- Unterstützt PostgreSQL + MySQL + MongoDB

**Alternative:** **TypeORM** (mehr Control, aber komplexer)

### 5.5 Authentifizierung

**Library:** **NextAuth.js v5** (für Next.js) oder **Lucia** (framework-agnostic)

**Begründung:**
- Built-in OAuth-Providers (Google, Microsoft, etc.)
- Session-Management out-of-the-box
- Database-Adapters für PostgreSQL
- CSRF-Protection
- Secure-Cookie-Handling

**Session-Storage:** **JWT + Database-Sessions** (Hybrid)
- JWT für stateless-auth
- DB-Session für Revocation-Support

**Password-Hashing:** **Argon2** (statt bcrypt)
- Winner des Password-Hashing-Competition
- Resistance gegen GPU/ASIC-Attacks
- Konfigurierbare Memory + Time-Cost

### 5.6 Payment-Processing

**Provider:** **Stripe**

**Begründung:**
- Umfassende API
- Built-in-Fraud-Detection
- PCI-DSS-Compliant (keine Card-Daten im System)
- Webhook-Support
- Klarna, SEPA, Apple Pay out-of-the-box
- Excellent-TypeScript-SDK

**Alternative:** **Paddle** (Merchant-of-Record, einfacher für EU-Steuern)

### 5.7 AI / LLM

**Provider:** **OpenAI GPT-4 Turbo** oder **Anthropic Claude 3**

**Begründung:**
- Bessere Reasoning-Fähigkeiten als Google Gemini
- Längere Context-Windows (128k+ Tokens)
- Function-Calling für strukturierte Outputs
- Streaming-Support für Chat

**Alternative:** **Google Gemini 1.5 Pro** (kostengünstiger, bereits verwendet)

**Library:** **LangChain** oder **Vercel AI SDK**
- Prompt-Management
- Memory-Handling für Chat-History
- Token-Counting
- Retry-Logic

### 5.8 PDF-Generation

**Library:** **Puppeteer** oder **Playwright**

**Begründung:**
- HTML → PDF mit perfektem Layout
- Screenshot-Support für Charts
- Headless-Browser, serverseitig

**Alternative:** **PDFKit / pdfmake** (Native-PDF, schneller, aber komplexeres Layout)

### 5.9 Email-Service

**Provider:** **Resend** oder **SendGrid**

**Begründung:**
- **Resend:** Developer-freundlich, günstiger, modernes API
- **SendGrid:** Enterprise-Grade, Template-Engine, Analytics

**Template-Engine:** **React-Email**
- React-Components für Emails
- Automatische Inline-Styling
- Cross-Client-Testing

### 5.10 File-Storage

**Provider:** **AWS S3** oder **Cloudflare R2**

**Begründung:**
- Günstig, skalierbar
- Signed-URLs für private-access
- Lifecycle-Policies (Auto-Delete nach 30 Tagen)
- **Cloudflare R2:** Kein Egress-Cost

**CDN:** **Cloudflare** oder **AWS CloudFront**

### 5.11 Deployment/Hosting

**Option 1: Cloud-Native (Empfohlen)**
- **Vercel** (für Next.js Frontend + Edge-Functions)
- **Railway** oder **Render** (für Backend + PostgreSQL)
- **Upstash Redis** (für Caching)

**Vorteile:**
- Zero-Config-Deployment
- Auto-Scaling
- Global-CDN
- Built-in-Monitoring

**Option 2: Self-Hosted (wie aktuell)**
- **Docker + Docker-Compose**
- **Kubernetes** (Overkill für Start, aber langfristig)
- **VPS** (Hetzner, DigitalOcean)

**CI/CD:** **GitHub-Actions** oder **GitLab-CI**

### 5.12 Monitoring & Observability

**Application-Performance-Monitoring (APM):**
- **Datadog** oder **New Relic**
- **Sentry** für Error-Tracking

**Logging:**
- **Pino** (für Node.js) oder **Winston**
- **Axiom** oder **Logtail** für centralized-logging

**Uptime-Monitoring:**
- **BetterStack** oder **Pingdom**

### 5.13 Background-Jobs

**Queue-System:** **BullMQ** (Redis-based)

**Begründung:**
- Reliable-Job-Processing
- Retry-Mechanismen
- Cron-Jobs für scheduled-tasks
- Dashboard für Job-Monitoring

**Jobs:**
- PDF-Generation
- Email-Versand
- Report-Generation
- Integration-Syncs

### 5.14 Testing

**Unit-Tests:** **Vitest** (schneller als Jest)
**Integration-Tests:** **Supertest** (für API-Testing)
**E2E-Tests:** **Playwright** (für Browser-Automation)
**Load-Testing:** **k6**

### 5.15 Mobile-App

**Framework:** **React Native** mit **Expo**

**Begründung:**
- Shared-Code mit Web (React)
- Cross-Platform (iOS + Android)
- Hot-Reload für Development
- Expo-Router für Navigation
- Push-Notifications via Expo

**Alternative:** **Flutter** (bessere Performance, aber Dart-Language)

### 5.16 Zusammenfassung Tech-Stack

| Layer | Technologie | Begründung |
|-------|-------------|------------|
| **Frontend** | React 18 + Next.js 14 + TypeScript | SSR, SSG, API-Routes, SEO |
| **UI** | Tailwind CSS + Radix UI | Utility-First, Accessible |
| **State** | Zustand + React Query | Lightweight, Server-State-Caching |
| **Backend** | Node.js 20 + NestJS + TypeScript | Enterprise-Grade, Modular |
| **Database** | PostgreSQL 15 + Prisma ORM | Type-Safe, Advanced-Features |
| **Cache** | Redis 7 | Reports, Sessions, Rate-Limiting |
| **Auth** | NextAuth.js v5 + Argon2 | OAuth, Sessions, Secure-Hashing |
| **Payment** | Stripe | PCI-Compliant, Feature-Rich |
| **AI** | OpenAI GPT-4 Turbo | Best-in-Class Reasoning |
| **PDF** | Puppeteer | HTML → PDF |
| **Email** | Resend + React-Email | Modern, Developer-Friendly |
| **Storage** | AWS S3 / Cloudflare R2 | Scalable, CDN-Integration |
| **Deployment** | Vercel (Frontend) + Railway (Backend) | Zero-Config, Auto-Scaling |
| **CI/CD** | GitHub Actions | Automated-Testing + Deployment |
| **Monitoring** | Sentry + Datadog | Error-Tracking + APM |
| **Queue** | BullMQ | Background-Jobs |
| **Mobile** | React Native + Expo | Cross-Platform |

---

## 6. Externe APIs & Integrationen

### 6.1 Authentication

**Google OAuth 2.0**
- **Zweck:** Social-Login für Endbenutzer
- **Credentials:** Client-ID, Client-Secret
- **Scopes:** `profile`, `email`
- **API-Docs:** https://developers.google.com/identity/protocols/oauth2

**Optional:**
- **Microsoft OAuth** (für B2B-Enterprise)
- **Apple Sign-In** (für iOS-App)

### 6.2 AI / LLM

**OpenAI API**
- **Zweck:** KI-Coach Chat, Report-Generierung
- **Model:** `gpt-4-turbo` oder `gpt-3.5-turbo` (günstiger)
- **Endpoints:** `/v1/chat/completions`
- **API-Docs:** https://platform.openai.com/docs/api-reference

**Konfiguration:**
- Max-Tokens: 1000 (Chat), 4000 (Report)
- Temperature: 0.7
- Streaming: Ja (für Chat)

### 6.3 Payment

**Stripe**
- **Zweck:** Checkout, Subscriptions (B2B), Webhooks
- **Products:**
  - One-Time-Payment: €49 (B2C-Report)
  - Subscription: €990/Monat (B2B Basic)
- **Webhooks:** `checkout.session.completed`, `invoice.paid`
- **API-Docs:** https://stripe.com/docs/api

**PCI-DSS:**
- Keine Card-Daten im System
- Stripe-Hosted-Checkout
- Webhook-Signature-Verification

### 6.4 Email

**Resend**
- **Zweck:** Transactional-Emails
- **Templates:**
  - Test-Link nach Submission
  - Payment-Confirmation
  - Employee-Invitations
  - Report-Access
- **API-Docs:** https://resend.com/docs

**From-Email:** `auswertung@noba-experts.de`
**DSGVO:** Unsubscribe-Link in allen Marketing-Emails

### 6.5 PDF-Generation

**Puppeteer / Playwright**
- **Zweck:** HTML → PDF Conversion
- **Use-Case:** Report-PDFs
- **Konfiguration:**
  - Format: A4
  - Margin: 20mm
  - Print-Background: True
  - Wait-For: `networkidle`

### 6.6 B2B-Integrationen

#### Slack
- **Zweck:** Notifications bei Test-Completion
- **Integration:** Slack-App mit OAuth
- **Scopes:** `chat:write`, `channels:read`, `incoming-webhook`
- **Events:** `test.completed`, `employee.added`
- **API-Docs:** https://api.slack.com/

#### Microsoft Teams
- **Zweck:** Notifications + Bot-Commands
- **Integration:** Teams-App + Incoming-Webhook
- **Bot-Commands:** `/noba status`, `/noba invite`
- **API-Docs:** https://learn.microsoft.com/en-us/microsoftteams/

#### Google Workspace
- **Zweck:** User-Sync, Calendar-Integration
- **Integration:** Google-Admin-SDK
- **Scopes:** `admin.directory.user.readonly`
- **Use-Case:** Auto-Import von Employees
- **API-Docs:** https://developers.google.com/admin-sdk

#### Personio (HR-System)
- **Zweck:** Employee-Daten-Sync
- **Integration:** Personio-API
- **Auth:** API-Key
- **Endpoints:** `/v1/company/employees`
- **Sync-Frequency:** Täglich
- **API-Docs:** https://developer.personio.de/

#### JIRA
- **Zweck:** Team-Composition-Analyse für Projects
- **Integration:** JIRA-Cloud-REST-API
- **Auth:** OAuth 2.0
- **Use-Case:** Personality-Insights für Project-Teams
- **API-Docs:** https://developer.atlassian.com/cloud/jira/

#### SAP SuccessFactors (Enterprise)
- **Zweck:** Enterprise-HR-Integration
- **Integration:** OData-API
- **Auth:** OAuth 2.0
- **Use-Case:** Employee-Sync, Performance-Data
- **API-Docs:** https://help.sap.com/docs/SAP_SUCCESSFACTORS_PLATFORM

### 6.7 Infrastruktur-Services

#### AWS S3
- **Zweck:** PDF-Storage, Backups
- **Buckets:** `noba-reports-prod`, `noba-backups`
- **Lifecycle:** Auto-Delete nach 90 Tagen (Reports)
- **Access:** Signed-URLs (Expiry: 1 Stunde)

#### Cloudflare
- **Zweck:** CDN, DDoS-Protection, Rate-Limiting
- **Features:** Page-Rules, Workers (Edge-Functions)

#### Sentry
- **Zweck:** Error-Tracking + Performance-Monitoring
- **SDKs:** @sentry/nextjs, @sentry/node
- **Alerts:** Slack-Integration bei kritischen Errors

#### Datadog
- **Zweck:** APM, Infrastructure-Monitoring
- **Metrics:** Response-Time, Error-Rate, CPU/Memory
- **Dashboards:** Custom-Dashboards für B2B-Metrics

---

## 7. Geschäftslogik-Spezifikation

### 7.1 Big Five Test-Algorithmus

#### Fragenset
- **Total:** 119 Fragen
- **Dimensionen:**
  - Openness (O): 23 Fragen
  - Conscientiousness (C): 24 Fragen
  - Extraversion (E): 24 Fragen
  - Agreeableness (A): 24 Fragen
  - Neuroticism (N): 24 Fragen
- **Antwortskala:** 1-5 (Stimme gar nicht zu → Stimme voll zu)

#### Scoring-Formel
```typescript
// Jede Frage hat eine Wertung: "plus" oder "minus"
// Plus-Fragen: Score = Antwort (1-5)
// Minus-Fragen: Score = 6 - Antwort (Reverse-Scoring)

function calculateDimensionScore(
  answers: { questionId: number; score: number }[],
  dimension: 'O' | 'C' | 'E' | 'A' | 'N',
  questionConfig: { id: number; dimension: string; keyed: 'plus' | 'minus' }[]
): number {
  const dimensionQuestions = questionConfig.filter(q => q.dimension === dimension);

  let total = 0;
  for (const question of dimensionQuestions) {
    const answer = answers.find(a => a.questionId === question.id);
    if (!answer) continue; // Skip unanswered

    const score = question.keyed === 'plus'
      ? answer.score
      : (6 - answer.score);

    total += score;
  }

  return total; // Range: 24-120 per dimension
}
```

#### Interpretation
```typescript
function interpretScore(score: number): 'low' | 'average' | 'high' {
  if (score < 60) return 'low';
  if (score > 90) return 'high';
  return 'average';
}
```

**Textuelle Interpretationen:** (Pro Dimension x Interpretation-Level)
- Beispiel: **Hohe Offenheit**
  > "Sie sind offen für neue Erfahrungen, kreativ und neugierig. Sie bevorzugen Abwechslung und schätzen Kunst und Ästhetik."

### 7.2 KI-Report-Generierung

#### Prompt-Template
```typescript
const reportPrompt = `
Du bist ein Karrierecoach und Persönlichkeitsexperte.
Erstelle einen ausführlichen, personalisierten Report basierend auf:

**Persönlichkeitsprofil (Big Five):**
- Openness: ${scores.O} (${interpretScore(scores.O)})
- Conscientiousness: ${scores.C} (${interpretScore(scores.C)})
- Extraversion: ${scores.E} (${interpretScore(scores.E)})
- Agreeableness: ${scores.A} (${interpretScore(scores.A)})
- Neuroticism: ${scores.N} (${interpretScore(scores.N)})

**User-Details:**
- Alter: ${userDetails.age}
- Job: ${userDetails.currentJob}
- Branche: ${userDetails.industry}
- Karriereziel: ${userDetails.careerGoal}
- Herausforderung: ${userDetails.biggestChallenge}

**Report-Struktur (5-6 Seiten):**
1. Zusammenfassung
2. Stärken & Schwächen
3. Karriere-Empfehlungen (spezifisch für die Branche)
4. Entwicklungspotenziale
5. Konkrete nächste Schritte
6. Ressourcen (Bücher, Podcasts, Kurse)

**Ton:** Professionell, ermutigend, konkret. Keine generischen Aussagen.
**Format:** Markdown mit Überschriften (##), Listen, **Fettdruck** für Highlights.
`;
```

#### API-Call
```typescript
const response = await openai.chat.completions.create({
  model: 'gpt-4-turbo',
  messages: [
    { role: 'system', content: 'Du bist ein Karrierecoach.' },
    { role: 'user', content: reportPrompt }
  ],
  temperature: 0.7,
  max_tokens: 4000
});

const reportMarkdown = response.choices[0].message.content;
const reportHtml = marked(reportMarkdown); // Markdown → HTML
```

### 7.3 Team-Compatibility-Algorithmus

```typescript
function calculateCompatibility(
  person1: BigFiveScores,
  person2: BigFiveScores
): { score: number; riskFactors: string[] } {

  // Differenzen berechnen
  const diffs = {
    O: Math.abs(person1.O - person2.O),
    C: Math.abs(person1.C - person2.C),
    E: Math.abs(person1.E - person2.E),
    A: Math.abs(person1.A - person2.A),
    N: Math.abs(person1.N - person2.N)
  };

  // Gewichtete Summe (Total Range: 0-120 pro Dimension)
  // Ziel: Niedrige Differenzen = Hohe Compatibility
  const weightedDiff =
    diffs.A * 0.30 + // Agreeableness wichtigster Faktor
    diffs.C * 0.25 + // Arbeitsweise-Matching
    diffs.E * 0.20 +
    diffs.N * 0.15 +
    diffs.O * 0.10;

  // Normalisierung: 0-120 → 0-100% (invertiert)
  const compatibilityScore = 100 - (weightedDiff / 120 * 100);

  // Risk-Factors
  const riskFactors = [];
  if (diffs.A > 40) riskFactors.push('Hohe Differenz bei Verträglichkeit');
  if (person1.N > 90 || person2.N > 90) riskFactors.push('Hohes Neurotizismus bei mindestens einer Person');
  if (diffs.C > 50) riskFactors.push('Sehr unterschiedliche Arbeitsweisen');

  return {
    score: Math.round(compatibilityScore),
    riskFactors
  };
}
```

### 7.4 Retention-Risk-Berechnung

```typescript
function calculateRetentionRisk(
  employee: Employee,
  testScores: BigFiveScores,
  moodHistory: MoodSurvey[],
  developmentPlan: DevelopmentPlan | null
): { riskLevel: 'low' | 'medium' | 'high'; factors: string[] } {

  let riskScore = 0;
  const factors = [];

  // Faktor 1: Hohes Neurotizismus
  if (testScores.N > 90) {
    riskScore += 30;
    factors.push('Hohes Neurotizismus (Stress-anfällig)');
  }

  // Faktor 2: Niedriges Conscientiousness
  if (testScores.C < 60) {
    riskScore += 20;
    factors.push('Niedriges Conscientiousness (potenzielle Unzufriedenheit mit Struktur)');
  }

  // Faktor 3: Negative Mood-Trends
  const recentMoods = moodHistory.slice(-3); // Letzte 3 Surveys
  const avgMood = recentMoods.reduce((sum, m) => sum + m.moodScore, 0) / recentMoods.length;
  if (avgMood < 5) {
    riskScore += 25;
    factors.push('Negative Stimmungstrends (Avg. Mood < 5)');
  }

  // Faktor 4: Fehlende Entwicklungspläne
  if (!developmentPlan) {
    riskScore += 15;
    factors.push('Keine Entwicklungspläne vorhanden');
  }

  // Faktor 5: Skill-Gaps ohne Training
  if (developmentPlan && developmentPlan.skillGaps.length > 3 && !developmentPlan.trainingPlan.courses.length) {
    riskScore += 10;
    factors.push('Viele Skill-Gaps ohne Training-Plan');
  }

  // Risk-Level
  let riskLevel: 'low' | 'medium' | 'high';
  if (riskScore < 30) riskLevel = 'low';
  else if (riskScore < 60) riskLevel = 'medium';
  else riskLevel = 'high';

  return { riskLevel, factors };
}
```

### 7.5 Chat-Access-Logic

```typescript
async function checkChatAccess(testId: string, userEmail: string): Promise<boolean> {
  // 1. Check Payment-Status
  const testResult = await db.testResult.findUnique({ where: { testId } });
  if (!testResult) return false;

  // 2. Paid-Tests haben 7-Tage-Zugang
  if (testResult.paid) {
    const chatAccess = await db.chatAccess.findUnique({
      where: { testId_email: { testId, email: userEmail } }
    });

    if (!chatAccess) {
      // Erstelle Chat-Access
      await db.chatAccess.create({
        data: {
          testId,
          email: userEmail,
          accessGrantedAt: new Date(),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // +7 days
        }
      });
      return true;
    }

    // Check Expiry
    return chatAccess.expiresAt > new Date();
  }

  // 3. Demo-Tests (bestimmte Test-IDs) immer erlaubt
  const demoTestIds = ['demo-001', 'demo-002', 'demo-003'];
  if (demoTestIds.includes(testId)) return true;

  return false;
}
```

### 7.6 Voucher-Validation

```typescript
async function validateVoucher(code: string): Promise<{ valid: boolean; error?: string }> {
  const voucher = await db.voucher.findUnique({ where: { code } });

  if (!voucher) {
    return { valid: false, error: 'Voucher-Code nicht gefunden' };
  }

  // Check Expiry
  if (voucher.validUntil < new Date()) {
    return { valid: false, error: 'Voucher ist abgelaufen' };
  }

  // Check Max-Uses
  if (voucher.currentUses >= voucher.maxUses) {
    return { valid: false, error: 'Voucher bereits vollständig eingelöst' };
  }

  // Increment Usage
  await db.voucher.update({
    where: { code },
    data: { currentUses: { increment: 1 } }
  });

  return { valid: true };
}
```

---

## 8. API-Endpunkt-Spezifikation

### 8.1 Test & Results

#### POST /api/test/submit
**Zweck:** Test-Submission mit Score-Berechnung

**Request:**
```json
{
  "answers": [
    { "questionId": 1, "score": 4 },
    { "questionId": 2, "score": 5 },
    ...
  ],
  "userDetails": {
    "age": 28,
    "currentJob": "Software Engineer",
    "industry": "Tech",
    "careerGoal": "Become Team Lead",
    "biggestChallenge": "Public Speaking"
  },
  "email": "user@example.com",
  "voucher": "SUMMER2024" // Optional
}
```

**Response:**
```json
{
  "success": true,
  "testId": "test_1234567890_abc",
  "scores": {
    "O": 85,
    "C": 72,
    "E": 60,
    "A": 78,
    "N": 45
  },
  "reportUrl": "https://noba-experts.de/report/test_1234567890_abc"
}
```

**Errors:**
- 400: Validation-Error (fehlende Antworten, ungültiges Email-Format)
- 402: Voucher-Error (abgelaufen, maxed-out)
- 500: Server-Error

#### GET /api/results/:testId
**Zweck:** Test-Ergebnis abrufen

**Response:**
```json
{
  "testId": "test_1234567890_abc",
  "completedAt": "2024-01-15T14:30:00Z",
  "scores": {
    "O": 85,
    "C": 72,
    "E": 60,
    "A": 78,
    "N": 45
  },
  "interpretations": {
    "O": "high",
    "C": "average",
    "E": "average",
    "A": "average",
    "N": "low"
  },
  "paid": false,
  "userDetails": { ... }
}
```

#### GET /api/results/:testId/pdf
**Zweck:** PDF-Download

**Response:** PDF-File-Stream

**Errors:**
- 402: Payment-Required (paid = false)

---

### 8.2 Chat & AI

#### POST /api/chat
**Zweck:** KI-Chat-Nachricht

**Request:**
```json
{
  "testId": "test_1234567890_abc",
  "message": "Was sind meine Stärken im Beruf?"
}
```

**Response:**
```json
{
  "reply": "Basierend auf Ihrem Profil...",
  "conversationId": "conv_123"
}
```

#### GET /api/chat/history/:testId
**Zweck:** Chat-History abrufen

**Response:**
```json
{
  "messages": [
    { "role": "user", "content": "...", "timestamp": "..." },
    { "role": "assistant", "content": "...", "timestamp": "..." }
  ]
}
```

---

### 8.3 Company APIs

#### GET /api/company/dashboard
**Auth:** Company-Admin

**Response:**
```json
{
  "kpis": {
    "totalEmployees": 150,
    "testsCompleted": 120,
    "completionRate": 80.0,
    "avgScores": {
      "O": 78,
      "C": 72,
      "E": 65,
      "A": 80,
      "N": 50
    },
    "teamHealthScore": 78
  },
  "departments": [
    { "name": "Engineering", "employees": 50, "completed": 45 },
    ...
  ]
}
```

#### POST /api/company/employees
**Auth:** Company-Admin

**Request:**
```json
{
  "email": "john.doe@company.com",
  "firstName": "John",
  "lastName": "Doe",
  "departmentId": 3,
  "position": "Senior Developer",
  "level": "senior"
}
```

**Response:**
```json
{
  "id": 123,
  "testId": "test_company_123_abc",
  "invitationSent": true
}
```

---

### 8.4 Integration APIs

#### POST /api/integrations
**Auth:** Company-Admin

**Request:**
```json
{
  "integrationType": "slack",
  "integrationName": "Engineering Channel",
  "credentials": {
    "access_token": "xoxb-...",
    "channel_id": "C01234567"
  },
  "config": {
    "syncFrequency": "daily",
    "enabledFeatures": ["test_notifications", "employee_added"]
  }
}
```

**Response:**
```json
{
  "id": 5,
  "connectionStatus": "connected"
}
```

---

## 9. Deployment & DevOps-Anforderungen

### 9.1 CI/CD-Pipeline

**GitHub-Actions-Workflow:**
```yaml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20
      - run: npm install
      - run: npm run lint
      - run: npm run typecheck
      - run: npm run test:unit
      - run: npm run test:integration

  deploy-staging:
    needs: test
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - run: vercel deploy --env=staging

  deploy-production:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - run: vercel deploy --prod
```

### 9.2 Environment-Variables

**.env.example:**
```bash
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/noba_db
REDIS_URL=redis://localhost:6379

# Auth
AUTH_SECRET=<random_32_bytes>
NEXTAUTH_URL=https://noba-experts.de
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# AI
OPENAI_API_KEY=

# Payment
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Email
RESEND_API_KEY=

# Storage
S3_BUCKET_NAME=noba-reports
S3_ACCESS_KEY=
S3_SECRET_KEY=

# Monitoring
SENTRY_DSN=
DATADOG_API_KEY=

# Encryption
ENCRYPTION_KEY=<32_byte_hex>
```

### 9.3 Docker-Compose (für lokale Entwicklung)

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: noba
      POSTGRES_PASSWORD: dev-password
      POSTGRES_DB: noba_db
    ports:
      - 5432:5432
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - 6379:6379

  app:
    build: .
    ports:
      - 3000:3000
    environment:
      - DATABASE_URL=postgresql://noba:dev-password@postgres:5432/noba_db
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis

volumes:
  postgres_data:
```

### 9.4 Monitoring-Setup

**Sentry-Integration:**
```typescript
// lib/sentry.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: process.env.NODE_ENV,
  beforeSend(event) {
    // Filter sensitive data
    if (event.request) {
      delete event.request.cookies;
      delete event.request.headers;
    }
    return event;
  }
});
```

**Datadog-Integration:**
```typescript
// lib/datadog.ts
import { datadogRum } from '@datadog/browser-rum';

datadogRum.init({
  applicationId: process.env.DATADOG_APP_ID,
  clientToken: process.env.DATADOG_CLIENT_TOKEN,
  site: 'datadoghq.eu',
  service: 'noba-experts',
  env: process.env.NODE_ENV,
  sessionSampleRate: 100,
  sessionReplaySampleRate: 20,
  trackUserInteractions: true,
  trackResources: true,
  trackLongTasks: true
});
```

---

## 10. Migration-Plan (Alt → Neu)

### Phase 1: Dual-Run (4 Wochen)
1. Neue App auf Subdomain: `beta.noba-experts.de`
2. Alte App bleibt auf `test.noba-experts.de`
3. Datenbank-Replikation: Old-MySQL → New-PostgreSQL (täglich)
4. User-Testing mit 10% Traffic

### Phase 2: Cutover (1 Woche)
1. Feature-Freeze auf alte App
2. Final-Data-Migration
3. DNS-Switch: `test.noba-experts.de` → Neue App
4. Alte App als Fallback verfügbar

### Phase 3: Cleanup (2 Wochen)
1. Monitoring auf neue App
2. Bug-Fixes
3. Alte App decomissionen

### Data-Migration-Script

```typescript
// scripts/migrate-data.ts
import { PrismaClient as OldPrisma } from './old-prisma';
import { PrismaClient as NewPrisma } from './new-prisma';

async function migrateData() {
  const oldDb = new OldPrisma();
  const newDb = new NewPrisma();

  // 1. Migrate Users
  const oldUsers = await oldDb.users.findMany();
  for (const user of oldUsers) {
    await newDb.user.create({
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        password: user.password, // Already bcrypt-hashed
        createdAt: user.created_at
      }
    });
  }

  // 2. Migrate Test-Results
  const oldResults = await oldDb.results.findMany();
  for (const result of oldResults) {
    await newDb.testResult.create({
      data: {
        testId: result.testId,
        scores: JSON.parse(result.scores),
        rawAnswers: JSON.parse(result.rawAnswers),
        userDetails: {
          age: result.age,
          currentJob: result.currentJob,
          // ...
        },
        email: result.email,
        paid: result.paid,
        completedAt: result.completedAt
      }
    });
  }

  // 3. Migrate Companies
  // ...

  console.log('Migration complete!');
}

migrateData().catch(console.error);
```

---

## 11. Qualitätssicherung

### 11.1 Akzeptanzkriterien

**US-001 (Registration):**
- [x] User kann sich mit Email/Passwort registrieren
- [x] Validation: Email-Format, Passwort-Stärke
- [x] Email-Verification-Link wird gesendet
- [x] Nach Verification: Auto-Login
- [x] Error-Handling: Duplikate-Email

**US-005 (Test-Durchführung):**
- [x] 119 Fragen werden angezeigt
- [x] Antwortskala 1-5 funktioniert
- [x] Progress-Bar aktualisiert sich
- [x] Vor/Zurück-Navigation funktioniert
- [x] Mobile-responsiv (getestet auf iPhone, Android)
- [x] Score-Berechnung korrekt (Unit-Test)

**US-026 (Company-Dashboard):**
- [x] KPIs werden angezeigt
- [x] Department-Filter funktioniert
- [x] Real-time-Updates bei neuen Tests
- [x] Load-Time < 2s (Lighthouse-Test)

### 11.2 Test-Checkliste

**Unit-Tests:**
- [ ] Big-Five-Scorer (alle Edge-Cases)
- [ ] Retention-Risk-Calculator
- [ ] Compatibility-Algorithm
- [ ] Voucher-Validation
- [ ] All-Utility-Functions

**Integration-Tests:**
- [ ] POST /api/test/submit
- [ ] GET /api/results/:testId
- [ ] POST /api/chat
- [ ] POST /api/company/employees
- [ ] All-Company-APIs
- [ ] All-Admin-APIs

**E2E-Tests:**
- [ ] Full-Test-Flow (Landing → Test → Report)
- [ ] Payment-Flow (Stripe-Checkout)
- [ ] Company-Employee-Onboarding
- [ ] Chat-Conversation

**Performance-Tests:**
- [ ] Load-Test: 1000 concurrent-users (k6)
- [ ] Stress-Test: DB-queries unter Last
- [ ] PDF-Generation-Speed

**Security-Tests:**
- [ ] SQL-Injection-Prevention (sqlmap)
- [ ] XSS-Prevention (manual + automated)
- [ ] CSRF-Protection
- [ ] Rate-Limiting-Enforcement

### 11.3 Definition of Done

**Feature ist "Done" wenn:**
1. Code-Review abgeschlossen (2 Approvals)
2. Unit-Tests > 80% Coverage
3. Integration-Tests für alle APIs
4. E2E-Test für kritischen User-Flow
5. Performance-Test bestanden (<2s Load-Time)
6. Accessibility-Check (WCAG 2.1 AA)
7. Security-Review (keine High/Critical-Vulnerabilities)
8. Dokumentation aktualisiert (API-Docs, README)
9. Deployment auf Staging erfolgreich
10. Product-Owner-Approval

---

## 12. Risiken & Mitigationen

### Risiko 1: Data-Migration-Fehler
**Wahrscheinlichkeit:** Mittel
**Impact:** Hoch (Datenverlust)

**Mitigation:**
- Comprehensive-Backup vor Migration
- Dry-Run auf Test-Daten
- Data-Validation-Scripts post-Migration
- Rollback-Plan definiert

### Risiko 2: Performance-Probleme bei Skalierung
**Wahrscheinlichkeit:** Mittel
**Impact:** Mittel (schlechte UX)

**Mitigation:**
- Load-Testing ab Start
- Database-Indexing optimiert
- Redis-Caching für Reports
- CDN für Static-Assets
- Monitoring-Alerts bei Latency > 2s

### Risiko 3: Vendor-Lock-In (OpenAI)
**Wahrscheinlichkeit:** Niedrig
**Impact:** Hoch (Kosten, Verfügbarkeit)

**Mitigation:**
- Abstraction-Layer für LLM-Provider
- Fallback auf Anthropic Claude
- Caching von generierten Reports
- Self-Hosted-LLM-Option evaluieren (Llama 3)

### Risiko 4: DSGVO-Non-Compliance
**Wahrscheinlichkeit:** Niedrig
**Impact:** Kritisch (rechtlich)

**Mitigation:**
- Privacy-by-Design von Anfang an
- DSGVO-Audit vor Launch
- Data-Deletion-Mechanismen
- Encryption-at-Rest + in-Transit
- DPA (Data-Processing-Agreement) mit allen Vendors

### Risiko 5: Key-Developer-Verlust
**Wahrscheinlichkeit:** Mittel
**Impact:** Hoch (Projekt-Verzögerung)

**Mitigation:**
- Comprehensive-Dokumentation
- Code-Review-Kultur (Wissen teilen)
- Pair-Programming für kritische Features
- Onboarding-Guide für neue Devs

---

## 13. Zeitplan & Roadmap

### Phase 1: Foundation (6 Wochen)
- [ ] Projekt-Setup (Next.js, NestJS, PostgreSQL)
- [ ] Auth-System (NextAuth, Argon2)
- [ ] Big-Five-Test-Flow (Frontend + Scoring)
- [ ] Basic-Report-Display
- [ ] Deployment-Setup (Vercel + Railway)

### Phase 2: B2C-Features (4 Wochen)
- [ ] KI-Chat-Integration (OpenAI)
- [ ] PDF-Generation
- [ ] Stripe-Payment-Flow
- [ ] Voucher-System
- [ ] Email-Notifications

### Phase 3: B2B-Foundation (6 Wochen)
- [ ] Company-Management
- [ ] Employee-CRUD
- [ ] Invitation-System
- [ ] Company-Dashboard (KPIs)
- [ ] Basic-Analytics

### Phase 4: B2B-Advanced (6 Wochen)
- [ ] Team-Compatibility-Matrix
- [ ] Retention-Risk-Reports
- [ ] OKRs, Mood-Tracking, Development-Plans
- [ ] Extended-Reports

### Phase 5: Integrations (4 Wochen)
- [ ] Slack-Integration
- [ ] MS-Teams-Integration
- [ ] Personio-Integration
- [ ] Webhook-System

### Phase 6: Mobile-App (6 Wochen)
- [ ] React-Native-Setup
- [ ] Offline-Mode
- [ ] Push-Notifications
- [ ] App-Store-Submission

### Phase 7: Polish & Launch (4 Wochen)
- [ ] Performance-Optimization
- [ ] Security-Audit
- [ ] Data-Migration
- [ ] Beta-Testing
- [ ] Launch

**Total:** ~36 Wochen (9 Monate)

---

## 14. Anhang

### 14.1 Big Five Fragenset

*Aus Platzgründen hier nur Beispiele. Vollständiges Set in separater Datei.*

**Extraversion:**
1. Ich bin die Seele jeder Party. (plus)
2. Ich spreche nicht viel. (minus)
3. Ich fühle mich wohl unter Menschen. (plus)
...

**Conscientiousness:**
1. Ich bin immer vorbereitet. (plus)
2. Ich lasse Dinge oft liegen. (minus)
...

### 14.2 Glossar

- **Big Five:** Fünf-Faktoren-Modell der Persönlichkeitspsychologie (O, C, E, A, N)
- **Likert-Skala:** Rating-Skala mit 5 oder 7 Stufen
- **OKR:** Objectives & Key Results (Zielsetzungs-Framework)
- **Multi-Tenancy:** Eine App-Instanz für mehrere Kunden (Companies)
- **RLS:** Row-Level-Security (DB-Feature für Zugriffskontrolle)

### 14.3 Referenzen

**Psychologie:**
- Costa, P. T., & McCrae, R. R. (1992). NEO-PI-R Professional Manual.
- John, O. P., & Srivastava, S. (1999). The Big Five Trait Taxonomy.

**Tech-Docs:**
- Next.js: https://nextjs.org/docs
- Prisma: https://www.prisma.io/docs
- OpenAI: https://platform.openai.com/docs
- Stripe: https://stripe.com/docs

---

## Abschluss

Dieses Anforderungsdokument ist vollständig und präzise genug, um als einzige Grundlage für die Neuentwicklung der NOBA Experts Plattform zu dienen. Es deckt alle funktionalen und nicht-funktionalen Anforderungen, das Datenmodell, die Geschäftslogik, den empfohlenen Tech-Stack und externe Integrationen ab.

**Für externe Entwickler:** Dieses Dokument eliminiert die Notwendigkeit, den alten Code zu verstehen. Alle Anforderungen sind explizit spezifiziert, inklusive Edge-Cases, Algorithmen und API-Verträgen.

**Nächste Schritte:**
1. Product-Owner-Review dieses Dokuments
2. Priorisierung der User-Stories
3. Entwickler-Team-Onboarding
4. Sprint-Planning für Phase 1

**Fragen & Klärungen:** Bitte dokumentiere alle offenen Fragen in einem separaten Issue-Tracker.

---

**Dokument-Autor:** KI-Systemarchitekt-Analyse
**Version:** 2.0
**Letzte Aktualisierung:** 2025-10-06
**Status:** ✅ Review-Ready
