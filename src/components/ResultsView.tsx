import React from 'react';
import type { QuizData } from '../types';
import { AwardIcon, ClockIcon } from './icons';

interface ResultsViewProps {
  quiz: QuizData;
  userAnswers: Record<number, string>;
  timeSpent?: number;
  onRestart?: () => void;
  className?: string;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  quiz,
  userAnswers,
  timeSpent,
  onRestart,
  className = ''
}) => {
  // Calcula estatísticas
  const totalQuestions = quiz.questions.length;
  const correctAnswers = quiz.questions.reduce((total, question, index) => 
    total + (userAnswers[index] === question.correctAnswer ? 1 : 0), 0
  );
  const score = (correctAnswers / totalQuestions) * 100;

  // Determina a mensagem de feedback
  const getFeedbackMessage = (score: number) => {
    if (score >= 90) return 'Excelente! Você domina este conteúdo!';
    if (score >= 70) return 'Muito bom! Continue estudando!';
    if (score >= 50) return 'Bom trabalho! Mas há espaço para melhorar.';
    return 'Continue estudando. A prática leva à perfeição!';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Cabeçalho */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">
          Resultado Final
        </h2>
        <p className="text-slate-600">
          {getFeedbackMessage(score)}
        </p>
      </div>

      {/* Card de Pontuação */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <AwardIcon className="w-5 h-5 text-cyan-500" />
            <h3 className="font-medium text-slate-800">Pontuação</h3>
          </div>
          <div className="text-3xl font-bold text-slate-900">
            {score.toFixed(0)}%
          </div>
          <p className="text-sm text-slate-600 mt-1">
            {correctAnswers} de {totalQuestions} questões
          </p>
        </div>

        {timeSpent && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-2">
              <ClockIcon className="w-5 h-5 text-cyan-500" />
              <h3 className="font-medium text-slate-800">Tempo Total</h3>
            </div>
            <div className="text-3xl font-bold text-slate-900">
              {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
            </div>
            <p className="text-sm text-slate-600 mt-1">
              {Math.round(timeSpent / totalQuestions)} segundos por questão
            </p>
          </div>
        )}
      </div>

      {/* Revisão das Questões */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-slate-800">
          Revisão das Questões
        </h3>

        {quiz.questions.map((question, index) => {
          const userAnswer = userAnswers[index];
          const isCorrect = userAnswer === question.correctAnswer;

          return (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"
            >
              <div className="flex items-start gap-3">
                <div className={`
                  w-6 h-6 mt-1 flex-shrink-0 rounded-full flex items-center justify-center text-sm font-medium
                  ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                `}>
                  {index + 1}
                </div>

                <div className="space-y-3">
                  <p className="font-medium text-slate-800">{question.text}</p>
                  
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="text-slate-600">Sua resposta: </span>
                      <span className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                        {userAnswer}
                      </span>
                    </div>
                    
                    {!isCorrect && (
                      <div className="text-sm">
                        <span className="text-slate-600">Resposta correta: </span>
                        <span className="text-green-600">{question.correctAnswer}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded">
                    {question.explanation}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Botões de Ação */}
      {onRestart && (
        <div className="flex justify-center">
          <button
            onClick={onRestart}
            className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-medium rounded-lg hover:from-cyan-600 hover:to-violet-600 transition-colors duration-200"
          >
            Tentar Novamente
          </button>
        </div>
      )}
    </div>
  );
};
