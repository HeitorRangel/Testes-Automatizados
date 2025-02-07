import { StatusMatriculaController } from '../../controllers/status-matricula-controller';
import { Request, Response } from 'express';
import { IUseCase } from '../../contracts/iusecase';
import { StatusMatricula } from '../../domain/entities/status-matricula';
import { 
  IEntradaConsultarStatusMatricula, 
  ISaidaConsultarStatusMatricula 
} from '../../contracts/request-status-matricula';

describe('StatusMatriculaController', () => {
  let mockUseCase: jest.Mocked<IUseCase<IEntradaConsultarStatusMatricula, ISaidaConsultarStatusMatricula>>;
  let controller: StatusMatriculaController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    // Configuração de mocks
    mockUseCase = {
      execute: jest.fn()
    } as any;

    controller = new StatusMatriculaController(mockUseCase);

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
    const mockSaida: ISaidaConsultarStatusMatricula = {
        statusMatricula: new StatusMatricula(
          '12345', 
          'ATIVO', 
          new Date()
        )
      };

    mockUseCase.execute.mockResolvedValue(mockSaida);

    // Act
    await controller.handle(mockRequest as Request, mockResponse as Response);

    // Assert
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(
      expect.objectContaining({
        mensagem: 'Consulta de status de matrícula realizada com sucesso',
        statusMatricula: mockSaida.statusMatricula
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
      expect.objectContaining({ error: 'Erro no processamento' })
    );
  });
});