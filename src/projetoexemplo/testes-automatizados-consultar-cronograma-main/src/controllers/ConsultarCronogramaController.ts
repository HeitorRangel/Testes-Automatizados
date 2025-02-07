import { Request, Response } from "express";
import { IUseCase } from "../contracts/IUseCase";
import { IEntradaConsultarCronograma, ISaidaConsultarCronograma } from "../domain/usecases/ConsultarCronogramaUseCase";

export interface IController {
    handle(req: Request, resp: Response): Promise<void>;
}

export class ConsultarCronogramaController implements IController {
    useCase: IUseCase<IEntradaConsultarCronograma, ISaidaConsultarCronograma>;

    constructor(useCase: IUseCase<IEntradaConsultarCronograma, ISaidaConsultarCronograma>) {
        console.log('ConsultarCronogramaController instanciado');
        this.useCase = useCase;
    }

    async handle(req: Request, resp: Response): Promise<void> {

        const resultadoValidacaoEntrada = this.validarEntrada(req);
        if (resultadoValidacaoEntrada) {
            resp.status(400).json({ error: resultadoValidacaoEntrada });
        } else {

            try {
                const { disciplinaId } = req.params;

                const dto_usecase: IEntradaConsultarCronograma = {
                    disciplinaId: parseInt(disciplinaId as string),
                };

                const resposta: ISaidaConsultarCronograma = await this.useCase.perform(dto_usecase);
                console.log('Resposta UseCase', resposta.cronograma);

                if (this.validarSaida(resposta)) {
                    resp.status(500).json({ error: 'Retorno do use case não é um cronograma' });
                } else {
                    const minha_resposta = {
                        mensagem: 'ConsultarCronogramaController.metodoBasico() chamado',
                        cronograma: resposta.cronograma,
                    };
                    resp.status(200).json(minha_resposta).end();
                }

            } catch (error: any) {
                resp.status(500).json({ error: error.message });
            }

        }
    }

    private validarEntrada(req: Request): string | null {
        const { disciplinaId } = req.params;
        if (!disciplinaId) {
            return "disciplinaId é obrigatório";
        }
        if (isNaN(Number(disciplinaId))) {
            return "disciplinaId precisa ser um número";
        }
        if (Number(disciplinaId) < 0) {
            return "disciplinaId precisa ser um número positivo";
        }
        if (Number(disciplinaId) % 1 !== 0) {
            return "disciplinaId precisa ser um número inteiro";
        }
        return null;
    }

    private validarSaida(resposta: ISaidaConsultarCronograma): boolean {
        if (isNaN(Number(resposta.cronograma.disciplinaId)) || !Array.isArray(resposta.cronograma.atividades)) {
            return true;
        }
        for (let i = 0; i < resposta.cronograma.atividades.length; i++) {
            const atividade = resposta.cronograma.atividades[i];
            if (typeof atividade.data !== 'string') {
                return true;
            }
            if (typeof atividade.descricao !== 'string') {
                return true;
            }
        }
        return false;
    }

}