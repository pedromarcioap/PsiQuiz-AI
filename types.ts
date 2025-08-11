
export interface QuestionType {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface QuizData {
  topic: string;
  questions: Omit<QuestionType, 'id'>[];
}

export interface QuizSettings {
  topic: string;
  subtopics: string;
  numQuestions: number;
  difficulty: 'Básico' | 'Intermediário' | 'Avançado';
  distractorComplexity: 'Baixa' | 'Média' | 'Alta';
  useWebSearch: boolean;
  systemPrompt: string;
  studyMode: 'Modo Estudo' | 'Modo Prova de Fogo';
  sourceContent?: string; // For generating from library content
}

export interface User {
    name: string;
    email: string;
    avatarUrl: string;
}

export interface LibraryItem {
    id: string;
    type: 'text' | 'pdf' | 'link';
    title: string;
    content?: string; // for text files
    url?: string;     // for links
    createdAt: string;
}
