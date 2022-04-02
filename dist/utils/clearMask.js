"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearMask = void 0;
const clearMask = (value) => {
    return value
        .replace(/\D/g, "");
};
exports.clearMask = clearMask;
