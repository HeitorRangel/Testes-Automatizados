import { CancelamentoController } from '../../controllers/cancelamento-controller';
import { Request, Response } from 'express';
import { CancelarMatricula } from '../../domain/usecases/cancelar-matricula';
import { StatusMatricula } from '../../domain/entities/status-matricula';
import { 
  IStatusMatriculaGateway 
} from '../../domain/usecases/cancelar-matricula';
import { 
  IEntradaCancelarMatricula, 
  ISaidaCancelarMatricula 
} from '../../contracts/interfaces';

describe('CancelamentoController', () => {
  let mockRepository: jest.Mocked<IStatusMatriculaGateway>;
  let mockUseCase: CancelarMatricula;
  let controller: CancelamentoController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRepository = {
      buscarPorId: jest.fn(),
      salvar: jest.fn()
    };

    mockUseCase = new CancelarMatricula(mockRepository);
    controller = new CancelamentoController(mockUseCase);

    mockRequest = {
      body: {
        alunoId: '123'
      }
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    // Configurar mock do repositório para buscarPorId
    mockRepository.buscarPorId.mockResolvedValue(
      new StatusMatricula('123', 'ATIVO', new Date())
    );
  });

  it('deve cancelar matrícula com sucesso', async () => {
    const statusCancelado = new StatusMatricula('123', 'CANCELADO', new Date());
    
    jest.spyOn(mockUseCase, 'execute').mockResolvedValue({ 
      statusMatricula: {
        id: statusCancelado.getId(),
        status: statusCancelado.getStatus(),
        dataMatricula: statusCancelado.getDataMatricula()
      }
    });

    await controller.handle(mockRequest as Request, mockResponse as Response);

    expect(mockRepository.buscarPorId).toHaveBeenCalledWith('123');
    expect(mockRepository.salvar).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
      statusMatricula: expect.objectContaining({
        id: '123',
        status: 'CANCELADO'
      })
    }));
  });

  it('deve rejeitar requisição sem alunoId', async () => {
    mockRequest.body = {};

    await controller.handle(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: 'ID do aluno é obrigatório' });
  });
});