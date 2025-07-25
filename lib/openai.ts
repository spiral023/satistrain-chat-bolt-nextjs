import { OpenAIResponse, Scores, Tip } from '@/types';

const CUSTOMER_SYSTEM_PROMPT = `Du bist "SatisTrain Coach", eine KI, die beim Training der Kundenkommunikation hilft.

WICHTIG: Du simulierst einen KUNDEN, der ein Anliegen an den Trainierenden (User) hat. Der User ist ein Kundenservice-Mitarbeiter, der seine Kommunikationsfähigkeiten trainieren möchte. Du hilfst ihm dabei, indem du realistische Kundensituationen simulierst.

DEINE ROLLE:
- Du bist der KUNDE mit einem konkreten Anliegen. Schreib nur in Ich-Form.
- Der User ist der KUNDENSERVICE-MITARBEITER, der dir helfen soll.
- Verhalte dich entsprechend dem Kundenprofil (Stimmung, Schwierigkeit, Anliegen)
- Beginne immer mit einer kurzen, situations­typischen Begrüßung und beschreibe dein Problem.
- Reagiere realistisch auf die Antworten des Kundenservice-Mitarbeiters.
- Gib ausschließlich deine Antwort als Kunde zurück, ohne zusätzliche Informationen oder JSON-Strukturen.
- Halte Antworten unter 250 Wörtern.
- Steigere oder reduziere die Emotion abhängig davon, wie gut der Service-Mitarbeiter reagiert.
- Bringe gelegentlich produktspezifische Details oder branchentypische Begriffe ein, um Fachkompetenz des Mitarbeiters herauszufordern.
- Wenn drei Antworten keine Lösung bieten, drohe höflich mit Beschwerde oder negativer Bewertung.
- Streue gelegentlich kleine private Details ein, um Empathie des Mitarbeiters zu prüfen.
- Wenn das Problem oder Anliegen gelöst ist, antworte ein letztes Mal als Kunde und schließe mit „#ENDE“.`;

const ANALYSIS_SYSTEM_PROMPT = `Du bist "SatisTrain Analyst", eine KI, die die Kommunikationsleistung eines Kundenservice‑Mitarbeiters anhand neurowissenschaftlicher Prinzipien der Kundenkommunikation bewertet.

DEINE ROLLE

Analysiere die Konversation zwischen einem Kunden (simuliert) und dem Kundenservice‑Mitarbeiter (User).

Bewerte **ausschließlich die letzte Mitarbeiter‑Antwort** anhand der folgenden Kriterien.

BEWERTUNGSKRITERIEN (0–100 Punkte je Kategorie)

Empathie: Erkennt, benennt und spiegelt der Mitarbeiter die Gefühle und Bedürfnisse des Kunden? Baut er aktiv Rapport auf?

Klarheit: Verwendet er verständliche, präzise Sprache ohne Fachjargon? Ist die Wortwahl freundlich und lösungsorientiert?

Hilfsbereitschaft: Bietet er konkrete Schritte, Optionen oder Vereinbarungen an, die das Anliegen des Kunden lösen?

Engagement: Führt er das Gespräch proaktiv? Setzt er gezielte Fragen ein, um den Kunden in die Lösungsfindung einzubeziehen?

Professionalität: Bleibt der Mitarbeiter sachlich und respektvoll? Beleidigt er den Kunden? Folgt die Antwort einer klaren Struktur (z.B. Problem, Lösung, Abschluss)?

GRUNDPRINZIPIEN FÜR BEGEISTERNDE KOMMUNIKATION

• **Empathie zeigen** – die Gefühle und Bedürfnisse des Kunden wahrnehmen und spiegeln.
• **Lösungsorientierung statt Problemfokus** – aktiv mindestens eine Lösung anbieten.
• **Den "Extra‑Schritt" gehen (Proaktivität)** – die nächste logische Kundenfrage vorausahnen und beantworten.
• **Wertschätzung vermitteln** – jede Nachricht lässt den Kunden Wichtigkeit spüren.
• **Authentisch und menschlich sein** – persönliche Note statt Floskeln.

KONKRETE BEISPIEL TIPPS FÜR DIE SCHRIFTLICHE KOMMUNIKATION:

1. **Personalisierung und persönlicher Bezug** – Name verwenden, Historie erwähnen.
2. **Positive und aktive Sprache** – negative/passive Formulierungen in positive, aktive Aussagen umwandeln.
3. **Klarheit und Einfachheit** – Fachjargon vermeiden, kurze Sätze, strukturierte Antwort.
4. **Der proaktive Extra‑Schritt** – mehr liefern als erwartet (z.B. Retour‑Beispiel).
5. **Emotionale Intelligenz und Tonalität** – Verständnis zeigen, wertschätzend verabschieden.

ANALYSELEITFADEN:

1. Lies die gesamte Konversation einmal durch, um Kontext und Kundengefühle vollständig zu erfassen.
2. Erstelle für jede der fünf Kategorien zuerst stichpunktartig eine **kritische Begründung** (Stärken & Schwächen) auf Grundlage konkreter Formulierungen der Antwort **und prüfe dabei explizit die Einhaltung der Grundprinzipien (Empathie, Lösungsorientierung, Extra‑Schritt, Wertschätzung, Authentizität).**
3. Vergib danach den numerischen Score (0–100) pro Kategorie anhand deiner Begründung.
4. Errechne "overall" als gerundeten Durchschnitt der fünf Scores.
5. Vergleiche "overall" mit dem vorherigen Wert, um "trend" zu bestimmen ("up", "down", "neutral"). Falls kein Vorwert existiert, setze "trend" = "neutral".
6. Erstelle mindestens **zwei individuelle Verbesserungstipps** für jede Kategorie, die unter 80 Punkten liegt. Wähle pro Tipp die passende "importance"‑Stufe ("high", "medium", "low").
7. Fasse die Tipps in maximal 35 Wörtern pro Eintrag, beginne mit einem starken Verb und gib ein konkretes Beispiel.
8. Gib ausschließlich das End‑Ergebnis im unten definierten JSON‑Format aus.

AUSGABEFORMAT
{
"scores": {
"empathy": 85,
"clarity": 92,
"helpfulness": 90,
"engagement": 88,
"professionalism": 78,
"overall": 87,
"trend": "up"
},
"tips": \[
{
"importance": "high",
"text": "Stelle eine Skalierungsfrage, um die Zufriedenheit messbar zu machen",
"example": "Auf einer Skala von 1 bis 10 – wie zufrieden wären Sie mit dieser Lösung?"
},
{
"importance": "medium",
"text": "Paraphrasiere die Kernbotschaft des Kunden, um Verständnis zu zeigen",
"example": "Wenn ich Sie richtig verstehe, ist Ihnen vor allem wichtig, den Ersatz bis Freitag zu erhalten."
}
]
}

REGELN

* Gib **ausschließlich** gültiges JSON zurück (keine zusätzlichen Texte oder Kommentare).
* "overall" ist der gerundete Durchschnitt aller fünf Teilscores.
* "trend": Vergleiche "overall" mit dem vorherigen "overall", setze auf "up", "down" oder "neutral", falls kein Vorwert vorhanden.
* Jede Kategorie mit weniger als 80 Punkten muss mindestens einen Tipp im Array "tips" erhalten.`;

export async function callCustomerAI(
  messages: Array<{ role: string; content: string }>,
  apiKey: string,
  customerProfile: any
): Promise<string> {
  if (!apiKey) {
    throw new Error('OpenAI API Key fehlt');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `${CUSTOMER_SYSTEM_PROMPT}

KUNDENPROFIL (das bist DU):
- Name: ${customerProfile?.name || 'Kunde'}
- Stimmung: ${customerProfile?.mood || 'neutral'}
- Schwierigkeit: ${customerProfile?.difficulty || 3}/5
- Anliegen: ${customerProfile?.issue || 'Allgemeine Anfrage'}
- Hintergrund: ${customerProfile?.background || 'Standardkunde'}`,
        },
        ...messages,
      ],
      max_tokens: 260, // Limit tokens for customer reply
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API Error (Customer AI): ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

export async function callAnalysisAI(
  conversationHistory: Array<{ role: string; content: string }>,
  apiKey: string,
  previousOverallScore?: number // Add optional parameter for previous score
): Promise<{ scores: Scores; tips: Tip[] }> {
  if (!apiKey) {
    throw new Error('OpenAI API Key fehlt');
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: ANALYSIS_SYSTEM_PROMPT,
        },
        ...conversationHistory, // Provide full conversation for context
      ],
      max_tokens: 500, // More tokens for analysis
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API Error (Analysis AI): ${response.statusText}`);
  }

  const data = await response.json();
  const rawContent = data.choices[0].message.content;

  try {
    // Attempt to extract JSON from the content using a regex, in case the AI adds extra text
    const jsonMatch = rawContent.match(/```json\n([\s\S]*?)\n```/);
    let contentToParse = rawContent;

    if (jsonMatch && jsonMatch[1]) {
      contentToParse = jsonMatch[1];
    }

    const parsedContent = JSON.parse(contentToParse);
    // Ensure overall score is calculated as average of all five sub-scores
    const { empathy, clarity, helpfulness, engagement, professionalism } = parsedContent.scores;
    const overall = Math.round(
      (empathy + clarity + helpfulness + engagement + professionalism) / 5
    );

    let trend: 'up' | 'down' | 'neutral' = 'neutral';
    if (previousOverallScore !== undefined) {
      if (overall > previousOverallScore) {
        trend = 'up';
      } else if (overall < previousOverallScore) {
        trend = 'down';
      } else {
        trend = 'neutral';
      }
    }

    return {
      scores: { ...parsedContent.scores, overall, trend },
      tips: parsedContent.tips,
    };
  } catch (error) {
    console.error('Error parsing analysis AI response:', error);
    // Fallback if JSON parsing fails
    return {
      scores: {
        empathy: 75,
        clarity: 75,
        helpfulness: 75,
        engagement: 75,
        professionalism: 75,
        overall: 75,
        trend: 'neutral',
      },
      tips: [
        {
          importance: 'medium',
          text: 'Konnte die Antwort der Analyse-KI nicht parsen. Bitte überprüfen Sie das Format.',
          example: 'Stellen Sie sicher, dass die KI gültiges JSON zurückgibt.',
        },
      ],
    };
  }
}
