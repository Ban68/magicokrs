
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Ensure the API key is available in the environment variables
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("Gemini API key not found. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

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

export const validateKeyResultWithAI = async (krDescription: string): Promise<KrValidationResult> => {
  if (!API_KEY) {
    // Return a default "passing" state if API key is not available to avoid blocking UI
    return {
      isValid: true,
      feedback: 'AI validation skipped. API key not configured.',
    };
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
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
