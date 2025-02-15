import { IStatusMatriculaGateway, IStatusMatricula } from "../../contracts/interfaces";

export class MatriculaRepository implements IStatusMatriculaGateway {
    private matriculas: IStatusMatricula[] = [];

    async buscarPorId(alunoId: string): Promise<IStatusMatricula | null> {
        return this.matriculas.find(m => m.getId() === alunoId) || null;
    }

    async salvar(matricula: IStatusMatricula): Promise<void> {
        const index = this.matriculas.findIndex(m => m.getId() === matricula.getId());
        if (index !== -1) {
            this.matriculas[index] = matricula;
        } else {
            this.matriculas.push(matricula);
        }
    }
}