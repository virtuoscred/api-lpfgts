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
exports.authenticateService = void 0;
const apiPan_1 = __importDefault(require("../configs/apiPan"));
const banks_1 = __importDefault(require("../models/banks"));
const dayjs_1 = __importDefault(require("dayjs"));
const authenticateService = (dataUser) => __awaiter(void 0, void 0, void 0, function* () {
    const accessToken = yield isToken();
    if (!accessToken.created) {
        const newToken = yield createTokenApiBank(dataUser);
        yield banks_1.default.create({
            access_token: newToken.token,
            name: dataUser === null || dataUser === void 0 ? void 0 : dataUser.type,
            expires_in: newToken.expires_in
        });
        return newToken;
    }
    if (accessToken.created && accessToken.expired) {
        const newToken = yield createTokenApiBank(dataUser);
        yield banks_1.default.findOneAndUpdate({
            name: dataUser === null || dataUser === void 0 ? void 0 : dataUser.type
        }, {
            $set: {
                access_token: newToken.token,
                expires_in: newToken.expires_in,
                updated_at: Date.now()
            }
        }, { new: true });
        return newToken;
    }
    return { token: accessToken.access_token };
});
exports.authenticateService = authenticateService;
const createTokenApiBank = (dataUser) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = yield apiPan_1.default.post('/tokens', {
        username: `${dataUser === null || dataUser === void 0 ? void 0 : dataUser.user_bank}_${dataUser === null || dataUser === void 0 ? void 0 : dataUser.code_bank.padStart(6, '0')}`,
        password: dataUser === null || dataUser === void 0 ? void 0 : dataUser.password,
        grant_type: "client_credentials+password"
    }, { validateStatus: () => true });
    if (data.codigo && !data.token) {
        throw new Error('Error nas credencias');
    }
    return data;
});
const isToken = () => __awaiter(void 0, void 0, void 0, function* () {
    const bankAuth = yield banks_1.default.findOne({
        name: 'pan',
    });
    if (!(bankAuth === null || bankAuth === void 0 ? void 0 : bankAuth.expires_in)) {
        return { created: false };
    }
    const timeDiff = (0, dayjs_1.default)(bankAuth === null || bankAuth === void 0 ? void 0 : bankAuth.expires_in).diff(Date.now(), 'minutes');
    if (timeDiff <= 0) {
        return { expired: true, created: true };
    }
    return { expired: false, access_token: bankAuth.access_token, created: true };
});
