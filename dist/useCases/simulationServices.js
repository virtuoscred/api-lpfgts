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
exports.sendContractSMSService = exports.getLinkService = exports.createOrderFGTSService = exports.simulationServices = void 0;
const axios_1 = __importDefault(require("axios"));
const simulationServices = (params, acess_token) => __awaiter(void 0, void 0, void 0, function* () {
    const CODE_MANY_REQUEST = "99";
    const CODE_NO_FIND_AUTHORIZED = "7";
    const CODE_NO_ACCEPT_FGTS = "9";
    const CODE_ERROR_SERVER = "3";
    const CODE_INVALID_CPF = "400";
    const CODE_NOT_ACCOUNT = "8";
    const CODE_INVALID_PROMOTORA = "113950004";
    const CLIENT_APIKEY = process.env.CLIENT_APIKEY;
    const base_url = 'https://api.bancopan.com.br/openapi/consignado/v2/emprestimos/simulacao/fgts';
    let { data, status, } = yield axios_1.default.post(base_url, Object.assign({}, params), {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${acess_token}`,
            'ApiKey': CLIENT_APIKEY,
        },
        validateStatus: () => true,
        timeout: 180000
    });
    if (!data) {
        throw new Error('Api Bank not response');
    }
    if (status === 200 && data.condicoes_credito[0].sucesso === true) {
        return data.condicoes_credito[0];
    }
    if (status === 200 && data.condicoes_credito[0].sucesso === false) {
        throw new Error('Zero simularion found');
    }
    if (status === 400) {
        if (data.codigo == CODE_NO_FIND_AUTHORIZED) {
            throw new Error('Bank not authorized');
        }
        if (data.codigo == CODE_NO_ACCEPT_FGTS) {
            throw new Error('Service not authorized');
        }
        if (data.codigo == CODE_INVALID_CPF && data.detalhes[0] === 'cpf: Campo: cpf_cliente inválido') {
            throw new Error('Invalid CPF');
        }
        if (data.codigo == CODE_INVALID_PROMOTORA) {
            throw new Error('Invalid Promotora');
        }
        if (!data.codigo) {
            throw new Error('Many Requests');
        }
        throw new Error('Fail server');
    }
});
exports.simulationServices = simulationServices;
const createOrderFGTSService = (order, access_token) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, status } = yield axios_1.default.post('https://api.bancopan.com.br/openapi/consignado/v1/emprestimos/propostas/fgts', order, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`,
            'ApiKey': process.env.CLIENT_APIKEY,
        },
        validateStatus: () => true,
        timeout: 200000
    });
    return { data, status };
});
exports.createOrderFGTSService = createOrderFGTSService;
const getLinkService = (params, access_token) => __awaiter(void 0, void 0, void 0, function* () {
    const { codigo_promotora, cpf_client, numero_proposta } = params;
    const { data, status } = yield axios_1.default.get(`https://api.bancopan.com.br/consignado/v0/formalizador/${codigo_promotora}/${cpf_client}/${numero_proposta}/links`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`,
            'ApiKey': process.env.CLIENT_APIKEY,
        },
        validateStatus: () => true,
        timeout: 200000
    });
    return { data, status };
});
exports.getLinkService = getLinkService;
const sendContractSMSService = (params, phone, access_token) => __awaiter(void 0, void 0, void 0, function* () {
    const { codigo_promotora, cpf_client, numero_proposta } = params;
    const { data, status } = yield axios_1.default.post(`https://api.bancopan.com.br/consignado/v0/formalizador/${codigo_promotora}/${cpf_client}/${numero_proposta}/links?tipoEnvio=sms`, {
        destinatario: phone
    }, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`,
            'ApiKey': process.env.CLIENT_APIKEY,
        },
        validateStatus: () => true,
        timeout: 200000
    });
    return { data, status };
});
exports.sendContractSMSService = sendContractSMSService;
