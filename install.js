//Installera databas

const sqlite3 = require("sqlite3").verbose();
const express = require("express");
require("dotenv").config();

const db = new sqlite3.Database(process.env.DATABASE);

db.serialize(() => {
db.run ("DROP TABLE IF EXISTS users;");

db.run (`CREATE TABLE users (
id INTEGER PRIMARY KEY AUTOINCREMENT,
username VARCHAR(255) NOT NULL UNIQUE,
email VARCHAR(255) NOT NULL,
password TEXT NOT NULL,
user_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);
`);
console.log("Table created...")
})


db.close();
