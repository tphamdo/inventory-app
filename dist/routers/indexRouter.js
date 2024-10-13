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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inventoryController = __importStar(require("../controllers/inventoryController"));
const router = (0, express_1.Router)();
router.get('/', (_req, res) => {
    res.render('index');
});
router.get('/jerseys', inventoryController.allJerseysGet);
router.get('/jerseys/new', inventoryController.newJerseyGet);
router.post('/jerseys/new', inventoryController.newJerseyPost);
router.get('/jerseys/:jerseyId/edit', inventoryController.editJerseyGet);
router.post('/jerseys/:jerseyId/edit', inventoryController.editJerseyPost);
router.post('/jerseys/:jerseyId/delete', inventoryController.deleteJerseyGet);
router.get('/teams', inventoryController.allTeamsGet);
router.get('/teams/new', inventoryController.newTeamGet);
router.get('/teams/:team/jerseys', inventoryController.teamJerseysGet);
router.get('/teams/:team/jerseys/new', inventoryController.newTeamJerseyGet);
router.post('/teams/:team/jerseys/new', inventoryController.newJerseyPost);
router.post('/teams/:team/jerseys/:jerseyId/delete', inventoryController.deleteJerseyGet);
exports.default = router;
