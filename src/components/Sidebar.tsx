import React from 'react';
import { User } from '../types';
import { HomeIcon, SparklesIcon, BarChartIcon, LibraryIcon, LogOutIcon } from './icons';

type Page = 'dashboard' | 'generate' | 'analytics' | 'library' | 'study' | 'results';

type SidebarProps = {
    currentPage: Page;
    setPage: (page: Page) => void;
    user: User;
    onLogout: () => void;
};

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, setPage, user, onLogout }) => {
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
