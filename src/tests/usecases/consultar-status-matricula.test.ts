import { ConsultarStatusMatricula } from '../../domain/usecases/consultar-status-matricula';
import { StatusMatricula } from '../../domain/entities/status-matricula';
import { IRepository } from '../../contracts/irepository';

// Mock para o repositório
class MockStatusMatriculaRepository implements IRepository<StatusMatricula> {
    private statusMatricula: StatusMatricula[] = [
        new StatusMatricula('123', 'ATIVO', new Date()),
        new StatusMatricula('456', 'INATIVO', new Date()),
        new StatusMatricula('789', 'CANCELADO', new Date())
    ];

    async findAll(): Promise<StatusMatricula[]> {
        return this.statusMatricula;
    }

    async findById(id: string): Promise<StatusMatricula | undefined> {
        return this.statusMatricula.find(status => status.alunoId === id);
    }

    async create(obj: StatusMatricula): Promise<StatusMatricula> {
        this.statusMatricula.push(obj);
        return obj;
    }

    async update(id: string, obj: StatusMatricula): Promise<StatusMatricula> {
        const index = this.statusMatricula.findIndex(status => status.alunoId === id);
        if (index !== -1) {
            this.statusMatricula[index] = obj;
        }
        return obj;
    }

    async delete(id: string): Promise<boolean> {
        const index = this.statusMatricula.findIndex(status => status.alunoId === id);
        if (index !== -1) {
            this.statusMatricula.splice(index, 1);
            return true;
        }
        return false;
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
            .rejects.toThrow('Status de matrícula não encontrado');
    });

    // Teste de validação de entrada
    it('deve lançar erro para ID de aluno vazio', async () => {
        await expect(useCase.execute({ alunoId: '' }))
            .rejects.toThrow('ID do aluno é obrigatório');
    });

    // Teste de validação de tamanho do ID
    it('deve lançar erro para ID de aluno muito curto', async () => {
        await expect(useCase.execute({ alunoId: '123' }))
            .rejects.toThrow('ID do aluno deve ter pelo menos 5 caracteres');
    });
});