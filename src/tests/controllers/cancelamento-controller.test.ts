import { CancelamentoController } from '../../controllers/cancelamento-controller';
import { Request, Response } from 'express';
import { CancelarMatricula } from '../../domain/usecases/cancelar-matricula';
import { IStatusMatriculaRepository, IStatusMatricula } from '../../contracts/interfaces';
import { StatusMatriculaEnum, StatusMatricula } from '../../domain/entities/status-matricula';

class MockStatusMatricula implements IStatusMatricula {
  _id: string;
  _status: StatusMatriculaEnum;
  _dataMatricula: Date;

  constructor(
    id: string,
    status: StatusMatriculaEnum = StatusMatriculaEnum.ATIVO,
    dataMatricula: Date = new Date()
  ) {
    this._id = id;
    this._status = status;
    this._dataMatricula = dataMatricula;
  }

  getId(): string {
    return this._id;
  }

  getStatus(): StatusMatriculaEnum {
    return this._status;
  }

  getDataMatricula(): Date {
    return this._dataMatricula;
  }

  cancelar(): void {
    this._status = StatusMatriculaEnum.CANCELADO;
  }
}

describe('CancelamentoController', () => {
  let mockUseCase: jest.Mocked<CancelarMatricula>;
  let sut: CancelamentoController;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockUseCase = {
      execute: jest.fn().mockResolvedValue({
        statusMatricula: {
          id: '550e8400-e29b-41d4-a716-446655440000',
          status: StatusMatriculaEnum.CANCELADO,
          dataMatricula: new Date()
        }
      })
    } as any;

    sut = new CancelamentoController(mockUseCase);

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('Validação de Entrada', () => {
    it('deve lançar erro para ID de aluno vazio', async () => {
      mockRequest = {
        params: { alunoId: '' }
      };

      await sut.handle(
        mockRequest as Request, 
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'VALIDATION_ERROR',
          message: expect.stringContaining('obrigatório')
        })
      );
    });

    it('deve lançar erro para ID de aluno inválido', async () => {
      mockRequest = {
        params: { alunoId: 'invalid-uuid' }
      };

      await sut.handle(
        mockRequest as Request, 
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'VALIDATION_ERROR',
          message: expect.stringContaining('UUID')
        })
      );
    });
  });

  describe('Tratamento de Erros', () => {
    it('deve tratar erros internos corretamente', async () => {
      mockUseCase.execute.mockRejectedValue(new Error('Erro de processamento'));

      mockRequest = {
        params: { alunoId: '550e8400-e29b-41d4-a716-446655440000' }
      };

      await sut.handle(
        mockRequest as Request, 
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'INTERNAL_ERROR',
          message: 'Erro interno do servidor'
        })
      );
    });
  });

  describe('Tratamento de Erros Desconhecidos', () => {
    it('deve retornar erro 500 para erros não identificados', async () => {
      const mockCancelarMatricula = {
        execute: jest.fn().mockRejectedValue(null)
      } as unknown as CancelarMatricula;

      const controller = new CancelamentoController(mockCancelarMatricula);

      const mockRequest = {
        params: { alunoId: 'aluno-teste' }
      } as unknown as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      await controller.handle(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        type: 'INTERNAL_ERROR',
        message: 'Erro desconhecido'
      });
    });

    it('deve retornar erro 500 para valores primitivos não tratados', async () => {
      const mockCancelarMatricula = {
        execute: jest.fn().mockRejectedValue('string de erro')
      } as unknown as CancelarMatricula;

      const controller = new CancelamentoController(mockCancelarMatricula);

      const mockRequest = {
        params: { alunoId: 'aluno-teste' }
      } as unknown as Request;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      } as unknown as Response;

      await controller.handle(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        type: 'INTERNAL_ERROR',
        message: 'Erro desconhecido'
      });
    });
  });

  describe('Caso de Sucesso', () => {
    it('deve cancelar matrícula com sucesso', async () => {
      mockRequest = {
        params: { alunoId: '550e8400-e29b-41d4-a716-446655440000' }
      };

      await sut.handle(
        mockRequest as Request, 
        mockResponse as Response
      );

      expect(mockUseCase.execute).toHaveBeenCalledWith({ 
        alunoId: '550e8400-e29b-41d4-a716-446655440000' 
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          mensagem: 'Cancelamento de matrícula realizado com sucesso'
        })
      );
    });
  });
});