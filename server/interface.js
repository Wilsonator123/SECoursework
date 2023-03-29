const dB = require("better-sqlite3");
const fs = require('fs');
const path = require('path');



class Interface {
    constructor() {
        this.database = new dB("database.db", {
            verbose: console.log,
        });


        //IMPORTANT DATABASE STUFF WE MIGHT NEED AGAIN!

        //this.database.exec("DROP TABLE EXERCISE");
        //this.database.exec(fs.readFileSync(path.join(__dirname, "ddl.sql"), "utf8"));
    }

    /*********************************USER**********************************/



    checkEmailFormat(email) {
        //Returns true if email is in correct format, false if it is not
        console.log("Email: " + email);
        const re = /\S+@\S+\.\S+/; //Regex for email format
        return re.test(email);
    }


    checkEmail(email) {
        //Returns true if email is not in this.database, false if it is
        if (!this.checkEmailFormat(email)) return false; //If email is not in correct format
        const stmt = this.database.prepare(
            "SELECT * FROM user WHERE email = ?"
        );
        const info = stmt.all(email);
        if (info.length === 0) return true; //If email is not in this.database
        else return false; //If email is in this.database
    }

    checkUsername(username) {
        //Returns true if username is not in this.database, false if it is
        const stmt = this.database.prepare(
            "SELECT * FROM user WHERE username = ?"
        );
        const info = stmt.all(username);
        if (info.length === 0) return true; //If email is not in this.database
        else return false;
    }

    createUser(body, img) {
        //Creates a new user
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
        } = body;
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
            return false;
        }

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

        if (info.changes === 1) {
            const stmt = this.database.prepare(
                "SELECT * FROM user WHERE username = ?"
            );
            const info = stmt.all(username);
            return (body = {
                user: info[0].id,
                bmi: this.checkWeight(weight, height, tweight),
                goal: this.estimateGoal(user),
            });
        } else return false;
    }

    checkLogin(login, password) {
        //Returns the user's id if successful, false if login is not in this.database,
        if (this.checkEmailFormat(login)) {
            //If its an email
            if (this.checkEmail(login)) return false; //If email is not in this.database
            const stmt = this.database.prepare(
                "SELECT id FROM user WHERE email = ? AND password = ?"
            );
            const info = stmt.all(login, password);
            if (info.length === 0)
                return false; //If email and password do not match
            else return info[0].id; //If email and password match
        } else {
            //If its a username
            if (this.checkUsername(username)) return false; //If username is not in this.database
            const stmt = this.database.prepare(
                "SELECT * FROM user WHERE username = ? AND password = ?"
            );

            const info = stmt.all(username, password);
            if (info.length === 0)
                return false; //If username and password do not match
            else return info[0].id; //If username and password match
        }
        body = { id: status }
    }

    checkWeight(weight, tweight, height) {
        const bmi = this.calculateBmi(weight, height);
        if (bmi < 18.5) {
            if (weight > tweight) {
                console.log("UNDERWEIGHT");
                return false;
            }
        } else if (bmi > 25) {
            if (weight < tweight) {
                console.log("OVERWEIGHT");
                return false;
            }
        }
        return true;
    }

    calculateBmi(weight, height) {
        //Returns BMI
        return weight / (height * height);
    }

    bmi(id) {
        //Returns BMI for a specific user
        console.log("In interface method");
        console.log(id);
        const stmt = this.database.prepare("SELECT * FROM user WHERE id = ?");
        const info = stmt.all(id);
        const weight = info[0].weight;
        const height = info[0].height/100;
        //Gotta have it to 2dp or it gets UGLY
        return (weight / (height * height)).toFixed(2);
    }



    /********************************EXERCISE********************************/

    //Gets all activities a user can do when recording an exercise
    getActivities(){
        console.log("Trying to get activities");
        const stmt = this.database.prepare(
            "SELECT * FROM activity"
        );
        const info = stmt.all();
        return info;
    }



    //All details about an exercise given, checks if valid, then inserts into array
    recordExercise(body){
       //ID here refers to USER ID, NOT ACTIVITY ID OR EXERCISE ID
        const {
            id,
            name,
            activity,
            quantity,
            measurement,
            
        } = body;
        if (
            id === "" ||
            name === "" ||
            quantity === "" ||
            measurement === "" ||
            activity === ""
        ) {
            return false;
        }
        console.log("in the interface");
        console.log(body);
        console.log(id);
        console.log(activity);
        //We need to put ALL dates in the better format, not
        //the... weird and wrong US one
        const date = new Date().toLocaleDateString('en-GB');


        const stmt = this.database.prepare(
            'INSERT INTO exercise (user_id, name, quantity, measurement, date, type) VALUES (?, ?, ?, ?, ?, ?)'
        );

        const result = stmt.run(id, name, quantity, measurement, date, activity);
        return true;




    }

    /*********************************GOALS**********************************/

    getActiveGoals(id) {
        //Returns all active goals for a user
        const stmt = this.database.prepare(
            "SELECT * FROM goals WHERE id = ? AND status NOT IN ('inactive')"
        );
        const info = stmt.all(id);
        return info;
    }

    getGoalHistory(id) {
        //Returns all inactive goals for a user
        const stmt = this.database.prepare(
            "SELECT * FROM goals WHERE id = ? AND status IN ('inactive')"
        );
        const info = stmt.all(id);
        return info;
    }

    getGroupGoals(id) {
        //Returns all group goals for a user
        const stmt = this.database.prepare(
            "SELECT * FROM goals WHERE groupID = ? AND status NOT IN ('inactive')"
        );
        const info = stmt.all(id);
        return info;
    }

    estimateGoal(id) {
        //We need to use BMI to create a goal
        const stmt = this.database.prepare("SELECT * FROM user WHERE id = ?");
        const info = stmt.all(id);
        const weight = info[0].weight;
        const height = info[0].height;
        const tweight = info[0].tweight;
        const bmi = this.bmi(info[0].id);
        if (bmi < 18.5)
            return this.createUnderweightGoal(id, weight, height, tweight, bmi);
        else if (bmi >= 18.5 && bmi < 25)
            return this.createNormalGoal(id, weight, height, tweight, bmi);
        else if (bmi >= 25 && bmi < 30)
            return this.createOverweightGoal(id, weight, height, tweight, bmi);
        else return this.createObeseGoal(id, weight, height, tweight, bmi);
    }

    createUnderweightGoal(id, weight, tweight) {
        //We need to estimate the date of the goal
        const now = new Date();
        const futureDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        var goal;
        //Creates a goal for underweight people
        if (tweight <= weight) {
            return (goal = {
                id: id,
                goalType: "weight",
                current: weight,
                target: weight + 1,
                date: futureDate,
                notes: "Gain 1kg this week! Get some protein!",
            });
        } else {
            return (goal = {
                id: id,
                goalType: "distance",
                current: 0,
                target: 5,
                date: futureDate,
                notes: "Walk or run 5 miles this week!",
            });
        }
    }

    createNormalGoal(id) {
        //Creates a goal for normal people
        const now = new Date();
        const futureDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        //Creates a goal for underweight people

        return (goal = {
            id: id,
            goalType: "distance",
            current: 0,
            target: 10,
            date: futureDate,
            notes: "Run 10 miles this week! TIP: Split it up into multiple runs",
        });
    }

    createOverweightGoal(id, weight, tweight) {
        //Creates a goal for overweight people
        const now = new Date();
        const futureDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        //Creates a goal for underweight people
        if (tweight <= weight) {
            return (goal = {
                id: id,
                goalType: "weight",
                current: weight,
                target: weight - 1,
                date: futureDate,
                notes: "Lose 1kg this week! Get moving!",
            });
        } else {
            return (goal = {
                id: id,
                goalType: "distance",
                current: 0,
                target: 5,
                date: futureDate,
                notes: "Walk 5 miles this week!",
            });
        }
    }

    createObeseGoal(id, weight, tweight) {
        const now = new Date();
        const futureDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        //Creates a goal for underweight people
        if (tweight < weight) {
            return (goal = {
                id: id,
                goalType: "weight",
                current: weight,
                target: weight - 1,
                date: futureDate,
                notes: "Lose 1kg this week! Get moving!",
            });
        } else {
            return (goal = {
                id: id,
                goalType: "distance",
                current: 0,
                target: 5,
                date: futureDate,
                notes: "Walk 5 miles this week!",
            });
        }
    }
}

module.exports = { Interface };
