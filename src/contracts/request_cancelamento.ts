import { StatusMatricula } from '../domain/entities/status-matricula';

export interface IEntradaCancelarMatricula {
    alunoId: string;
}

export interface ISaidaCancelarMatricula {
    statusMatricula: StatusMatricula;
}