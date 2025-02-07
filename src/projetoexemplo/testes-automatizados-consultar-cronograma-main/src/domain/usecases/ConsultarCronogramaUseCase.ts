import { ICronograma } from "../entities/Cronograma";
import { IUseCase } from "../../contracts/IUseCase";
import { IRepository } from "contracts/IRepository";

export interface IEntradaConsultarCronograma {
    disciplinaId: number;
}

export interface ISaidaConsultarCronograma {
    cronograma: ICronograma;
}

export class ConsultarCronogramaUseCase implements IUseCase<IEntradaConsultarCronograma, ISaidaConsultarCronograma> {
    private repo: IRepository<ICronograma>;
    constructor(repo: IRepository<ICronograma>) {
        this.repo = repo;
        console.log('ConsultarCronogramaUseCase instanciado');
    }

    async perform(entrada: IEntradaConsultarCronograma): Promise<ISaidaConsultarCronograma> {

        if(entrada.disciplinaId>50){ //A instituição só possui 50 disciplinas cadastradas
            throw new Error('O id da disciplina não pode ser maior que 50');
        }

        let cronograma: ICronograma | undefined;
        try {
            cronograma = await this.repo.findById(String(entrada.disciplinaId));
        } catch(e) {
            throw new Error('Erro no repositório');
        }

        if(!cronograma){
            throw new Error('Cronograma não encontrado');
        }if(cronograma.atividades.length<5) {
            throw new Error('Cronograma deve ter pelo menos 5 atividades');
        }else {
            const saida: ISaidaConsultarCronograma = {
                cronograma: cronograma
            };
            return saida;
        }
    }
}