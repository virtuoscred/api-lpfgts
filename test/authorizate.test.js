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
require("dotenv/config");
const authenticateService_1 = require("../src/useCases/authenticateService");
let USER_CPF = process.env.USER_CPF;
let USER_CODE = process.env.USER_CODE;
let USER_PASSWORD = process.env.USER_PASSWORD;
test('it should handle with api bank authenticate ', () => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield (0, authenticateService_1.authenticateService)({ type: 'pan', code_bank: USER_CODE, user_bank: USER_CPF, password: USER_PASSWORD });
    expect(data.token ? true : false).toBe(true);
}), 120000);
test('it should return invalid credential user', () => __awaiter(void 0, void 0, void 0, function* () {
    USER_CODE = '006529';
    USER_CPF = '10472965603';
    USER_PASSWORD = '@Virtuos22@';
    try {
        const data = yield (0, authenticateService_1.authenticateService)({ type: 'pan', code_bank: USER_CODE, user_bank: USER_CPF, password: USER_PASSWORD });
        expect(data.token ? true : false).toBe(true);
    }
    catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error).toHaveProperty('message', 'Error nas credencias');
    }
}), 120000);
