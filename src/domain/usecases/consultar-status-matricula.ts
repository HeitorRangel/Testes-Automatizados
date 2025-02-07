import { IUseCase } from "../../contracts/iusecase";
import { StatusMatricula } from "../entities/status-matricula"; // Remover esta linha
import { IEntradaConsultarStatusMatricula, ISaidaConsultarStatusMatricula } from "../../contracts/request-status-matricula";
import { IRepository } from "../../contracts/irepository";

export class ConsultarStatusMatricula implements IUseCase<IEntradaConsultarStatusMatricula, ISaidaConsultarStatusMatricula> {
    private repo: IRepository<StatusMatricula>;

    constructor(repo: IRepository<StatusMatricula>) {
        this.repo = repo;
        console.log('ConsultarStatusMatricula instanciado');
    }

    async execute(entrada: IEntradaConsultarStatusMatricula): Promise<ISaidaConsultarStatusMatricula> {
        // Validações de entrada
        if (!entrada.alunoId) {
            throw new Error('ID do aluno é obrigatório');
        }
        if (entrada.alunoId.length < 5) {
            throw new Error('ID do aluno deve ter pelo menos 5 caracteres');
        }

        // Busca no repositório com tratamento de erro
        let statusMatricula: StatusMatricula | undefined;
        try {
            statusMatricula = await this.repo.findById(entrada.alunoId);
        } catch(e) {
            throw new Error('Erro no repositório ao buscar status de matrícula');
        }

        // Validações de negócio
        if (!statusMatricula) {
            throw new Error('Status de matrícula não encontrado');
        }
        if (statusMatricula.disciplinasMatriculadas && statusMatricula.disciplinasMatriculadas.length === 0) {
            throw new Error('Aluno não está matriculado em nenhuma disciplina');
        }

        // Retorno estruturado
        return {
            statusMatricula: statusMatricula
        };
    }
}