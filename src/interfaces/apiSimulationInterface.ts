import { IClient } from "../models/client";

export interface ISimulationData {
    create: (data: IClient)=> Promise<IClient | null>,
    getOne: (cpf: string)=> Promise<IClient[] | null>,
}