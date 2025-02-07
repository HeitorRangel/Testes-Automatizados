import { StatusMatricula } from '../../domain/entities/status-matricula';
import { Cancelamento } from '../../domain/entities/cancelamento';
import { IStatusMatriculaRepository } from '../../contracts/request-status-matricula';
import { CancelarMatricula, CancelamentoError } from '../../domain/usecases/cancelar-matricula';

// Mock para o repositório de status de matrícula
class MockStatusMatriculaRepository implements IStatusMatriculaRepository {
    private statusMatriculas: StatusMatricula[] = [];

    async findAll(): Promise<StatusMatricula[]> {
        return this.statusMatriculas;
    }

    async update(id: string, obj: StatusMatricula): Promise<StatusMatricula> {
        const index = this.statusMatriculas.findIndex(status => status.alunoId === id);
        if (index !== -1) {
            this.statusMatriculas[index] = obj;
        }
        return obj;
    }

    // Métodos adicionais para teste
    adicionarStatusMatricula(statusMatricula: StatusMatricula): void {
        this.statusMatriculas.push(statusMatricula);
    }
}

describe('CancelarMatricula', () => {
    let mockRepository: MockStatusMatriculaRepository;
    let cancelarMatricula: CancelarMatricula;

    beforeEach(() => {
        mockRepository = new MockStatusMatriculaRepository();
        cancelarMatricula = new CancelarMatricula(mockRepository);
    });

    it('deve cancelar uma matrícula ativa', async () => {
        // Preparação
        const statusMatriculaAtivo = new StatusMatricula('aluno123', 'ATIVO', new Date());
        mockRepository.adicionarStatusMatricula(statusMatriculaAtivo);

        // Execução
        const resultado = await cancelarMatricula.execute({ alunoId: 'aluno123' });

        // Verificações
        expect(resultado.statusMatricula.status).toBe('CANCELADO');
        expect(resultado.statusMatricula.alunoId).toBe('aluno123');
    });

    it('deve lançar erro ao tentar cancelar matrícula já cancelada', async () => {
        // Preparação
        const statusMatriculaCancelado = new StatusMatricula('aluno456', 'CANCELADO', new Date());
        mockRepository.adicionarStatusMatricula(statusMatriculaCancelado);

        // Execução e Verificação
        await expect(
            cancelarMatricula.execute({ alunoId: 'aluno456' })
        ).rejects.toThrow(CancelamentoError);
    });

    it('deve lançar erro ao tentar cancelar matrícula inexistente', async () => {
        // Execução e Verificação
        await expect(
            cancelarMatricula.execute({ alunoId: 'aluno789' })
        ).rejects.toThrow(CancelamentoError);
    });
});