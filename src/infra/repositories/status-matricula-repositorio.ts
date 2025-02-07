import { IRepository } from '../../contracts/irepository';
import { StatusMatricula } from '../../domain/entities/status-matricula';

export class StatusMatriculaRepositorio implements IRepository<StatusMatricula> {
    async findAll(): Promise<StatusMatricula[]> {
        // Implementação de busca de todos os status
        return [];
    }

    async findById(alunoId: string): Promise<StatusMatricula | undefined> {
        // Implementação de busca por ID
        // Por enquanto, um mock simples
        if (alunoId === '12345') {
            return new StatusMatricula(
                alunoId,
                'ATIVO',
                new Date()
            );
        }
        return undefined;
    }

    async create(obj: StatusMatricula): Promise<StatusMatricula> {
        // Implementação de criação
        return obj;
    }

    async update(id: string, obj: StatusMatricula): Promise<StatusMatricula> {
        // Implementação de atualização
        return obj;
    }

    async delete(id: string): Promise<boolean> {
        // Implementação de exclusão
        return true;
    }
}