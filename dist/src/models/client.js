"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../configs/database"));
const ClientSchema = new database_1.default.Schema({
    cpf: String,
    phone: String,
    id_simulation: String,
    createAt: {
        type: Date,
        default: Date.now
    }
});
const Client = database_1.default.model('Client', ClientSchema);
exports.default = Client;
