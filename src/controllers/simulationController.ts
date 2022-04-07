import { Request, Response } from 'express'
import { ApiSimulation } from '../data/simularionData';
import { getTokenService } from "../useCases/authenticateService";
import { getSaldoFGTS, getSimulationFGTS, IParcela, saveSimulationService } from "../useCases/simulationService";
import { clearMask } from '../utils/clearMask';

export const simulationController = async (req: Request, res: Response) => {
    try {
        const { cpf, phone, list_parcelas } = req.query;
        const cpfSanitized = Number(clearMask(cpf.toString()));
        const token = await getTokenService()
        const listParcelas = await getSaldoFGTS(cpfSanitized, token)
        const saveSimulation = await saveSimulationService(ApiSimulation())

        if (!list_parcelas) {
            const simulation = await getSimulationFGTS({ cpf: cpfSanitized, parcelas: listParcelas.parcelas }, token)
            if (simulation.id) {
                await saveSimulation({
                    cpf: cpfSanitized.toString(),
                    phone: phone.toString(),
                    id_simulation: simulation.id.toString()
                })
                return res.status(200).json(simulation);
            }
        }

        list_parcelas as any
        let parcelas: IParcela[] = JSON.parse(list_parcelas?.toString());
        const simulation = await getSimulationFGTS({ cpf: cpfSanitized, parcelas: parcelas }, token)
        await saveSimulation({
            cpf: cpfSanitized.toString(),
            phone: phone.toString(),
            id_simulation: simulation.id,
        })
        return res.status(200).json(simulation);

    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: 'Erro ao buscar saldo',
            error: error.message
        })
    }
}