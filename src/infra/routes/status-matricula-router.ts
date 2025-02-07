import { Router, Request, Response } from 'express';
import { StatusMatriculaController } from '../../controllers/status-matricula-controller';
import { ConsultarStatusMatricula } from '../../domain/usecases/consultar-status-matricula';

const statusMatriculaRouter = Router();
const consultarStatusMatricula = new ConsultarStatusMatricula();
const statusMatriculaController = new StatusMatriculaController(consultarStatusMatricula);

statusMatriculaRouter.get('/:alunoId', async (req: Request, res: Response) => {
  await statusMatriculaController.consultarStatus(req, res);
});

export { statusMatriculaRouter };