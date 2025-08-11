import React, { useState, useEffect, useMemo } from 'react';
import { QuizData, QuizSettings, QuestionType } from '../types';
import { ClockIcon, CheckCircleIcon, XCircleIcon } from '../components/icons';

type StudyPageProps = {
    quiz: QuizData;
    settings: QuizSettings;
    onFinish: (answers: Record<number, string>) => void;
};

export const StudyPage: React.FC<StudyPageProps> = ({ quiz, settings, onFinish }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false); // Only for "Modo Estudo"
    
    const questionsWithIds: QuestionType[] = useMemo(() => 
        quiz.questions.map((q, index) => ({...q, id: index})), [quiz.questions]);

    const isFireTestMode = settings.studyMode === 'Modo Prova de Fogo';
    const [timeLeft, setTimeLeft] = useState(() => isFireTestMode ? quiz.questions.length * 90 : 0);

    useEffect(() => {
        if (!isFireTestMode || timeLeft <= 0) return;
        const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
        return () => clearInterval(timer);
    }, [isFireTestMode, timeLeft]);

    useEffect(() => {
        if (isFireTestMode && timeLeft === 0) {
            onFinish(userAnswers);
        }
    }, [isFireTestMode, timeLeft, onFinish, userAnswers]);

    const currentQuestion = questionsWithIds[currentQuestionIndex];
    const totalQuestions = questionsWithIds.length;

    const handleSelectOption = (option: string) => {
        if (isAnswered) return;
        setSelectedOption(option);
    };

    const handleConfirm = () => {
        if (!selectedOption) return;
        const newAnswers = { ...userAnswers, [currentQuestion.id!]: selectedOption };
        setUserAnswers(newAnswers);

        if (isFireTestMode) {
             if (currentQuestionIndex < totalQuestions - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
                setSelectedOption(null);
            } else {
                onFinish(newAnswers);
            }
        } else {
            setIsAnswered(true);
        }
    };

    const handleNextQuestion = () => { // Only for "Modo Estudo"
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            onFinish(userAnswers);
        }
    };
    
    return (
        <div className="p-4 sm:p-6 lg:p-8 flex-grow flex flex-col items-center justify-center">
            <div className="w-full max-w-3xl bg-slate-800/50 rounded-2xl shadow-2xl p-6 sm:p-8 border border-slate-700">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-cyan-400">{quiz.topic}</h2>
                    <div className="flex items-center gap-4">
                        {isFireTestMode && (
                            <div className="flex items-center gap-2 text-lg font-mono text-yellow-400" title="Tempo Restante">
                                <ClockIcon className="w-5 h-5"/>
                                <span>{Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
                            </div>
                        )}
                        <p className="text-slate-400 font-medium">{currentQuestionIndex + 1} de {totalQuestions}</p>
                    </div>
                </div>

                <div className="my-6">
                    <p className="text-lg text-slate-200">{currentQuestion.text}</p>
                </div>

                <div className="space-y-3">
                    {currentQuestion.options.map((option, index) => {
                        const isCorrect = option === currentQuestion.correctAnswer;
                        const isSelected = option === selectedOption;
                        let buttonClass = "w-full text-left p-4 rounded-lg border-2 transition-all duration-200 text-slate-300 border-slate-600 bg-slate-700/50 hover:border-cyan-500/70";
                        
                        if(isAnswered && !isFireTestMode) {
                            if (isCorrect) buttonClass += " !bg-green-500/20 !border-green-500";
                            else if (isSelected && !isCorrect) buttonClass += " !bg-red-500/20 !border-red-500";
                        } else if (isSelected) {
                            buttonClass += " border-cyan-500 bg-cyan-500/10";
                        }
                        
                        return (
                            <button key={index} onClick={() => handleSelectOption(option)} disabled={isAnswered} className={buttonClass}>
                                {option}
                            </button>
                        );
                    })}
                </div>
                
                {isAnswered && !isFireTestMode && (
                     <div className="mt-6 p-4 bg-slate-900/50 rounded-lg">
                        <h4 className="font-bold text-lg mb-2 flex items-center gap-2">
                           {selectedOption === currentQuestion.correctAnswer 
                                ? <CheckCircleIcon className="text-green-400"/> 
                                : <XCircleIcon className="text-red-400"/>
                           }
                           {selectedOption === currentQuestion.correctAnswer ? "Correto!" : "Incorreto"}
                        </h4>
                        <p className="text-slate-300"><strong className="text-slate-100">Explicação:</strong> {currentQuestion.explanation}</p>
                    </div>
                )}
                
                <div className="mt-8 flex justify-end">
                    {isAnswered && !isFireTestMode ? (
                        <button onClick={handleNextQuestion} className="bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-bold py-2 px-6 rounded-lg hover:from-cyan-600 hover:to-violet-600 transition-all duration-300">
                            {currentQuestionIndex < totalQuestions - 1 ? "Próxima" : "Finalizar Quiz"}
                        </button>
                    ) : (
                        <button onClick={handleConfirm} disabled={!selectedOption} className="bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-bold py-2 px-6 rounded-lg hover:from-cyan-600 hover:to-violet-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                            {isFireTestMode ? (currentQuestionIndex < totalQuestions - 1 ? "Próxima Questão" : "Finalizar") : "Confirmar"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};