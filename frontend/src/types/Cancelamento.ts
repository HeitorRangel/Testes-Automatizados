export interface Cancelamento {
    id: string;
    alunoId: string;
    dataCancelamento: Date;
    motivo?: string;
}