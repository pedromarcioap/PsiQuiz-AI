import React from 'react';

export const AnalyticsPage = () => (
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