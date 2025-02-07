import { Router } from 'express';
import { CancelamentoController } from '../../controllers/cancelamento-controller';
import { ConsultarStatusMatricula } from '../../domain/usecases/cancelar-matricula';
import { StatusMatriculaRepositorio } from '../repositories/status-matricula-repositorio';

export const cancelamentoRouter = Router();

const statusMatriculaRepositorio = new StatusMatriculaRepositorio();
const consultarStatusMatricula = new ConsultarStatusMatricula(statusMatriculaRepositorio);
const cancelamentoController = new CancelamentoController(consultarStatusMatricula);

cancelamentoRouter.get("/:alunoId", (req, res) => {
    const validacaoEntrada = cancelamentoController.validarEntrada(req);
    if (validacaoEntrada) {
        return res.status(400).json({ error: validacaoEntrada });
    }

    cancelamentoController.handle(req, res)
        .catch(error => {
            res.status(500).json({ error: error.message });
        });
});