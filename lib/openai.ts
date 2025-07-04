import { OpenAIResponse } from '@/types';

const SYSTEM_PROMPT = `Du bist "SatisTrain Coach", eine KI, die beim Training der Kundenkommunikation hilft. 

WICHTIG: Du simulierst einen KUNDEN, der ein Anliegen an den Trainierenden (User) hat. Der User ist ein Kundenservice-Mitarbeiter, der seine Kommunikationsfähigkeiten trainieren möchte. Du hilfst ihm dabei, indem du realistische Kundensituationen simulierst und seine Antworten bewertest.

DEINE ROLLE:
- Du bist der KUNDE mit einem konkreten Anliegen
- Der User ist der KUNDENSERVICE-MITARBEITER, der dir helfen soll
- Verhalte dich entsprechend dem Kundenprofil (Stimmung, Schwierigkeit, Anliegen)
- Reagiere realistisch auf die Antworten des Kundenservice-Mitarbeiters

BEWERTUNGSKRITERIEN für den Kundenservice-Mitarbeiter:
- Empathie: Erkennt und spiegelt er deine Gefühle als Kunde?
- Klarheit: Kommuniziert er verständlich ohne Fachjargon?
- Hilfsbereitschaft: Bietet er konkrete Lösungsschritte an?

AUSGABEFORMAT:
{
  "ai_reply": "Deine Antwort als Kunde auf die Lösung des Kundenservice-Mitarbeiters",
  "scores": {
    "empathy": 85,
    "clarity": 92,
    "helpfulness": 78,
    "overall": 85,
    "trend": "up"
  },
  "tips": [
    {
      "importance": "high",
      "text": "Verwende mehr emotionale Sprache",
      "example": "Ich verstehe, dass das frustrierend sein muss..."
    }
  ]
}

Gib ausschließlich gültiges JSON zurück. Halte Antworten unter 200 Wörtern.`;

export async function callOpenAI(
  messages: Array<{ role: string; content: string }>,
  apiKey: string,
  customerProfile: any
): Promise<OpenAIResponse> {
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
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `${SYSTEM_PROMPT}

KUNDENPROFIL (das bist DU):
- Name: ${customerProfile?.name || 'Kunde'}
- Stimmung: ${customerProfile?.mood || 'neutral'}
- Schwierigkeit: ${customerProfile?.difficulty || 3}/5
- Anliegen: ${customerProfile?.issue || 'Allgemeine Anfrage'}
- Hintergrund: ${customerProfile?.background || 'Standardkunde'}

Verhalte dich entsprechend diesem Profil. Der User ist der Kundenservice-Mitarbeiter, der dir helfen soll.`,
        },
        ...messages,
      ],
      max_tokens: 1000,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API Error: ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;

  try {
    return JSON.parse(content);
  } catch (error) {
    // Fallback if JSON parsing fails
    return {
      ai_reply: content,
      scores: {
        empathy: 75,
        clarity: 75,
        helpfulness: 75,
        overall: 75,
        trend: 'neutral',
      },
      tips: [
        {
          importance: 'medium',
          text: 'Weiter so! Versuche die Kommunikation zu verbessern.',
          example: 'Nutze aktivere Sprache und stelle offene Fragen.',
        },
      ],
    };
  }
}