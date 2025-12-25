"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");
const dbDir = path.join(process.cwd(), "data");
// Create folder if it doesn't exist
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}
const dbPath = process.env.DB_PATH || path.join(process.cwd(), "data", "bts_database.db");
const db = Database(dbPath, {
    verbose: console.log
});
// this is very important especially for express applications
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");
module.exports = db;
