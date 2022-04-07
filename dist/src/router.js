"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("./controllers/orderController");
const simulationController_1 = require("./controllers/simulationController");
const route = express_1.default.Router();
route.get('/saldo', simulationController_1.simulationController);
route.post('/order', orderController_1.createOrderController);
exports.default = route;
