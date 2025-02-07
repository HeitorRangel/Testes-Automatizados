import { Request, Response } from "express";
import { ConsultarStatusMatricula } from "../domain/usecases/cancelar-matricula";
import { StatusMatricula } from "../domain/entities/status-matricula";

export class CancelamentoController {
    constructor(private consultarStatusMatricula: ConsultarStatusMatricula) {
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
            const resultado = await this.consultarStatusMatricula.execute({ alunoId });

            // Validação de saída
            if (this.validarSaida(resultado.statusMatricula)) {
                response.status(500).json({ error: 'Retorno inválido do caso de uso' });
                return;
            }

            // Resposta estruturada
            const respostaFormatada = {
                mensagem: 'Consulta de status de matrícula realizada com sucesso',
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

    private validarSaida(statusMatricula: StatusMatricula | undefined): boolean {
        return !statusMatricula || 
               !statusMatricula.alunoId || 
               !statusMatricula.status;
    }
}