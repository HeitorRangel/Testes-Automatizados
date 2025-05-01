import { CancelamentoController } from "../../controllers/cancelamento-controller";
import { CancelarMatricula } from "../../domain/usecases/cancelar-matricula";
import { StatusMatriculaRepository } from "../repositories/status-matricula-repository";

export function makeCancelamentoController(): CancelamentoController {
  const statusMatriculaRepository = new StatusMatriculaRepository();
  const cancelarMatricula = new CancelarMatricula(statusMatriculaRepository);
  return new CancelamentoController(cancelarMatricula);
}