export class Cancelamento {
    constructor(
      public alunoId: string,
      public motivo: string,
      public dataSolicitacao: Date = new Date()
    ) {}
  }
  