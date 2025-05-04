// src/config/database.ts
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/testes-automatizados';

export async function connectDatabase(): Promise<void> {
  try {
    console.log('Variáveis de ambiente carregadas:', {
      MONGODB_URI: MONGODB_URI ? 'Presente' : 'Não definida',
      URI_LENGTH: MONGODB_URI?.length,
      HAS_CREDENTIALS: MONGODB_URI?.includes('@') ? 'Sim' : 'Não'
    });

    console.log('Tentando conectar ao MongoDB com URI:', MONGODB_URI.replace(/\/\/.*:.*@/, '//[REDACTED]:***@'));
    
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // Aumentar timeout de seleção de servidor
      socketTimeoutMS: 45000, // Timeout de socket
      family: 4, // Forçar IPv4
      authSource: 'admin', // Fonte de autenticação
      retryWrites: true,
      w: 'majority',
      connectTimeoutMS: 10000 // Timeout de conexão
    });

    console.log('✅ Conexão com o MongoDB estabelecida com sucesso');
    
    // Adicionar listeners para monitorar a conexão
    mongoose.connection.on('connected', () => {
      console.log('Mongoose conectado ao MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Erro de conexão do Mongoose:', {
        name: err.name,
        message: err.message,
        stack: err.stack,
        code: (err as any).code,
        codeName: (err as any).codeName
      });
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ Mongoose desconectado do MongoDB');
    });

  } catch (error) {
    console.error('❌ Erro fatal ao conectar com o MongoDB:', {
      name: error instanceof Error ? error.name : 'Unknown Error',
      message: error instanceof Error ? error.message : 'Erro desconhecido',
      stack: error instanceof Error ? error.stack : 'Sem stack trace'
    });
    
    // Verificações adicionais
    if (MONGODB_URI.includes('localhost')) {
      console.warn('⚠️ Aviso: Usando conexão local. Certifique-se que o MongoDB local está rodando.');
    }

    // Não encerrar o processo, lançar erro para ser tratado
    throw new Error(`Falha na conexão com o banco de dados: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
}

export async function disconnectDatabase(): Promise<void> {
  try {
    await mongoose.disconnect();
    console.log('✅ Desconexão do MongoDB realizada com sucesso');
  } catch (error) {
    console.error('❌ Erro ao desconectar do MongoDB:', error);
  }
}

// Garantir desconexão ao encerrar o processo
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('Conexão com MongoDB fechada através do encerramento do processo');
    process.exit(0);
  } catch (error) {
    console.error('Erro ao fechar conexão com MongoDB:', error);
    process.exit(1);
  }
});