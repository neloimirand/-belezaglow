
import { GoogleGenAI, Type } from "@google/genai";
import { ProviderProfile } from "../types";

// Strictly following initialization guidelines by using process.env.API_KEY directly
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getBeautyRecommendations(prompt: string, goldProviders: ProviderProfile[]) {
  try {
    // Criar contexto dos profissionais Ouro disponíveis
    const providersContext = goldProviders.map(p => 
      `- ${p.businessName}: ${p.bio}`
    ).join('\n');

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `O usuário busca recomendações de beleza: "${prompt}". 
      
      IMPORTANTE: Você é um Concierge de Elite da Beleza Glow. 
      Você DEVE sugerir APENAS profissionais da nossa lista de membros OURO abaixo. 
      Não invente profissionais e não sugira outros que não estejam nesta lista:
      
      ${providersContext}
      
      Responda de forma elegante, curta e persuasiva em português de Angola, destacando por que esses profissionais Ouro são a escolha certa para o pedido do usuário.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Nossos especialistas de elite estão em alta demanda. Por favor, tente novamente em instantes.";
  }
}

export async function getBusinessInsights(stats: any) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analise as seguintes métricas de um salão de beleza e forneça 2 dicas estratégicas de crescimento: 
      Faturamento: ${stats.revenue} Kz, Agendamentos: ${stats.bookings}, Cancelamentos: ${stats.cancellations}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: { type: Type.STRING },
            tips: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["analysis", "tips"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    return { analysis: "Análise não disponível.", tips: [] };
  }
}
