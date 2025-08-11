
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import type { QuizSettings, QuizData, QuestionType, User, LibraryItem } from './types';
import { generateQuiz } from './services/geminiService';
import { getDocument } from 'pdfjs-dist/build/pdf.min.mjs';

// --- ÍCONES SVG COMO COMPONENTES ---
const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
);
const SparklesIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /></svg>
);
const BarChartIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" x2="12" y1="20" y2="10" /><line x1="18" x2="18" y1="20" y2="4" /><line x1="6" x2="6" y1="20" y2="16" /></svg>
);
const LibraryIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 22h14a2 2 0 0 0 2-2V7.5L14.5 2H6a2 2 0 0 0-2 2v4" /><polyline points="14 2 14 8 20 8" /><path d="M2 17h.01" /><path d="M2 13h.01" /></svg>
);
const LoaderIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
);
const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);
const XCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
);
const ClockIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
const AwardIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
);
const LogOutIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
);
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.1v2.7h5.1c-.2 1.7-1.4 3.1-3.1 3.1-1.9 0-3.4-1.5-3.4-3.4s1.5-3.4 3.4-3.4c.8 0 1.5.3 2.1.8l2.1-2.1c-1.3-1.2-3-2-4.9-2-3.9 0-7 3.1-7 7s3.1 7 7 7c3.9 0 6.7-2.8 6.7-6.8 0-.5 0-1-.1-1.5z"></path></svg>
);
const UploadCloudIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 16-4-4-4 4"/></svg>
);
const FileTextIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>
);
const LinkIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"/></svg>
);
const BookIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20v2H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v2H6.5A2.5 2.5 0 0 0 4 4.5z"/></svg>
);
const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
);


type Page = 'dashboard' | 'generate' | 'analytics' | 'study' | 'library' | 'results';

// --- COMPONENTES DE UI ---

const Sidebar: React.FC<{ currentPage: Page; setPage: (page: Page) => void; user: User; onLogout: () => void; }> = ({ currentPage, setPage, user, onLogout }) => {
  const navItems = [
    { id: 'dashboard', icon: HomeIcon, label: 'Dashboard' },
    { id: 'generate', icon: SparklesIcon, label: 'Gerar Quiz' },
    { id: 'analytics', icon: BarChartIcon, label: 'Análise IA' },
    { id: 'library', icon: LibraryIcon, label: 'Biblioteca' },
  ];

  return (
    <aside className="w-16 md:w-64 bg-slate-800 p-2 md:p-4 flex flex-col transition-all duration-300">
      <div className="flex items-center justify-center md:justify-start mb-10">
        <SparklesIcon className="w-8 h-8 text-cyan-400" />
        <h1 className="hidden md:block text-xl font-bold ml-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">PsicoQuiz IA</h1>
      </div>
      <nav className="flex flex-col space-y-2">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setPage(item.id as Page)}
            className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
              currentPage === item.id 
              ? 'bg-cyan-500/20 text-cyan-300' 
              : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
            }`}
          >
            <item.icon className="w-6 h-6 flex-shrink-0" />
            <span className="hidden md:block ml-4 font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="mt-auto">
          <div className="border-t border-slate-700 my-2"></div>
          <div className="p-2 flex items-center gap-3">
            <img src={user.avatarUrl} alt="User Avatar" className="w-10 h-10 rounded-full"/>
            <div className="hidden md:flex flex-col flex-grow">
                <span className="font-semibold text-sm text-slate-200">{user.name}</span>
                <button onClick={onLogout} className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1">
                    <LogOutIcon className="w-3 h-3"/>
                    Sair
                </button>
            </div>
          </div>
      </div>
    </aside>
  );
};

const GenerateQuizPage: React.FC<{ onGenerate: (settings: QuizSettings) => void; isLoading: boolean, initialSettings?: Partial<QuizSettings> }> = ({ onGenerate, isLoading, initialSettings }) => {
    const [settings, setSettings] = useState<QuizSettings>({
        topic: initialSettings?.topic || 'Neuropsicologia Cognitiva',
        subtopics: initialSettings?.subtopics || 'Memória de trabalho, atenção seletiva, funções executivas',
        numQuestions: initialSettings?.numQuestions || 5,
        difficulty: initialSettings?.difficulty || 'Intermediário',
        distractorComplexity: initialSettings?.distractorComplexity ||'Média',
        studyMode: initialSettings?.studyMode || 'Modo Estudo',
        useWebSearch: initialSettings?.useWebSearch || false,
        systemPrompt: initialSettings?.systemPrompt || 'Você é um especialista em Psicologia, focado em criar questões que testem o conhecimento de forma justa e precisa.',
        sourceContent: initialSettings?.sourceContent || undefined,
    });

    useEffect(() => {
        if(initialSettings) {
             setSettings(s => ({...s, ...initialSettings}));
        }
    }, [initialSettings]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onGenerate(settings);
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <h2 className="text-3xl font-bold text-white mb-6">Gerador de Quiz IA</h2>
            {settings.sourceContent && (
                <div className="mb-4 p-4 bg-cyan-900/50 border border-cyan-700 text-cyan-200 rounded-lg">
                    <h4 className="font-bold">Gerando a partir de material da biblioteca!</h4>
                    <p>O quiz será criado com base no conteúdo do documento: <span className="font-semibold">{settings.topic}</span>.</p>
                </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <form onSubmit={handleSubmit} className="lg:col-span-2 bg-slate-800/50 p-6 rounded-2xl border border-slate-700 shadow-lg">
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="topic" className="block text-sm font-medium text-slate-300 mb-2">Tópico Principal</label>
                            <input type="text" id="topic" value={settings.topic} onChange={e => setSettings({...settings, topic: e.target.value})} className="w-full bg-slate-900/70 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition" placeholder="Ex: Psicologia Cognitiva" disabled={!!settings.sourceContent}/>
                        </div>
                        {!settings.sourceContent && (
                          <div>
                              <label htmlFor="subtopics" className="block text-sm font-medium text-slate-300 mb-2">Subtópicos (opcional)</label>
                              <input type="text" id="subtopics" value={settings.subtopics} onChange={e => setSettings({...settings, subtopics: e.target.value})} className="w-full bg-slate-900/70 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition" placeholder="Ex: memória de trabalho, atenção seletiva"/>
                          </div>
                        )}
                         <div>
                            <label htmlFor="numQuestions" className="block text-sm font-medium text-slate-300 mb-2">Número de Questões: {settings.numQuestions}</label>
                            <input type="range" id="numQuestions" min="3" max="20" value={settings.numQuestions} onChange={e => setSettings({...settings, numQuestions: parseInt(e.target.value)})} className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"/>
                        </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="difficulty" className="block text-sm font-medium text-slate-300 mb-2">Nível de Dificuldade</label>
                                <select id="difficulty" value={settings.difficulty} onChange={e => setSettings({...settings, difficulty: e.target.value as QuizSettings['difficulty']})} className="w-full bg-slate-900/70 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition">
                                    <option>Básico</option>
                                    <option>Intermediário</option>
                                    <option>Avançado</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="distractorComplexity" className="block text-sm font-medium text-slate-300 mb-2">Complexidade dos Distratores</label>
                                <select id="distractorComplexity" value={settings.distractorComplexity} onChange={e => setSettings({...settings, distractorComplexity: e.target.value as QuizSettings['distractorComplexity']})} className="w-full bg-slate-900/70 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition">
                                    <option>Baixa</option>
                                    <option>Média</option>
                                    <option>Alta</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Modo de Estudo</label>
                            <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-900/70 p-1 border border-slate-600">
                                <button type="button" onClick={() => setSettings({...settings, studyMode: 'Modo Estudo'})} className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors ${settings.studyMode === 'Modo Estudo' ? 'bg-cyan-500 text-white shadow' : 'text-slate-400 hover:bg-slate-700/50'}`}>Modo Estudo</button>
                                <button type="button" onClick={() => setSettings({...settings, studyMode: 'Modo Prova de Fogo'})} className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors ${settings.studyMode === 'Modo Prova de Fogo' ? 'bg-cyan-500 text-white shadow' : 'text-slate-400 hover:bg-slate-700/50'}`}>Prova de Fogo</button>
                            </div>
                        </div>
                         <div>
                            <label htmlFor="systemPrompt" className="block text-sm font-medium text-slate-300 mb-2">System Prompt (Instrução para a IA)</label>
                            <textarea id="systemPrompt" value={settings.systemPrompt} onChange={e => setSettings({...settings, systemPrompt: e.target.value})} rows={3} className="w-full bg-slate-900/70 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition" />
                        </div>
                        {!settings.sourceContent && (
                          <div className="flex items-center">
                              <input type="checkbox" id="useWebSearch" checked={settings.useWebSearch} onChange={e => setSettings({...settings, useWebSearch: e.target.checked})} className="h-4 w-4 rounded border-slate-600 text-cyan-500 focus:ring-cyan-500 bg-slate-900/70"/>
                              <label htmlFor="useWebSearch" className="ml-2 block text-sm text-slate-300">Busca Web Automática?</label>
                          </div>
                        )}
                    </div>
                     <div className="mt-8">
                        <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-bold py-3 px-4 rounded-lg hover:from-cyan-600 hover:to-violet-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                            {isLoading ? <><LoaderIcon className="animate-spin" /> Gerando...</> : 'Gerar Quiz'}
                        </button>
                    </div>
                </form>

                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 flex flex-col justify-center items-center text-center">
                    <SparklesIcon className="w-16 h-16 text-cyan-400 mb-4"/>
                    <h3 className="text-xl font-bold text-white">Pronto para Gerar?</h3>
                    <p className="text-slate-400 mt-2">Configure os parâmetros à esquerda e clique em "Gerar Quiz" para começar.</p>
                    <div className="mt-6 space-y-2 text-slate-300">
                        <p>✓ Distratores de Alta Qualidade</p>
                        <p>✓ Geração Rápida com IA Avançada</p>
                        <p>✓ Busca na Web para Tópicos Atuais</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StudyPage: React.FC<{ quiz: QuizData; settings: QuizSettings; onFinish: (answers: Record<number, string>) => void }> = ({ quiz, settings, onFinish }) => {
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
        const newAnswers = { ...userAnswers, [currentQuestion.id]: selectedOption };
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
                    <p className="text-lg text-slate-200">{currentQuestion.question}</p>
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

const QuizResultsPage: React.FC<{ quiz: QuizData; userAnswers: Record<number, string>; onFinish: () => void }> = ({ quiz, userAnswers, onFinish }) => {
    const questionsWithIds: QuestionType[] = useMemo(() => 
        quiz.questions.map((q, index) => ({...q, id: index})), [quiz.questions]);
    
    const score = useMemo(() => {
        return questionsWithIds.reduce((acc, q) => {
            return userAnswers[q.id] === q.correctAnswer ? acc + 1 : acc;
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
                        const userAnswer = userAnswers[question.id];
                        const isCorrect = userAnswer === question.correctAnswer;
                        return (
                            <div key={question.id} className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                                <p className="text-lg text-slate-200 mb-4">{index + 1}. {question.question}</p>
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


// --- PÁGINAS COM DADOS ESTÁTICOS / NOVOS COMPONENTES ---

const LoginPage: React.FC<{ onLogin: () => void }> = ({ onLogin }) => (
    <div className="flex items-center justify-center min-h-screen bg-slate-900 text-slate-100">
        <div className="w-full max-w-sm text-center p-8 bg-slate-800/50 rounded-2xl shadow-2xl border border-slate-700">
            <div className="flex items-center justify-center mb-6">
                <SparklesIcon className="w-12 h-12 text-cyan-400" />
                <h1 className="text-3xl font-bold ml-3 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">PsicoQuiz IA</h1>
            </div>
            <p className="text-slate-400 mb-8">Faça o login para iniciar sua jornada de aprendizado.</p>
            <button 
                onClick={onLogin} 
                className="w-full flex justify-center items-center gap-3 bg-white text-slate-800 font-semibold py-3 px-4 rounded-lg hover:bg-slate-200 transition-colors duration-300"
            >
                <GoogleIcon className="w-6 h-6"/>
                Entrar com Google
            </button>
            <p className="text-xs text-slate-500 mt-4">(Simulação de login para fins de demonstração)</p>
        </div>
    </div>
);

const DashboardPage: React.FC<{ onStartPersonalizedQuiz: (topic: string) => void }> = ({ onStartPersonalizedQuiz }) => (
    <div className="p-4 sm:p-6 lg:p-8">
        <h2 className="text-3xl font-bold text-white mb-6">Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="md:col-span-2 lg:col-span-4 bg-gradient-to-r from-cyan-900/50 to-violet-900/50 p-6 rounded-xl border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h3 className="text-xl font-bold text-white">Quiz Personalizado IA</h3>
                    <p className="text-slate-300 mt-1">Baseado na sua performance, a IA recomenda focar em: <span className="font-bold text-cyan-400">Teorias Psicanalíticas</span></p>
                </div>
                <button onClick={() => onStartPersonalizedQuiz('Teorias Psicanalíticas')} className="bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-bold py-2 px-6 rounded-lg whitespace-nowrap hover:from-cyan-600 hover:to-violet-600 transition-all">Iniciar Quiz Focado</button>
            </div>
            <div className="lg:col-span-2 bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-4">Performance Semanal IA</h3>
                <div className="space-y-3">
                    {Object.entries({'Psicologia Cognitiva': 92, 'Teorias da Personalidade': 76, 'Psicopatologia': 84, 'Neuropsicologia': 68}).map(([topic, score]) => (
                        <div key={topic}>
                            <div className="flex justify-between text-sm text-slate-300 mb-1"><span>{topic}</span><span>{score}%</span></div>
                            <div className="w-full bg-slate-700 rounded-full h-2.5"><div className="bg-cyan-500 h-2.5 rounded-full" style={{width: `${score}%`}}></div></div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="lg:col-span-2 bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                 <h3 className="text-lg font-bold text-white mb-4">Atividade Recente</h3>
                 <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-slate-200">Neuropsicologia Cognitiva.pdf</p>
                            <p className="text-sm text-slate-400">15 questões geradas</p>
                        </div>
                        <p className="text-sm text-slate-500">2024-01-15</p>
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-semibold text-slate-200">Quiz: Teorias da Personalidade</p>
                            <p className="text-sm text-green-400">Score: 88%</p>
                        </div>
                        <p className="text-sm text-slate-500">2024-01-14</p>
                    </div>
                 </div>
            </div>
        </div>
    </div>
);
const AnalyticsPage = () => (
     <div className="p-4 sm:p-6 lg:p-8">
        <h2 className="text-3xl font-bold text-white mb-6">Análise de Performance IA</h2>
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-3 bg-slate-800/50 p-6 rounded-xl border border-slate-700 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div><p className="text-slate-400">Quizzes Realizados</p><p className="text-2xl font-bold text-white">15</p></div>
                <div><p className="text-slate-400">Média Geral</p><p className="text-2xl font-bold text-green-400">81%</p></div>
                <div><p className="text-slate-400">Tópicos Estudados</p><p className="text-2xl font-bold text-white">8</p></div>
                <div><p className="text-slate-400">Tempo Total</p><p className="text-2xl font-bold text-white">6h 24m</p></div>
            </div>
            <div className="lg:col-span-2 bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-4">Performance por Tópico</h3>
                <div className="space-y-4">
                    <p>Psicologia Cognitiva - Intermediário - <span className="text-green-400 font-bold">85%</span></p>
                    <p>Teorias da Personalidade - Avançado - <span className="text-yellow-400 font-bold">72%</span></p>
                    <p>Psicopatologia - Avançado - <span className="text-red-400 font-bold">68%</span></p>
                </div>
            </div>
             <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-4">Áreas que Precisam de Atenção</h3>
                <div className="space-y-3">
                     <p>Teorias Psicanalíticas - Score: <span className="text-red-400 font-bold">45%</span></p>
                     <p>Neuropsicologia - Score: <span className="text-yellow-400 font-bold">52%</span></p>
                     <p>Métodos de Pesquisa - Score: <span className="text-yellow-400 font-bold">58%</span></p>
                </div>
            </div>
         </div>
     </div>
);
const LibraryPage: React.FC<{
    items: LibraryItem[];
    onAddItem: (item: Omit<LibraryItem, 'id' | 'createdAt'>) => void;
    onRemoveItem: (id: string) => void;
    onGenerateQuiz: (item: LibraryItem) => void;
}> = ({ items, onAddItem, onRemoveItem, onGenerateQuiz }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [newLink, setNewLink] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragEvent = (e: React.DragEvent, dragging: boolean) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isProcessing) {
            setIsDragging(dragging);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        handleDragEvent(e, false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
            e.dataTransfer.clearData();
        }
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files) {
            handleFiles(e.target.files);
        }
    };

    const handleFiles = (files: FileList) => {
        setIsProcessing(true);
        const MAX_CONTENT_LENGTH = 150000; // Increased limit for larger documents

        const processFile = (file: File) => {
            return new Promise<void>(async (resolve, reject) => {
                const reader = new FileReader();

                reader.onload = async (e) => {
                    try {
                        let content: string | null = null;
                        let type: LibraryItem['type'] = 'text';
                        const fileExtension = file.name.split('.').pop()?.toLowerCase();
                        
                        if (fileExtension === 'pdf') {
                            type = 'pdf';
                            const data = e.target?.result as ArrayBuffer;
                            const doc = await getDocument({ data }).promise;
                            let text = '';
                            for (let i = 1; i <= doc.numPages; i++) {
                                const page = await doc.getPage(i);
                                const contentStream = await page.getTextContent();
                                text += contentStream.items.map((item: any) => item.str).join(' ');
                            }
                            content = text;
                        } else if (fileExtension === 'docx') {
                            type = 'text'; // Using text icon for this
                            const data = e.target?.result as ArrayBuffer;
                            // @ts-ignore
                            const result = await mammoth.extractRawText({ arrayBuffer: data });
                            content = result.value;
                        } else if (file.type === 'text/plain') {
                            type = 'text';
                            content = e.target?.result as string;
                        }

                        if (content) {
                            if (content.length > MAX_CONTENT_LENGTH) {
                                content = content.substring(0, MAX_CONTENT_LENGTH);
                                console.warn(`O arquivo ${file.name} foi truncado.`);
                                // Consider showing a toast message to the user here.
                            }
                            onAddItem({ type, title: file.name, content });
                        } else {
                            console.warn(`Tipo de arquivo não suportado ou falha na extração: ${file.name}`);
                        }
                        resolve();
                    } catch (err) {
                        console.error(`Falha ao processar ${file.name}:`, err);
                        // Consider showing an error message to the user.
                        reject(err);
                    }
                };
                reader.onerror = reject;

                if (file.type === 'text/plain') {
                    reader.readAsText(file);
                } else if (file.name.toLowerCase().endsWith('.pdf') || file.name.toLowerCase().endsWith('.docx')) {
                    reader.readAsArrayBuffer(file);
                } else {
                    console.warn(`Tipo de arquivo não suportado: ${file.name}`);
                    resolve();
                }
            });
        };

        const allPromises = Array.from(files).map(processFile);
        Promise.allSettled(allPromises).finally(() => {
            setIsProcessing(false);
            if (fileInputRef.current) fileInputRef.current.value = ""; // Reset input
        });
    };

    const handleAddLink = (e: React.FormEvent) => {
        e.preventDefault();
        if(newLink.trim()) {
            onAddItem({ type: 'link', title: newLink, url: newLink });
            setNewLink('');
        }
    };
    
    const getIconForItem = (type: LibraryItem['type']) => {
        switch(type) {
            case 'text': return <FileTextIcon className="w-8 h-8 text-cyan-400"/>;
            case 'pdf': return <BookIcon className="w-8 h-8 text-violet-400"/>;
            case 'link': return <LinkIcon className="w-8 h-8 text-green-400"/>;
        }
    }

    return (
         <div className="p-4 sm:p-6 lg:p-8">
            <h2 className="text-3xl font-bold text-white mb-6">Biblioteca de Conteúdo</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div 
                    onClick={() => !isProcessing && fileInputRef.current?.click()}
                    onDragEnter={(e) => handleDragEvent(e, true)}
                    onDragLeave={(e) => handleDragEvent(e, false)}
                    onDragOver={(e) => handleDragEvent(e, true)}
                    onDrop={handleDrop}
                    className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl transition-colors ${isProcessing ? 'cursor-wait' : 'cursor-pointer'} ${isDragging ? 'border-cyan-500 bg-cyan-500/10' : 'border-slate-600 hover:border-slate-500'}`}
                >
                    {isProcessing ? (
                        <>
                            <LoaderIcon className="w-12 h-12 text-slate-400 mb-2 animate-spin"/>
                            <p className="text-slate-300 font-semibold">Processando arquivos...</p>
                            <p className="text-sm text-slate-500">Isso pode levar um momento.</p>
                        </>
                    ) : (
                        <>
                            <UploadCloudIcon className="w-12 h-12 text-slate-400 mb-2"/>
                            <p className="text-slate-300 font-semibold">Arraste arquivos (.txt, .pdf, .docx) aqui</p>
                            <p className="text-sm text-slate-500">ou clique para selecionar</p>
                        </>
                    )}
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple accept=".txt,.pdf,.docx" disabled={isProcessing} />
                </div>
                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                    <h3 className="font-bold text-white mb-3">Adicionar via Link</h3>
                    <p className="text-sm text-slate-400 mb-3">A geração de quiz a partir de links não é suportada no momento.</p>
                    <form onSubmit={handleAddLink} className="flex gap-2">
                        <input type="url" value={newLink} onChange={e => setNewLink(e.target.value)} placeholder="Cole um link de um artigo ou material" className="flex-grow bg-slate-900/70 border border-slate-600 rounded-md p-2 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"/>
                        <button type="submit" className="bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-cyan-600 transition-colors">Adicionar</button>
                    </form>
                </div>
            </div>

            <div>
                <h3 className="text-xl font-bold text-white mb-4">Seus Materiais</h3>
                {items.length === 0 ? (
                    <p className="text-slate-400 text-center py-8">Sua biblioteca está vazia. Adicione materiais acima para começar!</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map(item => (
                             <div key={item.id} className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex flex-col">
                                 <div className="flex items-start gap-4 flex-grow">
                                     {getIconForItem(item.type)}
                                     <div className="flex-grow min-w-0">
                                         <h4 className="font-bold text-slate-200 break-words">{item.title}</h4>
                                         <p className="text-xs text-slate-400">{new Date(item.createdAt).toLocaleDateString()}</p>
                                     </div>
                                 </div>
                                 <div className="flex gap-2 mt-4">
                                    <button 
                                        onClick={() => onGenerateQuiz(item)} 
                                        disabled={!item.content}
                                        className="flex-grow flex justify-center items-center gap-2 bg-gradient-to-r from-cyan-500 to-violet-500 text-white font-bold py-2 px-3 rounded-lg hover:from-cyan-600 hover:to-violet-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                        title={!item.content ? 'Geração de quiz indisponível. O conteúdo não pôde ser extraído ou o item é um link.' : 'Gerar quiz a partir deste conteúdo'}
                                    >
                                        <SparklesIcon className="w-4 h-4"/> Gerar Quiz
                                    </button>
                                    <button 
                                        onClick={() => onRemoveItem(item.id)}
                                        className="p-2 bg-red-800/50 text-red-300 rounded-lg hover:bg-red-800/80"
                                        aria-label="Remover item"
                                    >
                                        <TrashIcon className="w-5 h-5"/>
                                    </button>
                                 </div>
                             </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};


// --- COMPONENTE PRINCIPAL ---
const App: React.FC = () => {
  const [currentPage, setPage] = useState<Page>('dashboard');
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [quizSettings, setQuizSettings] = useState<QuizSettings | null>(null);
  const [generationSettings, setGenerationSettings] = useState<Partial<QuizSettings> | undefined>(undefined);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([]);
  
  useEffect(() => {
    try {
        const storedItems = localStorage.getItem('psicoquiz-library');
        if (storedItems) {
            setLibraryItems(JSON.parse(storedItems));
        }
    } catch(e) {
        console.error("Failed to load library from localStorage", e);
    }
  }, []);

  useEffect(() => {
    try {
        localStorage.setItem('psicoquiz-library', JSON.stringify(libraryItems));
    } catch(e) {
        console.error("Failed to save library to localStorage", e);
    }
  }, [libraryItems]);

  const handleGenerateQuiz = useCallback(async (settings: QuizSettings) => {
    setIsLoading(true);
    setError(null);
    setGenerationSettings(undefined);
    try {
      const data = await generateQuiz(settings);
      setQuizData(data);
      setQuizSettings(settings);
      setQuizAnswers({}); // Reset answers for the new quiz
      setPage('study');
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Ocorreu um erro desconhecido.";
      setError(errorMessage);
      setPage('generate');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleFinishQuiz = useCallback((finalAnswers: Record<number, string>) => {
    setQuizAnswers(finalAnswers);
    if (quizSettings?.studyMode === 'Modo Prova de Fogo') {
        setPage('results');
    } else {
        setPage('dashboard');
    }
  }, [quizSettings]);

  const handleLogin = () => {
    // In a real app, this would be a full OAuth flow with a backend.
    setUser({
        name: 'Usuário Convidado',
        email: 'guest@psicoquiz.ai',
        avatarUrl: `https://api.dicebear.com/8.x/initials/svg?seed=Convidado`
    });
    setPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    // Optionally clear other state
  };
  
  const handleAddItemToLibrary = (itemData: Omit<LibraryItem, 'id' | 'createdAt'>) => {
    const newItem: LibraryItem = {
        ...itemData,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
    };
    setLibraryItems(prev => [...prev, newItem]);
  };
  
  const handleRemoveItemFromLibrary = (id: string) => {
    setLibraryItems(prev => prev.filter(item => item.id !== id));
  };
  
  const handleGenerateFromLibraryItem = (item: LibraryItem) => {
    if (!item.content) return;
    const settings: Partial<QuizSettings> = {
        topic: item.title,
        sourceContent: item.content,
        systemPrompt: "Você é um especialista em extrair informações de um texto para criar um quiz. Gere questões baseadas exclusivamente no conteúdo fornecido."
    };
    setGenerationSettings(settings);
    setPage('generate');
  };
  
  const handleStartPersonalizedQuiz = (topic: string) => {
      const settings: Partial<QuizSettings> = {
          topic: topic,
          subtopics: 'Conceitos chave, principais teóricos, aplicação clínica',
          numQuestions: 10,
          difficulty: 'Intermediário',
          distractorComplexity: 'Alta',
          studyMode: 'Modo Prova de Fogo',
          useWebSearch: true,
          systemPrompt: 'Você é um tutor de IA. Crie um quiz focado em fortalecer as áreas de maior dificuldade do usuário, usando um tom encorajador.'
      };
      setGenerationSettings(settings);
      setPage('generate');
  };


  const renderPage = () => {
    switch (currentPage) {
      case 'generate':
        return <GenerateQuizPage onGenerate={handleGenerateQuiz} isLoading={isLoading} initialSettings={generationSettings} />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'library':
          return <LibraryPage items={libraryItems} onAddItem={handleAddItemToLibrary} onRemoveItem={handleRemoveItemFromLibrary} onGenerateQuiz={handleGenerateFromLibraryItem} />
      case 'study':
        if (quizData && quizSettings) {
          return <StudyPage quiz={quizData} settings={quizSettings} onFinish={handleFinishQuiz} />;
        }
        setPage('generate'); 
        return <GenerateQuizPage onGenerate={handleGenerateQuiz} isLoading={isLoading} />;
      case 'results':
        if (quizData) {
            return <QuizResultsPage quiz={quizData} userAnswers={quizAnswers} onFinish={() => setPage('dashboard')} />;
        }
         setPage('dashboard');
         return <DashboardPage onStartPersonalizedQuiz={handleStartPersonalizedQuiz} />;
      case 'dashboard':
      default:
        return <DashboardPage onStartPersonalizedQuiz={handleStartPersonalizedQuiz} />;
    }
  };

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100 font-sans">
      <Sidebar currentPage={currentPage} setPage={setPage} user={user} onLogout={handleLogout} />
      <main className="flex-1 overflow-y-auto">
        {error && currentPage === 'generate' && (
          <div className="m-4 p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg">
             <button onClick={() => setError(null)} className="float-right font-bold text-lg">&times;</button>
            <h4 className="font-bold">Erro ao Gerar Quiz!</h4>
            <p>{error}</p>
          </div>
        )}
        {renderPage()}
      </main>
    </div>
  );
};

export default App;
