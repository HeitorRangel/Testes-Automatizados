export enum StatusMatriculaEnum {
    ATIVO = 'ATIVO',
    CANCELADO = 'CANCELADO'
  }
  
  export class StatusMatricula {
    private _id: string;
    private _status: StatusMatriculaEnum;
    private _dataMatricula: Date;
  
    constructor(
      alunoId: string, 
      dataMatricula: Date,
      status: StatusMatriculaEnum = StatusMatriculaEnum.ATIVO
    ) {
      this._id = alunoId;
      this._status = status;
      this._dataMatricula = dataMatricula;
    }
  
    getId(): string {
      return this._id;
    }
  
    getStatus(): string {
      return this._status;
    }
  
    getDataMatricula(): Date {
      return this._dataMatricula;
    }
  
    cancelar(): void {
      if (this._status === StatusMatriculaEnum.CANCELADO) {
        throw new Error('Matrícula já está cancelada');
      }
      this._status = StatusMatriculaEnum.CANCELADO;
    }
  }