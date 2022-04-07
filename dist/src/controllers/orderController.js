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
exports.createOrderController = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const client_1 = __importDefault(require("../models/client"));
const authenticateService_1 = require("../useCases/authenticateService");
const orderService_1 = require("../useCases/orderService");
const clearMask_1 = require("../utils/clearMask");
const createOrderController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Cpf, Telefone, NumeroDoc, EmissaoDoc, TipoDocumento, UfOrgaoEmissor, Banco, Agencia, NumeroConta, ContaDigito, TipoContaBancaria, Email, Cep, NumeroCasa, } = req.body;
        const TelefoneDDD = Number(Telefone.substring(1, 3));
        const NumeroCelular = Number(Telefone.substring(5, Telefone.length));
        const dataSplited = `${EmissaoDoc}`.replace(/\//g, '-').split('-');
        const convertDate = dataSplited.length === 3 ? `${dataSplited[2]}-${dataSplited[1]}-${dataSplited[0]}` : `2022-01-06`;
        const USUARIO_DIGITADOR = process.env.USUARIO_DIGITADOR;
        const UF_ATUACAO = process.env.UF_ATUACAO;
        const CPF_CERTIFICADO = process.env.CPF_CERTIFICADO;
        const token = yield (0, authenticateService_1.getTokenService)();
        const simulations = yield client_1.default.find({ cpf: (0, clearMask_1.clearMask)(Cpf) });
        const idSimulation = simulations === null || simulations === void 0 ? void 0 : simulations.sort((a, b) => {
            return (0, dayjs_1.default)(b.createAt).diff((0, dayjs_1.default)(a.createAt));
        });
        const newOrder = yield (0, orderService_1.createOrderService)({
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
                Cpf: Number((0, clearMask_1.clearMask)(Cpf)),
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
                    Cep: Number((0, clearMask_1.clearMask)(Cep)),
                    Complemento: '',
                    Numero: NumeroCasa,
                },
                ValorRenda: 4000,
            }
        }, token);
        if (newOrder.data.id) {
            return res.status(201).json({
                created: true,
                id_proposta: newOrder.data.id
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            created: false,
            error: error.message
        });
    }
});
exports.createOrderController = createOrderController;
