import { StatusMatricula } from "../entities/status-matricula";
import { RequestStatusMatricula } from "../../contracts/request-status-matricula";

export class ConsultarStatusMatricula {
  // Método síncrono, mas pode ser facilmente convertido para assíncrono
  execute(request: RequestStatusMatricula): StatusMatricula {
    if (!request.alunoId) {
      throw new Error("ID do aluno é obrigatório.");
    }
    
    return new StatusMatricula(
      request.alunoId,
      'ATIVO',
      ['Matemática', 'Português'],
      new Date()
    );
  }
}