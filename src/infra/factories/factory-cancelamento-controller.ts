import { CancelamentoController } from "../../controllers/cancelamento-controller";
import { CancelarMatricula } from "../../domain/usecases/cancelar-matricula";
import { StatusMatriculaGateway } from "../gateways/status-matricula-gateway";

export function makeCancelamentoController(): CancelamentoController {
  const statusMatriculaGateway = new StatusMatriculaGateway();
  const cancelarMatricula = new CancelarMatricula(statusMatriculaGateway);
  return new CancelamentoController(cancelarMatricula);
}