"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const mongoUri = process.env.MONGO_URI;
mongoose_1.default.connect(mongoUri)
    .then(() => {
    console.log('mongoDB Connected');
})
    .catch((error) => {
    console.log(`Fail to connect mongodb ${error}`);
});
exports.default = mongoose_1.default;
