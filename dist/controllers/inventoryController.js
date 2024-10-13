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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allJerseysGet = allJerseysGet;
exports.teamJerseysGet = teamJerseysGet;
exports.newJerseyGet = newJerseyGet;
exports.newTeamJerseyGet = newTeamJerseyGet;
exports.newJerseyPost = newJerseyPost;
exports.allTeamsGet = allTeamsGet;
exports.newTeamGet = newTeamGet;
exports.editJerseyGet = editJerseyGet;
exports.editJerseyPost = editJerseyPost;
exports.deleteJerseyGet = deleteJerseyGet;
const db = __importStar(require("../db/queries"));
function allJerseysGet(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const jerseys = yield db.getAllJerseys();
        res.render('jerseys', { jerseys, title: 'Jerseys' });
    });
}
function teamJerseysGet(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const team = req.params.team;
        const jerseys = yield db.getTeamJerseys(team);
        res.render('jerseys', { jerseys, title: team, team: team });
    });
}
function newJerseyGet(_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const teams = yield db.getAllTeams();
        res.render('jersey-form', { teams, title: 'New Jersey' });
    });
}
function newTeamJerseyGet(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const team = req.params.team;
        res.render('jersey-form', {
            team_name: team,
            team_readOnly: true,
            title: 'New Jersey',
        });
    });
}
function newJerseyPost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { name, team, quantity, price } = req.body;
        yield db.addJersey({
            name: name,
            team,
            quantity,
            price,
        });
        res.redirect('/jerseys');
    });
}
function allTeamsGet(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const teams = yield db.getAllTeams();
        res.render('teams', { teams });
    });
}
function newTeamGet(_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.render('team-form');
    });
}
function editJerseyGet(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const jerseyId = req.params.jerseyId;
        const teams = yield db.getAllTeams();
        const { player_name, price, quantity, team_name } = yield db.getJersey(jerseyId);
        res.render('jersey-form', {
            teams,
            player_name,
            price,
            quantity,
            team_name,
            title: 'Edit Jersey',
        });
    });
}
function editJerseyPost(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('edit');
        console.log(req.params);
        console.log(req.body);
        const { name, team, price, quantity } = req.body;
        const jerseyId = req.params.jerseyId;
        yield db.updateJersey(jerseyId, { name, team, price, quantity });
        res.redirect('/jerseys');
    });
}
function deleteJerseyGet(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const jerseyId = req.params.jerseyId;
        yield db.deleteJersey(jerseyId);
        if (req.params.team) {
            res.redirect(`/teams/${req.params.team}/jerseys`);
        }
        else {
            res.redirect('/jerseys');
        }
    });
}
