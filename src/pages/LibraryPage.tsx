import React, { useState, useRef } from 'react';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf';
import mammoth from 'mammoth';
import { LibraryItem, QuizSettings } from '../../types';
import { SparklesIcon, LoaderIcon, UploadCloudIcon, FileTextIcon, BookIcon, LinkIcon, TrashIcon } from '../components/icons';

type LibraryPageProps = {
    items: LibraryItem[];
    onAddItem: (item: Omit<LibraryItem, 'id' | 'createdAt'>) => void;
    onRemoveItem: (id: string) => void;
    onGenerateQuiz: (item: LibraryItem) => void;
};

export const LibraryPage: React.FC<LibraryPageProps> = ({ items, onAddItem, onRemoveItem, onGenerateQuiz }) => {
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