import { ConsultarStatusMatricula } from '../../domain/usecases/consultar-status-matricula';
import { IStatusMatriculaGateway } from '../../domain/usecases/cancelar-matricula';
import { StatusMatricula } from '../../domain/entities/status-matricula';

// Mock do Gateway
class MockStatusMatriculaGateway implements IStatusMatriculaGateway {
  private matriculas: StatusMatricula[] = [];

  constructor(matriculas: StatusMatricula[]) {
    this.matriculas = matriculas;
  }

  async buscarPorId(alunoId: string): Promise<StatusMatricula | null> {
    return this.matriculas.find(m => m.getId() === alunoId) || null;
  }

  async salvar(matricula: StatusMatricula): Promise<void> {
    // Implementação mock
  }
}

describe('ConsultarStatusMatricula', () => {
  it('deve consultar status de matrícula com sucesso', async () => {
    const matricula = new StatusMatricula('12345', 'ATIVO', new Date());
    const mockGateway = new MockStatusMatriculaGateway([matricula]);
    const useCase = new ConsultarStatusMatricula(mockGateway);

    const resultado = await useCase.execute({ alunoId: '12345' });

    expect(resultado.statusMatricula).toEqual({
      id: '12345',
      status: 'ATIVO',
      dataMatricula: expect.any(Date)
    });
  });

  it('deve tratar erro no use case', async () => {
    // Arrange
    mockUseCase.execute.mockRejectedValue(new Error('Erro no processamento'));

    // Act
    await controller.handle(mockRequest as Request, mockResponse as Response);

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'Erro no processamento' })
    );
  });
});