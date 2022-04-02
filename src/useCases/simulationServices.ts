import axios from "axios";
import { IGetLink, IOrderFGTS } from "../interfaces/globalInterfaces";

export interface ISimulation {
    cpf_cliente: string,
    codigo_promotora: string,
    incluir_seguro: boolean,
    data_nascimento: string,
    valor_solicitado?: string
}

export const simulationServices = async (params: ISimulation, acess_token: string) => {

    const CODE_MANY_REQUEST = "99"
    const CODE_NO_FIND_AUTHORIZED = "7"
    const CODE_NO_ACCEPT_FGTS = "9"
    const CODE_ERROR_SERVER = "3"
    const CODE_INVALID_CPF = "400"
    const CODE_NOT_ACCOUNT = "8"
    const CODE_INVALID_PROMOTORA = "113950004"

    const CLIENT_APIKEY = process.env.CLIENT_APIKEY as string
    const base_url = 'https://api.bancopan.com.br/openapi/consignado/v2/emprestimos/simulacao/fgts'

    let { data, status, } = await axios.post(base_url, {
        ...params
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${acess_token}`,
            'ApiKey': CLIENT_APIKEY,
        },
        validateStatus: () => true,
        timeout: 180000
    })
    
    if (!data) {
        throw new Error('Api Bank not response')
    }

    if (status === 200 && data.condicoes_credito[0].sucesso === true) {
        return data.condicoes_credito[0]
    }

    if (status === 200 && data.condicoes_credito[0].sucesso === false) {
        throw new Error('Zero simularion found')
    }

    if (status === 400) {
        if (data.codigo == CODE_NO_FIND_AUTHORIZED) {
            throw new Error('Bank not authorized')
        }

        if (data.codigo == CODE_NO_ACCEPT_FGTS) {
            throw new Error('Service not authorized')
        }

        if (data.codigo == CODE_INVALID_CPF && data.detalhes[0] === 'cpf: Campo: cpf_cliente inválido') {
            throw new Error('Invalid CPF')
        }

        if (data.codigo == CODE_INVALID_PROMOTORA) {
            throw new Error('Invalid Promotora')
        }

        if (!data.codigo) {
            throw new Error('Many Requests')
        }

        throw new Error('Fail server')
    }

}

export const createOrderFGTSService = async (order: IOrderFGTS, access_token: string) => {
    const { data, status } = await axios.post('https://api.bancopan.com.br/openapi/consignado/v1/emprestimos/propostas/fgts', order,
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`,
                'ApiKey': process.env.CLIENT_APIKEY as string,
            },
            validateStatus: () => true,
            timeout: 200000
        }
    )
    
    return { data, status }
}

export const getLinkService = async (params: IGetLink, access_token: string) => {
    const { codigo_promotora, cpf_client, numero_proposta } = params
    const { data, status } = await axios.get(`https://api.bancopan.com.br/consignado/v0/formalizador/${codigo_promotora}/${cpf_client}/${numero_proposta}/links`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`,
            'ApiKey': process.env.CLIENT_APIKEY as string,
        },
        validateStatus: () => true,
        timeout: 200000
    }
    )
    return { data, status }
}

export const sendContractSMSService = async (params: IGetLink, phone: string, access_token: string) => {
    const { codigo_promotora, cpf_client, numero_proposta } = params
    const { data, status } = await axios.post(`https://api.bancopan.com.br/consignado/v0/formalizador/${codigo_promotora}/${cpf_client}/${numero_proposta}/links?tipoEnvio=sms`,
        {
            destinatario: phone
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${access_token}`,
                'ApiKey': process.env.CLIENT_APIKEY as string,
            },

            validateStatus: () => true,
            timeout: 200000
        }
    )
    return { data, status }
}




