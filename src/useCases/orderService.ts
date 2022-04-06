import axios from "axios";
import { IOrderFGTS } from "../interfaces/globalInterfaces";

export const createOrderService = async (order: IOrderFGTS, token: string) =>{
        const baseUrl = 'https://api.mercantil.com.br:8443/PropostasExternas/v1/Propostas/FGTS'
        const {data, status} = await axios.post(baseUrl, order, {
            validateStatus: () => true,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        return {data,status}
}

export const getLinkOrderService = async (id_simulation: string, token: string) =>{
    const baseUrl = `https://api.mercantil.com.br:8443/PropostasExternas/v1/AutorizacoesDigitais/Proposta/${id_simulation}`
    const {data, status} = await axios.get(baseUrl, {
        validateStatus: () => true,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    return {data,status}
}
