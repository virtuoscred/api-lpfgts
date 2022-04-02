"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOrder = exports.verifyAuthorizateFGTS = void 0;
const authenticateService_1 = require("../useCases/authenticateService");
const simulationServices_1 = require("../useCases/simulationServices");
const clearMask_1 = require("../utils/clearMask");
const client_1 = __importDefault(require("../models/client"));
const verifyAuthorizateFGTS = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cpf, phone, valor_solicitado } = req.query;
        const USER_CPF = process.env.USER_CPF;
        const USER_CODE = process.env.USER_CODE;
        const USER_PASSWORD = process.env.USER_PASSWORD;
        const { token } = yield (0, authenticateService_1.authenticateService)({
            type: 'pan',
            user_bank: USER_CPF,
            code_bank: USER_CODE,
            password: USER_PASSWORD,
        });
        const clearCpf = cpf.toString().replace(/[^\d]+/g, '');
        let validateBody = {
            codigo_promotora: USER_CODE,
            cpf_cliente: clearCpf,
            data_nascimento: '30-06-1992',
            incluir_seguro: false,
        };
        valor_solicitado && Number(valor_solicitado) > 0 ? validateBody = Object.assign(Object.assign({}, validateBody), { valor_solicitado: valor_solicitado.toString() }) : null;
        const simulation = yield (0, simulationServices_1.simulationServices)(validateBody, token);
        const saveSimulation = yield client_1.default.create({
            nome: null,
            cpf: (0, clearMask_1.clearMask)(cpf.toString()),
            phone: (0, clearMask_1.clearMask)(phone.toString()),
            condicao_credito: simulation,
        });
        return res.status(200).json(simulation);
    }
    catch (error) {
        console.log(`Falha a simulacao ${error}`);
        return res.status(400).json({ error: error.message });
    }
});
exports.verifyAuthorizateFGTS = verifyAuthorizateFGTS;
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nome, nascimento, mae, documento_rg, banco, agencia, conta, tipo, logradouro, numero, complemento, bairro, cidade, uf, cep, cpf, phone, emissao_rg, nacionalidade } = req.body;
        const USER_CPF = process.env.USER_CPF;
        const USER_CODE = process.env.USER_CODE;
        const USER_PASSWORD = process.env.USER_PASSWORD;
        const { token } = yield (0, authenticateService_1.authenticateService)({
            type: 'pan',
            user_bank: USER_CPF,
            code_bank: USER_CODE,
            password: USER_PASSWORD,
        });
        const splitPhone = `${phone}`.split(' ');
        const lastSimulation = yield client_1.default.findOne({ cpf: (0, clearMask_1.clearMask)(cpf) }).sort({ "createAt": -1 });
        const isCEF = banco === '104';
        const splitedTipo = isCEF ? `${tipo}`.split(':') : tipo;
        const convertDate = `${nascimento}`.replace('/', '-').replace('/', '-');
        const orderSchema = {
            cliente: {
                nome: nome,
                data_nascimento: convertDate,
                cpf_cliente: (0, clearMask_1.clearMask)(cpf),
                dados_bancarios: {
                    codigo_meio_liberacao: banco === "623" ? '024' : "020",
                    numero_agencia: agencia,
                    numero_banco: banco,
                    numero_conta: conta,
                    tipo_conta: isCEF ? splitedTipo[1] : tipo,
                },
                enderecos: [{
                        bairro: bairro,
                        cep: (0, clearMask_1.clearMask)(cep),
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
                        ddd: (0, clearMask_1.clearMask)(splitPhone[0]),
                        numero: (0, clearMask_1.clearMask)(splitPhone[1]),
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
                    condicao_credito: Object.assign({}, lastSimulation.condicao_credito)
                }
            ]
        };
        isCEF ? orderSchema.cliente.dados_bancarios.CodOperCEF = splitedTipo[0] : null;
        const createOrder = yield (0, simulationServices_1.createOrderFGTSService)(Object.assign({}, orderSchema), token);
        if (createOrder.status === 200) {
            const { data, status } = yield (0, simulationServices_1.getLinkService)({
                codigo_promotora: process.env.USER_CODE,
                cpf_client: (0, clearMask_1.clearMask)(cpf),
                numero_proposta: createOrder.data[0].numero_proposta
            }, token);
            if (status === 200) {
                res.status(200).json(data.linkCliente);
                yield (0, simulationServices_1.sendContractSMSService)({
                    codigo_promotora: process.env.USER_CODE,
                    cpf_client: (0, clearMask_1.clearMask)(cpf),
                    numero_proposta: createOrder.data[0].numero_proposta
                }, (0, clearMask_1.clearMask)(phone), token);
            }
        }
        if (createOrder.status === 400) {
            return res.status(400).json({
                error: createOrder.data.detalhes[0]
            });
        }
        if (createOrder.status === 504) {
            return res.status(504).json({
                error: 'api of bank offline'
            });
        }
    }
    catch (error) {
        console.log(`Falha criacao da ordem ${error}`);
        return res.status(400).json({ error: error.message });
    }
});
exports.createOrder = createOrder;
