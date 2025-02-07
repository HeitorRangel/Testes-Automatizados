import { CancelamentoController } from '../../controllers/cancelamento-controller';
import { Request, Response } from 'express';
import { ConsultarStatusMatricula } from '../../domain/usecases/cancelar-matricula';
import { StatusMatricula } from '../../domain/entities/status-matricula';

describe('CancelamentoController', () => {
  let mockUseCase: jest.Mocked<ConsultarStatusMatricula>;
  let controller: CancelamentoController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    // Configuração de mocks
    mockUseCase = {
      execute: jest.fn()
    } as any;

    controller = new CancelamentoController(mockUseCase);

    mockRequest = {
      params: { alunoId: '12345' }
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      end: jest.fn()
    };
  });

  it('deve consultar status de matrícula com sucesso', async () => {
    // Arrange
    const mockStatusMatricula = new StatusMatricula(
      '12345', 
      'ATIVO', 
      new Date()
    );

    const mockResultado = { statusMatricula: mockStatusMatricula };

    mockUseCase.execute.mockResolvedValue(mockResultado);

    // Act
    await controller.handle(mockRequest as Request, mockResponse as Response);

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        mensagem: 'Consulta de status de matrícula realizada com sucesso',
        statusMatricula: mockStatusMatricula
      })
    );
  });

  it('deve tratar erro no use case', async () => {
    // Arrange
    mockUseCase.execute.mockRejectedValue(new Error('Erro no processamento'));

    // Act
    await controller.handle(mockRequest as Request, mockResponse as Response);

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({ 
        error: 'Erro interno',
        detalhes: 'Erro no processamento'
      })
    );
  });

  it('deve rejeitar requisição sem alunoId', async () => {
    // Arrange
    mockRequest.params = {};

    // Act
    await controller.handle(mockRequest as Request, mockResponse as Response);

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({ 
        error: 'ID do aluno é obrigatório'
      })
    );
  });
});