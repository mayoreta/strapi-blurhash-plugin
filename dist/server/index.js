"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const register_1 = __importDefault(require("./register"));
const bootstrap_1 = __importDefault(require("./bootstrap"));
const config_1 = __importDefault(require("./config"));
const services_1 = __importDefault(require("./services"));
exports.default = {
    register: register_1.default,
    bootstrap: bootstrap_1.default,
    services: services_1.default,
    config: config_1.default,
};
