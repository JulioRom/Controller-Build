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
const logger_1 = __importDefault(require("../../utils/logger"));
const node_opcua_client_1 = require("node-opcua-client");
const app_1 = require("../../app");
const connectionStrategy = {
    initialDelay: 1000,
    maxRetry: 1,
};
const options = {
    connectionStrategy: connectionStrategy,
    securityMode: node_opcua_client_1.MessageSecurityMode.None,
    securityPolicy: node_opcua_client_1.SecurityPolicy.None,
    endpointMustExist: false,
};
const booleanTrue = {
    dataType: node_opcua_client_1.DataType.Boolean,
    value: true,
};
const booleanFalse = {
    dataType: node_opcua_client_1.DataType.Boolean,
    value: false,
};
const client = node_opcua_client_1.OPCUAClient.create(options);
logger_1.default.info("OPC client created");
var valueState = undefined;
function Value(value) {
    if (value === 0) {
        logger_1.default.info("value false");
        return (valueState = booleanFalse);
    }
    if (value === 1) {
        logger_1.default.info("value true");
        return (valueState = booleanTrue);
    }
    else {
        logger_1.default.info("value undefined");
        return (valueState = undefined);
    }
}
class OPCObject {
    constructor(nodeID, valueIN, valueOUT) {
        this.nodeID = nodeID;
        this.valueIN = valueIN;
        this.valueOUT = valueOUT;
    }
}
function writeTag(nodeId, valueIn) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log(app_1.endpointUrl);
            yield client.connect(app_1.endpointUrl);
            logger_1.default.info("OPC cliente Connected");
            const session = yield client.createSession();
            const statusCode = yield session.write({
                nodeId: nodeId,
                attributeId: node_opcua_client_1.AttributeIds.Value,
                value: {
                    statusCode: node_opcua_client_1.StatusCodes.Good,
                    value: Value(valueIn),
                },
            });
            yield session.close();
            yield client.disconnect();
            logger_1.default.info("Session close and client Disconected");
            const objMessage = new OPCObject(nodeId, valueIn, Value(valueIn));
            logger_1.default.info({ statusCode: statusCode.description, resume: objMessage });
            return objMessage;
        }
        catch (error) {
            logger_1.default.error("Could not connect to OPC server, check your connection ...");
            process.exit(1);
        }
    });
}
exports.default = writeTag;
