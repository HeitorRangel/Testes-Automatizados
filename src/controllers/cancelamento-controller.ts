import { Request, Response } from "express";
import { CancelarMatricula } from "../domain/usecases/cancelar-matricula";
import { z, ZodError, ZodIssue } from 'zod';

// Definição de esquema de validação
const CancelamentoSchema = z.object({
  alunoId: z.string().uuid('ID do aluno deve ser um UUID válido').trim().min(1, 'ID do aluno é obrigatório')
});

// Enum para tipos de erros
enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND',
  INTERNAL_ERROR = 'INTERNAL_ERROR'
}

// Classe de erro customizada
class ApplicationError extends Error {
  type: ErrorType;
  statusCode: number;

  constructor(message: string, type: ErrorType, statusCode: number) {
    super(message);
    this.name = 'ApplicationError';
    this.type = type;
    this.statusCode = statusCode;
  }
}

export class CancelamentoController {
  constructor(private cancelarMatricula: CancelarMatricula) {
    console.log('CancelamentoController instanciado');
  }

  async handle(request: Request, response: Response): Promise<void> {
    try {
      // Validação de entrada com Zod
      const { alunoId } = this.validarEntrada(request);

      const resultado = await this.cancelarMatricula.execute({ alunoId });

      // Resposta estruturada
      const respostaFormatada = {
        mensagem: 'Cancelamento de matrícula realizado com sucesso',
        statusMatricula: resultado.statusMatricula
      };

      response.status(200).json(respostaFormatada);
    } catch (error) {
      this.tratarErro(error, response);
    }
  }

  private validarEntrada(request: Request): { alunoId: string } {
    try {
      return CancelamentoSchema.parse({
        alunoId: request.params.alunoId
      });
    } catch (error) {
      if (error instanceof ZodError) {
        // Extrai mensagens de erro do Zod
        const errorMessages = error.errors.map(err => err.message);
        throw new ApplicationError(
          errorMessages.join(', '), 
          ErrorType.VALIDATION_ERROR, 
          400
        );
      }
      throw error;
    }
  }

  private tratarErro(error: unknown, response: Response): void {
    console.error('Erro no cancelamento:', error);

    if (error instanceof ApplicationError) {
      response.status(error.statusCode).json({
        type: error.type,
        message: error.message
      });
    } else if (error instanceof Error) {
      response.status(500).json({
        type: ErrorType.INTERNAL_ERROR,
        message: 'Erro interno do servidor',
        detalhes: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    } else {
      response.status(500).json({
        type: ErrorType.INTERNAL_ERROR,
        message: 'Erro desconhecido'
      });
    }
  }
}