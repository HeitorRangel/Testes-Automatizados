import { 
    IEntradaConsultarStatusMatricula, 
    ISaidaConsultarStatusMatricula 
  } from '../../contracts/interfaces';
  import { IStatusMatriculaGateway } from './cancelar-matricula';
  
  export class ConsultarStatusMatricula {
      constructor(private gateway: IStatusMatriculaGateway) {}
  
      import { IRepository } from '../../contracts/irepository';
      import { StatusMatricula } from '../../domain/entities/status-matricula';
      import { IStatusMatriculaGateway } from '../../domain/usecases/cancelar-matricula';
      
      export class StatusMatriculaRepository implements IStatusMatriculaGateway {
          constructor(private repository: IRepository<StatusMatricula>) {}
      
          async buscarPorId(alunoId: string): Promise<StatusMatricula | null> {
              const matricula = await this.repository.findById(alunoId);
              return matricula || null;
          }
      
          async salvar(matricula: StatusMatricula): Promise<void> {
              // Adicionar método update ao IRepository ou usar create
              await this.repository.create(matricula);
          }
      }