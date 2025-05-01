import { StatusMatriculaEnum, StatusMatricula } from '../domain/entities/status-matricula';

export interface IStatusMatricula {
  _id: string;
  _status: StatusMatriculaEnum;
  _dataMatricula: Date;
  getId(): string;
  getStatus(): StatusMatriculaEnum;
  getDataMatricula(): Date;
  cancelar(): void;
}

export interface ISaidaCancelarMatricula {
  statusMatricula: {
    id: string;
    status: string;
    dataMatricula: Date;
  };
}

export interface IEntradaCancelarMatricula {
  alunoId: string;
}

export interface IStatusMatriculaRepository {
  buscarPorId(alunoId: string): Promise<StatusMatricula | null>;
  salvar(statusMatricula: StatusMatricula): Promise<void>;
  atualizar(statusMatricula: StatusMatricula): Promise<void>;
  listar(filtros?: ListagemFiltros): Promise<StatusMatricula[]>;
}

interface ListagemFiltros {
  status?: StatusMatriculaEnum;
  dataInicio?: Date;
  dataFim?: Date;
}