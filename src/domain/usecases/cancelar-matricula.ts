import { IUseCase } from "../../contracts/iusecase";
import { StatusMatricula } from "../entities/status-matricula";
import { IStatusMatriculaRepository } from "../../contracts/request-status-matricula";
import { IEntradaCancelarMatricula, ISaidaCancelarMatricula } from "../../contracts/request_cancelamento";

export class ConsultarStatusMatricula implements IUseCase<IEntradaCancelarMatricula, ISaidaCancelarMatricula> {
    constructor(private repo: IStatusMatriculaRepository) {
        console.log('ConsultarStatusMatricula instanciado');
    }

    async execute(entrada: IEntradaCancelarMatricula): Promise<ISaidaCancelarMatricula> {
        // Validações de entrada
        if (!entrada.alunoId) {
            throw new Error('ID do aluno é obrigatório');
        }

        // Busca no repositório com tratamento de erro
        let todosStatusMatricula: StatusMatricula[];
        try {
            todosStatusMatricula = await this.repo.findAll();
        } catch(e) {
            throw new Error('Erro ao buscar status da matrícula');
        }

        // Filtrar status específico do aluno
        const statusMatricula = todosStatusMatricula.find(status => status.alunoId === entrada.alunoId);

        // Validações de negócio
        if (!statusMatricula) {
            throw new Error('Status da matrícula não encontrado');
        }

        return { statusMatricula };
    }
}