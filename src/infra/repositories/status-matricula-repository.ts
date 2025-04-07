import { IStatusMatricula, IStatusMatriculaRepository } from '../../contracts/interfaces';
import { StatusMatricula, StatusMatriculaEnum } from '../../domain/entities/status-matricula';

export class StatusMatriculaRepository implements IStatusMatriculaRepository {
  private matriculas: Map<string, IStatusMatricula> = new Map();

  async buscarPorId(alunoId: string): Promise<IStatusMatricula | null> {
      return this.matriculas.get(alunoId) || null;
  }

  async salvar(matricula: IStatusMatricula): Promise<void> {
      this.matriculas.set(matricula.getId(), matricula);
  }
}