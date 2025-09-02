import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY as string,
});

export async function summarizeText(text: string) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Summarize this document:\n\n${text}`,
  });
  return response.text ?? ""; // fallback to empty string if undefined
}

export async function generateTags(text: string) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Generate 5 relevant tags for this text:\n\n${text}`,
  });
  const textResponse = response.text ?? "";
  return textResponse.split(",").map(tag => tag.trim());
}

export async function answerQuestion(docText: string, question: string) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Document: ${docText}\nQuestion: ${question}\nAnswer concisely:`,
  });
  return response.text ?? "";
}
