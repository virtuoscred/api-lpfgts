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
exports.saveSimulationService = exports.getSimulationFGTS = exports.getSaldoFGTS = void 0;
const axios_1 = __importDefault(require("axios"));
const getSaldoFGTS = (cpf_client, token) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const baseUrl = `https://api.mercantil.com.br:8443/PropostasExternas/v1/Clientes/${cpf_client}/SaquesAniversario/Saldo`;
    const { data, status } = yield axios_1.default.get(baseUrl, {
        validateStatus: () => true,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    const messageError = (_a = data === null || data === void 0 ? void 0 : data.errors) === null || _a === void 0 ? void 0 : _a[0].key;
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
            parcelas: data === null || data === void 0 ? void 0 : data.parcelas.map(item => {
                return {
                    DataVencimento: item.dataRepasse,
                    valor: item.valor
                };
            })
        };
        return listParcelas;
    }
});
exports.getSaldoFGTS = getSaldoFGTS;
const getSimulationFGTS = (dataSimulation, token) => __awaiter(void 0, void 0, void 0, function* () {
    const baseUrl = 'https://api.mercantil.com.br:8443/PropostasExternas/v1/Simulacoes/Fgts';
    const correspondente = {
        Correspondente: {
            UsuarioDigitador: "X335487",
            CpfAgenteCertificado: 6910423909,
            UfAtuacao: "PR"
        }
    };
    const { data, status } = yield axios_1.default.post(baseUrl, Object.assign(Object.assign({}, dataSimulation), correspondente), {
        validateStatus: () => true,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    if (status === 200) {
        return data;
    }
    if (data.errors[0].key === 'ValorParcelaObrigatorio') {
        throw new Error('Não possui saldo suficiente para realizar a simulação');
    }
    throw new Error('Erro ao realizar a simulação');
});
exports.getSimulationFGTS = getSimulationFGTS;
const saveSimulationService = (dataApi) => __awaiter(void 0, void 0, void 0, function* () {
    return (dataSimulation) => __awaiter(void 0, void 0, void 0, function* () {
        return yield dataApi.create(dataSimulation);
    });
});
exports.saveSimulationService = saveSimulationService;
