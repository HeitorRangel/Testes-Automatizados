import { StatusMatriculaRepository } from '../../infra/repositories/status-matricula-repository';
import { StatusMatricula, StatusMatriculaEnum } from '../../domain/entities/status-matricula';

describe('StatusMatriculaRepository', () => {
  let repository: StatusMatriculaRepository;
  let matricula: StatusMatricula;

  beforeEach(() => {
    repository = new StatusMatriculaRepository();
    matricula = new StatusMatricula('aluno1', new Date());
  });

  it('deve salvar uma matrícula', async () => {
    await repository.salvar(matricula);
    const encontrada = await repository.buscarPorId('aluno1');
    
    expect(encontrada).toBeTruthy();
    expect(encontrada?.getId()).toBe('aluno1');
    expect(encontrada?.getStatus()).toBe(StatusMatriculaEnum.ATIVO);
  });

  it('deve atualizar uma matrícula existente', async () => {
    await repository.salvar(matricula);
    
    matricula.cancelar();
    await repository.salvar(matricula);

    const encontrada = await repository.buscarPorId('aluno1');
    
    expect(encontrada?.getStatus()).toBe(StatusMatriculaEnum.CANCELADO);
  });

  it('deve retornar null para matrícula não encontrada', async () => {
    const encontrada = await repository.buscarPorId('aluno-inexistente');
    
    expect(encontrada).toBeNull();
  });
});