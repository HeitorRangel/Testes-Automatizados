import { StatusMatriculaRepository } from '../../infra/repositories/status-matricula-repository';
import { StatusMatriculaEnum, StatusMatricula } from '../../domain/entities/status-matricula';
import { connectDatabase, disconnectDatabase } from '../../config/database';
import { StatusMatriculaModel } from '../../models/StatusMatricula';
import mongoose from 'mongoose';

import { 
  DatabaseError, 
  DuplicateEntryError, 
  ValidationError 
} from '../../infra/repositories/errors/database-error';

describe('StatusMatriculaRepository', () => {
  let repository: StatusMatriculaRepository;

  beforeAll(async () => {
    await connectDatabase();
    repository = new StatusMatriculaRepository();
  });

  afterAll(async () => {
    await StatusMatriculaModel.deleteMany({});
    await disconnectDatabase();
    
    // Força fechamento de todas as conexões
    await mongoose.connection.close(true);
    
    // Limpa todos os listeners de eventos
    mongoose.connection.removeAllListeners();
  });

  beforeEach(async () => {
    await StatusMatriculaModel.deleteMany({});
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('deve estar conectado ao MongoDB', () => {
    expect(mongoose.connection.readyState).toBe(1); // 1 significa conectado
  });

  it('deve poder listar coleções no banco de dados', async () => {
    const connection = mongoose.connection;
    if (!connection.db) {
      throw new Error('Conexão com o banco de dados não estabelecida');
    }
    const colecoes = await connection.db.listCollections().toArray();
    expect(Array.isArray(colecoes)).toBe(true);
  });
  
  it('deve ter a conexão com a base de dados especificada', () => {
    const connection = mongoose.connection;
    if (!connection.db) {
      throw new Error('Conexão com o banco de dados não estabelecida');
    }
    const nomeBancoDados = connection.db.databaseName;
    expect(nomeBancoDados).toBe('testes-automatizados');
  });
  it('should save a status matricula', async () => {
    const statusMatricula = new StatusMatricula(
      'aluno1', 
      new Date(), 
      StatusMatriculaEnum.ATIVO
    );

    await repository.salvar(statusMatricula);

    const savedStatus = await StatusMatriculaModel.findOne({ alunoId: 'aluno1' });
    expect(savedStatus).toBeTruthy();
    expect(savedStatus?.status).toBe(StatusMatriculaEnum.ATIVO);
  });

  it('should update a status matricula', async () => {
    const statusMatricula = new StatusMatricula(
      'aluno1', 
      new Date(), 
      StatusMatriculaEnum.ATIVO
    );

    await repository.salvar(statusMatricula);
    
    statusMatricula.cancelar();

    await repository.atualizar(statusMatricula);

    const foundStatus = await StatusMatriculaModel.findOne({ alunoId: 'aluno1' });
    expect(foundStatus?.status).toBe(StatusMatriculaEnum.CANCELADO);
  });

  it('should list status matriculas with filters', async () => {
    const statusMatriculas = [
      new StatusMatricula(
        'aluno1', 
        new Date('2023-01-01'), 
        StatusMatriculaEnum.ATIVO
      ),
      new StatusMatricula(
        'aluno2', 
        new Date('2023-02-01'), 
        StatusMatriculaEnum.CANCELADO
      )
    ];

    await StatusMatriculaModel.insertMany(
      statusMatriculas.map(m => ({
        alunoId: m.getId(),
        status: m.getStatus(),
        dataMatricula: m.getDataMatricula()
      }))
    );

    const filteredActive = await repository.listar({ status: StatusMatriculaEnum.ATIVO });
    expect(filteredActive.length).toBe(1);
    expect(filteredActive[0].getStatus()).toBe(StatusMatriculaEnum.ATIVO);

    const filteredByDate = await repository.listar({
      dataInicio: new Date('2023-01-15'),
      dataFim: new Date('2023-02-15')
    });
    expect(filteredByDate.length).toBe(1);
    expect(filteredByDate[0].getId()).toBe('aluno2');
  });

  it('should retrieve a status matricula by id', async () => {
    const statusMatricula = new StatusMatricula(
      'aluno1', 
      new Date(), 
      StatusMatriculaEnum.ATIVO
    );

    await repository.salvar(statusMatricula);

    const foundMatricula = await repository.buscarPorId('aluno1');
    expect(foundMatricula).toBeTruthy();
    expect(foundMatricula?.getId()).toBe('aluno1');
    expect(foundMatricula?.getStatus()).toBe(StatusMatriculaEnum.ATIVO);
  });

  describe('Validações e Tratamento de Erros', () => {
    it('deve lançar erro ao tentar salvar matrícula com ID inválido', async () => {
      const statusMatricula = new StatusMatricula(
        '', 
        new Date(), 
        StatusMatriculaEnum.ATIVO
      );

      await expect(repository.salvar(statusMatricula)).rejects.toThrow(ValidationError);
    });

    it('deve lançar erro ao tentar salvar matrícula com status inválido', async () => {
      const statusMatricula = new StatusMatricula(
        'aluno1', 
        new Date(), 
        // @ts-ignore - forçando um status inválido para teste
        'STATUS_INVALIDO' as StatusMatriculaEnum
      );

      await expect(repository.salvar(statusMatricula)).rejects.toThrow(ValidationError);
    });

    it('deve lançar erro ao tentar salvar matrícula duplicada', async () => {
      const statusMatricula = new StatusMatricula(
        'aluno1', 
        new Date(), 
        StatusMatriculaEnum.ATIVO
      );

      // Primeira inserção
      await repository.salvar(statusMatricula);

      // Segunda inserção deve lançar erro de duplicidade
      await expect(repository.salvar(statusMatricula)).rejects.toThrow(DuplicateEntryError);
    });

    it('deve lançar erro ao tentar listar com status inválido', async () => {
      await expect(
        repository.listar({ 
          // @ts-ignore - forçando um status inválido para teste
          status: 'STATUS_INVALIDO' as StatusMatriculaEnum 
        })
      ).rejects.toThrow(ValidationError);
    });

    it('deve atualizar matrícula existente', async () => {
      const statusMatricula = new StatusMatricula(
        'aluno1', 
        new Date(), 
        StatusMatriculaEnum.ATIVO
      );

      // Primeiro salva
      await repository.salvar(statusMatricula);

      // Depois atualiza
      statusMatricula.cancelar();
      await repository.atualizar(statusMatricula);

      const matriculaAtualizada = await repository.buscarPorId('aluno1');
      expect(matriculaAtualizada?.getStatus()).toBe(StatusMatriculaEnum.CANCELADO);
    });
  });
});