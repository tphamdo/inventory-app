"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL)
    console.error('Could not find DATABASE_URL in the environment');
exports.default = new pg_1.Pool({
    connectionString: DATABASE_URL,
});
