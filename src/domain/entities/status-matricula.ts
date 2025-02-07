export class StatusMatricula {
  constructor(
    public alunoId: string,
    public status: 'ATIVO' | 'TRANCADO' | 'CONCLUÍDO' | 'CANCELADO',
    public disciplinasMatriculadas: string[],
    public dataUltimaAtualizacao: Date
  ) {}
}