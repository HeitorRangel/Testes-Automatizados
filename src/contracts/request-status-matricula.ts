import { StatusMatricula } from '../domain/entities/status-matricula';

export interface IStatusMatriculaRepository {
    findAll(): Promise<StatusMatricula[]>;
}