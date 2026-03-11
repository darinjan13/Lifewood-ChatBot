import { GoogleGenAI } from "@google/genai";
import { FileData } from "../types";

export interface AIResponse {
  text: string;
  generatedImageUrl?: string;
}

export const getGeminiResponse = async (
  userMessage: string, 
  attachments: FileData[] = [],
  toolId: string = 'chat',
  modelId: string = 'gemini-3-flash-preview',
  systemInstruction: string = 'You are Lifewood Intelligence, a proactive innovation partner.'
): Promise<AIResponse> => {
  try {
    // Re-initialize for every call to ensure the latest API key is used
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    
    const isImageMode = toolId === 'image';
    const modelName = isImageMode ? 'gemini-2.5-flash-image' : modelId;
    
    const parts: any[] = [{ text: userMessage }];

    attachments.forEach(file => {
      const base64Data = file.data.split(',')[1] || file.data;
      parts.push({
        inlineData: {
          mimeType: file.mimeType,
          data: base64Data,
        }
      });
    });

    const response = await ai.models.generateContent({
      model: modelName,
      contents: { parts },
      config: {
        systemInstruction: systemInstruction,
        ...(isImageMode && {
          imageConfig: {
            aspectRatio: "1:1"
          }
        })
      },
    });

    let text = response.text || "";
    let generatedImageUrl = undefined;

    // Iterate parts to find images if present (common in flash-image models)
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          generatedImageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }

    if (!text && generatedImageUrl) {
      text = "Generated your visual request.";
    }

    return { 
      text: text || "I'm sorry, I couldn't process that request properly.", 
      generatedImageUrl 
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { 
      text: "I encountered an error. Please check your configuration and try again." 
    };
  }
};