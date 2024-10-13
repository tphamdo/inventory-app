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
exports.getAllJerseys = getAllJerseys;
exports.getTeamJerseys = getTeamJerseys;
exports.addJersey = addJersey;
exports.getAllTeams = getAllTeams;
exports.deleteJersey = deleteJersey;
exports.getJersey = getJersey;
exports.updateJersey = updateJersey;
const pool_1 = __importDefault(require("./pool"));
function getAllJerseys() {
    return __awaiter(this, void 0, void 0, function* () {
        const SQL = `
    SELECT j.id, j.name as player_name, j.quantity, j.price, t.name as team_name FROM jerseys as j
    INNER JOIN teams as t
    ON j.team_id = t.id
    ORDER BY j.price DESC, team_name, player_name;
  `;
        const { rows } = yield pool_1.default.query(SQL);
        return rows;
    });
}
function getTeamJerseys(team) {
    return __awaiter(this, void 0, void 0, function* () {
        const SQL = `
    SELECT j.id, j.name as player_name, j.quantity, j.price, t.name as team_name FROM jerseys as j
    INNER JOIN teams as t
    ON j.team_id = t.id
    WHERE t.name = $1;
  `;
        const { rows } = yield pool_1.default.query(SQL, [team]);
        return rows;
    });
}
function addJersey(_a) {
    return __awaiter(this, arguments, void 0, function* ({ name, team, quantity = 0, price, }) {
        console.log(team);
        const SQL_MAYBE_ADD_TEAM = `
    INSERT INTO teams (name)
    SELECT CAST($1 AS VARCHAR)
    WHERE NOT EXISTS(SELECT name FROM teams WHERE name = $1);
  `;
        const SQL_ADD_JERSEY = `
    INSERT INTO jerseys (name, quantity, price, team_id) VALUES
    ($1, $2, $3, (SELECT id FROM teams WHERE name = $4));
  `;
        yield pool_1.default.query(SQL_MAYBE_ADD_TEAM, [team]);
        yield pool_1.default.query(SQL_ADD_JERSEY, [name, quantity, price, team]);
    });
}
function getAllTeams() {
    return __awaiter(this, void 0, void 0, function* () {
        const SQL = `
    SELECT * FROM teams
    ORDER BY teams.name;
  `;
        const { rows } = yield pool_1.default.query(SQL);
        return rows;
    });
}
function deleteJersey(jerseyId) {
    return __awaiter(this, void 0, void 0, function* () {
        const SQL_GET_TEAM_ID = `
    SELECT team_id FROM jerseys
    WHERE jerseys.id = $1;
  `;
        const SQL_DELETE = `
    DELETE FROM jerseys
    WHERE jerseys.id = $1;
  `;
        const SQL_MAYBE_DELETE_TEAM = `
    DELETE FROM teams
    WHERE teams.id = $1 AND
    (SELECT COUNT(j.team_id) FROM jerseys as j WHERE j.team_id = $1) = 0;
  `;
        const { rows, rowCount } = yield pool_1.default.query(SQL_GET_TEAM_ID, [jerseyId]);
        yield pool_1.default.query(SQL_DELETE, [jerseyId]);
        if (rowCount) {
            const team_id = rows[0].team_id;
            yield pool_1.default.query(SQL_MAYBE_DELETE_TEAM, [team_id]);
        }
    });
}
function getJersey(jerseyId) {
    return __awaiter(this, void 0, void 0, function* () {
        const SQL = `
    SELECT j.name as player_name, j.price, j.quantity, t.name as team_name FROM jerseys as j
    INNER JOIN teams as t
    ON t.id = j.team_id
    WHERE j.id = $1;
  `;
        const { rows, rowCount } = yield pool_1.default.query(SQL, [jerseyId]);
        console.log(rows);
        if (rowCount && rowCount > 0)
            return rows[0];
    });
}
function updateJersey(jerseyId, updates) {
    return __awaiter(this, void 0, void 0, function* () {
        const SQL_MAYBE_ADD_TEAM = `
    INSERT INTO teams (name)
    SELECT CAST($1 AS VARCHAR)
    WHERE NOT EXISTS(SELECT name FROM teams WHERE name = $1);
  `;
        const SQL_GET_OLD_TEAM_ID = `
    SELECT team_id FROM jerseys
    WHERE jerseys.id = $1;
  `;
        const SQL_UPDATE_JERSEY = `
    UPDATE jerseys
    SET name = $1, quantity = $2, price = $3, team_id = (SELECT id FROM teams WHERE name = $4)
    WHERE jerseys.id = $5
  `;
        const SQL_MAYBE_DELETE_TEAM = `
    DELETE FROM teams
    WHERE teams.id = $1 AND
    (SELECT COUNT(j.team_id) FROM jerseys as j WHERE j.team_id = $1) = 0;
  `;
        yield pool_1.default.query(SQL_MAYBE_ADD_TEAM, [updates.team]);
        const { rows } = yield pool_1.default.query(SQL_GET_OLD_TEAM_ID, [jerseyId]);
        yield pool_1.default.query(SQL_UPDATE_JERSEY, [
            updates.name,
            updates.quantity,
            updates.price,
            updates.team,
            jerseyId,
        ]);
        if (rows.length > 0) {
            const team_id = rows[0].team_id;
            yield pool_1.default.query(SQL_MAYBE_DELETE_TEAM, [team_id]);
        }
    });
}
