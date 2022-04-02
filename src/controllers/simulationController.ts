import { Request, Response } from 'express'
import { authenticateService } from '../useCases/authenticateService';
import { createOrderFGTSService, getLinkService, ISimulation, sendContractSMSService, simulationServices } from '../useCases/simulationServices';
import dayjs from 'dayjs';
import { clearMask } from '../utils/clearMask';
import Client from '../models/client';
import { IOrderFGTS } from '../interfaces/globalInterfaces';

export const verifyAuthorizateFGTS = async (req: Request, res: Response) => {
    try {
        const { cpf, phone, valor_solicitado } = req.query

        const USER_CPF = process.env.USER_CPF as string
        const USER_CODE = process.env.USER_CODE as string
        const USER_PASSWORD = process.env.USER_PASSWORD as string

        const { token } = await authenticateService({
            type: 'pan',
            user_bank: USER_CPF,
            code_bank: USER_CODE,
            password: USER_PASSWORD,
        })
        const clearCpf = cpf.toString().replace(/[^\d]+/g, '')
        let validateBody: ISimulation = {
            codigo_promotora: USER_CODE,
            cpf_cliente: clearCpf,
            data_nascimento: '30-06-1992',
            incluir_seguro: false,
        }
        valor_solicitado && Number(valor_solicitado) > 0 ? validateBody = { ...validateBody, valor_solicitado: valor_solicitado.toString() } : null
        const simulation = await simulationServices(validateBody, token)

        const saveSimulation = await Client.create({
            nome: null,
            cpf: clearMask(cpf.toString()),
            phone: clearMask(phone.toString()),
            condicao_credito: simulation,
        })

        return res.status(200).json(simulation)

    } catch (error: any) {
        console.log(`Falha a simulacao ${error}`)
        return res.status(400).json({ error: error.message })
    }
}

export const createOrder = async (req: Request, res: Response) => {
    try {
        const {
            nome,
            nascimento,
            mae,
            documento_rg,
            banco,
            agencia,
            conta,
            tipo,
            logradouro,
            numero,
            complemento,
            bairro,
            cidade,
            uf,
            cep,
            cpf,
            phone,
            emissao_rg,
            nacionalidade
        } = req.body

        const USER_CPF = process.env.USER_CPF as string
        const USER_CODE = process.env.USER_CODE as string
        const USER_PASSWORD = process.env.USER_PASSWORD as string

        const { token } = await authenticateService({
            type: 'pan',
            user_bank: USER_CPF,
            code_bank: USER_CODE,
            password: USER_PASSWORD,
        })

        const splitPhone = `${phone}`.split(' ')

        const lastSimulation = await Client.findOne({ cpf: clearMask(cpf) }).sort({ "createAt": -1 })
        const isCEF = banco === '104'
        const splitedTipo = isCEF ? `${tipo}`.split(':') : tipo
        const convertDate = `${nascimento}`.replace('/', '-').replace('/', '-')

        const orderSchema: IOrderFGTS = {
            cliente: {
                nome: nome,
                data_nascimento: convertDate,
                cpf_cliente: clearMask(cpf),
                dados_bancarios: {
                    codigo_meio_liberacao: banco === "623" ? '024' : "020",
                    numero_agencia: agencia,
                    numero_banco: banco,
                    numero_conta: conta,
                    tipo_conta: isCEF ? splitedTipo[1] : tipo,
                },
                enderecos: [{
                    bairro: bairro,
                    cep: clearMask(cep),
                    cidade: cidade,
                    logradouro: logradouro,
                    numero: numero,
                    tipo: "FISICO",
                    uf: uf
                }],
                estado_civil: "SOLTEIRO",
                nacionalidade: "BRASILEIRA",
                nome_mae: mae,
                numero_documento: documento_rg,
                pessoa_politicamente_exposta: false,
                renda_valor: 5000,
                telefones: [
                    {
                        ddd: clearMask(splitPhone[0]),
                        numero: clearMask(splitPhone[1]),
                        tipo: "CELULAR"
                    }
                ],
            },
            codigo_digitador: process.env.CODE_DIGITADOR,
            codigo_promotora: process.env.USER_CODE,
            codigo_filial: '016',
            codigo_supervisor: '000016',
            cpf_usuario_certificado: '06910423909',
            operacoes_credito: [
                {
                    condicao_credito: {
                        ...lastSimulation.condicao_credito,
                    }
                }
            ]
        }

        isCEF ? orderSchema.cliente.dados_bancarios.CodOperCEF = splitedTipo[0] : null

        const createOrder = await createOrderFGTSService({ ...orderSchema }, token)

        if (createOrder.status === 200) {
            const { data, status } = await getLinkService({
                codigo_promotora: process.env.USER_CODE as string,
                cpf_client: clearMask(cpf),
                numero_proposta: createOrder.data[0].numero_proposta
            }, token)

            if (status === 200) {

                res.status(200).json(data.linkCliente)
                await sendContractSMSService({
                    codigo_promotora: process.env.USER_CODE as string,
                    cpf_client: clearMask(cpf),
                    numero_proposta: createOrder.data[0].numero_proposta
                },
                    clearMask(phone),
                    token)
            }
        }


        if (createOrder.status === 400) {
            return res.status(400).json({
                error: createOrder.data.detalhes[0]
            })
        }

        if (createOrder.status === 504) {
            return res.status(504).json({
                error: 'api of bank offline'
            })
        }

    } catch (error) {
        console.log(`Falha criacao da ordem ${error}`)
        return res.status(400).json({ error: error.message })
    }
}