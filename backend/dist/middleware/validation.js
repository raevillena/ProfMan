"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateParams = exports.validateQuery = exports.validateBody = exports.validate = void 0;
const yup = __importStar(require("yup"));
const validate = (schema, property = 'body') => {
    return async (req, res, next) => {
        try {
            const data = req[property];
            await schema.validate(data, { abortEarly: false });
            next();
        }
        catch (error) {
            if (error instanceof yup.ValidationError) {
                const errors = error.inner.map((err) => ({
                    field: err.path || 'unknown',
                    message: err.message,
                }));
                res.status(400).json({
                    error: {
                        code: 'VALIDATION_ERROR',
                        message: 'Validation failed',
                        details: errors,
                    },
                });
                return;
            }
            console.error('Validation error:', error);
            res.status(500).json({
                error: {
                    code: 'INTERNAL_ERROR',
                    message: 'Validation failed',
                },
            });
        }
    };
};
exports.validate = validate;
const validateBody = (schema) => (0, exports.validate)(schema, 'body');
exports.validateBody = validateBody;
const validateQuery = (schema) => (0, exports.validate)(schema, 'query');
exports.validateQuery = validateQuery;
const validateParams = (schema) => (0, exports.validate)(schema, 'params');
exports.validateParams = validateParams;
//# sourceMappingURL=validation.js.map