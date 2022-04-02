"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const simulationController_1 = require("./controllers/simulationController");
const route = express_1.default.Router();
route.get('/simulacao', simulationController_1.verifyAuthorizateFGTS);
route.post('/order', simulationController_1.createOrder);
exports.default = route;
