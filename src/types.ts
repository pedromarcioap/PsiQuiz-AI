// Tipos para o Quiz
export interface QuizSettings {
  topic: string;
  subtopics?: string;
  numQuestions: number;
  difficulty: 'Básico' | 'Intermediário' | 'Avançado';
  distractorComplexity: 'Baixa' | 'Média' | 'Alta';
  studyMode: 'Modo Estudo' | 'Modo Prova de Fogo';
  useWebSearch: boolean;
  systemPrompt: string;
  sourceContent?: string;
}

export interface QuestionType {
  id: number;
  text: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface QuizData {
  id: string;
  createdAt: string;
  topic: string;
  subject: string;
  difficulty: QuizSettings['difficulty'];
  questions: QuestionType[];
}

// Tipos para o Usuário
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

// Tipos para a Biblioteca
export interface LibraryItem {
  id: string;
  title: string;
  type: 'pdf' | 'text' | 'link';
  content?: string;
  url?: string;
  createdAt: string;
}
