import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

interface KrValidationResult {
  isValid: boolean;
  feedback: string;
}

const systemInstruction = `You are an expert OKR (Objectives and Key Results) coach.
Your task is to analyze a user-provided Key Result description.
A good Key Result is a measurable OUTCOME, not a task or activity. It must be quantifiable and verifiable.
- Bad KR: "Help the sales team." (Vague, not measurable)
- Good KR: "Increase enterprise sales qualified leads by 15%." (Specific, measurable outcome)

Analyze the user's text and determine if it's a valid Key Result.
Respond ONLY with a JSON object in the following format:
{
  "isValid": boolean, // true if it's a good KR, false otherwise
  "feedback": "string" // A concise, one-sentence explanation of your reasoning. If it's bad, explain why and suggest what a better KR would focus on (the outcome).
}
Do not include any other text or markdown formatting in your response.`;


// Define a variable to hold the Gemini client instance.
// It will be lazily initialized on the first API call.
let ai: GoogleGenAI | null;

const getAiClient = (): GoogleGenAI | null => {
  // If the client is already initialized, return it.
  if (ai) {
    return ai;
  }

  const apiKey = process.env.API_KEY;
  
  if (apiKey) {
    try {
        ai = new GoogleGenAI({ apiKey });
        return ai;
    } catch (error) {
        console.error("Failed to initialize GoogleGenAI client:", error);
        ai = null; // Mark as failed to prevent retries.
        return null;
    }
  } else {
    // This path is taken if the API key is not available.
    // We don't throw an error here to prevent crashing the app.
    // The calling function will handle the null client.
    console.error("Gemini API key not found. Please set the API_KEY environment variable.");
    return null;
  }
};


export const validateKeyResultWithAI = async (krDescription: string): Promise<KrValidationResult> => {
  const geminiClient = getAiClient();
  
  if (!geminiClient) {
    // Return a default "passing" state if API key is not available, to avoid blocking the UI.
    return {
      isValid: true,
      feedback: 'AI validation skipped. API key not configured.',
    };
  }

  try {
    const response: GenerateContentResponse = await geminiClient.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17",
      contents: `Analyze this Key Result: "${krDescription}"`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    let jsonStr = response.text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    const parsedData = JSON.parse(jsonStr) as KrValidationResult;
    return parsedData;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get validation from AI.");
  }
};
