"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db = require("./db");
db.exec(`CREATE TABLE users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        author_name TEXT NOT NULL
    )`);
db.exec(`
    CREATE TABLE categories(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category_name TEXT NOT NULL UNIQUE
    )
    `);
db.exec(`
    CREATE TABLE articles(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        category_id INTEGER,
        content TEXT NOT NULL,
        verification TEXT,
        author_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        views INTEGER DEFAULT 0,
        FOREIGN KEY(author_id) REFERENCES users(id),
        FOREIGN KEY(category_id) REFERENCES categories(id)
    )
    `);
console.log("Database has been successfully initialized");
