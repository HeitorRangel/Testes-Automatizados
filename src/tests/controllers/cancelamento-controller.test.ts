import { CancelamentoController } from '../../controllers/cancelamento-controller';
import { Request, Response } from 'express';
import { CancelarMatricula } from '../../domain/usecases/cancelar-matricula';
import { IStatusMatriculaGateway, IStatusMatricula } from '../../contracts/interfaces';

class MockStatusMatricula implements IStatusMatricula {
  constructor(
    private id: string,
    private status: string,
    private dataMatricula: Date
  ) {}

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
    this.status = 'CANCELADO';
  }
}

describe('CancelamentoController', () => {
  let mockRepository: jest.Mocked<IStatusMatriculaGateway>;
  let mockUseCase: CancelarMatricula;
  let sut: CancelamentoController; // SUT (System Under Test)
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRepository = {
      buscarPorId: jest.fn(),
      salvar: jest.fn()
    };

    mockUseCase = new CancelarMatricula(mockRepository);
    sut = new CancelamentoController(mockUseCase); // SUT

    mockRequest = {
      params: {
        alunoId: '123'
      }
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Configurar mock do repositório para buscarPorId
    mockRepository.buscarPorId.mockResolvedValue(
      new MockStatusMatricula('123', 'ATIVO', new Date())
    );
  });

  it('deve cancelar matrícula com sucesso', async () => {
    const statusCancelado = new MockStatusMatricula('123', 'CANCELADO', new Date());
    
    jest.spyOn(mockUseCase, 'execute').mockResolvedValue({ 
      statusMatricula: {
        id: statusCancelado.getId(),
        status: statusCancelado.getStatus(),
        dataMatricula: statusCancelado.getDataMatricula()
      }
    });

    await sut.handle(mockRequest as Request, mockResponse as Response);

    expect(mockRepository.buscarPorId).toHaveBeenCalledWith('123');
    expect(mockRepository.salvar).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
      mensagem: 'Cancelamento de matrícula realizado com sucesso',
      statusMatricula: expect.objectContaining({
        id: '123',
        status: 'CANCELADO'
      })
    }));
  });

  it('deve rejeitar requisição sem alunoId', async () => {
    mockRequest.params = {};

    await sut.handle(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'ID do aluno é obrigatório' });
  });

  it('deve retornar erro se a matrícula não for encontrada', async () => {
    mockRepository.buscarPorId.mockResolvedValue(null);

    await sut.handle(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Erro interno', detalhes: 'Matrícula não encontrada' });
  });
});