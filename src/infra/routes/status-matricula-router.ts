import { Router, Request, Response } from 'express';
import { StatusMatriculaController } from '../../controllers/status-matricula-controller';
import { ConsultarStatusMatricula } from '../../domain/usecases/consultar-status-matricula';
import { StatusMatriculaRepositorio } from '../repositories/status-matricula-repositorio';

const statusMatriculaRouter = Router();
const statusMatriculaRepositorio = new StatusMatriculaRepositorio();
const consultarStatusMatricula = new ConsultarStatusMatricula(statusMatriculaRepositorio);
const statusMatriculaController = new StatusMatriculaController(consultarStatusMatricula);

statusMatriculaRouter.get('/:alunoId', async (req: Request, res: Response) => {
  await statusMatriculaController.handle(req, res);
});

export { statusMatriculaRouter };