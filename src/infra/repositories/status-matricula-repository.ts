import { IStatusMatriculaRepository } from '../../contracts/interfaces';
import { StatusMatricula, StatusMatriculaEnum } from '../../domain/entities/status-matricula';

export class StatusMatriculaRepository implements IStatusMatriculaRepository {
  private matriculas: StatusMatricula[] = [];

  async buscarPorId(alunoId: string): Promise<StatusMatricula | null> {
    return this.matriculas.find(m => m.getId() === alunoId) || null;
  }

  async salvar(statusMatricula: StatusMatricula): Promise<void> {
    this.matriculas.push(statusMatricula);
  }

  async atualizar(statusMatricula: StatusMatricula): Promise<void> {
    const index = this.matriculas.findIndex(m => m.getId() === statusMatricula.getId());
    if (index !== -1) {
      this.matriculas[index] = statusMatricula;
    }
  }

  async listar(filtros?: { 
    status?: StatusMatriculaEnum, 
    dataInicio?: Date, 
    dataFim?: Date 
  }): Promise<StatusMatricula[]> {
    return this.matriculas.filter(m => {
      if (filtros?.status && m.getStatus() !== filtros.status) return false;
      if (filtros?.dataInicio && m.getDataMatricula() < filtros.dataInicio) return false;
      if (filtros?.dataFim && m.getDataMatricula() > filtros.dataFim) return false;
      return true;
    });
  }
}