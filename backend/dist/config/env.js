"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function required(name) {
    const value = process.env[name]?.trim();
    if (!value) {
        throw new Error(`${name} environment variable is required`);
    }
    return value;
}
const nodeEnv = process.env.NODE_ENV || 'development';
exports.env = {
    nodeEnv,
    isProduction: nodeEnv === 'production',
    port: Number(process.env.PORT || 5000),
    jwtSecret: required('JWT_SECRET'),
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
    frontendOrigins: required('FRONTEND_URL')
        .split(',')
        .map((origin) => origin.trim().replace(/\/$/, ''))
        .filter(Boolean),
    logLevel: process.env.LOG_LEVEL || (nodeEnv === 'production' ? 'info' : 'debug'),
};
if (!Number.isInteger(exports.env.port) || exports.env.port < 1 || exports.env.port > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535');
}
