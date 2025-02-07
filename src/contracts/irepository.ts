export interface IRepository<E> {
    findAll(): Promise<E[]>;
}