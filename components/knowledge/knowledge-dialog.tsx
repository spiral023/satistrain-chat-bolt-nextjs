import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  MessageCircle,
  Users,
  Smile,
  Gift,
  Compass,
  Phone,
  Ear,
  HelpCircle,
  Shield,
  Brain,
  Activity,
  BarChart,
  Globe,
  Cpu,
  Lock,
  Handshake,
  Bot,
} from "lucide-react";

const knowledgeData = [
  {
    category: "Psychologische Grundlagen der Kommunikation",
    icon: <Brain className="h-5 w-5 text-indigo-600" />,
    points: [
      "**Resonanzprinzip:** Vertrauen entsteht durch empathisches Einstimmen auf den Gesprächspartner.",
      "**Priming-Effekt:** Die Wortwahl und Formulierungen beeinflussen die Wahrnehmung und Reaktion des Kunden.",
      "**Mehrere Ebenen:** Kommunikation findet immer gleichzeitig auf der verbalen (was gesagt wird) und nonverbalen (wie es gesagt wird) Ebene statt.",
    ],
  },
  {
    category: "Kommunikationskanäle und Großsprachen",
    icon: <MessageCircle className="h-5 w-5 text-blue-500" />,
    points: [
      "**Bewusste & Unbewusste Kanäle:** Verbale Aussagen sind bewusst, während nonverbale Signale oft unbewusst gesendet und empfangen werden.",
      "**Großsprachen:** Blickkontakt, Stimme und Körpersprache sind entscheidend für die Beziehungsebene.",
      "**Kongruenz:** Die Übereinstimmung von verbalen und nonverbalen Signalen schafft Glaubwürdigkeit und Vertrauen.",
    ],
  },
  {
    category: "Rapport aufbauen: Joining – Pacing – Leading",
    icon: <Handshake className="h-5 w-5 text-lime-600" />,
    points: [
      "**Joining:** Emotionales Ankommen und eine positive Atmosphäre schaffen.",
      "**Pacing:** Sich an die Sprache, den Tonfall und die Körperhaltung des Kunden anpassen, um eine Verbindung herzustellen.",
      "**Leading:** Das Gespräch durch lösungsorientierte Fragen und ethische Vorschläge gezielt in eine konstruktive Richtung lenken.",
    ],
  },
  {
    category: "Paraphrasieren",
    icon: <Ear className="h-5 w-5 text-purple-500" />,
    points: [
      "**Verständnissicherung:** Die Aussage des Kunden mit eigenen Worten wiederholen, um sicherzustellen, dass man sie korrekt verstanden hat.",
      "**Deeskalation:** Bringt emotionale Gespräche auf eine sachliche Ebene zurück.",
      "**Wertschätzung:** Zeigt dem Kunden, dass man ihm aufmerksam zuhört und seine Anliegen ernst nimmt.",
    ],
  },
  {
    category: "Fragetechniken",
    icon: <HelpCircle className="h-5 w-5 text-teal-500" />,
    points: [
      "**Offene Fragen:** Dienen dem Informationsgewinn und erfassen die Sichtweise des Kunden.",
      "**Geschlossene Fragen:** Führen zu klaren Ja-/Nein-Antworten und helfen, Entscheidungen herbeizuführen.",
      "**Lösungsorientierte Fragen:** Lenken den Fokus weg vom Problem und hin zu zukünftigen Möglichkeiten.",
      "**Zielfragen:** Helfen dabei, ein gemeinsames und klares Ziel für das Gespräch zu definieren.",
      "**Skalierungsfragen:** Machen subjektive Einschätzungen messbar und greifbar (z.B. „Auf einer Skala von 1 bis 10...“).",
      "**Konkretisierungsfragen:** Klären vage oder allgemeine Aussagen und bringen Details ans Licht.",
      "**Metaphern- und Schlüsselwortfragen:** Greifen die Sprache des Kunden auf, um Rapport zu stärken.",
      "**Zirkuläre Fragen:** Regen zum Perspektivwechsel an, indem sie die Sichtweise Dritter einbeziehen.",
      "**Verschlechterungsfragen:** Machen dem Kunden bewusst, welche Ressourcen er bereits hat, um eine Situation zu meistern.",
    ],
  },
  {
    category: "Gesprächsstruktur in fünf Phasen",
    icon: <Compass className="h-5 w-5 text-orange-500" />,
    points: [
      "**1. Beziehungsaufbau:** Vertrauen und eine positive Gesprächsatmosphäre schaffen.",
      "**2. Thema klären:** Das Anliegen des Kunden genau erfassen und durch Paraphrasieren bestätigen.",
      "**3. Zieldefinition:** Eine klare und gemeinsame Zielvereinbarung für das Gespräch treffen.",
      "**4. Lösungsphase:** Mit gezielten Fragen und Vorschlägen gemeinsam eine passende Lösung erarbeiten.",
      "**5. Abschluss:** Die Zufriedenheit des Kunden prüfen, die nächsten Schritte fixieren und sich wertschätzend verabschieden.",
    ],
  },
  {
    category: "Grundlagen der Kommunikation",
    icon: <MessageCircle className="h-5 w-5 text-blue-500" />,
    points: [
      "**Aktives Zuhören:** Konzentrieren Sie sich voll und ganz auf den Kunden, verstehen Sie seine Anliegen und fassen Sie sie zusammen, um sicherzustellen, dass Sie alles richtig verstanden haben.",
      "**Empathie zeigen:** Versetzen Sie sich in die Lage des Kunden. Zeigen Sie Verständnis für seine Frustration oder Verwirrung.",
      "**Klare und einfache Sprache:** Vermeiden Sie Fachjargon. Drücken Sie sich so aus, dass der Kunde Sie mühelos versteht.",
    ],
  },
  {
    category: "Umgang mit schwierigen Kunden",
    icon: <Users className="h-5 w-5 text-red-500" />,
    points: [
      "**Ruhig bleiben:** Lassen Sie sich nicht von der Wut des Kunden anstecken. Eine ruhige und professionelle Haltung deeskaliert die Situation.",
      "**Verantwortung übernehmen:** Auch wenn das Problem nicht direkt durch Sie verursacht wurde, entschuldigen Sie sich für die Unannehmlichkeiten.",
      "**Lösungsorientiert handeln:** Konzentrieren Sie sich darauf, eine Lösung zu finden, anstatt die Schuld zuzuweisen.",
    ],
  },
  {
    category: "Positive Gesprächsführung",
    icon: <Smile className="h-5 w-5 text-green-500" />,
    points: [
      "**Positive Formulierungen:** Statt \"Das geht nicht\" sagen Sie \"Lassen Sie uns sehen, was wir tun können.\"",
      "**Den Kundennamen verwenden:** Eine persönliche Ansprache schafft eine bessere Verbindung.",
      "**Das Gespräch positiv beenden:** Fassen Sie die besprochenen Lösungen zusammen und bedanken Sie sich für das Gespräch.",
    ],
  },
  {
    category: "Kundenbegeisterung & Wow‑Effekte",
    icon: <Gift className="h-5 w-5 text-pink-500" />,
    points: [
      "**Überraschungsmomente schaffen:** Kleine unerwartete Extras, die den Kunden positiv überraschen (z. B. handgeschriebene Dankeskarte).",
      "**Emotionale Verbindung aufbauen:** Geschichten, die Nutzen lebendig machen und positive Gefühle auslösen.",
      "**Proaktives Handeln:** Bedürfnisse antizipieren, bevor der Kunde sie äußert.",
    ],
  },
  {
    category: "Customer Journey & Touchpoints",
    icon: <Compass className="h-5 w-5 text-orange-500" />,
    points: [
      "**Konsistentes Markenerlebnis:** Auf allen Kanälen einheitliche Botschaften und Tonalität gewährleisten.",
      "**Identifizierung kritischer Momente:** ‚Moments of Truth‘, die den Gesamteindruck prägen.",
      "**After‑Sales Betreuung:** Follow‑up, um Zufriedenheit sicherzustellen und Empfehlungen zu generieren.",
    ],
  },
  {
    category: "Kanalspezifische Kommunikation (Telefon, E‑Mail, Chat, Social Media)",
    icon: <Phone className="h-5 w-5 text-yellow-500" />,
    points: [
      "**Telefon:** Lächeln hörbar machen, Pausen nutzen, klar artikulieren.",
      "**E‑Mail:** Prägnante Betreffzeilen, strukturierte Absätze, höfliche Abschlussformel.",
      "**Chat & Social Media:** Kurz, schnell, freundlich. Emojis sparsam und zielgruppengerecht einsetzen.",
    ],
  },
  {
    category: "Nonverbale Kommunikation",
    icon: <Ear className="h-5 w-5 text-purple-500" />,
    points: [
      "**Körpersprache spiegeln:** Offene Haltung, Blickkontakt, freundliches Nicken.",
      "**Stimme & Tonfall:** Geschwindigkeit, Lautstärke und Betonung situationsgerecht anpassen.",
      "**Micro‑Signals beachten:** Gesichtsausdruck und Gestik des Kunden lesen (Video‑Call, Vor‑Ort).",
    ],
  },
  {
    category: "Storytelling & Nutzenargumentation",
    icon: <BookOpen className="h-5 w-5 text-blue-700" />,
    points: [
      "**Heldenreise:** Kunde als Held, Produkt als Helfer.",
      "**Evidenz nutzen:** Daten, Fallstudien, Social Proof.",
      "**Nutzen > Features:** Fokus auf Ergebnis und Mehrwert.",
    ],
  },
  {
    category: "Beschwerdemanagement & Service Recovery",
    icon: <Shield className="h-5 w-5 text-red-600" />,
    points: [
      "**LAST‑Modell:** Listen, Acknowledge, Solve, Thank.",
      "**24‑Stunden‑Regel:** Rückmeldung spätestens am nächsten Werktag.",
      "**Wiedergutmachung:** Kulanzgeste, die den wahrgenommenen Schaden übertrifft.",
    ],
  },
  {
    category: "Psychologie & Verhaltensökonomie",
    icon: <Brain className="h-5 w-5 text-indigo-600" />,
    points: [
      "**Prinzip der Reziprozität:** Kleine Gefälligkeiten erzeugen Gegenseitigkeit.",
      "**Anchoring:** Vergleichsanker setzen, um Wert wahrzunehmen.",
      "**Loss Aversion:** Aufzeigen, was der Kunde verliert, wenn er nicht handelt.",
    ],
  },
  {
    category: "Voice of the Customer & Feedback‑Loops",
    icon: <Activity className="h-5 w-5 text-green-700" />,
    points: [
      "**Net Promoter Score (NPS) regelmäßig messen.**",
      "**Closed‑Loop Feedback:** Rückmeldung an Kunden, wie Feedback umgesetzt wurde.",
      "**Sentiment‑Analyse aus Social Listening einbeziehen.**",
    ],
  },
  {
    category: "Messung & KPIs (CSAT, NPS, CES)",
    icon: <BarChart className="h-5 w-5 text-amber-600" />,
    points: [
      "**CSAT:** Zufriedenheit nach Interaktion (Skala 1‑5).",
      "**NPS:** Weiterempfehlungsbereitschaft (‑100 bis +100).",
      "**CES:** Aufwand des Kunden minimieren (Frage „Es war leicht mein Anliegen zu lösen“).",
    ],
  },
  {
    category: "Interkulturelle Kommunikation",
    icon: <Globe className="h-5 w-5 text-cyan-600" />,
    points: [
      "**Hofstede‑Dimensionen verstehen** (z. B. Machtdistanz, Individualismus).",
      "**Lokale Etikette respektieren** (Begrüßung, Feiertage).",
      "**Cultural Intelligence (CQ) entwickeln.**",
    ],
  },
  {
    category: "Digitalisierung & Automatisierung",
    icon: <Cpu className="h-5 w-5 text-gray-600" />,
    points: [
      "**Chatbots** für 24/7 First‑Level‑Support.",
      "**CRM‑Systeme integrieren**, um Konversationen zu zentralisieren.",
      "**Omnichannel‑Plattformen** für nahtlosen Übergang.",
    ],
  },
  {
    category: "Ethik & Datenschutz",
    icon: <Lock className="h-5 w-5 text-slate-600" />,
    points: [
      "**DSGVO‑Konformität sicherstellen** (Einwilligungen, Datenspeicherung).",
      "**Transparenz** bei Datennutzung gewährleisten.",
      "**Fairness und Inklusion** in Kommunikation (sprachliche Diversität).",
    ],
  },
  {
    category: "Konfliktlösung & Verhandlungstechniken",
    icon: <Handshake className="h-5 w-5 text-lime-600" />,
    points: [
      "**Harvard‑Konzept:** Sachgerecht verhandeln, Win‑Win anstreben.",
      "**BATNA ermitteln** (Best Alternative to a Negotiated Agreement).",
      "**Eskalationsstufen** definieren und kommunizieren.",
    ],
  },
  {
    category: "Self‑Service & Proaktive Kommunikation",
    icon: <Bot className="h-5 w-5 text-fuchsia-600" />,
    points: [
      "**Wissensdatenbank & FAQ** aktuell halten.",
      "**Proaktive Benachrichtigungen** bei Lieferverzögerungen.",
      "**Guided Tours & Tutorials**, damit Kunden selbst Lösungen finden.",
    ],
  },
];

export function KnowledgeDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start">
          <BookOpen className="mr-2 h-4 w-4" />
          Wissen
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Wissensdatenbank
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto pr-4 -mr-4">
          <Accordion type="single" collapsible className="w-full">
            {knowledgeData.map((item, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="text-lg font-semibold">
                  <div className="flex items-center">
                    {item.icon}
                    <span className="ml-3">{item.category}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <Card>
                    <CardContent className="pt-6">
                      <ul className="space-y-4">
                        {item.points.map((point, pIndex) => (
                          <li
                            key={pIndex}
                            className="flex items-start"
                            dangerouslySetInnerHTML={{ __html: point }}
                          />
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </DialogContent>
    </Dialog>
  );
}
