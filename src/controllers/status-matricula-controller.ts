import { Request, Response } from 'express';
import { IUseCase } from '../contracts/iusecase';
import { IEntradaConsultarStatusMatricula, ISaidaConsultarStatusMatricula } from '../contracts/request-status-matricula';

export interface IController {
    handle(req: Request, resp: Response): Promise<void>;
}

export class StatusMatriculaController implements IController {
    private useCase: IUseCase<IEntradaConsultarStatusMatricula, ISaidaConsultarStatusMatricula>;

    constructor(useCase: IUseCase<IEntradaConsultarStatusMatricula, ISaidaConsultarStatusMatricula>) {
        console.log('StatusMatriculaController instanciado');
        this.useCase = useCase;
    }

    async handle(req: Request, resp: Response): Promise<void> {
        // Validação de entrada
        const resultadoValidacaoEntrada = this.validarEntrada(req);
        if (resultadoValidacaoEntrada) {
            resp.status(400).json({ error: resultadoValidacaoEntrada });
            return;
        }

        try {
            // Preparação da entrada
            const { alunoId } = req.params;
            const dto_usecase: IEntradaConsultarStatusMatricula = {
                alunoId: alunoId,
            };

            // Execução do use case
            const resposta: ISaidaConsultarStatusMatricula = await this.useCase.execute(dto_usecase);

            // Validação de saída
            if (this.validarSaida(resposta)) {
                resp.status(500).json({ error: 'Retorno do use case não é um status de matrícula' });
                return;
            }

            // Resposta estruturada
            const minha_resposta = {
                mensagem: 'Consulta de status de matrícula realizada com sucesso',
                statusMatricula: resposta.statusMatricula,
            };
            resp.status(200).json(minha_resposta).end();

        } catch (error: any) {
            resp.status(500).json({ error: error.message });
        }
    }

    // Métodos de validação
    private validarEntrada(req: Request): string | null {
        const { alunoId } = req.params;
        if (!alunoId) {
            return 'ID do aluno é obrigatório';
        }
        return null;
    }

    private validarSaida(resposta: ISaidaConsultarStatusMatricula): boolean {
        return !resposta.statusMatricula;
    }
}