import { StatusMatricula } from '../domain/entities/status-matricula';

export interface IEntradaCancelarMatricula {
  alunoId: string;
}

export interface ISaidaCancelarMatricula {
  statusMatricula: {
    id: string;
    status: string;
    dataMatricula: Date;
  };
}

export interface IStatusMatricula {
  getId(): string;
  getStatus(): string;
  getDataMatricula(): Date;
  cancelar(): void;
}

export interface IEntradaConsultarStatusMatricula {
  alunoId: string;
}

export interface ISaidaConsultarStatusMatricula {
  statusMatricula: {
    id: string;
    status: string;
    dataMatricula: Date;
  };
}