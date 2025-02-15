import { Request, Response } from "express";
import { CancelarMatricula } from "../domain/usecases/cancelar-matricula";

export class CancelamentoController {
    constructor(private cancelarMatricula: CancelarMatricula) {
        console.log('CancelamentoController instanciado');
    }

    async handle(request: Request, response: Response): Promise<void> {
        // Validação de entrada
        const resultadoValidacaoEntrada = this.validarEntrada(request);
        if (resultadoValidacaoEntrada) {
            response.status(400).json({ error: resultadoValidacaoEntrada });
            return;
        }

        try {
            const { alunoId } = request.params;
            const resultado = await this.cancelarMatricula.execute({ alunoId });

            // Resposta estruturada
            const respostaFormatada = {
                mensagem: 'Cancelamento de matrícula realizado com sucesso',
                statusMatricula: resultado.statusMatricula
            };

            response.status(200).json(respostaFormatada);
        } catch (error) {
            response.status(500).json({ 
                error: 'Erro interno', 
                detalhes: (error as Error).message 
            });
        }
    }

    private validarEntrada(request: Request): string | null {
        const { alunoId } = request.params;
        if (!alunoId) {
            return 'ID do aluno é obrigatório';
        }
        return null;
    }
}