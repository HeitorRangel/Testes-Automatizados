import mongoose from 'mongoose';
import { StatusMatriculaEnum } from '../domain/entities/status-matricula';

const StatusMatriculaSchema = new mongoose.Schema({
  alunoId: { 
    type: String, 
    required: [true, 'ID do aluno é obrigatório']
  },
  status: { 
    type: String, 
    enum: {
      values: Object.values(StatusMatriculaEnum),
      message: 'Status inválido'
    },
    required: [true, 'Status é obrigatório']
  },
  dataMatricula: { 
    type: Date, 
    default: Date.now,
    required: [true, 'Data de matrícula é obrigatória']
  }
}, {
  timestamps: true, // Adiciona createdAt e updatedAt automaticamente
  strict: true, // Rejeita campos não definidos no schema
  indexes: [
    { 
      unique: true, 
      fields: { alunoId: 1 } 
    }
  ]
});

export const StatusMatriculaModel = mongoose.model('StatusMatricula', StatusMatriculaSchema);