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
Object.defineProperty(exports, "__esModule", { value: true });
const authenticateService_1 = require("../src/useCases/authenticateService");
const simulationServices_1 = require("../src/useCases/simulationServices");
let USER_CODE = process.env.USER_CODE;
let USER_CPF = process.env.USER_CPF;
let USER_PASSWORD = process.env.USER_PASSWORD;
const defaultTimeOut = 120000;
test.only('its should handle simulation FGTS total value authorizated CEF', () => __awaiter(void 0, void 0, void 0, function* () {
    const CPF_AUTH_NO_LIMIT = '13829681917';
    const DT_NASCIMENTO_TEST = '30-06-1992';
    const acessoToken = yield (0, authenticateService_1.authenticateService)({ type: 'pan', code_bank: USER_CODE, user_bank: USER_CPF, password: USER_PASSWORD });
    try {
        const data = yield (0, simulationServices_1.simulationServices)({
            codigo_promotora: USER_CODE,
            cpf_cliente: CPF_AUTH_NO_LIMIT,
            data_nascimento: DT_NASCIMENTO_TEST,
            incluir_seguro: false,
        }, acessoToken.token);
        console.log(data);
        expect((data === null || data === void 0 ? void 0 : data.condicoes_credito) ? true : false).toBe(true);
    }
    catch (error) {
        expect(error).toHaveProperty('message', 'Many Requests');
    }
}), defaultTimeOut);
test('its should verify error in authorization of CEF', () => __awaiter(void 0, void 0, void 0, function* () {
    const CPF_BANK_NOT_AUTH = '10472965603';
    let DT_NASCIMENTO_TEST = '02-11-2001';
    const acessoToken = yield (0, authenticateService_1.authenticateService)({ type: 'pan', code_bank: USER_CODE, user_bank: USER_CPF, password: USER_PASSWORD });
    try {
        const data = yield (0, simulationServices_1.simulationServices)({
            codigo_promotora: USER_CODE,
            cpf_cliente: CPF_BANK_NOT_AUTH,
            data_nascimento: DT_NASCIMENTO_TEST,
            incluir_seguro: false,
        }, acessoToken.token);
    }
    catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error).toHaveProperty('message', 'Bank not authorized');
    }
}), defaultTimeOut);
test('is should handle simulation FGTS parcial value', () => __awaiter(void 0, void 0, void 0, function* () {
    const CPF_AUTH_NO_LIMIT = '13829681917';
    const DT_NASCIMENTO_TEST = '02-11-2001';
    const acessoToken = yield (0, authenticateService_1.authenticateService)({ type: 'pan', code_bank: USER_CODE, user_bank: USER_CPF, password: USER_PASSWORD });
    try {
        const data = yield (0, simulationServices_1.simulationServices)({
            cpf_cliente: CPF_AUTH_NO_LIMIT,
            codigo_promotora: USER_CODE,
            data_nascimento: DT_NASCIMENTO_TEST,
            incluir_seguro: false,
            valor_solicitado: '1000.00'
        }, acessoToken.token);
        expect((data === null || data === void 0 ? void 0 : data.condicoes_credito) ? true : false).toBe(true);
    }
    catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error).toHaveProperty('message', 'Many Requests');
    }
}), defaultTimeOut);
test('is should handle simulation FGTS total value, Erro Caixa 09', () => __awaiter(void 0, void 0, void 0, function* () {
    const CPF_BANK_NOT_AUTH = '06910423909';
    let DT_NASCIMENTO_TEST = '02-11-2001';
    const acessoToken = yield (0, authenticateService_1.authenticateService)({ type: 'pan', code_bank: USER_CODE, user_bank: USER_CPF, password: USER_PASSWORD });
    try {
        const data = yield (0, simulationServices_1.simulationServices)({
            codigo_promotora: USER_CODE,
            cpf_cliente: CPF_BANK_NOT_AUTH,
            data_nascimento: DT_NASCIMENTO_TEST,
            incluir_seguro: false,
        }, acessoToken.token);
    }
    catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error).toHaveProperty('message', 'Service not authorized');
    }
}), defaultTimeOut);
test('is should handle simulation FGTS invalid CPF', () => __awaiter(void 0, void 0, void 0, function* () {
    const CPF_BANK_NOT_AUTH = '10472965605';
    let DT_NASCIMENTO_TEST = '02-11-2001';
    const acessoToken = yield (0, authenticateService_1.authenticateService)({ type: 'pan', code_bank: USER_CODE, user_bank: USER_CPF, password: USER_PASSWORD });
    try {
        yield (0, simulationServices_1.simulationServices)({
            codigo_promotora: USER_CODE,
            cpf_cliente: CPF_BANK_NOT_AUTH,
            data_nascimento: DT_NASCIMENTO_TEST,
            incluir_seguro: false,
        }, acessoToken.token);
    }
    catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error).toHaveProperty('message', 'Invalid CPF');
    }
}), defaultTimeOut);
test('is should handle simulation FGTS invalid CODIGO PROMOTORA', () => __awaiter(void 0, void 0, void 0, function* () {
    const CPF_BANK_NOT_AUTH = '10472965603';
    let DT_NASCIMENTO_TEST = '02-11-2001';
    const acessoToken = yield (0, authenticateService_1.authenticateService)({ type: 'pan', code_bank: USER_CODE, user_bank: USER_CPF, password: USER_PASSWORD });
    try {
        yield (0, simulationServices_1.simulationServices)({
            codigo_promotora: '002172',
            cpf_cliente: CPF_BANK_NOT_AUTH,
            data_nascimento: DT_NASCIMENTO_TEST,
            incluir_seguro: false,
        }, acessoToken.token);
    }
    catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error).toHaveProperty('message', 'Invalid Promotora');
    }
}), defaultTimeOut);
