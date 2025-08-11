import React, { useMemo } from 'react';
import { QuizData, QuestionType } from '../types';
import { AwardIcon, CheckCircleIcon, XCircleIcon } from '../components/icons';

type QuizResultsPageProps = {
    quiz: QuizData;
    userAnswers: Record<number, string>;
    onFinish: () => void;
};

export const QuizResultsPage: React.FC<QuizResultsPageProps> = ({ quiz, userAnswers, onFinish }) => {
    const questionsWithIds: QuestionType[] = useMemo(() => 
        quiz.questions.map((q, index) => ({...q, id: index})), [quiz.questions]);
    
    const score = useMemo(() => {
        return questionsWithIds.reduce((acc, q) => {
            return userAnswers[q.id!] === q.correctAnswer ? acc + 1 : acc;
        }, 0);
    }, [questionsWithIds, userAnswers]);

    const scorePercentage = Math.round((score / questionsWithIds.length) * 100);

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-slate-800/50 p-8 rounded-2xl border border-slate-700 text-center mb-8">
                    <AwardIcon className="w-16 h-16 text-yellow-400 mx-auto mb-4"/>
                    <h2 className="text-3xl font-bold text-white mb-2">Quiz Finalizado!</h2>
                    <p className="text-slate-300 text-lg">Resultados para: <span className="font-bold text-cyan-400">{quiz.topic}</span></p>
                    <p className="text-5xl font-bold text-white my-4">{scorePercentage}%</p>
                    <p className="text-slate-400">Você acertou {score} de {questionsWithIds.length} questões.</p>
                </div>

                <div className="space-y-6">
                    {questionsWithIds.map((question, index) => {
                        const userAnswer = userAnswers[question.id!];
                        const isCorrect = userAnswer === question.correctAnswer;
                        return (
                            <div key={question.id} className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                                <p className="text-lg text-slate-200 mb-4">{index + 1}. {question.text}</p>
                                <div className="space-y-2">
                                    {question.options.map(option => {
                                        const isUserAnswer = option === userAnswer;
                                        const isCorrectAnswer = option === question.correctAnswer;
                                        let optionClass = "w-full text-left p-3 rounded-md border text-slate-300 border-slate-600 bg-slate-700/50";
                                        if (isCorrectAnswer) {
                                            optionClass += " !bg-green-500/20 !border-green-500 font-semibold";
                                        } else if (isUserAnswer) {
                                            optionClass += " !bg-red-500/20 !border-red-500";
                                        }
                                        return <div key={option} className={optionClass}>{option}</div>;
                                    })}
                                </div>
                                <div className="mt-4 p-4 bg-slate-900/50 rounded-lg">
                                    <h4 className="font-bold text-lg mb-1 flex items-center gap-2">
                                       {isCorrect ? <CheckCircleIcon className="text-green-400"/> : <XCircleIcon className="text-red-400"/>}
                                       {isCorrect ? "Sua resposta está correta." : "Sua resposta está incorreta."}
                                    </h4>
                                    <p className="text-slate-300"><strong className="text-slate-100">Explicação:</strong> {question.explanation}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                <div className="mt-8 text-center">
                    <button onClick={onFinish} className="bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-bold py-3 px-8 rounded-lg hover:from-cyan-600 hover:to-violet-600 transition-all duration-300">
                        Voltar ao Dashboard
                    </button>
                </div>
            </div>
        </div>
    );
};