import { StatusMatriculaRepository } from '../../infra/repositories/status-matricula-repository';
import { StatusMatriculaModel } from '../../models/StatusMatricula';
import { StatusMatriculaEnum, StatusMatricula } from '../../domain/entities/status-matricula';
import { 
  DatabaseError, 
  DuplicateEntryError, 
  ValidationError 
} from '../../infra/repositories/errors/database-error';
import mongoose from 'mongoose';

// Mock do modelo StatusMatriculaModel
jest.mock('../../models/StatusMatricula', () => ({
  StatusMatriculaModel: {
    findOne: jest.fn(),
    create: jest.fn(),
    updateOne: jest.fn(),
    deleteOne: jest.fn(),
    find: jest.fn()
  }
}));

describe('StatusMatriculaRepository', () => {
  let repository: StatusMatriculaRepository;

  beforeEach(() => {
    repository = new StatusMatriculaRepository();
    jest.clearAllMocks();
  });

  describe('buscarPorId', () => {
    it('deve retornar null quando nenhum registro for encontrado', async () => {
      (StatusMatriculaModel.findOne as jest.Mock).mockResolvedValue(null);

      const resultado = await repository.buscarPorId('aluno-inexistente');

      expect(resultado).toBeNull();
      expect(StatusMatriculaModel.findOne).toHaveBeenCalledWith({ alunoId: 'aluno-inexistente' });
    });

    it('deve retornar StatusMatricula quando registro for encontrado', async () => {
      const mockMatricula = {
        alunoId: 'aluno1',
        status: StatusMatriculaEnum.ATIVO,
        dataMatricula: new Date()
      };

      (StatusMatriculaModel.findOne as jest.Mock).mockResolvedValue(mockMatricula);

      const resultado = await repository.buscarPorId('aluno1');

      expect(resultado).toBeInstanceOf(StatusMatricula);
      expect(resultado?.getId()).toBe('aluno1');
      expect(resultado?.getStatus()).toBe(StatusMatriculaEnum.ATIVO);
    });
  });

  describe('salvar', () => {
    it('deve salvar uma nova matrícula com sucesso', async () => {
      const statusMatricula = new StatusMatricula(
        'aluno1', 
        new Date(), 
        StatusMatriculaEnum.ATIVO
      );

      // Simular que não existe entrada anterior
      (StatusMatriculaModel.findOne as jest.Mock).mockResolvedValue(null);
      (StatusMatriculaModel.create as jest.Mock).mockResolvedValue(statusMatricula);

      await repository.salvar(statusMatricula);

      expect(StatusMatriculaModel.findOne).toHaveBeenCalledWith({ 
        alunoId: statusMatricula.getId() 
      });
      expect(StatusMatriculaModel.create).toHaveBeenCalledWith({
        alunoId: statusMatricula.getId(),
        status: statusMatricula.getStatus(),
        dataMatricula: statusMatricula.getDataMatricula()
      });
    });

    it('deve lançar erro ao tentar salvar matrícula duplicada', async () => {
      const statusMatricula = new StatusMatricula(
        'aluno1', 
        new Date(), 
        StatusMatriculaEnum.ATIVO
      );

      // Simular entrada existente
      (StatusMatriculaModel.findOne as jest.Mock).mockResolvedValue({
        alunoId: 'aluno1'
      });

      await expect(repository.salvar(statusMatricula)).rejects.toThrow(DuplicateEntryError);
    });

    it('deve lançar erro de validação para status inválido', async () => {
      const statusMatriculaInvalida = new StatusMatricula(
        '', // ID vazio
        new Date(), 
        StatusMatriculaEnum.ATIVO
      );

      await expect(repository.salvar(statusMatriculaInvalida)).rejects.toThrow(ValidationError);
    });

    it('deve lançar erro para data de matrícula futura', async () => {
      const dataFutura = new Date();
      dataFutura.setFullYear(dataFutura.getFullYear() + 1);

      const statusMatriculaInvalida = new StatusMatricula(
        'aluno1', 
        dataFutura, 
        StatusMatriculaEnum.ATIVO
      );

      await expect(repository.salvar(statusMatriculaInvalida)).rejects.toThrow(ValidationError);
    });
  });

  describe('Validações Específicas', () => {
    it('deve lançar erro quando status for nulo ou undefined', async () => {
      // Mock para simular que não existe entrada anterior
      (StatusMatriculaModel.findOne as jest.Mock).mockResolvedValue(null);

      // criação de um StatusMatricula com status nulo
      const statusMatriculaInvalida = new StatusMatricula(
        'aluno1', 
        new Date()
      );
      
      // Substituir o status por null
      (statusMatriculaInvalida as any)._status = null;

      await expect(repository.salvar(statusMatriculaInvalida)).rejects.toThrow(ValidationError);
    });

    it('deve lançar erro quando status for um valor inválido', async () => {
      const statusMatriculaInvalida = new StatusMatricula(
        'aluno1', 
        new Date(), 
        'STATUS_INVALIDO' as StatusMatriculaEnum
      );

      await expect(repository.salvar(statusMatriculaInvalida)).rejects.toThrow(ValidationError);
    });

    it('deve lançar erro quando data de matrícula for nula ou undefined', async () => {
      const statusMatriculaInvalida = new StatusMatricula(
        'aluno1', 
        undefined as unknown as Date, 
        StatusMatriculaEnum.ATIVO
      );

      await expect(repository.salvar(statusMatriculaInvalida)).rejects.toThrow(ValidationError);
    });

    it('deve tratar erro de entrada duplicada do MongoDB', async () => {
      const statusMatricula = new StatusMatricula(
        'aluno1', 
        new Date(), 
        StatusMatriculaEnum.ATIVO
      );

      // Simular erro de entrada duplicada do Mongo
      const mongoDbDuplicateError = new Error('Duplicate key error');
      (mongoDbDuplicateError as any).code = 11000;

      (StatusMatriculaModel.findOne as jest.Mock).mockResolvedValue(null);
      (StatusMatriculaModel.create as jest.Mock).mockRejectedValue(mongoDbDuplicateError);

      await expect(repository.salvar(statusMatricula)).rejects.toThrow(DuplicateEntryError);
    });

    it('deve tratar erro genérico de banco de dados ao listar', async () => {
      const databaseError = new Error('Erro de conexão genérico');

      (StatusMatriculaModel.find as jest.Mock).mockRejectedValue(databaseError);

      await expect(
        repository.listar({ status: StatusMatriculaEnum.ATIVO })
      ).rejects.toThrow(DatabaseError);
    });
  });

  describe('Tratamento de Erros', () => {
    it('deve tratar erros de banco de dados durante a busca', async () => {
      (StatusMatriculaModel.findOne as jest.Mock).mockRejectedValue(new Error('Erro de conexão'));

      await expect(repository.buscarPorId('aluno1')).rejects.toThrow(DatabaseError);
    });

    it('deve tratar erros de validação do Mongoose', async () => {
      const statusMatricula = new StatusMatricula(
        'aluno1', 
        new Date(), 
        StatusMatriculaEnum.ATIVO
      );

      const mongooseValidationError = new mongoose.Error.ValidationError();
      (StatusMatriculaModel.findOne as jest.Mock).mockResolvedValue(null);
      (StatusMatriculaModel.create as jest.Mock).mockRejectedValue(mongooseValidationError);

      await expect(repository.salvar(statusMatricula)).rejects.toThrow(ValidationError);
    });
  });
});