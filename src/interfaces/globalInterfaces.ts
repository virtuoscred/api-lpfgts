// export interface ISimulation {
//     condicoes_credito: ISimulationItem[]
//     codigo?: string,
//     detalhes?: string[]
// }

export interface ISimulationError {
    codigo: string,
    mensagem: string,
    origem: string,
    detalhes: string[]
}

// export interface ISimulationItem {
//     sucesso: boolean,
//     mensagemErro: string,
//     prazo: number,
//     codigo_tabela_financiamento: number,
//     descricao_tabela_financiamento: string,
//     codigo_produto: number,
//     descricao_produto: string,
//     despesas: [],
//     parcelas: [
//         {
//             num_parcela: number,
//             valor_parcela: number,
//             data_vencimento: string
//         }
//     ],
//     taxa_apropriacao_anual: number,
//     taxa_apropriacao_mensal: number,
//     taxa_cet_anual: number,
//     taxa_cet_mensal: number,
//     taxa_referencia_anual: number,
//     taxa_referencia_mensal: number,
//     valor_bruto: number,
//     valor_cliente: number,
//     valor_financiado: number,
//     valor_solicitado: number,
//     valor_iof: number,
//     valor_liquido: number,
//     tipo_simulacao: string
// }

export interface IOrderFGTS {
    SimulacaoId: string,
    Liberacao: {
        TipoContaBancaria: "ContaCorrente" | "ContaPoupanca",
        Banco: number,
        NumeroConta: number,
        Agencia: number,
        ContaDigito: number
    },
    Correspondente: {
        UsuarioDigitador: string,
        CpfAgenteCertificado: number,
        UfAtuacao: string,
    },
    Cliente: {
        Cpf: number,
        ValorRenda: number,
        EnderecoResidencial: {
            Cep: number,
            Numero: string,
            Complemento:  string
        },
        Contatos: {
            DddCelular: number,
            NumeroCelular: number,
            Email: string
        },
        DocumentoIdentificacao: {
            TipoDocumento: "RG" | "Ctps" | "Passaporte" | "Cnh" | "IdentidadeEstrangeira" | "Outros",
            Numero: string,
            OrgaoEmissor: string,
            UfOrgaoEmissor: string,
            DataEmissao: string
        }
    }
}

export interface IGetLink {
    codigo_promotora: string,
    cpf_client: string,
    numero_proposta: string
}

export interface IClient {
    cpf: string,
    phone: string,
    id_simulation: string,
    createAt?:string
}