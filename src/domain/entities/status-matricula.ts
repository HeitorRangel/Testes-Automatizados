export class StatusMatricula {
  constructor(
      public alunoId: string,
      public status: string,
      public disciplinasMatriculadas: string[],
      public dataMatricula: Date
  ) {}
}