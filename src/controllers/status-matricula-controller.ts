import { Request, Response } from 'express';
import { ConsultarStatusMatricula } from '../domain/usecases/consultar-status-matricula';
import { RequestStatusMatricula } from '../contracts/request-status-matricula';

export class StatusMatriculaController {
  constructor(
    private consultarStatusMatricula: ConsultarStatusMatricula
  ) {}

  async consultarStatus(req: Request, res: Response): Promise<Response> {
    try {
      const { alunoId } = req.params;

      const requestStatus: RequestStatusMatricula = { alunoId };
      const statusMatricula = this.consultarStatusMatricula.execute(requestStatus);

      return res.status(200).json(statusMatricula);
    } catch (error) {
      return res.status(400).json({
        message: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    }
  }
}