import mongoose from 'mongoose';
import { StatusMatriculaModel } from '../../models/StatusMatricula';
import { IStatusMatriculaRepository } from '../../contracts/interfaces';
import { StatusMatriculaEnum, StatusMatricula } from '../../domain/entities/status-matricula';
import { 
  DatabaseError, 
  DuplicateEntryError, 
  ValidationError 
} from './errors/database-error';

export class StatusMatriculaRepository implements IStatusMatriculaRepository {
  private validateStatusMatricula(statusMatricula: StatusMatricula): void {
    // Verificar se o ID do aluno é válido
    if (!statusMatricula.getId()) {
      throw new ValidationError('ID do aluno é obrigatório');
    }

    // Validar o status da matrícula
    if (!statusMatricula.getStatus()) {
      throw new ValidationError('Status de matrícula é obrigatório');
    }

    // Verificar se o status é um valor válido do enum
    const statusValidos = Object.values(StatusMatriculaEnum);
    if (!statusValidos.includes(statusMatricula.getStatus())) {
      throw new ValidationError('Status de matrícula inválido');
    }

    // Validar data de matrícula
    if (!statusMatricula.getDataMatricula()) {
      throw new ValidationError('Data de matrícula é obrigatória');
    }

    // Verificar se a data não é futura
    const dataMatricula = new Date(statusMatricula.getDataMatricula());
    const dataAtual = new Date();
    if (dataMatricula > dataAtual) {
      throw new ValidationError('Data de matrícula não pode ser futura');
    }
  }

  async buscarPorId(alunoId: string): Promise<StatusMatricula | null> {
    try {
      const result = await StatusMatriculaModel.findOne({ alunoId });
      return result ? new StatusMatricula(
        result.alunoId, 
        result.dataMatricula, 
        result.status as StatusMatriculaEnum
      ) : null;
    } catch (error) {
      throw new DatabaseError('Erro ao buscar status de matrícula', error as Error);
    }
  }

  async salvar(statusMatricula: StatusMatricula): Promise<void> {
    try {
      // Validação inicial dos dados
      this.validateStatusMatricula(statusMatricula);

      // Verificar se já existe um registro para este aluno
      const existingEntry = await StatusMatriculaModel.findOne({ 
        alunoId: statusMatricula.getId() 
      });

      // Se já existir, lançar erro de entrada duplicada
      if (existingEntry) {
        console.warn(`Tentativa de criar status duplicado para aluno ${statusMatricula.getId()}`);
        throw new DuplicateEntryError(`Já existe um status de matrícula para o aluno ${statusMatricula.getId()}`);
      }

      // Criar novo registro
      const novoStatusMatricula = await StatusMatriculaModel.create({
        alunoId: statusMatricula.getId(),
        status: statusMatricula.getStatus(),
        dataMatricula: statusMatricula.getDataMatricula()
      });

      // Log de sucesso
      console.log(`Status de matrícula criado com sucesso para o aluno ${statusMatricula.getId()}`);
    } catch (error) {
      // Priorizar erros de validação personalizados
      if (error instanceof ValidationError) {
        console.error('Erro de validação:', error.message);
        throw error;
      }

      // Priorizar erro de entrada duplicada
      if (error instanceof DuplicateEntryError) {
        console.error('Erro de entrada duplicada:', error.message);
        throw error;
      }

      // Lidar com erros de validação do Mongoose
      if (error instanceof mongoose.Error.ValidationError) {
        console.error('Erro de validação do Mongoose:', error);
        throw new ValidationError('Erro de validação ao salvar status de matrícula', error);
      }
      
      // Lidar com erros de entrada duplicada do MongoDB
      if ((error as any).code === 11000) {
        console.error('Erro de entrada duplicada do MongoDB');
        throw new DuplicateEntryError(`Já existe um status de matrícula para o aluno ${statusMatricula.getId()}`, error as Error);
      }

      // Tratamento final para qualquer erro não capturado
      console.error('Erro inesperado ao salvar status de matrícula:', error);
      throw new DatabaseError('Erro inesperado ao salvar status de matrícula', error as Error);
    }
  }

  async atualizar(statusMatricula: StatusMatricula): Promise<void> {
    try {
      this.validateStatusMatricula(statusMatricula);

      const resultado = await StatusMatriculaModel.findOneAndUpdate(
        { alunoId: statusMatricula.getId() }, 
        {
          status: statusMatricula.getStatus(),
          dataMatricula: statusMatricula.getDataMatricula()
        }, 
        { 
          upsert: true,
          runValidators: true // Força validação do schema
        }
      );

      if (!resultado) {
        throw new DatabaseError(`Não foi possível atualizar o status de matrícula para o aluno ${statusMatricula.getId()}`);
      }
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        throw new ValidationError('Erro de validação ao atualizar status de matrícula', error);
      }

      if (error instanceof ValidationError) {
        throw error;
      }

      throw new DatabaseError('Erro ao atualizar status de matrícula', error as Error);
    }
  }

  async listar(filtros?: { 
    status?: StatusMatriculaEnum, 
    dataInicio?: Date, 
    dataFim?: Date 
  }): Promise<StatusMatricula[]> {
    try {
      const query: any = {};
      
      if (filtros?.status) {
        if (!Object.values(StatusMatriculaEnum).includes(filtros.status)) {
          throw new ValidationError('Status de matrícula inválido para filtro');
        }
        query.status = filtros.status;
      }

      if (filtros?.dataInicio) query.dataMatricula = { $gte: filtros.dataInicio };
      if (filtros?.dataFim) query.dataMatricula = { 
        ...query.dataMatricula, 
        $lte: filtros.dataFim 
      };

      const results = await StatusMatriculaModel.find(query);
      return results.map(result => 
        new StatusMatricula(
          result.alunoId, 
          result.dataMatricula, 
          result.status as StatusMatriculaEnum
        )
      );
    } catch (error) {
      if (error instanceof ValidationError) {
        throw error;
      }
      throw new DatabaseError('Erro ao listar status de matrícula', error as Error);
    }
  }
}