import { CancelamentoController } from "../../controllers/cancelamento-controller";
import { CancelarDisciplina } from "../../domain/usecases/cancelar-disciplina";

export function makeCancelamentoController(): CancelamentoController {
  const cancelarDisciplina = new CancelarDisciplina();
  return new CancelamentoController(cancelarDisciplina);
}
