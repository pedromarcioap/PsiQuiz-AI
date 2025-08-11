import React, { useState, useEffect } from 'react';
import { QuizSettings } from '../types';
import { SparklesIcon, LoaderIcon } from '../components/icons';

type GenerateQuizPageProps = {
    onGenerate: (settings: QuizSettings) => void;
    isLoading: boolean;
    initialSettings?: Partial<QuizSettings>;
};

export const GenerateQuizPage: React.FC<GenerateQuizPageProps> = ({ onGenerate, isLoading, initialSettings }) => {
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