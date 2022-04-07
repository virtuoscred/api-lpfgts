import axios from "axios";
import { ISimulationData } from "../interfaces/apiSimulationInterface";
import { IClient } from "../models/client";

export interface IParcela {
    DataVencimento: string,
    valor: number
}

interface IListParcelas {
    cpf: Number,
    parcelas: IParcela[]
}

export const getSaldoFGTS = async (cpf_client: Number, token: string): Promise<IListParcelas> => {

    const baseUrl = `https://api.mercantil.com.br:8443/PropostasExternas/v1/Clientes/${cpf_client}/SaquesAniversario/Saldo`
    const { data, status } = await axios.get(baseUrl,
        {
            validateStatus: () => true,

            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })

    const messageError = data?.errors?.[0].key

    if (messageError === 'OperacaoNaoAutorizada') {
        throw new Error('Operação não autorizada na instituição financeira');
    }

    if (messageError === 'ClienteSemFgts') {
        throw new Error('Cliente  não possui conta FGTS');
    }

    if (messageError === 'SaqueAniversarioNaoAderido') {
        throw new Error('Saque aniversário não aderido');
    }

    if (messageError === 'ValorParcelaObrigatorio') {
        throw new Error('Saldo Insulficiente');
    }

    if (messageError === 'CpfInvalido') {
        throw new Error('CPF inválido');
    }

    if (status === 200) {
        const listParcelas = {
            cpf: data.cpf,
            parcelas: data?.parcelas.map(item => {
                return {
                    DataVencimento: item.dataRepasse,
                    valor: item.valor
                }
            })
        }

        return listParcelas
    }

}

export const getSimulationFGTS = async (dataSimulation: IListParcelas, token: string) => {
    const baseUrl = 'https://api.mercantil.com.br:8443/PropostasExternas/v1/Simulacoes/Fgts'

    const correspondente = {
        Correspondente: {
            UsuarioDigitador: "X335487",
            CpfAgenteCertificado: 6910423909,
            UfAtuacao: "PR"
        }
    }

    const { data, status } = await axios.post(baseUrl, { ...dataSimulation, ...correspondente }, {
        validateStatus: () => true,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })

    if (status === 200) {
        return data
    }

    if (data.errors[0].key === 'ValorParcelaObrigatorio') {
        throw new Error('Não possui saldo suficiente para realizar a simulação')
    }

    throw new Error('Erro ao realizar a simulação')

}

export const saveSimulationService = async (dataApi: ISimulationData) => {
    return async (dataSimulation: IClient) => {
        return await dataApi.create(dataSimulation)
    }
}