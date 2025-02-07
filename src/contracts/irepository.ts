export interface IRepository<E> {
    findAll(): Promise<E[]>;
    findById(id: string): Promise<E | undefined>;
    create(id: string, obj: E): Promise<E>;
    update(id: string, obj: E): Promise<E>;
    delete(id: string): Promise<boolean>;
}