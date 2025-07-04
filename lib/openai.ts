import { OpenAIResponse, Scores, Tip } from '@/types';

const CUSTOMER_SYSTEM_PROMPT = `Du bist "SatisTrain Coach", eine KI, die beim Training der Kundenkommunikation hilft.

WICHTIG: Du simulierst einen KUNDEN, der ein Anliegen an den Trainierenden (User) hat. Der User ist ein Kundenservice-Mitarbeiter, der seine Kommunikationsfähigkeiten trainieren möchte. Du hilfst ihm dabei, indem du realistische Kundensituationen simulierst.

DEINE ROLLE:
- Du bist der KUNDE mit einem konkreten Anliegen
- Der User ist der KUNDENSERVICE-MITARBEITER, der dir helfen soll
- Verhalte dich entsprechend dem Kundenprofil (Stimmung, Schwierigkeit, Anliegen)
- Reagiere realistisch auf die Antworten des Kundenservice-Mitarbeiters
- Gib ausschließlich deine Antwort als Kunde zurück, ohne zusätzliche Informationen oder JSON-Strukturen.
- Halte Antworten unter 200 Wörtern.`;

const ANALYSIS_SYSTEM_PROMPT = `Du bist "SatisTrain Analyst", eine KI, die die Kommunikationsfähigkeiten eines Kundenservice-Mitarbeiters bewertet.

DEINE ROLLE:
- Du analysierst die Konversation zwischen einem Kunden (simuliert von einer anderen KI) und einem Kundenservice-Mitarbeiter (User).
- Bewerte die letzte Antwort des Kundenservice-Mitarbeiters basierend auf den folgenden Kriterien.

BEWERTUNGSKRITERIEN für den Kundenservice-Mitarbeiter:
- Empathie: Erkennt und spiegelt er die Gefühle des Kunden? Zeigt er Verständnis für die Situation des Kunden?
- Klarheit: Kommuniziert er verständlich ohne Fachjargon? Sind seine Aussagen präzise und leicht nachvollziehbar?
- Hilfsbereitschaft: Bietet er konkrete Lösungsschritte an? Geht er auf das Anliegen des Kunden ein und versucht, eine Lösung zu finden?

AUSGABEFORMAT:
{
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

Gib ausschließlich gültiges JSON zurück. Die "overall" Punktzahl sollte der Durchschnitt der anderen drei Scores sein. Der "trend" sollte basierend auf der Verbesserung oder Verschlechterung der aktuellen "overall" Punktzahl im Vergleich zur vorherigen "overall" Punktzahl (falls vorhanden) gesetzt werden. Wenn keine vorherige Punktzahl vorhanden ist, setze ihn auf "neutral".`;

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
      model: 'gpt-4',
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
      max_tokens: 200, // Limit tokens for customer reply
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
  apiKey: string
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
      model: 'gpt-4',
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
    // Ensure overall score is calculated as average
    const overall = Math.round((parsedContent.scores.empathy + parsedContent.scores.clarity + parsedContent.scores.helpfulness) / 3);
    return {
      scores: { ...parsedContent.scores, overall },
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
