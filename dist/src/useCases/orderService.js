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
exports.getLinkOrderService = exports.createOrderService = void 0;
const axios_1 = __importDefault(require("axios"));
const createOrderService = (order, token) => __awaiter(void 0, void 0, void 0, function* () {
    const baseUrl = 'https://api.mercantil.com.br:8443/PropostasExternas/v1/Propostas/FGTS';
    const { data, status } = yield axios_1.default.post(baseUrl, order, {
        validateStatus: () => true,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    return { data, status };
});
exports.createOrderService = createOrderService;
const getLinkOrderService = (id_simulation, token) => __awaiter(void 0, void 0, void 0, function* () {
    const baseUrl = `https://api.mercantil.com.br:8443/PropostasExternas/v1/AutorizacoesDigitais/Proposta/${id_simulation}`;
    const { data, status } = yield axios_1.default.get(baseUrl, {
        validateStatus: () => true,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    });
    return { data, status };
});
exports.getLinkOrderService = getLinkOrderService;
