/*************************IMPORTS******************************/
const express = require("express");

const bodyParser = require("body-parser");
const app = express();
const fs = require("fs");

const https = require("https");
const serverKey = fs.readFileSync("./key.pem");
const serverCert = fs.readFileSync("./cert.pem");

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

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/api/getUser", (req, res) => {
    res.send(interface.getUser(req.body.id));
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
    //Returns the user's id, or a a false error status otherwise
    const isValidLogin = interface.checkLogin(
        req.body.username,
        req.body.password
    );

    //returns the user's ID if successful
    if (isValidLogin) {
        res.send({ id: isValidLogin });
    }

    //returns an error message if unsuccessful
    else {
        res.send(false);
    }
});

app.post("/api/createUser", upload.single("file"), (req, res) => {
    var img;
    if (req.body.file === undefined) img = "default.png";
    else img = body.username + "pp.png";

    const isValidAccountCreation = interface.createUser(req.body, img);
    //Return data on a successful login including their user id, a
    // BMI, and a target goal if applicable
    if (isValidAccountCreation) {
        console.log(isValidAccountCreation);
        res.send({ id: isValidAccountCreation });
    } else {
        res.send(false);
    }
});

/*********************RECORD EXERCISE PAGE**********************/

app.get("/api/getActivities", (req, res) => {
    res.send(interface.getActivities());
});

app.post("/api/getExercises", (req, res) => {
    console.log(req.body);
    res.send(interface.getExercises(req.body.id));
});

app.post("/api/recordExercise", (req, res) => {
    console.log(req.body);
    res.send(interface.recordExercise(req.body));
});

app.post("/api/getUserExercises", (req, res) => {
    console.log(req.body);
    res.send(interface.getUserExercises(req.body));
});

app.post("/api/getUserMeals", (req, res) => {
    console.log(req.body);
    res.send(interface.getUserMeals(req.body));
});

app.post("/api/getActivity", (req, res) => {
    console.log(req.body);
    res.send(interface.getActivity(req.body));
});

app.post("/api/getWeeklyExercise", (req, res) => {
    console.log(req.body);
    res.send(interface.getWeeklyExercise(req.body));
});
/*********************RECORD MEAL PAGE**********************/

app.post("/api/getFood", (req, res) => {
    console.log("Getting food in index");
    console.log(req.body);
    res.send(interface.getFood(req.body));
});

app.post("/api/getDrink", (req, res) => {
    console.log(req.body);
    res.send(interface.getDrink(req.body));
});

app.post("/api/recordNewFood", (req, res) => {
    console.log(req.body);
    res.send(interface.recordNewFood(req.body));
});

app.post("/api/recordNewDrink", (req, res) => {
    console.log(req.body);
    res.send(interface.recordNewDrink(req.body));
});

app.post("/api/recordMeal", (req, res) => {
    console.log(req.body);
    res.send(interface.recordMeal(req.body));
});

/*************************Goal PAGE******************************/

app.post("/api/getActiveGoals", (req, res) => {
    res.send(interface.getActiveGoals(req.body.id));
});

app.get("/api/getGoalHistory", (req, res) => {
    res.send(interface.getGoalHistory(req.body.id));
});

app.post("/api/getBMI", (req, res) => {
    console.log("Called correctly!");
    console.log(req.body.id);
    res.send(JSON.stringify(interface.bmi(req.body.id)));
});

/*************************GROUP PAGE******************************/

app.post("/api/checkGroupName", (req, res) => {
    console.log(req.body);
    res.send(interface.checkGroupName(req.body));
});

app.post("/api/createGroup", (req, res) => {
    console.log(req.body);
    res.send(interface.createGroup(req.body));
});

app.post("/api/getUserGroups", (req, res) => {
    console.log(req.body);
    res.send(interface.getUserGroups(req.body));
});

app.post("/api/getGroupUsers", (req, res) => {
    console.log(req.body);
    res.send(interface.getGroupUsers(req.body));
});

//Used when adding a user on frontend - will do the email send to them
app.post("/api/addUserToGroup", (req, res) => {
    console.log(req.body);
    res.send(interface.sendGroupInvite(req.body));
});

//Adding a user to a group when they click the link on an email
app.post("/api/addUserViaEmail", (req, res) => {
    console.log(req.body);
    res.send(interface.acceptGroupInvite(req.body));
});

app.post("/api/expiredGoals", (req, res) => {
    res.send(interface.getGoalHistory(req.body));
});

app.post("/api/createGoal", (req, res) => {
    console.log(req.body);
    res.send(interface.createGoal(req.body));
});

app.post("/api/checkGoals", (req, res) => {
    console.log(req.body);
    res.send(interface.checkGoals(req.body.id));
});

app.post("/api/reActivateGoal", (req, res) => {
    console.log(req.body);
    res.send(interface.expiredGoal(req.body));
});

const sslServer = https.createServer({ key: serverKey, cert: serverCert }, app);
app.listen(3001, () => {
    console.log("Server running on port 3001");
});
