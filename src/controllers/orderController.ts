import dayjs from 'dayjs'
import { Request, Response } from 'express'
import Client from '../models/client'
import { getTokenService } from '../useCases/authenticateService'
import { createOrderService, getLinkOrderService } from '../useCases/orderService'
import { clearMask } from '../utils/clearMask'

export const createOrderController = async (req: Request, res: Response) => {
    try {

        const {
            Cpf,
            Telefone,
            NumeroDoc,
            EmissaoDoc,
            TipoDocumento,
            UfOrgaoEmissor,
            Banco,
            Agencia,
            NumeroConta,
            ContaDigito,
            TipoContaBancaria,
            Email,
            Cep,
            NumeroCasa,
        } = req.body
        const TelefoneDDD = Number(Telefone.substring(1, 3))
        const NumeroCelular = Number(Telefone.substring(5, Telefone.length))
        const dataSplited = `${EmissaoDoc}`.replace(/\//g, '-').split('-')
        const convertDate = dataSplited.length === 3 ? `${dataSplited[2]}-${dataSplited[1]}-${dataSplited[0]}` : `2022-01-06`

        const USUARIO_DIGITADOR = process.env.USUARIO_DIGITADOR
        const UF_ATUACAO = process.env.UF_ATUACAO
        const CPF_CERTIFICADO = process.env.CPF_CERTIFICADO

        const token = await getTokenService()

        const simulations = await Client.find({ cpf: clearMask(Cpf) })

        const idSimulation = simulations?.sort((a, b) => {
            return dayjs(b.createAt).diff(dayjs(a.createAt))
        })

        const newOrder = await createOrderService({
            SimulacaoId: idSimulation[0].id_simulation,
            Correspondente: {
                CpfAgenteCertificado: Number(CPF_CERTIFICADO),
                UfAtuacao: UF_ATUACAO,
                UsuarioDigitador: USUARIO_DIGITADOR
            },
            Liberacao: {
                TipoContaBancaria: TipoContaBancaria,
                Agencia: Number(Agencia),
                Banco: Number(Banco),
                NumeroConta: NumeroConta,
                ContaDigito: Number(ContaDigito),
            },
            Cliente: {
                Cpf: Number(clearMask(Cpf)),
                Contatos: {
                    DddCelular: TelefoneDDD,
                    NumeroCelular: NumeroCelular,
                    Email: Email,
                },
                DocumentoIdentificacao: {
                    DataEmissao: convertDate,
                    Numero: NumeroDoc,
                    OrgaoEmissor: 'SSP',
                    TipoDocumento: TipoDocumento,
                    UfOrgaoEmissor: UfOrgaoEmissor,
                },
                EnderecoResidencial: {
                    Cep: Number(clearMask(Cep)),
                    Complemento: '',
                    Numero: NumeroCasa,
                },
                ValorRenda: 4000,
            }
        }, token)

        if (newOrder.data.id) {
           return res.status(201).json({
               created: true,
               id_proposta: newOrder.data.id
           })
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            created: false,
            error: error.message
        })
    }
}