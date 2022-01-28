"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllReadable = exports.getReadable = exports.getTags = void 0;
const nodeTags_json_1 = __importDefault(require("../db/nodeTags.json")); // for opc.tcp://10.115.43.26:4840
//import dataTags from "../db/nodeTagsOPCsiemens.json"; // for opc.tcp://10.115.42.241:4840 
function getTags(slotid, method) {
    const slotId = slotid;
    const methodId = method;
    const slots = nodeTags_json_1.default.writableTags;
    const verifySlot = slots.find((slots) => slots.slotId === slotId);
    const verifyMethod = verifySlot === null || verifySlot === void 0 ? void 0 : verifySlot.tagsId[methodId];
    if (!verifySlot || !verifyMethod) {
        return "undefined";
    }
    return verifyMethod;
}
exports.getTags = getTags;
function getReadable(slotid) {
    const slotId = slotid;
    const slots = nodeTags_json_1.default.readableTags;
    const verifySlot = slots.find((slots) => slots.slotId === slotId);
    const verifyMethod = verifySlot === null || verifySlot === void 0 ? void 0 : verifySlot.tagsId;
    if (!verifySlot || !verifyMethod) {
        return "undefined";
    }
    return verifyMethod;
}
exports.getReadable = getReadable;
function getAllReadable() {
    const slots = nodeTags_json_1.default.readableTags;
    return slots;
}
exports.getAllReadable = getAllReadable;
