import React, { useState, useCallback, useEffect } from 'react';
import type { QuizData, QuizSettings, User, LibraryItem } from './types';
import { generateQuiz } from '../services/geminiService';

import { Sidebar } from './components/Sidebar';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { GenerateQuizPage } from './pages/GenerateQuizPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { LibraryPage } from './pages/LibraryPage';
import { StudyPage } from './pages/StudyPage';
import { QuizResultsPage } from './pages/QuizResultsPage';

type Page = 'dashboard' | 'generate' | 'analytics' | 'library' | 'study' | 'results';

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
        id: 'guest',
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
