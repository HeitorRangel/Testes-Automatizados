import mongoose from 'mongoose';
import { env } from './env';

export const connectDatabase = async () => {
  try {
    await mongoose.connect(env.database.url, {
      serverSelectionTimeoutMS: 5000, // Tempo limite de seleção de servidor
      socketTimeoutMS: 45000, // Tempo limite de socket
      family: 4 // Usar IPv4
    });
    console.log('Conexão com o MongoDB estabelecida com sucesso');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error);
    process.exit(1);
  }
};

export const disconnectDatabase = async () => {
  try {
    await mongoose.disconnect();
    console.log('Desconexão do MongoDB realizada com sucesso');
  } catch (error) {
    console.error('Erro ao desconectar do MongoDB:', error);
  }
};

mongoose.connection.on('connected', () => {
  console.log('Mongoose conectado ao MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Erro de conexão do Mongoose:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose desconectado');
});