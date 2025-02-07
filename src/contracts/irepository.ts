export interface IRepository<E> {
    findAll(): Promise<E[]>;
    findById(id: string): Promise<E | undefined>;
}