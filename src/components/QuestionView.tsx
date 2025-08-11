import React from 'react';
import type { QuestionType } from '../types';

interface QuestionViewProps {
  question: QuestionType;
  selectedOption: string | null;
  isAnswered: boolean;
  onAnswer: (answer: string) => void;
  className?: string;
}

export const QuestionView: React.FC<QuestionViewProps> = ({
  question,
  selectedOption,
  isAnswered,
  onAnswer,
  className = ''
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-lg font-medium text-slate-800">
        {question.text}
      </div>

      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedOption === option;
          const isCorrect = isAnswered && option === question.correctAnswer;
          const isWrong = isAnswered && isSelected && option !== question.correctAnswer;

          return (
            <button
              key={index}
              onClick={() => onAnswer(option)}
              disabled={isAnswered}
              className={`
                w-full p-4 text-left rounded-lg transition-colors duration-200
                ${isAnswered
                  ? isCorrect
                    ? 'bg-green-100 text-green-800 border-green-300'
                    : isWrong
                      ? 'bg-red-100 text-red-800 border-red-300'
                      : 'bg-white text-slate-800 border-slate-200'
                  : isSelected
                    ? 'bg-cyan-100 text-cyan-800 border-cyan-300'
                    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200'
                }
                border
              `}
            >
              <div className="flex items-center gap-3">
                <span className={`
                  w-6 h-6 flex items-center justify-center rounded-full text-sm
                  ${isAnswered
                    ? isCorrect
                      ? 'bg-green-200 text-green-800'
                      : isWrong
                        ? 'bg-red-200 text-red-800'
                        : 'bg-slate-200 text-slate-800'
                    : isSelected
                      ? 'bg-cyan-200 text-cyan-800'
                      : 'bg-slate-200 text-slate-800'
                  }
                `}>
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1">{option}</span>
              </div>
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className="mt-4 p-4 bg-slate-50 rounded-lg">
          <h3 className="font-medium text-slate-800 mb-2">Explicação:</h3>
          <p className="text-slate-600">{question.explanation}</p>
        </div>
      )}
    </div>
  );
};
