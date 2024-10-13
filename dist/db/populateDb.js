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
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const SQL = `
DROP TABLE IF EXISTS jerseys;
DROP TABLE IF EXISTS teams;

CREATE TABLE IF NOT EXISTS jerseys (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  quantity INT DEFAULT 0,
  team_id INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS teams (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(255) NOT NULL
);

INSERT INTO teams (name) VALUES
('Washington Commanders'),
('Baltimore Ravens'),
('New York Giants'),
('Los Angeles Clippers'),
('FC Barcelona'),
('Los Angeles Lakers')
;

INSERT INTO jerseys (name, price, quantity, team_id) VALUES
('Jayden Daniels', 129.99, 25, 1),
('Terry McLaurin', 129.99, 18, 1),
('Tress Way', 129.99, 9, 1),
('Ryan Kerrigan', 129.99, 3, 1),
('Lamar Jackson', 129.99, 21, 2),
('Ray Lewis', 129.99, 8, 2),
('Ed Reed', 129.99, 12, 2),
('Justin Tucker', 129.99, 19, 2),
('Daniel Jones', 34.99, 1, 3),
('Eli Manning', 34.99, 2, 3),
('Kawhi Leonard', 119.99, 4, 4),
('Chris Paul', 119.99, 2, 4),
('Lionel Messi', 349.99, 13, 5),
('Neymar Jr', 149.99, 15, 5),
('Lebron James', 119.99, 32, 6)
;
`;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const args = process.argv.slice(2);
        if (args.length !== 1) {
            console.error('Expected to recieve 1 argument <database_connection_url>');
            return -1;
        }
        const client = new pg_1.Client({
            connectionString: args[0],
        });
        try {
            yield client.connect();
            const result = yield client.query(SQL);
            console.debug('cq:', result);
        }
        catch (error) {
            console.error('Something went wrong:', error);
        }
        finally {
            yield client.end();
        }
    });
}
main();
