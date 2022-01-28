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
exports.writer = void 0;
const searcher_service_1 = require("../service/searcher.service");
const logger_1 = __importDefault(require("../utils/logger"));
const write_service_1 = __importDefault(require("../service/ConnectionOPC/write.service"));
function writer(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const slot = parseInt(req.params.slotid);
        const method = parseInt(req.params.methodid);
        const value = parseInt(req.params.value);
        const tag = (0, searcher_service_1.getTags)(slot, method);
        try {
            if (tag === "undefined") {
                logger_1.default.error("slot or method not found (writer)");
                const error = "SLOT_OR_METHOD_NOT_FOUND(writer)";
                res.formatter.notFound(error);
            }
            else {
                const changeOPC = yield (0, write_service_1.default)(tag, value);
                logger_1.default.info("Change OPC executed successfully");
                const success = "SUCCESSFULLY_EXECUTED_METHOD";
                res.formatter.ok(success, changeOPC);
            }
        }
        catch (error) {
            logger_1.default.error("Error responding to request: " + error);
            res.formatter.badRequest(error);
        }
    });
}
exports.writer = writer;
