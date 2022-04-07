"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
const router_1 = __importDefault(require("./router"));
const cors_1 = __importDefault(require("cors"));
app.use((0, cors_1.default)({
    // origin: process.env.URL_ORIGIN
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api', router_1.default);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
