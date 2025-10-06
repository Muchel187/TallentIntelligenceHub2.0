/**
 * Big Five Personality Test Questions
 * Based on IPIP (International Personality Item Pool)
 * 120 questions across 5 dimensions (24 per dimension: O, C, E, A, N)
 */

export interface Question {
  id: number;
  text: string;
  dimension: 'O' | 'C' | 'E' | 'A' | 'N';
  keyed: 'plus' | 'minus';
}

export const questions: Question[] = [
  // OPENNESS TO EXPERIENCE (O) - 24 questions
  { id: 1, text: 'Ich habe eine lebhafte Fantasie.', dimension: 'O', keyed: 'plus' },
  { id: 2, text: 'Ich habe wenig Interesse an abstrakten Ideen.', dimension: 'O', keyed: 'minus' },
  { id: 3, text: 'Ich habe ausgezeichnete Ideen.', dimension: 'O', keyed: 'plus' },
  { id: 4, text: 'Ich verstehe Dinge nicht schnell.', dimension: 'O', keyed: 'minus' },
  { id: 5, text: 'Ich benutze schwierige Wörter.', dimension: 'O', keyed: 'plus' },
  { id: 6, text: 'Ich verbringe Zeit damit, über Dinge nachzudenken.', dimension: 'O', keyed: 'plus' },
  { id: 7, text: 'Ich bin voller Ideen.', dimension: 'O', keyed: 'plus' },
  { id: 8, text: 'Ich habe Schwierigkeiten, abstrakte Konzepte zu verstehen.', dimension: 'O', keyed: 'minus' },
  { id: 9, text: 'Ich interessiere mich für viele verschiedene Dinge.', dimension: 'O', keyed: 'plus' },
  { id: 10, text: 'Ich mag keine Kunst.', dimension: 'O', keyed: 'minus' },
  { id: 11, text: 'Ich liebe es, über neue Ideen nachzudenken.', dimension: 'O', keyed: 'plus' },
  { id: 12, text: 'Ich vermeide philosophische Diskussionen.', dimension: 'O', keyed: 'minus' },
  { id: 13, text: 'Ich genieße das Schöne der Natur.', dimension: 'O', keyed: 'plus' },
  { id: 14, text: 'Ich glaube, dass Kunst wichtig ist.', dimension: 'O', keyed: 'plus' },
  { id: 15, text: 'Ich mag es nicht, über Theorien zu sprechen.', dimension: 'O', keyed: 'minus' },
  { id: 16, text: 'Ich habe ein reiches Vokabular.', dimension: 'O', keyed: 'plus' },
  { id: 17, text: 'Ich trage gerne ungewöhnliche Kleidung.', dimension: 'O', keyed: 'plus' },
  { id: 18, text: 'Ich bin nicht an abstrakten Konzepten interessiert.', dimension: 'O', keyed: 'minus' },
  { id: 19, text: 'Ich schätze künstlerische und ästhetische Erfahrungen.', dimension: 'O', keyed: 'plus' },
  { id: 20, text: 'Ich habe Schwierigkeiten, mir Dinge vorzustellen.', dimension: 'O', keyed: 'minus' },
  { id: 21, text: 'Ich bin gut in abstraktem Denken.', dimension: 'O', keyed: 'plus' },
  { id: 22, text: 'Ich habe eine breite Palette von Interessen.', dimension: 'O', keyed: 'plus' },
  { id: 23, text: 'Ich sehe Schönheit in Dingen, die andere nicht bemerken.', dimension: 'O', keyed: 'plus' },
  { id: 24, text: 'Ich bevorzuge Routine gegenüber Abwechslung.', dimension: 'O', keyed: 'minus' },

  // CONSCIENTIOUSNESS (C) - 24 questions
  { id: 25, text: 'Ich bin immer vorbereitet.', dimension: 'C', keyed: 'plus' },
  { id: 26, text: 'Ich lasse meine Sachen überall liegen.', dimension: 'C', keyed: 'minus' },
  { id: 27, text: 'Ich achte auf Details.', dimension: 'C', keyed: 'plus' },
  { id: 28, text: 'Ich mache in meinem Zimmer ein Durcheinander.', dimension: 'C', keyed: 'minus' },
  { id: 29, text: 'Ich erledige Aufgaben sofort.', dimension: 'C', keyed: 'plus' },
  { id: 30, text: 'Ich erledige oft Dinge auf den letzten Drücker.', dimension: 'C', keyed: 'minus' },
  { id: 31, text: 'Ich mag Ordnung.', dimension: 'C', keyed: 'plus' },
  { id: 32, text: 'Ich versäume oder vergesse meine Termine.', dimension: 'C', keyed: 'minus' },
  { id: 33, text: 'Ich folge einem Zeitplan.', dimension: 'C', keyed: 'plus' },
  { id: 34, text: 'Ich bin exakt in meiner Arbeit.', dimension: 'C', keyed: 'plus' },
  { id: 35, text: 'Ich verliere oft meine Sachen.', dimension: 'C', keyed: 'minus' },
  { id: 36, text: 'Ich erledige Aufgaben erfolgreich.', dimension: 'C', keyed: 'plus' },
  { id: 37, text: 'Ich mache Pläne und halte sie ein.', dimension: 'C', keyed: 'plus' },
  { id: 38, text: 'Ich verschwende meine Zeit.', dimension: 'C', keyed: 'minus' },
  { id: 39, text: 'Ich finde es schwer zu arbeiten.', dimension: 'C', keyed: 'minus' },
  { id: 40, text: 'Ich arbeite hart.', dimension: 'C', keyed: 'plus' },
  { id: 41, text: 'Ich tue nur das Nötigste.', dimension: 'C', keyed: 'minus' },
  { id: 42, text: 'Ich erledige mehr als was von mir erwartet wird.', dimension: 'C', keyed: 'plus' },
  { id: 43, text: 'Ich breche meine Versprechen.', dimension: 'C', keyed: 'minus' },
  { id: 44, text: 'Ich bin pünktlich für meine Termine.', dimension: 'C', keyed: 'plus' },
  { id: 45, text: 'Ich halte meine Versprechen.', dimension: 'C', keyed: 'plus' },
  { id: 46, text: 'Ich überlasse Dinge unfertig.', dimension: 'C', keyed: 'minus' },
  { id: 47, text: 'Ich versuche, andere nicht zu enttäuschen.', dimension: 'C', keyed: 'plus' },
  { id: 48, text: 'Ich schiebe unangenehme Aufgaben auf.', dimension: 'C', keyed: 'minus' },

  // EXTRAVERSION (E) - 24 questions
  { id: 49, text: 'Ich bin die Seele der Party.', dimension: 'E', keyed: 'plus' },
  { id: 50, text: 'Ich spreche nicht viel.', dimension: 'E', keyed: 'minus' },
  { id: 51, text: 'Ich fühle mich wohl unter Menschen.', dimension: 'E', keyed: 'plus' },
  { id: 52, text: 'Ich halte mich im Hintergrund.', dimension: 'E', keyed: 'minus' },
  { id: 53, text: 'Ich beginne Gespräche.', dimension: 'E', keyed: 'plus' },
  { id: 54, text: 'Ich habe wenig zu sagen.', dimension: 'E', keyed: 'minus' },
  { id: 55, text: 'Ich spreche mit vielen verschiedenen Menschen auf Partys.', dimension: 'E', keyed: 'plus' },
  { id: 56, text: 'Ich mag es nicht, die Aufmerksamkeit auf mich zu ziehen.', dimension: 'E', keyed: 'minus' },
  { id: 57, text: 'Ich ergreife die Initiative.', dimension: 'E', keyed: 'plus' },
  { id: 58, text: 'Ich bin ruhig bei Fremden.', dimension: 'E', keyed: 'minus' },
  { id: 59, text: 'Ich weiß, wie man eine Party in Schwung bringt.', dimension: 'E', keyed: 'plus' },
  { id: 60, text: 'Ich fühle mich in großen Gruppen nicht wohl.', dimension: 'E', keyed: 'minus' },
  { id: 61, text: 'Ich spreche Fremde an.', dimension: 'E', keyed: 'plus' },
  { id: 62, text: 'Ich vermeide Menschenmengen.', dimension: 'E', keyed: 'minus' },
  { id: 63, text: 'Ich mache Freunde leicht.', dimension: 'E', keyed: 'plus' },
  { id: 64, text: 'Ich lache viel.', dimension: 'E', keyed: 'plus' },
  { id: 65, text: 'Ich entferne mich von anderen.', dimension: 'E', keyed: 'minus' },
  { id: 66, text: 'Ich habe eine dominante Persönlichkeit.', dimension: 'E', keyed: 'plus' },
  { id: 67, text: 'Ich bin voll von Energie.', dimension: 'E', keyed: 'plus' },
  { id: 68, text: 'Ich suche Abenteuer.', dimension: 'E', keyed: 'plus' },
  { id: 69, text: 'Ich verstecke mich vor anderen.', dimension: 'E', keyed: 'minus' },
  { id: 70, text: 'Ich fühle mich wohl mit mir selbst.', dimension: 'E', keyed: 'plus' },
  { id: 71, text: 'Ich warte darauf, dass andere den Weg zeigen.', dimension: 'E', keyed: 'minus' },
  { id: 72, text: 'Ich suche Aufregung.', dimension: 'E', keyed: 'plus' },

  // AGREEABLENESS (A) - 24 questions
  { id: 73, text: 'Ich interessiere mich für Menschen.', dimension: 'A', keyed: 'plus' },
  { id: 74, text: 'Ich beleidige Menschen.', dimension: 'A', keyed: 'minus' },
  { id: 75, text: 'Ich fühle mit anderen mit.', dimension: 'A', keyed: 'plus' },
  { id: 76, text: 'Ich interessiere mich nicht für die Probleme anderer.', dimension: 'A', keyed: 'minus' },
  { id: 77, text: 'Ich habe ein weiches Herz.', dimension: 'A', keyed: 'plus' },
  { id: 78, text: 'Ich bin nicht wirklich an anderen interessiert.', dimension: 'A', keyed: 'minus' },
  { id: 79, text: 'Ich nehme mir Zeit für andere.', dimension: 'A', keyed: 'plus' },
  { id: 80, text: 'Ich spüre die Emotionen anderer nicht.', dimension: 'A', keyed: 'minus' },
  { id: 81, text: 'Ich beruhige andere.', dimension: 'A', keyed: 'plus' },
  { id: 82, text: 'Ich bin nicht wirklich interessiert an anderen.', dimension: 'A', keyed: 'minus' },
  { id: 83, text: 'Ich kümmere mich um andere.', dimension: 'A', keyed: 'plus' },
  { id: 84, text: 'Ich versuche nicht hilfreich zu sein.', dimension: 'A', keyed: 'minus' },
  { id: 85, text: 'Ich bin respektvoll gegenüber anderen.', dimension: 'A', keyed: 'plus' },
  { id: 86, text: 'Ich halte Menschen auf Distanz.', dimension: 'A', keyed: 'minus' },
  { id: 87, text: 'Ich akzeptiere Menschen so wie sie sind.', dimension: 'A', keyed: 'plus' },
  { id: 88, text: 'Ich mache andere sich schlecht fühlen.', dimension: 'A', keyed: 'minus' },
  { id: 89, text: 'Ich hasse zu sehen, wie andere leiden.', dimension: 'A', keyed: 'plus' },
  { id: 90, text: 'Ich suche nach Fehlern bei anderen.', dimension: 'A', keyed: 'minus' },
  { id: 91, text: 'Ich glaube, dass andere gute Absichten haben.', dimension: 'A', keyed: 'plus' },
  { id: 92, text: 'Ich sage negative Dinge über Menschen.', dimension: 'A', keyed: 'minus' },
  { id: 93, text: 'Ich vertraue darauf, was Menschen sagen.', dimension: 'A', keyed: 'plus' },
  { id: 94, text: 'Ich misstraue Menschen.', dimension: 'A', keyed: 'minus' },
  { id: 95, text: 'Ich behandle alle gleich.', dimension: 'A', keyed: 'plus' },
  { id: 96, text: 'Ich fühle mich anderen überlegen.', dimension: 'A', keyed: 'minus' },

  // NEUROTICISM (N) - 23 questions
  { id: 97, text: 'Ich fühle mich oft gestresst.', dimension: 'N', keyed: 'plus' },
  { id: 98, text: 'Ich bin entspannt die meiste Zeit.', dimension: 'N', keyed: 'minus' },
  { id: 99, text: 'Ich mache mir über Dinge Sorgen.', dimension: 'N', keyed: 'plus' },
  { id: 100, text: 'Ich bin selten traurig.', dimension: 'N', keyed: 'minus' },
  { id: 101, text: 'Ich bin leicht beunruhigt.', dimension: 'N', keyed: 'plus' },
  { id: 102, text: 'Ich werde selten ärgerlich.', dimension: 'N', keyed: 'minus' },
  { id: 103, text: 'Ich werde oft emotional.', dimension: 'N', keyed: 'plus' },
  { id: 104, text: 'Ich habe häufige Stimmungsschwankungen.', dimension: 'N', keyed: 'plus' },
  { id: 105, text: 'Ich verliere meine Beherrschung.', dimension: 'N', keyed: 'plus' },
  { id: 106, text: 'Ich bin leicht zu verärgern.', dimension: 'N', keyed: 'plus' },
  { id: 107, text: 'Ich werde leicht wütend.', dimension: 'N', keyed: 'plus' },
  { id: 108, text: 'Ich gerate in Panik leicht.', dimension: 'N', keyed: 'plus' },
  { id: 109, text: 'Ich fühle mich oft niedergeschlagen.', dimension: 'N', keyed: 'plus' },
  { id: 110, text: 'Ich werde von meinen Emotionen überwältigt.', dimension: 'N', keyed: 'plus' },
  { id: 111, text: 'Ich bin oft in schlechter Laune.', dimension: 'N', keyed: 'plus' },
  { id: 112, text: 'Ich bin entspannt und handle Stress gut.', dimension: 'N', keyed: 'minus' },
  { id: 113, text: 'Ich fühle mich oft ängstlich.', dimension: 'N', keyed: 'plus' },
  { id: 114, text: 'Ich bin oft pessimistisch.', dimension: 'N', keyed: 'plus' },
  { id: 115, text: 'Ich fühle mich wohl mit mir selbst.', dimension: 'N', keyed: 'minus' },
  { id: 116, text: 'Ich fühle mich oft unsicher.', dimension: 'N', keyed: 'plus' },
  { id: 117, text: 'Ich mache mir Sorgen über die Zukunft.', dimension: 'N', keyed: 'plus' },
  { id: 118, text: 'Ich habe Angst vor Versagen.', dimension: 'N', keyed: 'plus' },
  { id: 119, text: 'Ich fühle mich oft hilflos.', dimension: 'N', keyed: 'plus' },
  { id: 120, text: 'Ich bin emotional stabil.', dimension: 'N', keyed: 'minus' },
];

export function getQuestionsByDimension(dimension: 'O' | 'C' | 'E' | 'A' | 'N'): Question[] {
  return questions.filter((q) => q.dimension === dimension);
}

export function getQuestionById(id: number): Question | undefined {
  return questions.find((q) => q.id === id);
}
