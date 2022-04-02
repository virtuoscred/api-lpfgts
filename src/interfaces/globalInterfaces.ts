export interface ISimulation {
    condicoes_credito: ISimulationItem[]
    codigo?: string,
    detalhes?: string[]
}

export interface ISimulationError {
    codigo: string,
    mensagem: string,
    origem: string,
    detalhes: string[]
}

export interface ISimulationItem {
    sucesso: boolean,
    mensagemErro: string,
    prazo: number,
    codigo_tabela_financiamento: number,
    descricao_tabela_financiamento: string,
    codigo_produto: number,
    descricao_produto: string,
    despesas: [],
    parcelas: [
        {
            num_parcela: number,
            valor_parcela: number,
            data_vencimento: string
        }
    ],
    taxa_apropriacao_anual: number,
    taxa_apropriacao_mensal: number,
    taxa_cet_anual: number,
    taxa_cet_mensal: number,
    taxa_referencia_anual: number,
    taxa_referencia_mensal: number,
    valor_bruto: number,
    valor_cliente: number,
    valor_financiado: number,
    valor_solicitado: number,
    valor_iof: number,
    valor_liquido: number,
    tipo_simulacao: string
}

export interface IOrderFGTS {
    cliente: {
        cpf_cliente: string,
        telefones: [
            {
                tipo: "FONE_FISICO" | "CELULAR",
                ddd: string,
                numero: string,
            }
        ],
        enderecos: [
            {
                tipo: "FISICO",
                logradouro: string,
                numero: string,
                bairro: string,
                cidade: string,
                uf: string,
                cep: string,
            }
        ],
        dados_bancarios: {
            numero_agencia: string,
            numero_banco: string,
            numero_conta: string,
            codigo_meio_liberacao: "020" | "024",
            digito_conta?: string,
            tipo_conta: "CONTA_CORRENTE_INDIVIDUAL" | "CONTA_POUPANCA_INDIVIDUAL" | "CONTA_SALARIO" | "CONTA_CORRENTE_CONJUNTA" | "CONTA_POUPANCA_CONJUNTA" | "CONTA_INVESTIMENTO",
            CodOperCEF?: "001" | "002" | "013" | "023" | "032" | "037"
        },
        data_nascimento: string,
        estado_civil: string,
        nacionalidade: string,
        nome: string,
        numero_documento: string,
        data_emissao_documento?: string,
        uf_emissao_documento?: string,
        nome_mae: string,
        pessoa_politicamente_exposta: false,
        renda_valor: number
    },
    codigo_digitador: string,
    codigo_filial: string,
    codigo_supervisor: string,
    codigo_promotora: string,
    cpf_usuario_certificado?: string,
    operacoes_credito: [
        {
            condicao_credito: {
                prazo: number,
                codigo_tabela_financiamento: string,
                codigo_produto: string,
                despesas: object[],
                parcelas: object[],
                taxa_apropriacao_anual: number,
                taxa_apropriacao_mensal: number,
                taxa_cet_anual: number,
                taxa_cet_mensal: number,
                taxa_referencia_anual: number,
                taxa_referencia_mensal: number,
                valor_bruto: number,
                valor_cliente: number,
                valor_financiado: number,
                valor_solicitado: number,
                valor_iof: number,
                valor_liquido: number,
                tipo_simulacao: string,
            }
        }
    ],
    // NumeroExterno?: string
}

export interface IGetLink {
    codigo_promotora: string,
    cpf_client: string,
    numero_proposta: string
}