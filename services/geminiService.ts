
import { GoogleGenAI, Type } from "@google/genai";
import type { QuizData, QuizSettings } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const quizGenerationModel = "gemini-2.5-flash";

export const generateQuiz = async (settings: QuizSettings): Promise<QuizData> => {
  const { topic, subtopics, numQuestions, difficulty, distractorComplexity, useWebSearch, systemPrompt, sourceContent } = settings;

  const systemInstruction = systemPrompt || `Você é um especialista em psicologia e um criador de quizzes educacionais. Seu objetivo é gerar um quiz de múltipla escolha de alta qualidade com base nos parâmetros fornecidos. As perguntas devem ser claras, concisas e academicamente corretas. Os distratores (opções incorretas) devem ser plausíveis e desafiadores. Para cada questão, forneça uma breve explicação para a resposta correta.`;

  const userPrompt = sourceContent
    ? `
    Gere um quiz com base ESTRITAMENTE no conteúdo fornecido abaixo.
    --- CONTEÚDO ---
    ${sourceContent}
    --- FIM DO CONTEÚDO ---
    
    - Tópico do Quiz: ${topic}
    - Número de Questões: ${numQuestions}
    - Nível de Dificuldade: ${difficulty}
    - Complexidade dos Distratores: ${distractorComplexity}.
    
    Responda ESTRITAMENTE no formato JSON, seguindo o schema fornecido. Não adicione markdown ou qualquer outro texto fora do JSON.
    `
    : `
    Gere um quiz sobre o seguinte tópico:
    - Tópico Principal: ${topic}
    ${subtopics ? `- Subtópicos a serem incluídos: ${subtopics}` : ''}
    - Número de Questões: ${numQuestions}
    - Nível de Dificuldade: ${difficulty}
    - Complexidade dos Distratores: ${distractorComplexity}. ${
      distractorComplexity === 'Alta' 
      ? 'Crie distratores que sejam conceitos relacionados mas incorretos, equívocos comuns, ou informações parcialmente verdadeiras para desafiar o conhecimento profundo.' 
      : 'Crie distratores plausíveis mas claramente incorretos para um estudante atento.'
    }
    ${useWebSearch ? 'Utilize a busca na web para garantir que as informações sejam atuais e precisas, especialmente para desenvolvimentos recentes no campo.' : ''}
    
    Responda ESTRITAMENTE no formato JSON, seguindo o schema fornecido. Não adicione markdown ou qualquer outro texto fora do JSON.
  `;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      topic: { type: Type.STRING, description: "O tópico principal do quiz, derivado da solicitação." },
      questions: {
        type: Type.ARRAY,
        description: "Uma lista de questões para o quiz.",
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING, description: "O texto da pergunta." },
            options: {
              type: Type.ARRAY,
              description: "Uma lista de 4 opções de resposta (uma correta, três incorretas).",
              items: { type: Type.STRING }
            },
            correctAnswer: { type: Type.STRING, description: "O texto exato da resposta correta, que deve ser uma das 'options'." },
            explanation: { type: Type.STRING, description: "Uma breve explicação de por que a resposta correta está certa." }
          },
          required: ["question", "options", "correctAnswer", "explanation"]
        }
      }
    },
    required: ["topic", "questions"]
  };

  try {
    const config: any = {
      systemInstruction,
    };

    if (useWebSearch && !sourceContent) {
      config.tools = [{ googleSearch: {} }];
    } else {
      config.responseMimeType = "application/json";
      config.responseSchema = responseSchema;
    }

    const response = await ai.models.generateContent({
      model: quizGenerationModel,
      contents: userPrompt,
      config,
    });

    let quizJsonText = response.text.trim();
    if (!quizJsonText) {
      throw new Error("A API retornou uma resposta vazia.");
    }

    if (quizJsonText.startsWith('```json')) {
      quizJsonText = quizJsonText.substring(7, quizJsonText.length - 3).trim();
    } else if (quizJsonText.startsWith('```')) {
      quizJsonText = quizJsonText.substring(3, quizJsonText.length - 3).trim();
    }

    const parsedQuiz = JSON.parse(quizJsonText) as QuizData;

    if (!parsedQuiz.topic || !Array.isArray(parsedQuiz.questions) || parsedQuiz.questions.length === 0) {
      throw new Error("A resposta da API está malformada ou não contém questões.");
    }
    
    return parsedQuiz;

  } catch (error) {
    console.error("Erro ao gerar quiz com a API Gemini:", error);
    if (error instanceof Error) {
        throw new Error(`Falha na geração do quiz: ${error.message}. Verifique o console para mais detalhes.`);
    }
    throw new Error("Ocorreu um erro desconhecido durante a geração do quiz.");
  }
};
