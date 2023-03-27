/*************************IMPORTS******************************/
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const fs = require("fs");
const cors = require("cors");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "../client/public/images/");
    },
    filename: function (req, file, cb) {
        cb(null, req.body.username + "pp.png");
    },
});

const upload = multer({ storage });

const { Interface } = require("./interface.js");

/*************************MIDDLEWARE******************************/

const interface = new Interface();
app.use(cors({ origin: true, credentials: true }));
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});
app.use(bodyParser.json());

/*************************DATABASE TINGS******************************/

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
    res.send(interface.checkEmailFormat(req.body.email));
});

app.post("/api/checkUsername", (req, res) => {
    res.send(interface.checkUsername(req.body.username));
});

app.get("/api/checkPassword", (req, res) => {
    if (req.body.password === req.body.dpassword) res.send(true);
    else res.send(false);
});

app.post("/api/login", (req, res) => {
    res.send(interface.checkLogin(req.body.login, req.body.password));
});

app.post("/api/createUser", upload.single("file"), (req, res) => {
    var img;
    if (body.file === undefined) img = "default.png";
    else img = body.username + "pp.png";
    res.send(interface.createUser(req.body, img));
});

/*************************HOME PAGE******************************/

app.get("/api/getActiveGoals", (req, res) => {
    res.send(interface.getActiveGoals(req.body.id));
});

app.get("/api/getGoalHistory", (req, res) => {
    res.send(interface.getGoalHistory(req.body.id));
});

app.listen(3001, () => {
    console.log("Server running on port 3001");
});
