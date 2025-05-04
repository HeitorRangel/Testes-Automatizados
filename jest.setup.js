// jest.setup.js
const mongoose = require('mongoose');

// Configurações globais para limpeza após os testes
afterAll(async () => {
  // Fecha todas as conexões do Mongoose
  await mongoose.disconnect();
  
  // Remove todos os listeners de eventos
  mongoose.connection.removeAllListeners();
});