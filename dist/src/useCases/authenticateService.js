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
exports.getTokenService = void 0;
const axios_1 = __importDefault(require("axios"));
const dayjs_1 = __importDefault(require("dayjs"));
const banks_1 = __importDefault(require("../models/banks"));
const getTokenService = () => __awaiter(void 0, void 0, void 0, function* () {
    const token = yield banks_1.default.findOne({ name: "mercantil" });
    if (!(token === null || token === void 0 ? void 0 : token.access_token)) {
        const newToken = yield generateTokenMercantil();
        const createBanck = yield banks_1.default.create({
            name: "mercantil",
            access_token: newToken.access_token,
            expires_in: (0, dayjs_1.default)().add(newToken.expires_in, 'second').toDate()
        });
        return createBanck.access_token;
    }
    if ((0, dayjs_1.default)(token.expires_in).isBefore((0, dayjs_1.default)())) {
        const newToken = yield generateTokenMercantil();
        yield banks_1.default.updateOne({ name: "mercantil" }, {
            access_token: newToken.access_token,
            expires_in: (0, dayjs_1.default)().add(newToken.expires_in, 'second').toDate()
        });
        return newToken.access_token;
    }
    return token.access_token;
});
exports.getTokenService = getTokenService;
const generateTokenMercantil = () => __awaiter(void 0, void 0, void 0, function* () {
    const baseUrl = 'https://api.mercantil.com.br:8443/auth/oauth/v2/token';
    const { grant_type, client_id, client_secret } = {
        grant_type: "client_credentials",
        client_id: process.env.CLIENT_APIKEY,
        client_secret: process.env.CLIENT_SECRET,
    };
    const { data, status } = yield axios_1.default.post(baseUrl, null, {
        validateStatus: () => true,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        params: {
            grant_type,
            client_id,
            client_secret
        }
    });
    return data;
});
