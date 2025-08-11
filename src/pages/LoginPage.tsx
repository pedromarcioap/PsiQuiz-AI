import React from 'react';
import { GoogleIcon, SparklesIcon } from '../components/icons';

type LoginPageProps = {
  onLogin: () => void;
};

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => (
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