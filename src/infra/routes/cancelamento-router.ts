import { Router } from 'express';
import { makeCancelamentoController } from '../factories/factory-cancelamento-controller';

export const cancelamentoRouter = Router();

const cancelamentoController = makeCancelamentoController();

cancelamentoRouter.post("/:alunoId", (req, res) => {
    cancelamentoController.handle(req, res)
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
});