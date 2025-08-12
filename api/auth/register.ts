import { PrismaClient } from '../../generated/prisma';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', ['POST']);
    return response.status(405).end(`Método ${request.method} não permitido.`);
  }

  try {
    const { email, name, password } = request.body;

    if (!email || !password) {
      return response.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return response.status(409).json({ error: 'Este email já está em uso.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    // Não retorne a senha, mesmo que criptografada
    const { password: _, ...userWithoutPassword } = user;

    return response.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: 'Erro interno do servidor.' });
  }
}