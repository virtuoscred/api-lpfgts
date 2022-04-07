"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const axios_1 = __importDefault(require("axios"));
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const CLIENT_APIKEY = process.env.CLIENT_APIKEY;
const token_base64 = Buffer.from(`${CLIENT_APIKEY}:${CLIENT_SECRET}`, 'binary').toString('base64');
console.log(token_base64);
const apiPan = axios_1.default.create({
    baseURL: 'https://api.bancopan.com.br/consignado/v0',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${token_base64}`,
        'ApiKey': CLIENT_APIKEY,
    }
});
exports.default = apiPan;
