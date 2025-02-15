import { CancelarMatricula, CancelamentoError } from '../../domain/usecases/cancelar-matricula';
import { IStatusMatriculaGateway, IEntradaCancelarMatricula, IStatusMatricula } from '../../contracts/interfaces';

class MockStatusMatriculaGateway implements IStatusMatriculaGateway {
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
    private id: string;
    private status: string;
    private dataMatricula: Date;

    constructor(id: string, status: string, dataMatricula: Date) {
        this.id = id;
        this.status = status;
        this.dataMatricula = dataMatricula;
    }

    getId(): string {
        return this.id;
    }

    getStatus(): string {
        return this.status;
    }

    getDataMatricula(): Date {
        return this.dataMatricula;
    }

    cancelar(): void {
        this.status = 'cancelado';
    }
}

describe('CancelarMatricula', () => {
    let gateway: IStatusMatriculaGateway;
    let cancelarMatricula: CancelarMatricula;

    beforeEach(() => {
        gateway = new MockStatusMatriculaGateway();
        cancelarMatricula = new CancelarMatricula(gateway);
    });

    it('deve lançar um erro se o ID do aluno não for fornecido', async () => {
        const entrada: IEntradaCancelarMatricula = { alunoId: '' };

        await expect(cancelarMatricula.execute(entrada)).rejects.toThrow(CancelamentoError);
    });

    it('deve lançar um erro se a matrícula não for encontrada', async () => {
        const entrada: IEntradaCancelarMatricula = { alunoId: '123' };

        await expect(cancelarMatricula.execute(entrada)).rejects.toThrow(CancelamentoError);
    });

    it('deve cancelar a matrícula se todos os dados estiverem corretos', async () => {
        const matricula = new MockStatusMatricula('123', 'ativo', new Date());

        await gateway.salvar(matricula);

        const entrada: IEntradaCancelarMatricula = { alunoId: '123' };
        const saida = await cancelarMatricula.execute(entrada);

        expect(saida.statusMatricula.id).toBe('123');
        expect(saida.statusMatricula.status).toBe('cancelado');
    });
});