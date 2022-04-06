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
const authenticateService_1 = require("../../src/useCases/authenticateService");
const simulationService_1 = require("../../src/useCases/simulationService");
let tokenActive;
test('Generate token api mercantil ', () => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield (0, authenticateService_1.getTokenService)();
    const token = data;
    tokenActive = token;
    expect(token).toBeDefined();
}));
test('Get saldo FGTS', () => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield (0, authenticateService_1.getTokenService)();
    const data = yield (0, simulationService_1.getSaldoFGTS)(87645793953, token);
    expect(data).toBeDefined();
}));
test.only('Get Simulation Mercantion', () => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield (0, authenticateService_1.getTokenService)();
    const listParcelas = yield (0, simulationService_1.getSaldoFGTS)(87645793953, token);
    console.log(listParcelas);
    const adapter = {
        cpf: listParcelas.cpf,
        parcelas: listParcelas.parcelas.map(parcela => {
            return {
                DataVencimento: parcela.DataVencimento,
                valor: parcela.valor
            };
        })
    };
    console.log(adapter);
    const data = yield (0, simulationService_1.getSimulationFGTS)(adapter, token);
    expect(data).toBeDefined();
}));
