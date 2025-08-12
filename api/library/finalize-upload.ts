import type { VercelRequest, VercelResponse } from '@vercel/node';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

interface JwtPayload {
  userId: string;
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', ['POST']);
    return response.status(405).end('Método não permitido');
  }

  // 1. Verificar Autenticação
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return response.status(401).json({ error: 'Não autorizado: Token não fornecido.' });
  }
  const token = authHeader.split(' ')[1];

  let userId: string;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    userId = decoded.userId;
  } catch (error) {
    return response.status(401).json({ error: 'Não autorizado: Token inválido.' });
  }

  // 2. Validar Input
  const { filePath, fileName, fileType } = request.body;
  if (!filePath || !fileName || !fileType) {
    return response.status(400).json({ error: 'filePath, fileName e fileType são obrigatórios.' });
  }

  // 3. Salvar Metadados no Banco de Dados
  try {
    const newFile = await prisma.libraryFile.create({
      data: {
        name: fileName,
        storagePath: filePath,
        fileType: fileType,
        ownerId: userId,
      },
    });

    return response.status(201).json(newFile);

  } catch (error) {
    console.error('Erro ao salvar metadados do arquivo:', error);
    return response.status(500).json({ error: 'Não foi possível salvar o arquivo no banco de dados.' });
  }
}