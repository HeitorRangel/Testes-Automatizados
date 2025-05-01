import { CancelarMatricula } from '../../domain/usecases/cancelar-matricula';
import { IStatusMatriculaRepository, IStatusMatricula } from '../../contracts/interfaces';
import { StatusMatricula, StatusMatriculaEnum } from '../../domain/entities/status-matricula';

class MockStatusMatricula implements IStatusMatricula {
  _id: string;
  _status: StatusMatriculaEnum;
  _dataMatricula: Date;

  constructor(
    id: string,
    status: StatusMatriculaEnum = StatusMatriculaEnum.ATIVO,
    dataMatricula: Date = new Date()
  ) {
    this._id = id;
    this._status = status;
    this._dataMatricula = dataMatricula;
  }

  getId(): string {
    return this._id;
  }

  getStatus(): StatusMatriculaEnum {
    return this._status;
  }

  getDataMatricula(): Date {
    return this._dataMatricula;
  }

  cancelar(): void {
    this._status = StatusMatriculaEnum.CANCELADO;
  }
}

class MockStatusMatriculaRepository implements IStatusMatriculaRepository {
  private matriculas: StatusMatricula[] = [];

  async buscarPorId(alunoId: string): Promise<StatusMatricula | null> {
    return this.matriculas.find(m => m.getId() === alunoId) || null;
  }

  async salvar(statusMatricula: StatusMatricula): Promise<void> {
    this.matriculas.push(statusMatricula);
  }

  async atualizar(statusMatricula: StatusMatricula): Promise<void> {
    const index = this.matriculas.findIndex(m => m.getId() === statusMatricula.getId());
    if (index !== -1) {
      this.matriculas[index] = statusMatricula;
    }
  }

  async listar(filtros?: { 
    status?: StatusMatriculaEnum, 
    dataInicio?: Date, 
    dataFim?: Date 
  }): Promise<StatusMatricula[]> {
    return this.matriculas.filter(m => {
      if (filtros?.status && m.getStatus() !== filtros.status) return false;
      if (filtros?.dataInicio && m.getDataMatricula() < filtros.dataInicio) return false;
      if (filtros?.dataFim && m.getDataMatricula() > filtros.dataFim) return false;
      return true;
    });
  }
}

describe('CancelarMatricula', () => {
  let repository: MockStatusMatriculaRepository;
  let useCase: CancelarMatricula;

  beforeEach(() => {
    repository = new MockStatusMatriculaRepository();
    useCase = new CancelarMatricula(repository);
  });

  it('deve cancelar matrícula existente', async () => {
    const matricula = new StatusMatricula(
      '123', 
      new Date(), 
      StatusMatriculaEnum.ATIVO
    );
    await repository.salvar(matricula);

    const resultado = await useCase.execute({ alunoId: '123' });

    expect(resultado.statusMatricula.status).toBe(StatusMatriculaEnum.CANCELADO);
  });

  it('deve criar nova matrícula se não existir', async () => {
    const resultado = await useCase.execute({ alunoId: '456' });

    expect(resultado.statusMatricula.id).toBe('456');
    expect(resultado.statusMatricula.status).toBe(StatusMatriculaEnum.CANCELADO);
  });

  it('deve lançar erro se alunoId não for fornecido', async () => {
    await expect(useCase.execute({ alunoId: '' }))
      .rejects.toThrow('ID do aluno é obrigatório');
  });
});