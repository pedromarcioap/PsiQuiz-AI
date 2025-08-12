import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '../../generated/prisma';
import { createClient } from '@supabase/supabase-js';
const { GoogleGenerativeAI } = require("@google/genai");
import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
import mammoth from 'mammoth';

const prisma = new PrismaClient();

interface JwtPayload {
  userId: string;
}

// Função para extrair texto de um buffer de PDF
async function getTextFromPdf(data: Buffer) {
  const doc = await pdfjs.getDocument(data).promise;
  let text = '';
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map(item => ('str' in item ? item.str : '')).join(' ');
  }
  return text;
}

// Função para extrair texto de um buffer de DOCX
async function getTextFromDocx(data: Buffer) {
  const result = await mammoth.extractRawText({ buffer: data });
  return result.value;
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== 'POST') {
    return response.status(405).end('Método não permitido');
  }

  // 1. Autenticação
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return response.status(401).json({ error: 'Não autorizado.' });
  }
  const token = authHeader.split(' ')[1];
  let userId: string;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    userId = decoded.userId;
  } catch (error) {
    return response.status(401).json({ error: 'Token inválido.' });
  }

  // 2. Input
  const { libraryFileId } = request.body;
  if (!libraryFileId) {
    return response.status(400).json({ error: 'libraryFileId é obrigatório.' });
  }

  try {
    // 3. Buscar metadados do arquivo e verificar posse
    const fileMeta = await prisma.libraryFile.findFirst({
      where: { id: libraryFileId, ownerId: userId },
    });
    if (!fileMeta) {
      return response.status(404).json({ error: 'Arquivo não encontrado ou não pertence ao usuário.' });
    }

    // 4. Baixar o arquivo do Supabase Storage
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_KEY!);
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('library-files')
      .download(fileMeta.storagePath);

    if (downloadError) throw downloadError;
    const fileBuffer = Buffer.from(await fileData.arrayBuffer());

    // 5. Extrair texto com base no tipo de arquivo
    let extractedText = '';
    if (fileMeta.fileType === 'application/pdf') {
      extractedText = await getTextFromPdf(fileBuffer);
    } else if (fileMeta.fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      extractedText = await getTextFromDocx(fileBuffer);
    } else {
      return response.status(400).json({ error: 'Tipo de arquivo não suportado para geração de quiz.' });
    }

    if (!extractedText.trim()) {
        return response.status(400).json({ error: 'Não foi possível extrair texto do arquivo.' });
    }

    // 6. Chamar a IA Generativa (Gemini)
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `
      Com base no seguinte texto, crie um quiz.
      O quiz deve ter um título e 5 perguntas de múltipla escolha, cada uma com 4 opções.
      Indique a resposta correta para cada pergunta.
      Responda APENAS com um objeto JSON válido, sem nenhum texto ou formatação adicional.
      O formato do JSON deve ser:
      {
        "title": "Título do Quiz",
        "questions": [
          {
            "text": "Texto da pergunta 1?",
            "options": ["Opção A", "Opção B", "Opção C", "Opção D"],
            "correctAnswer": "A resposta correta para a pergunta 1"
          }
        ]
      }

      TEXTO:
      ---
      ${extractedText.substring(0, 10000)}
      ---
    `;
    const result = await model.generateContent(prompt);
    const aiResponseText = result.response.text();
    
    // Limpar e analisar a resposta JSON da IA
    const jsonResponse = JSON.parse(aiResponseText.replace(/```json|```/g, '').trim());

    // 7. Salvar o quiz gerado no banco de dados
    // (Nota: A estrutura de salvamento pode ser mais complexa, salvando perguntas e opções separadamente)
    const newQuiz = await prisma.quiz.create({
        data: {
            title: jsonResponse.title || fileMeta.name,
            authorId: userId,
            // A estrutura de perguntas/respostas precisaria de seus próprios modelos no Prisma
            // Por simplicidade, estamos apenas salvando o título por enquanto.
        }
    });

    // 8. Retornar o quiz gerado (da IA, não do banco por enquanto)
    return response.status(201).json({
        ...jsonResponse,
        databaseId: newQuiz.id, // Inclui o ID do quiz salvo no banco
    });

  } catch (error) {
    console.error('Erro ao gerar quiz:', error);
    return response.status(500).json({ error: 'Não foi possível gerar o quiz.' });
  }
}