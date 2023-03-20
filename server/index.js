const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const dB = require("better-sqlite3");
const fs = require("fs");
const interface = require("./interface");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "../client/public/images/");
    },
    filename: function (req, file, cb) {
        cb(null, req.body.username + "pp.png");
    },
});

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});

const database = new dB("database.db", { verbose: console.log });
/**
 * This will handle all requests from the server
 */
database.exec(fs.readFileSync(path.join(__dirname, "ddl.sql"), "utf8"));

app.get("/", (req, res) => {
    res.send("Hello World!");
});

/*************************LOG IN PAGE******************************/

app.get("/api/checkEmail", (req, res) => {
    if (!checkEmail(req.params.email, res)) res.send(false);
    const stmt = database.prepare("SELECT * FROM user WHERE email = '$1'");
    stmt.all(req.email);
    info.rows.length > 0 ? res.send(false) : res.send(true);
});

app.get("/api/checkUsername", (req, res) => {
    const stmt = database.prepare("SELECT * FROM user WHERE username = '$1'");
    stmt.all(req.username);
    info.rows.length > 0 ? res.send(false) : res.send(true);
});

app.get("/api/checkPassword", (req, res) => {
    const stmt = database.prepare("SELECT * FROM user WHERE password = '$1'");
    stmt.all(req.password);
    info.rows.length > 0 ? res.send(true) : res.send(false);
});

app.post("/api/createUser", (req, res) => {
    const {
        username,
        firstname,
        lastname,
        gender,
        password,
        email,
        weight,
        height,
        tweight,
        dob,
    } = req.body;
    if (req.file === undefined) img = "default.png";
    else img = req.body.username + "pp.png";
    const stmt = database.prepare(
        "INSERT INTO user (username, firstname, lastname, gender, password, email, weight, height, tweight, dob, img) VALUES (?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?)"
    );
    const info = stmt.run(
        username,
        firstname,
        lastname,
        gender,
        password,
        email,
        weight,
        height,
        tweight,
        dob,
        img
    );
    res.send(info);
});

/*************************HOME PAGE******************************/

app.get("/api/getActiveGoals", (req, res) => {
    const stmt = database.prepare(
        "SELECT * FROM goals WHERE id = '$1' AND status NOT IN ('inactive')"
    );
    const info = stmt.all(req.id);
    res.send(info);
});

app.get("/api/getGoalHistory", (req, res) => {
    const stmt = database.prepare(
        "SELECT * FROM goals WHERE id = '$1' AND status IN ('inactive')"
    );
    const info = stmt.all(req.id);
    res.send(info);
});

app.listen(3001, () => {
    console.log("Server running on port 3001");
});
