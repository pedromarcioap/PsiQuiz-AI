import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import jwt from 'jsonwebtoken';

// Tipagem para o payload do nosso JWT
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
  const { fileName, fileType } = request.body;
  if (!fileName || !fileType) {
    return response.status(400).json({ error: 'fileName e fileType são obrigatórios.' });
  }

  // 3. Inicializar Supabase
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Credenciais do Supabase não configuradas.');
    return response.status(500).json({ error: 'Erro de configuração do servidor.' });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // 4. Gerar URL de Upload Assinada
  try {
    const filePath = `${userId}/${Date.now()}-${fileName}`;
    const { data, error } = await supabase.storage
      .from('library-files') // Nome do nosso bucket
      .createSignedUploadUrl(filePath, 60, { // URL válida por 60 segundos
          upsert: true, // Permite sobrescrever se o caminho for o mesmo
      });

    if (error) {
      throw error;
    }

    // 5. Retornar a URL para o frontend
    return response.status(200).json({
      uploadUrl: data.signedUrl,
      filePath: filePath, // O frontend precisará disso para notificar o backend após o upload
    });

  } catch (error) {
    console.error('Erro ao criar URL de upload:', error);
    return response.status(500).json({ error: 'Não foi possível gerar a URL de upload.' });
  }
}