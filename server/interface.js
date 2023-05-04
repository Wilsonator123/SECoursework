const dB = require("better-sqlite3");
const fs = require("fs");
const path = require("path");
const { start } = require("repl");

const nodemailer = require("nodemailer");
const crypto = require("crypto");

class Interface {
    constructor() {
        this.database = new dB("database.db", {
            verbose: console.log,
        });

        //IMPORTANT DATABASE STUFF WE MIGHT NEED AGAIN!

        //this.database.exec(fs.readFileSync(path.join(__dirname, "ddl.sql"), "utf8"));
        this.database.exec(
            fs.readFileSync(path.join(__dirname, "ddl.sql"), "utf8")
        );

        //this.database.exec("DROP TABLE user");
    }
    /************************************************************************/

    /*********************************USER**********************************/
    
    
    getUser(id) {
        //Returns the user with the given id
        const stmt = this.database.prepare("SELECT * FROM user WHERE id = ?");
        const info = stmt.all(id);
        return info;
    }

    recordWeight(body){
        const {id, weight} = body;
        const stmt = this.database.prepare(
            "UPDATE user SET weight = ? WHERE id = ?"
        );
        stmt.run(weight, id);
        return true;
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
            crypto.createHash('md5').update(password).digest('hex'),
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
            const info = stmt.all(login, crypto.createHash('md5').update(password).digest('hex'));
            if (info.length === 0)
                return false; //If email and password do not match
            else return info[0].id; //If email and password match
        } else {
            //If its a username
            if (this.checkUsername(login)) return false; //If username is not in this.database
            const stmt = this.database.prepare(
                "SELECT * FROM user WHERE username = ? AND password = ?"
            );

            const info = stmt.all(login, crypto.createHash('md5').update(password).digest('hex'));
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

        const stmt2 = this.database.prepare(
            "SELECT * FROM activity WHERE id = ?"
        );
        const info2 = stmt2.all(activity);
        const type = info2[0].type;
        console.log("TYPE: " + type);
        if (result.changes !== 0 && type === 1) this.updateGoal(id, distance);
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

    /*********************************GROUPS**********************************/

    //Return true only if group name hasnt been taken before
    checkGroupName(body) {
        const { name } = body;
        console.log(name);
        console.log(body);
        const stmt = this.database.prepare(
            "SELECT * FROM `group` WHERE name = ?"
        );
        const info = stmt.get(body);
        console.log(info);
        if (info === undefined) {
            return true;
        }
        if (info.length === 0) {
            return true;
        }
        return false;
    }

    createGroup(body) {
        const { user_id, name } = body;

        if (user_id === "" || name === "") {
            return false;
        }

        //Checking the unique group name again
        if (!this.checkGroupName(name)) {
            return false;
        }

        const stmt = this.database.prepare(
            "INSERT INTO `group` (name, owner_id) VALUES (?, ?)"
        );

        const result = stmt.run(name, user_id);

        const getIDstmt = this.database.prepare(
            "SELECT * from `group` WHERE name = ?"
        );
        const info = getIDstmt.all(name);
        const idResult = info[0].id;

        const stmt2 = this.database.prepare(
            "INSERT INTO group_user (group_id, user_id) VALUES (?, ?)"
        );

        const result2 = stmt2.run(idResult, user_id);

        return true;
    }

    getUserGroups(body) {
        //Returns the user with the given id
        const { id } = body;
        const stmt = this.database.prepare(
            "SELECT `group`.id, `group`.name FROM `group` INNER JOIN group_user ON `group`.id = group_user.group_id WHERE group_user.user_id = ?"
        );
        const info = stmt.all(id);
        return info;
    }

    getUserGroups(body) {
        //Returns the user with the given id
        const { id } = body;
        const stmt = this.database.prepare(
            "SELECT `group`.id, `group`.name FROM `group` INNER JOIN group_user ON `group`.id = group_user.group_id WHERE group_user.user_id = ?"
        );
        const info = stmt.all(id);
        return info;
    }

    getGroupUsers(body) {
        //Returns the user with the given id
        const { id } = body;
        const stmt = this.database.prepare(
            "SELECT user.id, user.firstname, user.lastname, user.username FROM user INNER JOIN group_user ON user.id = group_user.user_id  WHERE group_user.group_id = ?"
        );
        const info = stmt.all(id);
        return info;
    }

    sendGroupInvite(body) {
        //Emails a user about joining a group
        const { group_id, email } = body;

        //First check if email in system:
        const stmt = this.database.prepare(
            "SELECT * from user WHERE email = ?"
        );
        const info = stmt.get(email);
        if (info === undefined) {
            return false;
        } else if (info.length === 0) {
            return res
                .status(400)
                .json({ error: "User with this email not found" });
        }

        //Then check email is not already in the given group
        const stmt2 = this.database.prepare(
            "SELECT * from group_user INNER JOIN user ON user.id = group_user.user_id WHERE user.email = ? AND group_user.group_id = ?"
        );
        const info2 = stmt2.get(email, group_id);
        if (info2 === undefined) {
            //This is what we want, so just continue on
        } else if (info2.length !== 0) {
            return res
                .status(400)
                .json({ error: "User is already a member of this group" });
        }

        console.log("Valid email, so try and send");

        //If all this is met, send an email.

        const groupPageUrl = `http://localhost:3000/Group?groupId=${group_id}&email=${email}`;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "se.healthtracker101@gmail.com",
                pass: "btssdtghvfwpyiyo",
            },
        });

        //Prepares our email
        const mailOptions = {
            from: "se.healthtracker101@gmail.com",
            to: email,
            subject: "Health Tracker: Join Group",
            html: `<div>
                    <p>You have been invited to join a group. Click</p>
                    <a href="${groupPageUrl}">here</a>
                    <p> to join. \nOtherwise, enter code: ${group_id}</p>
                </div>`,
        };

        //Sends our email
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
                return false;
            } else {
                console.log("Email sent: " + info.response);
                return true;
            }
        });

        return true;
    }








    //Multi purpose function for adding users to groups based on either clicking an email link or typing in hash code:
    acceptGroupInvite(body) {
        //Emails a user about joining a group
        const { group_id, email, user_id } = body;

        //First check if email in system:
        const stmt = this.database.prepare(
            "SELECT * from user WHERE email = ?"
        );
        const info = stmt.get(email);
        
        
        if (info === undefined) {
            return { error: "Account with that email not found" };
        }

        //Then check if group in system:
        
        const stmt3 = this.database.prepare(
            "SELECT * from `group` WHERE id = ?"
        );
        const info3 = stmt3.get(group_id);
        console.log(info3);
        if (info3 === undefined) {
            console.log("Group not found error");
            return { error: "Group not found" };
        }

        const userID = info.id;

        //Check that user isnt already in group
        const stmt4 = this.database.prepare(
            "SELECT * from group_user WHERE user_id = ? AND group_id = ?"
        );
        const info4 = stmt4.get(userID, group_id);
        if (info4 === undefined) {
            //This is what we want, so just continue on
        } else if (info4.length !== 0) {
            return { error: "User is already a member of this group" };
        }

        console.log(userID);
        console.log(user_id);

        console.log(typeof userID);
        console.log(typeof user_id);
        console.log(userID == user_id);

        //Check the userID matches the current account logged in
        if (userID != user_id) {
            console.log("HAH GOT YA");
            return { error: "Not logged in as the right user to accept this" };
        }

        const stmt2 = this.database.prepare(
            "INSERT INTO group_user (user_id, group_id) VALUES (?, ?)"
        );

        const result = stmt2.run(userID, group_id);

        return true;
    }


    //Additional functionality needed when adding user by a code - need to get their email first
    addUserViaCode(body){
            const { user_id, group_id } = body;
    
            //Get users email
            const stmt5 = this.database.prepare(
                "SELECT email from user WHERE id = ?"
            );
            const info5 = stmt5.get(user_id);
            console.log(info5);
            if (info5 === undefined) {
                return { error: "Account with that email not found" };
            }

            const body2 = ({ group_id: group_id, email: info5.email, user_id: user_id })
            console.log(body2);
            return this.acceptGroupInvite(body2);
    
        }

    
    
    //Checks if user is owner of group or not - if so, they see the group modification details. If not, they get the member view
    checkOwner(body){
        const { group_id, user_id } = body;
        console.log(body);

        //Get users email
        const stmt = this.database.prepare(
            "SELECT * from `group` WHERE owner_id = ? AND id = ?"
        );
        const info = stmt.get(user_id, group_id);
        console.log(info);

        if (info === undefined) {
            console.log("NOT OWNER");
            return false;
        }

        else{
            console.log("IS OWNER");
            return true;
        }
    }



    //Remove a non-owner from a group, or an owner if the group only has one member
    leaveGroup(body){
        const { group_id, user_id } = body;
        console.log(body);

        //If user is owner and group size is 1, allow them to leave. Otherwise, dont.
        //If user is NOT the owner, allow them to leave
        const stmt = this.database.prepare(
            "SELECT * from `group` WHERE owner_id = ? AND id = ?"
        );
        const info = stmt.get(user_id, group_id);
        console.log(info);

        if (info === undefined) {
            const stmt2 = this.database.prepare(
                "DELETE from group_user WHERE user_id = ? AND group_id = ?"
            );
            stmt2.run(user_id, group_id);


            return true;
        }

        else{
            
            const stmt3 = this.database.prepare(
                "SELECT COUNT(*) FROM group_user WHERE group_id = ?"
            )
            const info3 = stmt3.get(group_id);
            console.log(info3);     
            //If only one member left in group remove them and delete group

            if(info3['COUNT(*)'] <= 1){
                console.log("Removing owner");
                const stmt4 = this.database.prepare(
                    "DELETE from group_user WHERE user_id = ? AND group_id = ?"
                );
                stmt4.run(user_id, group_id);

                
                //Deletes the group
                const stmt5 = this.database.prepare(
                    "DELETE from `group` WHERE id = ?"
                );
                stmt5.run(group_id);
                return true;
            }
            else{
                console.log("Will not remove owner");
                return false;
            }
        }
    }




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
        if (!this.dateCheck(start, end)) return false;
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
        console.log("updateGoal");
        console.log(id, distance);

        const stmt = this.database.prepare(
            "SELECT * from goal WHERE user_id = ? AND goalType = 'exercise' AND status = 'ACTIVE'"
        );
        const info = stmt.all(id).forEach((goal) => {
            const stmt1 = this.database.prepare(
                "UPDATE goal SET current = current + ? WHERE user_id = ? AND id= ? AND goalType = 'exercise' AND status = 'ACTIVE'"
            );
            const result = stmt1.run(distance, id, goal.id);
        });
    }

    dateCheck(start, end) {
        const today = new Date().toISOString().slice(0, 10);
        if (start < today || end < today) {
            return false;
        }
        if (start > end) {
            return false;
        }
        return true;
    }

    getActiveGoals(id) {
        const today = new Date().toISOString().slice(0, 10);
        //Returns all active goals for a user
        const stmt = this.database.prepare(
            "SELECT * FROM goal WHERE user_id = ? AND status != 'COMPLETED' AND start <= ? ORDER BY CASE status WHEN 'EXPIRED' THEN 1 WHEN 'ACTIVE' THEN 2 END, end ASC"
        );
        const info = stmt.all(id, today);
        return info;
    }

    checkGoals(id) {
        this.finishGoal(id);
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
                "UPDATE goal SET status = 'COMPLETED' WHERE id = ?"
            );
            const info = stmt.run(body.goalID);
            return info;
        }
    }

    getGoalHistory(id) {
        //Returns all inactive goals for a user
        const stmt = this.database.prepare(
            "SELECT * FROM goals WHERE id = ? AND status IN ('COMPLETED')"
        );
        const info = stmt.all(id);
        return info;
    }

    finishGoal(id) {
        const stmt = this.database.prepare(
            "UPDATE goal SET status = 'COMPLETED' WHERE user_id = ? AND target <= current AND status = 'ACTIVE'"
        );
        const info = stmt.run(id);
        return info;
    }









    getGroupGoals(body) {
        //Returns all group goals for a user
        const { id, group_id } =
        body;
        const stmt = this.database.prepare(
            "SELECT * FROM goal WHERE group_id = ? AND user_id = ? AND status NOT IN ('inactive')"
        );
        const info = stmt.all(group_id, id);
        return info;
    }



    createGroupGoal(body) {
        const { user_id, name, group_id, goalType, target, start, end, notes } =
            body;
        console.log(body);
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
        if (!this.dateCheck(start, end)) return false;
        //Update User Profile
        current = 0;

        
        //GET A LIST OF ALL USERS IN GROUP
        const stmt2 = this.database.prepare(
            "SELECT * FROM user JOIN group_user on user.id = group_user.user_id WHERE group_user.group_id = ?"
        );
        const info = stmt2.all(group_id);

        //Get the owners ID
        const stmt3 = this.database.prepare(
            "SELECT owner_id from `group` WHERE id = ?"
        );
        const ownerID = stmt3.all(group_id);



        
        //Prepares email stuff
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "se.healthtracker101@gmail.com",
                pass: "btssdtghvfwpyiyo",
            },
        });


        //Add admin goal first and get its id
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
        
        const stmt5 = this.database.prepare(
            "SELECT id FROM goal WHERE user_id = ? AND name = ? AND group_id = ? and goalType = ? and current = ? and target = ? and start = ? and end = ? and notes = ?"
        );

        const result2= stmt5.all(
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
        console.log(result2);

        const ownerGoalID = result2[0].id;


        const groupGoalPageUrl = `http://localhost:3000/Goal?id=${ownerGoalID}`;
        

        //Loop through the users - group owner gets goal automatically added, everyone else gets a link.
        info.forEach(user => {
            console.log("USER ID:" + user.user_id);
            console.log(ownerID);
            if (user.user_id == ownerID[0].owner_id){
                //IF owner, pass here as already done
                console.log("Doesn't send to owner")

            }
            else {
                
                
                const mailOptions = {
                    from: "se.healthtracker101@gmail.com",
                    to: user.email,
                    subject: "Health Tracker: Add Group Goal",
                    html: `<div>
                            <p>You have been sent a goal from one of your groups. Click</p>
                            <a href="${groupGoalPageUrl}">here</a>
                            <p> to add it. \nOtherwise, enter code: ${ownerGoalID}</p>
                        </div>`,
                };
        
                //Sends our email
                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                        return false;
                    } else {
                        console.log("Email sent: " + info.response);
                        return true;
                    }
                });
            }


    
            
        });

        return true;


        
    }




    //Can be used for both types of group goal adding
    acceptGoalInvite(body){
        const { goal_id, user_id } =
            body;
        
        console.log("Testing accept goal invite");
        console.log(body);


        //Get goal which will be copied into the user
        const stmt5 = this.database.prepare(
            "SELECT * FROM goal WHERE id = ?"
        );

        const result2= stmt5.all(
            goal_id
        );


        console.log("RESULT2");
        console.log(result2);

        //Return an error if no goal found with the code.
        if (result2.length === 0){
            return { error: "No goal found with this code." }
        }


        //Check if user is part of group. If not, disallow them from adding the goal
        const stmt6 = this.database.prepare(
            "SELECT * FROM group_user WHERE user_id = ? AND group_id = ?"
        );
        const result6= stmt6.all(
            user_id, result2[0].group_id
        );

        if (result6.length === 0){
            return { error: "You are not a member of this group." }
        }

        

        //Disallow goal if out of date
        if (result2[0].status !== 'ACTIVE'){
            return { error: "This group goal is no longer active." }
        }
        


        //Check the user doesn't already have the goal. If so, return false with a message
        const stmt3 = this.database.prepare(
            "SELECT id FROM goal WHERE user_id = ? AND name = ? AND group_id = ? and goalType = ? and current = ? and target = ? and start = ? and end = ? and notes = ?"
        );

        const result3= stmt3.all(
            user_id,
            result2[0].name,
            result2[0].group_id,
            result2[0].goalType,
            result2[0].current,
            result2[0].target,
            result2[0].start,
            result2[0].end,
            result2[0].notes
        );
        

        console.log("RESULT3");
        console.log(result3);

        if(result3.length !== 0){
            return { error: "User already has this group goal on their account." }
        }



       



        
        //Add this goal to the user
        const stmt = this.database.prepare(
            "INSERT INTO goal (user_id, name, group_id, goalType, current, target, start, end, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
        );

        const result = stmt.run(
            user_id,
            result2[0].name,
            result2[0].group_id,
            result2[0].goalType,
            result2[0].current,
            result2[0].target,
            result2[0].start,
            result2[0].end,
            result2[0].notes
        );

        return true;
    }


    
    checkGroupGoals(id) {
        //NEED TO UPDATE FINISH GOALS TO SEND OUT EMAILS TO ALL MEMBERS IF GROUP ID IS NOT NULL
        this.finishGoal(id);
        const date = new Date().toISOString().slice(0, 10);
        //Returns all active goals for a user
        const stmt = this.database.prepare(
            "UPDATE goal set status = 'EXPIRED' WHERE user_id = ? AND status IS ('ACTIVE') AND end<?"
        );
        stmt.run(id, date);
        return true;
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
