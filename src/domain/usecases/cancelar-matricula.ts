import { 
    IEntradaCancelarMatricula, 
    ISaidaCancelarMatricula, 
    IStatusMatricula 
  } from '../../contracts/interfaces';
  
  export class CancelamentoError extends Error {
      constructor(message: string) {
          super(message);
          this.name = 'CancelamentoError';
      }
  }
  
  export interface IStatusMatriculaGateway {
      buscarPorId(alunoId: string): Promise<IStatusMatricula | null>;
      salvar(matricula: IStatusMatricula): Promise<void>;
  }
  
  export class CancelarMatricula {
      constructor(private gateway: IStatusMatriculaGateway) {}
  
      async execute(entrada: IEntradaCancelarMatricula): Promise<ISaidaCancelarMatricula> {
          // Validações de negócio
          if (!entrada.alunoId) {
              throw new CancelamentoError('ID do aluno é obrigatório');
          }
  
          // Busca da matrícula
          const matricula = await this.gateway.buscarPorId(entrada.alunoId);
  
          // Validações de negócio
          if (!matricula) {
              throw new CancelamentoError('Matrícula não encontrada');
          }
  
          // Regra de negócio de cancelamento
          matricula.cancelar();
  
          // Persistência
          await this.gateway.salvar(matricula);
  
          // Retorno agnóstico
          return {
              statusMatricula: {
                  id: matricula.getId(),
                  status: matricula.getStatus(),
                  dataMatricula: matricula.getDataMatricula()
              }
          };
      }
  }