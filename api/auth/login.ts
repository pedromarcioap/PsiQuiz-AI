import { PrismaClient } from '../../generated/prisma';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return response.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return response.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('O segredo JWT não está configurado.');
      return response.status(500).json({ error: 'Erro de configuração do servidor.' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      jwtSecret,
      { expiresIn: '1d' }, // O token expira em 1 dia
    );

    return response.status(200).json({ token });

  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: 'Erro interno do servidor.' });
  }
}