export interface IRepository<E> {
    findById(id: string): Promise<E | undefined>;
    findAll(): Promise<E[]>;
    create(obj: E): Promise<E>;
    // Remover update e delete se não estiverem sendo usados
  }