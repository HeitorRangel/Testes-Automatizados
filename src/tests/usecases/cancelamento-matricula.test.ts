import { CancelarMatricula, CancelamentoError } from '../../domain/usecases/cancelar-matricula';
import { IStatusMatriculaRepository, IEntradaCancelarMatricula, IStatusMatricula } from '../../contracts/interfaces';
import { StatusMatriculaEnum } from '../../domain/entities/status-matricula';

class MockStatusMatriculaRepository implements IStatusMatriculaRepository {
    private matriculas: IStatusMatricula[] = [];

    async buscarPorId(alunoId: string): Promise<IStatusMatricula | null> {
        return this.matriculas.find(m => m.getId() === alunoId) || null;
    }

    async salvar(matricula: IStatusMatricula): Promise<void> {
        const index = this.matriculas.findIndex(m => m.getId() === matricula.getId());
        if (index !== -1) {
            this.matriculas[index] = matricula;
        } else {
            this.matriculas.push(matricula);
        }
    }
}

class MockStatusMatricula implements IStatusMatricula {
    private _id: string;
    private _status: string;
    private _dataMatricula: Date;

    constructor(id: string, status: string = StatusMatriculaEnum.ATIVO, dataMatricula: Date = new Date()) {
        this._id = id;
        this._status = status;
        this._dataMatricula = dataMatricula;
    }

    getId(): string {
        return this._id;
    }

    getStatus(): string {
        return this._status;
    }

    getDataMatricula(): Date {
        return this._dataMatricula;
    }

    cancelar(): void {
        if (this._status === StatusMatriculaEnum.CANCELADO) {
            throw new CancelamentoError('Matrícula já está cancelada');
        }
        this._status = StatusMatriculaEnum.CANCELADO;
    }
}

describe('CancelarMatricula', () => {
    let repository: IStatusMatriculaRepository;
    let cancelarMatricula: CancelarMatricula;

    beforeEach(() => {
        repository = new MockStatusMatriculaRepository();
        cancelarMatricula = new CancelarMatricula(repository);
    });

    it('deve lançar um erro se o ID do aluno não for fornecido', async () => {
        const entrada: IEntradaCancelarMatricula = { alunoId: '' };

        await expect(cancelarMatricula.execute(entrada)).rejects.toThrow(CancelamentoError);
    });

    it('deve criar e cancelar uma nova matrícula se não existir', async () => {
        const entrada: IEntradaCancelarMatricula = { alunoId: '123' };
        const saida = await cancelarMatricula.execute(entrada);

        expect(saida.statusMatricula.id).toBe('123');
        expect(saida.statusMatricula.status).toBe(StatusMatriculaEnum.CANCELADO);
    });

    it('deve cancelar a matrícula existente', async () => {
        const matricula = new MockStatusMatricula('123', StatusMatriculaEnum.ATIVO);
        await repository.salvar(matricula);

        const entrada: IEntradaCancelarMatricula = { alunoId: '123' };
        const saida = await cancelarMatricula.execute(entrada);

        expect(saida.statusMatricula.id).toBe('123');
        expect(saida.statusMatricula.status).toBe(StatusMatriculaEnum.CANCELADO);
    });

    it('deve lançar erro ao tentar cancelar matrícula já cancelada', async () => {
        const matricula = new MockStatusMatricula('123', StatusMatriculaEnum.CANCELADO);
        await repository.salvar(matricula);
      
        const entrada: IEntradaCancelarMatricula = { alunoId: '123' };
        await expect(cancelarMatricula.execute(entrada)).rejects.toThrow(CancelamentoError);
    });
      
    it('deve manter a data original de matrícula ao cancelar', async () => {
        const dataOriginal = new Date('2023-01-01');
        const matricula = new MockStatusMatricula('123', StatusMatriculaEnum.ATIVO, dataOriginal);
      
        await repository.salvar(matricula);
      
        const entrada: IEntradaCancelarMatricula = { alunoId: '123' };
        const saida = await cancelarMatricula.execute(entrada);
      
        expect(saida.statusMatricula.dataMatricula).toEqual(dataOriginal);
        expect(saida.statusMatricula.status).toBe(StatusMatriculaEnum.CANCELADO);
    });
});