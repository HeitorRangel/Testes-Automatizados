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

export interface IStatusMatriculaGateway {
  buscarPorId(alunoId: string): Promise<IStatusMatricula | null>;
  salvar(matricula: IStatusMatricula): Promise<void>;
}