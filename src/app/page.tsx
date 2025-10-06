export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Entdecke deine Persönlichkeit
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Wissenschaftlich fundierter Big Five Persönlichkeitstest mit
            KI-gestützter Karriereberatung
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/test"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition shadow-lg hover:shadow-xl"
            >
              Test jetzt starten
            </a>
            <a
              href="/login"
              className="bg-white hover:bg-gray-50 text-blue-600 font-semibold py-4 px-8 rounded-lg transition border-2 border-blue-600"
            >
              Anmelden
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FeatureCard
            title="Wissenschaftlich fundiert"
            description="Basierend auf dem Big Five Modell - dem anerkanntesten Persönlichkeitsmodell der Psychologie"
            icon="🎓"
          />
          <FeatureCard
            title="KI-Coach"
            description="Erhalte personalisierte Karriere-Empfehlungen durch unseren intelligenten Coaching-Assistenten"
            icon="🤖"
          />
          <FeatureCard
            title="Detaillierte Reports"
            description="Umfassende PDF-Berichte mit konkreten Handlungsempfehlungen für deine Karriere"
            icon="📊"
          />
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">120</div>
              <div className="text-blue-100">Fragen</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">5</div>
              <div className="text-blue-100">Dimensionen</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">10-15</div>
              <div className="text-blue-100">Minuten</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Bereit für deinen Test?
        </h2>
        <p className="text-xl text-gray-600 mb-8">
          Starte jetzt und erhalte dein Persönlichkeitsprofil in 15 Minuten
        </p>
        <a
          href="/test"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-12 rounded-lg transition shadow-lg hover:shadow-xl"
        >
          Kostenlos starten
        </a>
      </div>
    </main>
  );
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
