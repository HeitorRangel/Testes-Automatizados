import { CancelamentoController } from '../../controllers/cancelamento-controller';
import { Request, Response } from 'express';
import { CancelarMatricula } from '../../domain/usecases/cancelar-matricula';
import { IStatusMatriculaRepository, IStatusMatricula } from '../../contracts/interfaces';
import { StatusMatriculaEnum } from '../../domain/entities/status-matricula';

class MockStatusMatricula implements IStatusMatricula {
  constructor(
    private id: string,
    private status: string = StatusMatriculaEnum.ATIVO,
    private dataMatricula: Date = new Date()
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
    this.status = StatusMatriculaEnum.CANCELADO;
  }
}

describe('CancelamentoController', () => {
  let mockUseCase: jest.Mocked<CancelarMatricula>;
  let sut: CancelamentoController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    // Mock do caso de uso
    mockUseCase = {
      execute: jest.fn().mockResolvedValue({
        statusMatricula: {
          id: '123',
          status: StatusMatriculaEnum.CANCELADO,
          dataMatricula: new Date()
        }
      })
    } as any;

    sut = new CancelamentoController(mockUseCase);

    mockRequest = {
      params: { alunoId: '123' }  // Mudança: params em vez de body
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  it('deve cancelar matrícula com sucesso', async () => {
    await sut.handle(mockRequest as Request, mockResponse as Response);

    expect(mockUseCase.execute).toHaveBeenCalledWith({ alunoId: '123' });
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
      mensagem: 'Cancelamento de matrícula realizado com sucesso',
      statusMatricula: expect.objectContaining({
        id: '123',
        status: StatusMatriculaEnum.CANCELADO
      })
    }));
  });

  it('deve rejeitar requisição sem alunoId', async () => {
    mockRequest.params = {};

    await sut.handle(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ 
      error: 'ID do aluno é obrigatório' 
    });
  });

  it('deve retornar erro se o caso de uso lançar exceção', async () => {
    mockUseCase.execute.mockRejectedValue(new Error('Erro de cancelamento'));

    await sut.handle(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({ 
      error: 'Erro interno', 
      detalhes: 'Erro de cancelamento' 
    });
  });
});