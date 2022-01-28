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
exports.readOnly = exports.readAll = void 0;
const logger_1 = __importDefault(require("../../utils/logger"));
const node_opcua_client_1 = require("node-opcua-client");
const searcher_service_1 = require("../searcher.service");
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
const client = node_opcua_client_1.OPCUAClient.create(options);
logger_1.default.info("OPC client created");
class OPCObject {
    constructor(slotID, value, nodeID) {
        this.slotID = slotID;
        this.value = value;
        this.nodeID = nodeID;
    }
}
function readAll() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect(app_1.endpointUrl);
            logger_1.default.info("OPC cliente Connected(to read)");
            const session = yield client.createSession();
            const getTags = (0, searcher_service_1.getAllReadable)();
            const maxAge = 0;
            const list = [];
            for (let index = 0; index < getTags.length; index++) {
                const slot = getTags[index];
                const tag = slot.tagsId;
                const nodeToRead = {
                    nodeId: tag,
                    attributeId: node_opcua_client_1.AttributeIds.Value,
                };
                // read the tag and keep the value
                const dataValue = yield session.read(nodeToRead, maxAge);
                const objData = new OPCObject(slot.slotId, dataValue.value.value, tag);
                const sortData = {
                    slotID: objData.slotID,
                    Value: objData.value,
                    Node: objData.nodeID,
                };
                //create an array of object with the info a return it back
                list.push(sortData);
            }
            yield session.close();
            yield client.disconnect();
            logger_1.default.info("Session close and client Disconected");
            logger_1.default.info({ list });
            return { list };
        }
        catch (error) {
            logger_1.default.error("Could not connect to OPC server, check your connection ...");
            process.exit(1);
        }
    });
}
exports.readAll = readAll;
function readOnly(nodeId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect(app_1.endpointUrl);
            logger_1.default.info("OPC cliente Connected(to read)");
            const session = yield client.createSession();
            const maxAge = 0;
            const nodeToRead = {
                nodeId: nodeId,
                attributeId: node_opcua_client_1.AttributeIds.Value,
            };
            // read the tag and keep the value
            const dataValue = yield session.read(nodeToRead, maxAge);
            yield session.close();
            yield client.disconnect();
            logger_1.default.info("Session close and client Disconected");
            logger_1.default.info({ dataValue });
            return { dataValue };
        }
        catch (error) {
            logger_1.default.error("Could not connect to OPC server, check your connection ...");
            process.exit(1);
        }
    });
}
exports.readOnly = readOnly;
