import type { QuizSettings, QuizData } from '../types';

class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function generateQuiz(settings: QuizSettings): Promise<QuizData> {
  try {
    const response = await fetch('/api/generate-quiz', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      throw new ApiError('Falha ao gerar o quiz', response.status);
    }

    const data = await response.json();
    
    if (!data || !Array.isArray(data.questions) || data.questions.length === 0) {
      throw new ApiError('Resposta inválida do servidor');
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Erro ao conectar com o servidor');
  }
}

export function handleApiError(error: unknown): string {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 401:
        return 'Sessão expirada. Por favor, faça login novamente.';
      case 403:
        return 'Você não tem permissão para realizar esta ação.';
      case 404:
        return 'O recurso solicitado não foi encontrado.';
      case 500:
        return 'Erro interno do servidor. Tente novamente mais tarde.';
      default:
        return error.message;
    }
  }
  return 'Ocorreu um erro inesperado. Tente novamente.';
}
