import { ISimulationData } from "../interfaces/apiSimulationInterface";
import { IClient } from "../interfaces/globalInterfaces";
import Client from "../models/client";
import { clearMask } from "../utils/clearMask";

export const ApiSimulation = (): ISimulationData  => {
    return {
        create: async (data: IClient) => {
            return await Client.create({
                ...data
            })
        },
        getOne: async (cpf: string) => {
            return await Client.find({ cpf: clearMask(cpf) })
        },
    }
}