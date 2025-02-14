import { IStatusMatricula } from '../../contracts/interfaces';

export class StatusMatricula implements IStatusMatricula {
  private status: string;
  private readonly id: string; // Adicionar campo id

  constructor(
      private alunoId: string, 
      initialStatus: string, 
      private dataMatricula: Date
  ) {
      this.id = alunoId; // Definir id
      this.status = initialStatus;
  }

  getId(): string {
      return this.id;
  }

  getStatus(): string {
      return this.status;
  }

  getDataMatricula(): Date {
      return this.dataMatricula;
  }

  cancelar(): void {
      if (this.status === 'CANCELADO') {
          throw new Error('Matrícula já está cancelada');
      }
      this.status = 'CANCELADO';
  }
}