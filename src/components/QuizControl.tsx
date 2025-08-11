import React from 'react';
import { SparklesIcon } from './icons';
import type { QuizSettings } from '../types';

interface QuizControlProps {
  onGenerate: (settings: QuizSettings) => Promise<void>;
  loading: boolean;
  error?: string;
  className?: string;
}

export const QuizControl: React.FC<QuizControlProps> = ({
  onGenerate,
  loading,
  error,
  className = ''
}) => {
  const [settings, setSettings] = React.useState<QuizSettings>({
    topic: '',
    subtopics: '',
    numQuestions: 10,
    difficulty: 'Intermediário',
    distractorComplexity: 'Média',
    studyMode: 'Modo Estudo',
    useWebSearch: false,
    systemPrompt: 'Você é um especialista em Psicologia, focado em criar questões que testem o conhecimento de forma justa e precisa.',
    sourceContent: undefined,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onGenerate(settings);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center gap-2 text-lg font-semibold text-slate-800">
        <SparklesIcon className="w-6 h-6 text-cyan-500" />
        <h2>Configurações do Quiz</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="text-red-500 text-sm p-2 bg-red-50 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="topic" className="block text-sm font-medium text-slate-700">
            Tópico Principal
          </label>
          <input
            type="text"
            id="topic"
            value={settings.topic}
            onChange={e => setSettings(prev => ({ ...prev, topic: e.target.value }))}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
            placeholder="Ex: Psicologia Cognitiva"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label htmlFor="difficulty" className="block text-sm font-medium text-slate-700">
              Dificuldade
            </label>
            <select
              id="difficulty"
              value={settings.difficulty}
              onChange={e => setSettings(prev => ({ ...prev, difficulty: e.target.value as 'Básico' | 'Intermediário' | 'Avançado' }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
            >
              <option value="Básico">Básico</option>
              <option value="Intermediário">Intermediário</option>
              <option value="Avançado">Avançado</option>
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="questionCount" className="block text-sm font-medium text-slate-700">
              Número de Questões
            </label>
            <input
              type="number"
              id="questionCount"
              min="5"
              max="50"
              value={settings.numQuestions}
              onChange={e => setSettings(prev => ({ ...prev, numQuestions: parseInt(e.target.value, 10) }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>

        </div>

        <button
          type="submit"
          disabled={loading}
          className={`
            w-full px-4 py-2 text-white font-medium rounded-lg
            transition-colors duration-200
            ${loading
              ? 'bg-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-500 to-violet-500 hover:from-cyan-600 hover:to-violet-600'
            }
          `}
        >
          {loading ? 'Gerando Quiz...' : 'Gerar Quiz'}
        </button>
      </form>
    </div>
  );
};
