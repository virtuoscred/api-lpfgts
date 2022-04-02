"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../configs/database"));
const ClientSchema = new database_1.default.Schema({
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
        type: Date,
        default: Date.now
    }
});
const Client = database_1.default.model('Client', ClientSchema);
exports.default = Client;
