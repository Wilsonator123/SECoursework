/*************************IMPORTS******************************/
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const dB = require("better-sqlite3");
const fs = require("fs");
const cors = require("cors");
const multer = require("multer");
const { checkEmailFormat } = require("./interface.js");

/*************************MIDDLEWARE******************************/

app.use(cors({ origin: true, credentials: true }));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});
app.use(bodyParser.json());

/*************************DATABASE TINGS******************************/
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "../client/public/images/");
    },
    filename: function (req, file, cb) {
        cb(null, req.body.username + "pp.png");
    },
});

const upload = multer({ storage });
const database = new dB("database.db", { verbose: console.log });
/**
 * This will handle all requests from the server
 */
// database.exec(fs.readFileSync(path.join(__dirname, "ddl.sql"), "utf8"));
// database.exec(
//     fs.readFileSync(path.join(__dirname, "data/activity.sql"), "utf8")
// );
// database.exec(
//     fs.readFileSync(path.join(__dirname, "data/food_drink.sql"), "utf8")
// );
// database.exec("DELETE FROM user");

app.get("/", (req, res) => {
    res.send("Hello World!");
});

/*************************LOG IN PAGE******************************/

app.post("/api/checkEmail", (req, res) => {
    if (!checkEmailFormat(req.params.email)) res.send(false);
    const stmt = database.prepare("SELECT * FROM user WHERE email = ?");
    const info = stmt.all(req.body.email);
    info.length === 0 ? res.send(true) : res.send(false);
});

app.post("/api/checkUsername", (req, res) => {
    const stmt = database.prepare("SELECT * FROM user WHERE username = ?");
    const info = stmt.all(req.body.username);
    info.length === 0 ? res.send(true) : res.send(false);
});

// app.get("/api/checkPassword", (req, res) => {
//     const stmt = database.prepare("SELECT * FROM user WHERE password = '$1'");
//     const info = stmt.all(req.body.password);
//     info.rows() > 0 ? res.send(false) : res.send(true);
// });

app.post("/api/login", (req, res) => {
    const stmt = database.prepare(
        "SELECT * FROM user WHERE username = ? AND password = ?"
    );
    const info = stmt.all(req.body.username, req.body.password);
    if (info.length === 0) res.send(false);
    else res.send(true);
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
    if (
        username === "" ||
        firstname === "" ||
        lastname === "" ||
        gender === "" ||
        password === "" ||
        email === "" ||
        weight === "" ||
        height === "" ||
        tweight === "" ||
        dob === ""
    ) {
        res.send(false);
        return;
    }

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
    if (info.changes === 1) res.send(true);
    else res.send(false);
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
