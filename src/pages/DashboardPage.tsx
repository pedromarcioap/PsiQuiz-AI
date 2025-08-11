import React from 'react';

type DashboardPageProps = {
  onStartPersonalizedQuiz: (topic: string) => void;
};

export const DashboardPage: React.FC<DashboardPageProps> = ({ onStartPersonalizedQuiz }) => (
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