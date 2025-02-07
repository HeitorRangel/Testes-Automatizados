import { IRepository } from "contracts/IRepository";
import { ICronograma } from "domain/entities/Cronograma";

export class ConsultarCronogramaRepository implements IRepository<ICronograma> {
    findAll(): Promise<ICronograma[]> {
        throw new Error("Method not implemented.");
    }
    findById(id: string): Promise<ICronograma | undefined> {
        return Promise.resolve({
            disciplinaId: id,
            atividades: [
                { data: "2025-02-03", descricao: "Teste" },
                { data: "2025-02-03", descricao: "Teste" },
                { data: "2025-02-03", descricao: "Teste" },
                { data: "2025-02-03", descricao: "Teste" },
                { data: "2025-02-03", descricao: "Teste" }
            ]} as unknown as ICronograma);
    }
    create(id: string, obj: ICronograma): Promise<ICronograma> {
        throw new Error("Method not implemented.");
    }
    update(id: string, obj: ICronograma): Promise<ICronograma> {
        throw new Error("Method not implemented.");
    }
    delete(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

}