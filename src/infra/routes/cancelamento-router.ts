import { Router, Request, Response } from 'express';
import { CancelamentoController } from '../../controllers/cancelamento-controller';
import { CancelarDisciplina } from '../../domain/usecases/cancelar-disciplina';

export const cancelamentoRouter = Router();
const cancelarDisciplina = new CancelarDisciplina();
const cancelamentoController = new CancelamentoController(cancelarDisciplina);

cancelamentoRouter.post("/", async (req, res, next) => {
    try {
      await cancelamentoController.handle(req, res);
    } catch (error) {
      next(error);
    }
  });