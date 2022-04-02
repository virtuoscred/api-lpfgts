"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../configs/database"));
const BankSchema = new database_1.default.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    expires_in: {
        type: String,
        required: true,
    },
    access_token: String,
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    },
});
const Bank = database_1.default.model('Bank', BankSchema);
exports.default = Bank;
