import { PrismaClient } from '../generated/prisma';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const prisma = new PrismaClient();

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method === 'GET') {
    try {
      const quizzes = await prisma.quiz.findMany();
      return response.status(200).json(quizzes);
    } catch (error) {
      return response.status(500).json({ error: 'Erro ao buscar quizzes.' });
    }
  }

  if (request.method === 'POST') {
    try {
      const { title } = request.body;
      if (!title) {
        return response.status(400).json({ error: 'O título é obrigatório.' });
      }
      const newQuiz = await prisma.quiz.create({
        data: {
          title,
        },
      });
      return response.status(201).json(newQuiz);
    } catch (error) {
      return response.status(500).json({ error: 'Erro ao criar quiz.' });
    }
  }

  response.setHeader('Allow', ['GET', 'POST']);
  return response.status(405).end(`Método ${request.method} não permitido.`);
}