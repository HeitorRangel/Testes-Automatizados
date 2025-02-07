import { ConsultarStatusMatricula } from '../../domain/usecases/consultar-status-matricula';
import { StatusMatricula } from '../../domain/entities/status-matricula';
import { IStatusMatriculaRepository } from '../../contracts/request-status-matricula';

// Mock para o repositório
class MockStatusMatriculaRepository implements IStatusMatriculaRepository {
    private statusMatricula: StatusMatricula[] = [
        new StatusMatricula('123', 'ATIVO', new Date()),
        new StatusMatricula('456', 'INATIVO', new Date()),
        new StatusMatricula('789', 'CANCELADO', new Date())
    ];

    async findAll(): Promise<StatusMatricula[]> {
        return this.statusMatricula;
    }
}

describe('ConsultarStatusMatricula', () => {
    let useCase: ConsultarStatusMatricula;
    let mockRepository: MockStatusMatriculaRepository;

    beforeEach(() => {
        mockRepository = new MockStatusMatriculaRepository();
        useCase = new ConsultarStatusMatricula(mockRepository);
    });

    // Teste de consulta de status de matrícula com sucesso
    it('deve consultar status de matrícula existente', async () => {
        const resultado = await useCase.execute({ alunoId: '123' });
        
        expect(resultado.statusMatricula).toBeDefined();
        expect(resultado.statusMatricula.alunoId).toBe('123');
        expect(resultado.statusMatricula.status).toBe('ATIVO');
    });

    // Teste de erro para aluno não encontrado
    it('deve lançar erro para aluno não encontrado', async () => {
        await expect(useCase.execute({ alunoId: '999' }))
            .rejects.toThrow('Status da matrícula não encontrado');
    });

    // Teste de validação de entrada
    it('deve lançar erro para ID de aluno inválido', async () => {
        await expect(useCase.execute({ alunoId: '' }))
            .rejects.toThrow('ID do aluno é obrigatório');
    });

    // Teste de regra de negócio para status cancelado
    it('deve lançar erro para matrícula já cancelada', async () => {
        await expect(useCase.execute({ alunoId: '789' }))
            .rejects.toThrow('Matrícula já está cancelada');
    });

    // Teste de tipo de entrada
    it('deve lançar erro para tipo de entrada inválido', async () => {
        await expect(useCase.execute({ alunoId: 123 as any }))
            .rejects.toThrow('ID do aluno deve ser uma string');
    });
});