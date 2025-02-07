import { IRepository } from "contracts/IRepository";
import { ICronograma } from "domain/entities/Cronograma";
import { ConsultarCronogramaUseCase, IEntradaConsultarCronograma } from "../../src/domain/usecases/ConsultarCronogramaUseCase";


class RepositoryFake implements IRepository<ICronograma> {
    private opcao: string;
    constructor(opcao: string){
        this.opcao=opcao;
    }
    findAll(): Promise<ICronograma[]> {
        throw new Error("Method not implemented.");
    }
    findById(id: string): Promise<ICronograma | undefined> {
        if(this.opcao === 'certo') {
            return Promise.resolve({
                    disciplinaId: id,
                    atividades: [{ data: "2025-02-03", descricao: "Teste" },{ data: "2025-02-03", descricao: "Teste" },{ data: "2025-02-03", descricao: "Teste" },{ data: "2025-02-03", descricao: "Teste" },{ data: "2025-02-03", descricao: "Teste" }]
                } as unknown as ICronograma);
        }if(this.opcao === 'falta atividade') {
            return Promise.resolve({
                    disciplinaId: id,
                    atividades: [{ data: "2025-02-03", descricao: "Teste" }]
                } as unknown as ICronograma);
        }if(this.opcao === 'falta cronograma') {
            return Promise.resolve(undefined);
        }if(this.opcao === 'erro'){
            throw new Error('Teste');
        }else {
            return Promise.resolve(undefined);
        }
    }
    create(id: string, obj: ICronograma): Promise<ICronograma> {
        throw new Error("Method not implemented.");
    }
    update(id: string, obj: ICronograma): Promise<ICronograma> {
        throw new Error("Method not implemented.");
    }
    delete(id: string): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

}

function makeSUT(opcao: string) {
    const repo = new RepositoryFake(opcao);
    const uc = new ConsultarCronogramaUseCase(repo);
    return { repo, uc };
}

describe('ConsultarCronogramaUseCase', () => {
    
    it('deve instanciar ConsultarCronogramaUseCase', () => {
        let { repo, uc } = makeSUT('1');
        expect(uc).toBeDefined();
    });

    it('deve chamar perform', async () => {
        let { repo, uc } = makeSUT('certo');
        const entrada: IEntradaConsultarCronograma = {disciplinaId: 1}
        const saida = await uc.perform(entrada);

        expect(saida.cronograma.disciplinaId).toBe("1");
        expect(saida.cronograma.atividades[0].data).toBe("2025-02-03");
        expect(saida.cronograma.atividades[0].descricao).toBe("Teste");
        
    });

    it('deve retornar erro caso tenha menos de 5 atividades', async () => {
        let { repo, uc } = makeSUT('falta atividade');
        const entrada: IEntradaConsultarCronograma = {disciplinaId: 1}
        let erro: any;
        try{
            const saida = await uc.perform(entrada);
        }catch(e: any){
            erro = e;
        }
        expect(erro.message).toBe("Cronograma deve ter pelo menos 5 atividades");
        
    });

    it('deve retornar erro caso repositório não retorne o cronograma', async () => {
        let { repo, uc } = makeSUT('falta gronograma');
        const entrada: IEntradaConsultarCronograma = {disciplinaId: 1}
        let erro: any;
        try{
            const saida = await uc.perform(entrada);
        }catch(e: any){
            erro = e;
        }
        expect(erro.message).toBe("Cronograma não encontrado");
        
    });

    it('deve retornar erro caso o id seja maior que 49', async () => {
        let { repo, uc } = makeSUT('certo');
        const entrada: IEntradaConsultarCronograma = {disciplinaId: 51}
        let erro: any;
        try{
            const saida = await uc.perform(entrada);
        }catch(e: any){
            erro = e;
        }
        expect(erro.message).toBe("O id da disciplina não pode ser maior que 50");
        
    });

    it('deve retornar erro caso ocorra algum erro no repositório', async () => {
        let { repo, uc } = makeSUT('erro');
        const entrada: IEntradaConsultarCronograma = {disciplinaId: 50}
        let erro: any;
        try{
            const saida = await uc.perform(entrada);
        }catch(e: any){
            erro = e;
        }
        expect(erro.message).toBe("Erro no repositório");
        
    });

});