import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  const { OPENAI_SECRET_APIKEY, OPENAI_SECRET_APIKEY_PW } = process.env;

  if (!OPENAI_SECRET_APIKEY || !OPENAI_SECRET_APIKEY_PW) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Umgebungsvariablen sind nicht auf dem Server konfiguriert.' }),
    };
  }

  try {
    const { secretPw } = JSON.parse(event.body || '{}');

    if (!secretPw) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Secret PW fehlt im Request Body.' }),
      };
    }

    if (secretPw === OPENAI_SECRET_APIKEY_PW) {
      return {
        statusCode: 200,
        body: JSON.stringify({ apiKey: OPENAI_SECRET_APIKEY }),
      };
    } else {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Ungültiges Secret PW.' }),
      };
    }
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Ungültiger Request Body.' }),
    };
  }
};

export { handler };
