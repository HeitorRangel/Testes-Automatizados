import { Request, Response } from "express";
import { CancelarDisciplina } from "../domain/usecases/cancelar-disciplina";

export class CancelamentoController {
  constructor(private cancelarDisciplina: CancelarDisciplina) {}

  handle(request: Request, response: Response): Response {
    try {
      const { alunoId, disciplinaId, motivo } = request.body;
      const cancelamento = this.cancelarDisciplina.execute({ alunoId, disciplinaId, motivo });
      return response.status(201).json(cancelamento);
    } catch (error) {
      return response.status(400).json({ error: error.message });
    }
  }
}
