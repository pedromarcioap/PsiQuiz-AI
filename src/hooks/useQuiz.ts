import { useState, useCallback, useMemo, useEffect } from 'react';
import type { QuizData, QuestionType } from '../types';

interface UseQuizProps {
  quiz: QuizData | null;
  isFireTestMode?: boolean;
  onComplete?: (score: number, answers: Record<number, string>) => void;
}

export function useQuiz({ quiz, isFireTestMode = false, onComplete }: UseQuizProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(() => 
    isFireTestMode && quiz ? quiz.questions.length * 90 : 0
  );

  // Adiciona IDs únicos às questões para referência
  const questionsWithIds: QuestionType[] = useMemo(() => 
    quiz?.questions.map((q, idx) => ({ ...q, id: idx })) || [],
    [quiz?.questions]
  );

  // Calcula a pontuação atual
  const score = useMemo(() => {
    if (!quiz) return 0;
    
    return Object.entries(userAnswers).reduce((total, [index, answer]) => {
      const question = quiz.questions[parseInt(index)];
      return total + (answer === question.correctAnswer ? 1 : 0);
    }, 0);
  }, [quiz, userAnswers]);

  // Gerencia o timer para o modo de simulado
  useEffect(() => {
    if (!isFireTestMode || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(time => {
        if (time <= 1) {
          clearInterval(timer);
          onComplete?.(score, userAnswers);
        }
        return time - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isFireTestMode, timeLeft, score, userAnswers, onComplete]);

  // Manipula a resposta do usuário
  const handleAnswer = useCallback((answer: string) => {
    if (isAnswered && !isFireTestMode) return;
    
    setSelectedOption(answer);
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answer
    }));
    
    if (!isFireTestMode) {
      setIsAnswered(true);
    }
  }, [currentQuestionIndex, isAnswered, isFireTestMode]);

  // Navega para a próxima questão
  const moveToNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questionsWithIds.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else if (isFireTestMode) {
      onComplete?.(score, userAnswers);
    }
  }, [currentQuestionIndex, questionsWithIds.length, isFireTestMode, score, userAnswers, onComplete]);

  // Navega para a questão anterior
  const moveToPreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedOption(userAnswers[currentQuestionIndex - 1] || null);
      setIsAnswered(true);
    }
  }, [currentQuestionIndex, userAnswers]);

  return {
    currentQuestionIndex,
    currentQuestion: questionsWithIds[currentQuestionIndex],
    questionsCount: questionsWithIds.length,
    selectedOption,
    isAnswered,
    timeLeft,
    score,
    userAnswers,
    handleAnswer,
    moveToNextQuestion,
    moveToPreviousQuestion,
  };
}
