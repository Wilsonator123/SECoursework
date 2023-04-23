const dB = require("better-sqlite3");
const fs = require("fs");
const path = require("path");
const { start } = require("repl");
class Interface {
    constructor() {
        this.database = new dB("database.db", {
            verbose: console.log,
        });

        // this.database.exec(
        //     "INSERT INTO goal VALUES (?, 15, NULL, 'Test', 'exercise', 0, 100, '2023-04-20','2023-04-21', NULL, 'ACTIVE') "
        // );

        this.database.exec(
            fs.readFileSync(path.join(__dirname, "ddl.sql"), "utf8")
        );
    }
    /************************************************************************/

    /*********************************USER**********************************/
    getUser(id) {
        //Returns the user with the given id
        const stmt = this.database.prepare("SELECT * FROM user WHERE id = ?");
        const info = stmt.all(id);
        return info;
    }

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
        console.log("Body :" + body);
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
        if (!this.checkEmail(email)) return false;
        if (!this.checkUsername(username)) return false;
        const stmt = this.database.prepare(
            "INSERT INTO user VALUES (NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
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

        if (info.changes === 1) {
            const stmt = this.database.prepare(
                "SELECT * FROM user WHERE username = ?"
            );
            const info = stmt.all(username);
            const user = info[0].id;
            this.estimateGoal(user);
            return user;
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
            if (this.checkUsername(login)) return false; //If username is not in this.database
            const stmt = this.database.prepare(
                "SELECT * FROM user WHERE username = ? AND password = ?"
            );

            const info = stmt.all(login, password);
            if (info.length === 0)
                return false; //If username and password do not match
            else return info[0].id; //If username and password match
        }
    }

    checkWeight(weight, tweight, height) {
        const bmi = this.calculateBmi(weight, height);
        if (bmi < 18.5) {
            if (weight > tweight) {
                return false;
            }
        } else if (bmi > 25) {
            if (weight < tweight) {
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
        const height = info[0].height / 100;
        //Gotta have it to 2dp or it gets UGLY
        return (weight / (height * height)).toFixed(2);
    }
    /************************************************************************/

    /********************************EXERCISE********************************/
    getActivities() {
        console.log("Trying to get activities");
        const stmt = this.database.prepare(
            "SELECT * FROM activity ORDER BY name"
        );
        const info = stmt.all();
        return info;
    }

    getActivity(name) {
        //Returns all activity for a user
        const stmt = this.database.prepare(
            "SELECT * FROM activity WHERE id = ?"
        );
        const info = stmt.all(name.name);
        return info;
    }

    getWeeklyExercise(data) {
        let body = {
            SOW: 0,
            days: [0, 0, 0, 0, 0, 0, 0],
        };
        let today = new Date(data.date);
        let startOfWeek = new Date(
            today.getTime() - today.getDay() * 24 * 60 * 60 * 1000
        );
        body.SOW = startOfWeek.toISOString().slice(0, 10);
        let date = new Date(startOfWeek);
        for (let i = 0; i < 7; i++) {
            this.database
                .prepare(
                    "SELECT * FROM exercise WHERE user_id = ? AND date = ?"
                )
                .all(data.id, date.toISOString().slice(0, 10))
                .forEach((row) => {
                    body.days[i] += row.time / 60;
                });
            date.setDate(date.getDate() + 1);
        }
        console.log(body);

        return body;
    }

    //Gets exercises for a specific date to display on the homepage
    getUserExercises(body) {
        console.log("Trying to get exercises");
        console.log(body);

        //Get all exercises and their names for the given user (based on their token)
        const stmt = this.database.prepare(
            "SELECT exercise.id, exercise.name, exercise.time, exercise.distance, exercise.date, activity.name AS activity_name FROM exercise INNER JOIN activity ON exercise.type = activity.id WHERE exercise.user_id = ? AND exercise.date = ?"
        );

        const info = stmt.all(body.id, body.date);
        console.log(info);
        return info;
    }

    getExercises(id) {
        //Returns all exercise for a user
        const stmt = this.database.prepare(
            "SELECT exercise.name, activity.name AS type, time, distance, date FROM exercise JOIN activity on exercise.type=activity.id WHERE user_id = ? ORDER BY date ASC, exercise.id ASC"
        );
        const info = stmt.all(id);
        return info;
    }

    //All details about an exercise given, checks if valid, then inserts into array
    recordExercise(body) {
        //ID here refers to USER ID, NOT ACTIVITY ID OR EXERCISE ID
        const { id, name, activity, time, distance } = body;
        if (id === "" || name === "" || time === "" || activity === "") {
            return false;
        }
        if (distance === undefined) {
            distance = 0;
        }
        //We need to put ALL dates in the better format, not
        //the... weird and wrong US one
        const date = new Date().toISOString().slice(0, 10);

        const stmt = this.database.prepare(
            "INSERT INTO exercise (user_id, name, time, distance, date, type) VALUES (?, ?, ?, ?, ?, ?)"
        );

        const result = stmt.run(id, name, time, distance, date, activity);
        if (result.changes !== 0 && activity === 1)
            this.updateGoal(id, distance);
        return result;
    }
    /************************************************************************/

    /********************************MEALS********************************/
    getUserMeals(body) {
        let first =
            "SELECT meal.id, meal.name, meal.mealType, meal.date, meal.calories, food.name AS food_name, food.calories AS food_calories, meal.foodAmount, drink.name AS drink_name, drink.calories AS drink_calories, meal.drinkAmount FROM meal INNER JOIN food ON meal.food = food.name INNER JOIN drink ON meal.drink = drink.name ";
        let second = "";
        let third =
            "ORDER BY meal.date, CASE WHEN mealType='breakfast' THEN 1 WHEN mealType= 'lunch' THEN 2 WHEN mealType= 'dinner' THEN 3 WHEN mealType= 'snack' THEN 4 END";
        //Get all exercises and their names for the given user (based on their token)
        let stmt;
        if (body.size == 1) {
            second = "WHERE meal.user_id = ? AND meal.date = ? ";
            stmt = this.database.prepare(first + second + third);
            const info = stmt.all(body.id, body.date);
            console.log(info);
            return info;
        }
        if (body.size == 7) {
            let today = new Date(body.date);
            let startOfWeek = new Date(
                today.getTime() - today.getDay() * 24 * 60 * 60 * 1000
            );
            let endOfWeek = new Date(today.setDate(startOfWeek.getDate() + 6));
            console.log(startOfWeek, endOfWeek);
            second = "WHERE meal.user_id = ? AND meal.date BETWEEN ? AND ? ";
            stmt = this.database.prepare(first + second + third);
            const info = stmt.all(
                body.id,
                startOfWeek.toISOString().slice(0, 10),
                endOfWeek.toISOString().slice(0, 10)
            );
            console.log(info);
            return info;
        }
        if (body.size == 30) {
            let today = new Date(body.date);
            let startOfMonth = new Date(
                today.getFullYear(),
                today.getMonth(),
                1
            );
            let endOfMonth = new Date(
                today.getFullYear(),
                today.getMonth() + 1,
                0
            );
            second = "WHERE meal.user_id = ? AND meal.date BETWEEN ? AND ? ";
            stmt = this.database.prepare(first + second + third);
            const info = stmt.all(
                body.id,
                startOfMonth.toISOString().slice(0, 10),
                endOfMonth.toISOString().slice(0, 10)
            );
            console.log(info);
            return info;
        }
    }

    getFood(body) {
        console.log(body);
        const stmt = this.database.prepare(
            "SELECT * FROM food WHERE (createdBy = ? OR createdBy = 0) AND LOWER(name) LIKE ? ORDER BY name ASC LIMIT 6"
        );
        const info = stmt.all(body.id, `%${body.food}%`);
        console.log(info);
        return info;
    }

    recordNewFood(body) {
        //ID here refers to USER ID
        const { id, name, calories } = body;

        if (id === "" || name === "" || calories === "") {
            return false;
        }
        const stmt = this.database.prepare(
            "INSERT INTO food (name, calories, createdBy) VALUES (?, ?, ?)"
        );
        const result = stmt.run(name, calories, id);
        return result;
    }

    recordNewDrink(body) {
        //ID here refers to USER ID
        const { id, name, calories } = body;
        if (id === "" || name === "" || calories === "") {
            return false;
        }
        const stmt = this.database.prepare(
            "INSERT INTO drink (name, calories, createdBy) VALUES (?, ?, ?)"
        );
        const result = stmt.run(name, calories, id);
        return result;
    }

    getDrink(body) {
        console.log(body);
        const stmt = this.database.prepare(
            "SELECT * FROM drink WHERE (createdBy = ? OR createdBy = 0) AND LOWER(name) LIKE ? ORDER BY name ASC LIMIT 6"
        );
        const info = stmt.all(body.id, `%${body.drink}%`);
        console.log(info);
        return info;
    }

    getCalories(food, foodAmount, drink, drinkAmount) {
        console.log(food, foodAmount, drink, drinkAmount);
        var foodCalories = 0;
        var drinkCalories = 0;
        console.log("in getCalories");
        if (food !== "") {
            const stmt = this.database.prepare(
                "SELECT calories FROM food WHERE name = ?"
            );
            let data = stmt.get(food);
            foodCalories = (data.calories * foodAmount) / 100;
        }
        if (drink !== "") {
            const stmt = this.database.prepare(
                "SELECT calories FROM drink WHERE name = ?"
            );
            let data = stmt.get(drink);
            drinkCalories = (data.calories * drinkAmount) / 100;
        }
        return foodCalories + drinkCalories;
    }

    checkFood(body) {
        const { food } = body;
        const stmt = this.database.prepare("SELECT * FROM food WHERE name = ?");
        const info = stmt.get(food);
        if (info.length === 0) {
            return false;
        }
        return true;
    }

    checkDrink(body) {
        const { drink } = body;
        const stmt = this.database.prepare(
            "SELECT * FROM drink WHERE name = ?"
        );
        const info = stmt.get(drink);
        if (info.length === 0) {
            return false;
        }
        return true;
    }

    dietFilter(id, body) {
        //Date / Period of time -> 7 days
        var line = "SELECT * FROM diet WHERE user_id = " + id;
        if (body.date != null) {
            line += " AND date = " + body.date;
        }
    }

    //All details about an exercise given, checks if valid, then inserts into array
    recordMeal(body) {
        //ID here refers to USER ID, NOT ACTIVITY ID OR EXERCISE ID

        const {
            user_id,
            name,
            mealType,
            food,
            foodAmount,
            drink,
            drinkAmount,
        } = body;

        if (
            user_id === "" ||
            name === "" ||
            mealType === "" ||
            (food !== "" && foodAmount === "") ||
            (drink !== "" && drinkAmount === "")
        ) {
            return false;
        }

        var calories = this.getCalories(food, foodAmount, drink, drinkAmount);
        console.log(user_id);
        console.log(name);
        console.log(typeof user_id);

        const date = new Date().toISOString().slice(0, 10);

        const stmt = this.database.prepare(
            "INSERT INTO meal (name, mealType, date, user_id, food, foodAmount, drink, drinkAmount, calories) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
        );

        const result = stmt.run(
            name,
            mealType,
            date,
            user_id,
            food,
            foodAmount,
            drink,
            drinkAmount,
            calories
        );
        return true;
    }
    /************************************************************************/

    /*********************************GOALS**********************************/
    createGoal(body) {
        const { user_id, name, group_id, goalType, target, start, end, notes } =
            body;
        let current = body.current;
        if (
            name === "" ||
            goalType === "" ||
            target === "" ||
            start === "" ||
            end === ""
        ) {
            return false;
        }
        if (!this.dateCheck(end)) return false;
        //Update User Profile
        if (goalType === "diet") {
            const stmt1 = this.database.prepare(
                "UPDATE user SET weight = ?, tweight = ? WHERE id = ?"
            );
            const result1 = stmt1.run(current, target, user_id);
        } else {
            current = 0;
        }

        const stmt = this.database.prepare(
            "INSERT INTO goal (user_id, name, group_id, goalType, current, target, start, end, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
        );
        const result = stmt.run(
            user_id,
            name,
            group_id,
            goalType,
            current,
            target,
            start,
            end,
            notes
        );
        return result;
    }

    updateGoal(id, distance) {
        //user_id

        const stmt = this.database.prepare(
            "SELECT * from goal WHERE user_id = ? AND goalType = 'exercise' AND status = 'active'"
        );
        const info = stmt.get(id).forEach((goal) => {
            const stmt = this.database.prepare(
                "UPDATE goal SET current = current + ? WHERE id = ?"
            );
            const result = stmt.run(distance, id);
        });
    }

    dateCheck(date) {
        const today = new Date().toISOString().slice(0, 10);
        if (date < today) {
            return false;
        }
        return true;
    }

    getActiveGoals(id) {
        //Returns all active goals for a user
        const stmt = this.database.prepare(
            "SELECT * FROM goal WHERE user_id = ? AND status NOT IN ('COMPLETE') ORDER BY CASE status WHEN 'EXPIRED' THEN 1 WHEN 'ACTIVE' THEN 2 END, end ASC"
        );
        const info = stmt.all(id);
        return info;
    }

    checkGoals(id) {
        const date = new Date().toISOString().slice(0, 10);
        //Returns all active goals for a user
        const stmt = this.database.prepare(
            "UPDATE goal set status = 'EXPIRED' WHERE user_id = ? AND status IS ('ACTIVE') AND end<?"
        );
        stmt.run(id, date);
        return true;
    }

    reActivateGoal(goalID) {
        //We can actually change this to repeat the same duration as set
        const stmt = this.database.prepare("SELECT * FROM goal WHERE id = ?");
        const info = stmt.all(goalID);
        const data = info[0];
        const oldStart = new Date(data.start);
        const oldEnd = new Date(data.end);
        const diffTime = Math.abs(oldEnd - oldStart);
        const duration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        console.log(duration);
        const end = new Date();
        end.setDate(end.getDate() + duration);

        const start = new Date().toISOString().slice(0, 10);

        //Returns all active goals for a user
        const stmt1 = this.database.prepare(
            "UPDATE goal SET status = 'ACTIVE', start = ?, end = ? WHERE id = ?"
        );
        const info1 = stmt1.run(start, end.toISOString().slice(0, 10), goalID);
        return info1;
    }

    expiredGoal(body) {
        console.log(body);
        if (body.reactivate) this.reActivateGoal(body.goalID);
        else {
            const stmt = this.database.prepare(
                "UPDATE goal SET status = 'COMPLETE' WHERE id = ?"
            );
            const info = stmt.run(body.goalID);
            return info;
        }
    }

    getGoalHistory(id) {
        //Returns all inactive goals for a user
        const stmt = this.database.prepare(
            "SELECT * FROM goals WHERE id = ? AND status IN ('completed')"
        );
        const info = stmt.all(id);
        return info;
    }

    finishGoal(id) {
        const stmt = this.database.prepare(
            "UPDATE goal set status = 'COMPLETED' WHERE user_id = ? AND target <= current"
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
        const goal = null;
        if (bmi < 18.5)
            goal = this.createUnderweightGoal(id, weight, height, tweight, bmi);
        else if (bmi >= 25 && bmi < 30)
            goal = this.createOverweightGoal(id, weight, height, tweight, bmi);
        else goal = this.createObeseGoal(id, weight, height, tweight, bmi);
    }

    createUnderweightGoal(id, weight, tweight) {
        //We need to estimate the date of the goal
        const now = new Date();
        const futureDate = new Date();
        futureDate.setDate(now.getDate() + 7);
        //Creates a goal for underweight people
        if (tweight <= weight) {
            return (goal = {
                id: id,
                goalType: "weight",
                current: weight,
                target: weight + 1,
                date: futureDate.toISOString().slice(0, 10),
                notes: "Gain 1kg this week! Get some protein!",
            });
        } else {
            return (goal = {
                id: id,
                goalType: "distance",
                current: 0,
                target: 5,
                date: futureDate.toISOString().slice(0, 10),
                notes: "Walk or run 5 miles this week!",
            });
        }
    }

    createNormalGoal(id) {
        //Creates a goal for normal people
        const now = new Date();
        const futureDate = new Date();
        futureDate.setDate(now.getDate() + 7);
        //Creates a goal for underweight people

        return (goal = {
            id: id,
            goalType: "distance",
            current: 0,
            target: 10,
            date: futureDate.toISOString().slice(0, 10),
            notes: "Run 10 miles this week! TIP: Split it up into multiple runs",
        });
    }

    createOverweightGoal(id, weight, tweight) {
        //Creates a goal for overweight people
        const now = new Date();
        const futureDate = new Date();
        futureDate.setDate(now.getDate() + 7);
        //Creates a goal for underweight people
        if (tweight <= weight) {
            return (goal = {
                id: id,
                goalType: "weight",
                current: weight,
                target: weight - 1,
                date: futureDate.toISOString().slice(0, 10),
                notes: "Lose 1kg this week! Get moving!",
            });
        } else {
            return (goal = {
                id: id,
                goalType: "distance",
                current: 0,
                target: 5,
                date: futureDate.toISOString().slice(0, 10),
                notes: "Walk 5 miles this week!",
            });
        }
    }

    createObeseGoal(id, weight, tweight) {
        const now = new Date();
        const futureDate = new Date();
        futureDate.setDate(now.getDate() + 7);
        //Creates a goal for underweight people
        if (tweight < weight) {
            return (goal = {
                id: id,
                goalType: "weight",
                current: weight,
                target: weight - 1,
                date: futureDate.toISOString().slice(0, 10),
                notes: "Lose 1kg this week! Get moving!",
            });
        } else {
            return (goal = {
                id: id,
                goalType: "distance",
                current: 0,
                target: 5,
                date: futureDate.toISOString().slice(0, 10),
                notes: "Walk 5 miles this week!",
            });
        }
    }
}

module.exports = { Interface };
