import { 
    IEntradaCancelarMatricula,
    ISaidaCancelarMatricula,
    IStatusMatriculaRepository 
  } from '../../contracts/interfaces';
  import { StatusMatricula, StatusMatriculaEnum } from '../entities/status-matricula';
  
  export class CancelamentoError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'CancelamentoError';
    }
  }
  
  export class CancelarMatricula {
    constructor(private repository: IStatusMatriculaRepository) {}
  
    async execute(entrada: IEntradaCancelarMatricula): Promise<ISaidaCancelarMatricula> {
      // Validações de negócio
      if (!entrada.alunoId) {
        throw new CancelamentoError('ID do aluno é obrigatório');
      }
  
      // Busca da matrícula
      const matriculaExistente = await this.repository.buscarPorId(entrada.alunoId);
  
      // Validações de negócio
      if (!matriculaExistente) {
        // Se não existir, cria uma nova matrícula
        const novaMatricula = new StatusMatricula(
          entrada.alunoId, 
          new Date()
        );
  
        // Cancela a matrícula
        novaMatricula.cancelar();
  
        // Salva a nova matrícula
        await this.repository.salvar(novaMatricula);
  
        return { 
          statusMatricula: {
            id: novaMatricula.getId(),
            status: novaMatricula.getStatus(),
            dataMatricula: novaMatricula.getDataMatricula()
          }
        };
      }
  
      // Se a matrícula existir, cancela a existente
      matriculaExistente.cancelar();
  
      // Salva a matrícula cancelada
      await this.repository.salvar(matriculaExistente);
  
      return { 
        statusMatricula: {
          id: matriculaExistente.getId(),
          status: matriculaExistente.getStatus(),
          dataMatricula: matriculaExistente.getDataMatricula()
        }
      };
    }
  }