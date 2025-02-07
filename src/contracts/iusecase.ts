export interface IUseCase<Entrada, Saida> {
  execute(entrada: Entrada): Promise<Saida>;
}