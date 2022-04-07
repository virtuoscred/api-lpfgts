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
exports.simulationController = void 0;
const simularionData_1 = require("../data/simularionData");
const authenticateService_1 = require("../useCases/authenticateService");
const simulationService_1 = require("../useCases/simulationService");
const clearMask_1 = require("../utils/clearMask");
const simulationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cpf, phone, list_parcelas } = req.query;
        const cpfSanitized = Number((0, clearMask_1.clearMask)(cpf.toString()));
        const token = yield (0, authenticateService_1.getTokenService)();
        const listParcelas = yield (0, simulationService_1.getSaldoFGTS)(cpfSanitized, token);
        const saveSimulation = yield (0, simulationService_1.saveSimulationService)((0, simularionData_1.ApiSimulation)());
        if (!list_parcelas) {
            const simulation = yield (0, simulationService_1.getSimulationFGTS)({ cpf: cpfSanitized, parcelas: listParcelas.parcelas }, token);
            if (simulation.id) {
                yield saveSimulation({
                    cpf: cpfSanitized.toString(),
                    phone: phone.toString(),
                    id_simulation: simulation.id.toString()
                });
                return res.status(200).json(simulation);
            }
        }
        list_parcelas;
        let parcelas = JSON.parse(list_parcelas === null || list_parcelas === void 0 ? void 0 : list_parcelas.toString());
        const simulation = yield (0, simulationService_1.getSimulationFGTS)({ cpf: cpfSanitized, parcelas: parcelas }, token);
        yield saveSimulation({
            cpf: cpfSanitized.toString(),
            phone: phone.toString(),
            id_simulation: simulation.id,
        });
        return res.status(200).json(simulation);
    }
    catch (error) {
        console.log(error);
        res.status(400).json({
            message: 'Erro ao buscar saldo',
            error: error.message
        });
    }
});
exports.simulationController = simulationController;
