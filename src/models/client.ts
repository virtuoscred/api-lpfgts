import mongoose from '../configs/database';

interface IClient extends mongoose.Document {
    nome: string,
    cpf: string,
    phone: string,
    condicao_credito: {
        prazo: number,
        codigo_tabela_financiamento: string,
        codigo_produto: string,
        despesas: [],
        parcelas: [],
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
    },
    createAt?:string
}

const ClientSchema = new mongoose.Schema({
    nome: String,
    cpf: String,
    phone: String,
    condicao_credito: {
        prazo: Number,
        codigo_tabela_financiamento: String,
        codigo_produto: String,
        despesas: [],
        parcelas: [],
        taxa_apropriacao_anual: Number,
        taxa_apropriacao_mensal: Number,
        taxa_cet_anual: Number,
        taxa_cet_mensal: Number,
        taxa_referencia_anual: Number,
        taxa_referencia_mensal: Number,
        valor_bruto: Number,
        valor_cliente: Number,
        valor_financiado: Number,
        valor_solicitado: Number,
        valor_iof: Number,
        valor_liquido: Number,
        tipo_simulacao: String
    },
    createAt: {
        type:Date,
        default:Date.now
    }
})

const Client = mongoose.model<IClient>('Client', ClientSchema)
export default Client