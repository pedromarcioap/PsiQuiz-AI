import { useState, useCallback, useMemo } from 'react';
import type { QuizData, QuestionType } from '../types';

export const useQuizState = (quiz: QuizData | null, isFireTestMode: boolean = false) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(() => 
    isFireTestMode ? (quiz?.questions.length || 0) * 90 : 0
  );

  const questionsWithIds: QuestionType[] = useMemo(() => 
    quiz?.questions.map((q, idx) => ({ ...q, id: idx })) || [],
    [quiz?.questions]
  );

  const handleAnswer = useCallback((answer: string) => {
    if (isAnswered) return;
    
    setSelectedOption(answer);
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answer
    }));
    
    if (!isFireTestMode) {
      setIsAnswered(true);
    }
  }, [currentQuestionIndex, isAnswered, isFireTestMode]);

  const moveToNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questionsWithIds.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    }
  }, [currentQuestionIndex, questionsWithIds.length]);

  const moveToPreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedOption(userAnswers[currentQuestionIndex - 1] || null);
      setIsAnswered(true);
    }
  }, [currentQuestionIndex, userAnswers]);

  return {
    currentQuestionIndex,
    selectedOption,
    isAnswered,
    timeLeft,
    userAnswers,
    questionsWithIds,
    handleAnswer,
    moveToNextQuestion,
    moveToPreviousQuestion,
    setTimeLeft
  };
};
