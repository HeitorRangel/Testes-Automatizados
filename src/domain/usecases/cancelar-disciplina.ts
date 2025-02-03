import { Cancelamento } from "../entities/cancelamento";
import { RequestCancelamento } from "../../contracts/request_cancelamento";

export class CancelarDisciplina {
  execute(request: RequestCancelamento): Cancelamento {
    if (!request.alunoId || !request.disciplinaId || !request.motivo) {
      throw new Error("Todos os campos são obrigatórios.");
    }
    return new Cancelamento(request.alunoId, request.disciplinaId, request.motivo);
  }
}
