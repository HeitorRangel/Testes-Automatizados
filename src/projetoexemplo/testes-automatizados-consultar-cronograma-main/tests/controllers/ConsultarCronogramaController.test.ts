import { ConsultarCronogramaController } from "../../src/controllers/ConsultarCronogramaController";
import { IUseCase } from "../../src/contracts/IUseCase";
import { IEntradaConsultarCronograma, ISaidaConsultarCronograma } from "../../src/domain/usecases/ConsultarCronogramaUseCase";
import { Request, Response } from "express";


class UseCaseFake implements IUseCase<IEntradaConsultarCronograma, ISaidaConsultarCronograma> {
    chamado: boolean = false;
    opcao: string;
    constructor (opcao: string) {
        this.opcao = opcao;
    }
    async perform(entrada: IEntradaConsultarCronograma): Promise<any> {
        if(this.opcao === "certo") {
            return {
                cronograma: {
                    disciplinaId: entrada.disciplinaId,
                    atividades: [{ data: "2025-02-03", descricao: "Teste" }]
                }
            };
        }if(this.opcao === "erro") {
            throw new Error("Erro inesperado");
        } if(this.opcao === "errado1") {
            return {
                cronograma: {
                    disciplinaId: 'teste',
                    atividades: [{ data: "2025-02-03", descricao: "Teste" }]
                }
            };
        } if(this.opcao === "errado2") {
            return {
                cronograma: {
                    disciplinaId: '1',
                    atividades: [{ data: false, descricao: "Teste" }]
                }
            };
        } if(this.opcao === "errado3") {
            return {
                cronograma: {
                    disciplinaId: '1',
                    atividades: [{ data: "2025-02-03", descricao: false }]
                }
            };
        }
    }
}

class ResponseFake {
    statusCodeInformado: number = 0;
    jsonInformado: any = null;
    endChamado: boolean = false;
    
    status(code: number): ResponseFake {
        this.statusCodeInformado = code;
        return this;
    }
    
    json(data: any): ResponseFake {
        this.jsonInformado = data;
        return this;
    }

    end(): ResponseFake {
        this.endChamado = true;
        return this;
    }
}

function makeSUT(disciplinaId: any, opcao: string) {
    const requestStub = {
        params: {
            disciplinaId: disciplinaId,
        },
    } as any as Request;
    const responseFake = new ResponseFake();
    const uc = new UseCaseFake(opcao);
    const controller = new ConsultarCronogramaController(uc);
    return { uc, controller, requestStub, responseFake };
}

describe('ConsultarCronogramaController', () => {
    
    it('deve instanciar ConsultarCronogramaController', () => {
        let { uc, controller, requestStub, responseFake } = makeSUT('1', "certo");
        expect(controller).toBeDefined();
    });

    it('deve chamar handle', async () => {
        let { uc, controller, requestStub, responseFake } = makeSUT('1', "certo");
        await controller.handle(requestStub, responseFake as any as Response);

        expect(responseFake.endChamado).toBe(true);
        expect(responseFake.statusCodeInformado).toBe(200);
        expect(responseFake.jsonInformado.mensagem).toBe('ConsultarCronogramaController.metodoBasico() chamado');
        expect(responseFake.jsonInformado.cronograma.atividades[0].data).toBe("2025-02-03");
        expect(responseFake.jsonInformado.cronograma.atividades[0].descricao).toBe("Teste");
        
    });

    it('deve retornar mensagem de erro e código 400 caso não passe parâmetro', async () => {
        let { uc, controller, requestStub, responseFake } = makeSUT(undefined, "certo");
        await controller.handle(requestStub, responseFake as any as Response);

        expect(responseFake.endChamado).toBe(false);
        expect(responseFake.statusCodeInformado).toBe(400);
        expect(responseFake.jsonInformado.error).toBe("disciplinaId é obrigatório");
    });

    it('deve retornar mensagem de erro e código 400 caso passe parâmetro null', async () => {
        let { uc, controller, requestStub, responseFake } = makeSUT(null, "certo");
        await controller.handle(requestStub, responseFake as any as Response);

        expect(responseFake.endChamado).toBe(false);
        expect(responseFake.statusCodeInformado).toBe(400);
        expect(responseFake.jsonInformado.error).toBe("disciplinaId é obrigatório");
    });

    it('deve retornar mensagem de erro e código 400 caso o parâmetro não seja um número', async () => {
        let { uc, controller, requestStub, responseFake } = makeSUT('teste', "certo");
        await controller.handle(requestStub, responseFake as any as Response);

        expect(responseFake.endChamado).toBe(false);
        expect(responseFake.statusCodeInformado).toBe(400);
        expect(responseFake.jsonInformado.error).toBe("disciplinaId precisa ser um número");
    });

    it('deve retornar mensagem de erro e código 400 caso o parâmetro seja um número negativo', async () => {
        let { uc, controller, requestStub, responseFake } = makeSUT('-1', "certo");
        await controller.handle(requestStub, responseFake as any as Response);

        expect(responseFake.endChamado).toBe(false);
        expect(responseFake.statusCodeInformado).toBe(400);
        expect(responseFake.jsonInformado.error).toBe("disciplinaId precisa ser um número positivo");
    });

    it('deve retornar mensagem de erro e código 400 caso o parâmetro não seja um número inteiro', async () => {
        let { uc, controller, requestStub, responseFake } = makeSUT('1.6', "certo");
        await controller.handle(requestStub, responseFake as any as Response);

        expect(responseFake.endChamado).toBe(false);
        expect(responseFake.statusCodeInformado).toBe(400);
        expect(responseFake.jsonInformado.error).toBe("disciplinaId precisa ser um número inteiro");
    });

    it('deve retornar mensagem de erro e código 500 caso algum erro inesperado ocorra', async () => {
        let { uc, controller, requestStub, responseFake } = makeSUT('1', "erro");
        await controller.handle(requestStub, responseFake as any as Response);

        expect(responseFake.endChamado).toBe(false);
        expect(responseFake.statusCodeInformado).toBe(500);
        expect(responseFake.jsonInformado.error).toBe("Erro inesperado");
    });

    it('deve retornar mensagem de erro e código 500 caso a saída do use case não seja um cronograma', async () => {
        let { uc, controller, requestStub, responseFake } = makeSUT('1', "errado1");
        await controller.handle(requestStub, responseFake as any as Response);

        expect(responseFake.endChamado).toBe(false);
        expect(responseFake.statusCodeInformado).toBe(500);
        expect(responseFake.jsonInformado.error).toBe("Retorno do use case não é um cronograma");
    });

    it('deve retornar mensagem de erro e código 500 caso a saída do use case não seja um cronograma', async () => {
        let { uc, controller, requestStub, responseFake } = makeSUT('1', "errado2");
        await controller.handle(requestStub, responseFake as any as Response);

        expect(responseFake.endChamado).toBe(false);
        expect(responseFake.statusCodeInformado).toBe(500);
        expect(responseFake.jsonInformado.error).toBe("Retorno do use case não é um cronograma");
    });

    it('deve retornar mensagem de erro e código 500 caso a saída do use case não seja um cronograma', async () => {
        let { uc, controller, requestStub, responseFake } = makeSUT('1', "errado3");
        await controller.handle(requestStub, responseFake as any as Response);

        expect(responseFake.endChamado).toBe(false);
        expect(responseFake.statusCodeInformado).toBe(500);
        expect(responseFake.jsonInformado.error).toBe("Retorno do use case não é um cronograma");
    });

});