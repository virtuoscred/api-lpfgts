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
exports.ApiSimulation = void 0;
const client_1 = __importDefault(require("../models/client"));
const clearMask_1 = require("../utils/clearMask");
const ApiSimulation = () => {
    return {
        create: (data) => __awaiter(void 0, void 0, void 0, function* () {
            return yield client_1.default.create(Object.assign({}, data));
        }),
        getOne: (cpf) => __awaiter(void 0, void 0, void 0, function* () {
            return yield client_1.default.find({ cpf: (0, clearMask_1.clearMask)(cpf) });
        }),
    };
};
exports.ApiSimulation = ApiSimulation;
