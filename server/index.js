const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const dB = require("better-sqlite3");
const fs = require("fs");

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

const database = new dB("database.db", { verbose: console.log });

database.exec(fs.readFileSync(path.join(__dirname, "ddl.sql"), "utf8"));

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/api/createUser", (req, res) => {
    const { username, email, password } = req.body;
    const stmt = database.prepare(
        "INSERT INTO user (username, email, password) VALUES (?, ?, ?)"
    );
    const info = stmt.run(username, email, password);
    res.send(info);
});

app.listen(3001, () => {
    console.log("Server running on port 3001");
});
