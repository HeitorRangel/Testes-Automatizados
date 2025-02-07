import { ConsultarCronogramaUseCase } from "../../domain/usecases/ConsultarCronogramaUseCase";
import { ConsultarCronogramaController } from "../../controllers/ConsultarCronogramaController";
import { ConsultarCronogramaRepository } from "../../data/repositories/ConsultarCronogramaRepository";

export function factoryConsultarCronograma() {
    const repository = new ConsultarCronogramaRepository();
    const useCase = new ConsultarCronogramaUseCase(repository);
    return new ConsultarCronogramaController(useCase);
}