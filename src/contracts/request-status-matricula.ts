import { StatusMatricula } from '../domain/entities/status-matricula';

export interface IEntradaConsultarStatusMatricula {
    alunoId: string;
}

export interface ISaidaConsultarStatusMatricula {
    statusMatricula: StatusMatricula;
}