const assert = require("chai").assert;
const Database = require("better-sqlite3");

const fs = require("fs");
const path = require("path");
const { start } = require("repl");

const { Interface } = require("../interface.js");
const backend = new Interface(new Database("../database.db"));
backend.database.exec("DROP TABLE user");
backend.database.exec("DROP TABLE group_user");
backend.database.exec("DROP TABLE meal");
backend.database.exec("DROP TABLE exercise");
backend.database.exec("DROP TABLE goal");
backend.database.exec("DROP TABLE food");
backend.database.exec("DROP TABLE drink");
backend.database.exec("DROP TABLE activity");
backend.database.exec("DROP TABLE `group`");

backend.database.exec(
    fs.readFileSync(path.join(__dirname, "/../ddl.sql"), "utf8")
);

backend.database.exec(
    fs.readFileSync(path.join(__dirname, "/../data/food_drink.sql"), "utf8")
);

backend.database.exec(
    fs.readFileSync(path.join(__dirname, "/../data/activity.sql"), "utf8")
);

describe("Account Creation Tests", function () {
    describe("checkEmailFormat", function () {
        it("Returns true on a valid email format", function () {
            const email = "test@example.com";
            const result = backend.checkEmailFormat(email);
            assert.isTrue(result);
        });

        it("Return false on an invalid email format", function () {
            const email = "invalid_email_format";
            const result = backend.checkEmailFormat(email);
            assert.isFalse(result);
        });
    });

    describe("createUser", function () {
        it("Creates a user when valid data is given", function () {
            const userData = {
                username: "unitTest1234",
                firstname: "Unit",
                lastname: "Test",
                email: "driverandrew222@yahoo.com",
                password: "test",
                gender: "male",
                dob: new Date("2003-04-21").toDateString(),
                height: "170",
                weight: "60",
                tweight: "65",
            };

            const img = "default.png";
            const result = backend.createUser(userData, img);
            assert.isTrue(result !== false);
        });

        it("Return false if email has already been taken", function () {
            const userData = {
                username: "unitTest123",
                firstname: "Unit",
                lastname: "Test",
                email: "driverandrew222@yahoo.com",
                password: "test",
                gender: "male",
                dob: new Date("2003-04-21").toDateString(),
                height: "170",
                weight: "60",
                tweight: "65",
            };

            const result = backend.createUser(userData);
            assert.isFalse(result);
        });
    });

    describe("checkEmail", function () {
        it("Return true if email is available", function () {
            const email = "test@example.com";
            const result = backend.checkEmail(email);
            assert.isTrue(result);
        });

        it("Return false if email is already taken", function () {
            const email = "driverandrew222@yahoo.com";
            const result = backend.checkEmail(email);
            assert.isFalse(result);
        });
    });

    describe("checkUsername", function () {
        it("Return true if username is available", function () {
            const username = "unitTest12345";
            const result = backend.checkUsername(username);
            assert.isTrue(result);
        });

        it("Return false if the username is already taken", function () {
            const username = "unitTest1234";
            const result = backend.checkUsername(username);
            assert.isFalse(result);
        });
    });
});

describe("Login Tests", function () {
    describe("login", function () {
        it("Return true for a valid username and password", function () {
            const username = "unitTest1234";
            const password = "test";
            const result = backend.checkLogin(username, password);
            assert.isTrue(result == 1);
        });

        it("Return false for an invalid username or password", function () {
            const username = "unitTest1234";
            const password = "wrongpassword";

            const result = backend.checkLogin(username, password);

            assert.isFalse(result);
        });

        it("Return false for a non-existing username", function () {
            const username = "nonexistinguser";
            const password = "password123";

            const result = backend.checkLogin(username, password);

            assert.isFalse(result);
        });
    });
});

describe("Diet Tests", function () {
    describe("recordNewFood", function () {
        it("Return true for valid input of food", function () {
            const result = backend.recordNewFood({
                id: 1,
                name: "testFood123",
                calories: 200,
            });
            assert.isTrue(result.changes === 1);
        });

        it("Return false if any part of input is empty", function () {
            let result = backend.recordNewFood({
                id: "",
                name: "testFood123",
                calories: 200,
            });
            assert.isFalse(result);
            result = backend.recordNewFood({ id: 1, name: "", calories: 200 });
            assert.isFalse(result);
            result = backend.recordNewFood({
                id: 1,
                name: "testFood123",
                calories: "",
            });
            assert.isFalse(result);
        });
    });

    describe("recordNewDrink", function () {
        it("Return true for valid input of drink", function () {
            const result = backend.recordNewDrink({
                id: 1,
                name: "testDrink123",
                calories: 200,
            });
            assert.isTrue(result.changes === 1);
        });

        it("Return false if any part of input is empty", function () {
            let result = backend.recordNewDrink({
                id: "",
                name: "testDrink123",
                calories: 200,
            });
            assert.isFalse(result);
            result = backend.recordNewDrink({ id: 1, name: "", calories: 200 });
            assert.isFalse(result);
            result = backend.recordNewDrink({
                id: 1,
                name: "testDrink123",
                calories: "",
            });
            assert.isFalse(result);
        });
    });

    describe("getFood", function () {
        it("Return true for valid input of food", function () {
            let result = backend.getFood({ id: 1, food: "testFood123" });
            assert.isTrue(result.length === 1);
        });
        it("Return false for invalid input of food", function () {
            result = backend.getFood({ id: 1, food: "notAFood" });
            console.log("CHECK FOOD :" + result);
            assert.isFalse(result === "");
        });
    });

    describe("getDrink", function () {
        it("Return true for valid input of drink", function () {
            let result = backend.getDrink({ id: 1, drink: "testDrink123" });
            assert.isTrue(result.length === 1);
        });
        it("Return false for invalid input of drink", function () {
            result = backend.getDrink({ id: 1, drink: "notADrink" });
            assert.isFalse(result === null);
        });
    });

    describe("checkFood", function () {
        it("Return true for valid input of food", function () {
            let result = backend.checkFood({ food: "testFood123" });
            assert.isTrue(result);
        });
        it("Return false for invalid input of food", function () {
            result = backend.checkFood({ food: "notAFood" });
            assert.isFalse(result === null);
        });

        describe("recordMeal", function () {
            it("Return true for valid input of meal", function () {
                let result = backend.recordMeal({
                    user_id: 1,
                    name: "testMeal123",
                    mealType: "breakfast",
                    food: "Apple",
                    foodAmount: 200,
                    drink: "Water",
                    drinkAmount: 200,
                });
                assert.isTrue(result);
            });

            it("Return false if any part of input is null", function () {
                result = backend.recordMeal({
                    user_id: 1,
                    name: "",
                    mealType: "breakfast",
                    food: "Apple",
                    foodAmount: 200,
                    drink: "Water",
                    drinkAmount: 200,
                });
                assert.isFalse(result);
            });
        });

        describe("getCalories", function () {
            it("Return true for correct calorie calculation ", function () {
                let result = backend.getCalories(
                    "testFood123",
                    50,
                    "testDrink123",
                    50
                );
                assert.isTrue(result === 200);
            });

            it("Return false for incorrect food and drink enties calculation ", function () {
                result = backend.getCalories(
                    "notAFood",
                    50,
                    "testDrink123",
                    50
                );
                assert.isFalse(result);
                result = backend.getCalories(
                    "testFood123",
                    50,
                    "notADrink",
                    50
                );
            });
        });

        describe("getUserMeals", function () {
            let date = new Date().toISOString().slice(0, 10);
            it("Returns meals of a specified user", function () {
                let result = backend.getUserMeals({
                    id: 1,
                    date: date,
                    size: 1,
                });
                assert.isTrue(result.length === 1);
            });

            it("Returns false for invalid user", function () {
                let result = backend.getUserMeals({
                    id: 10,
                    date: date,
                    size: 1,
                });
                console.log("GET USER MEALS" + result);
                assert.isFalse(result === "");
            });
        });
    });

    describe("checkDrink", function () {
        it("Return true for valid input of drink", function () {
            const result = backend.checkDrink({ drink: "testDrink123" });
            assert.isTrue(result);
        });

        it("Return false for invalid input of drink", function () {
            const result = backend.checkDrink({ drink: "notADrink" });
            assert.isFalse(result);
        });
    });

    describe("recordMeal", function () {
        let body = {
            user_id: 1,
            name: "testMeal123",
            mealType: "breakfast",
            food: "testFood123",
            foodAmount: 50,
            drink: "testDrink123",
            drinkAmount: 50,
        };
        it("Return true for valid input of meal", function () {
            const result = backend.recordMeal(body);
            assert.isTrue(result);
        });

        it("Return false if any part of input is null", function () {
            body.name = "";
            const result = backend.recordMeal(body);
            assert.isFalse(result);
            body.name = "testMeal123";
        });

        it("Return false if food or drink is not in database", function () {
            body.food = "notAFood";
            const result = backend.recordMeal(body);
            assert.isFalse(result);
            body.food = "testFood123";
            body.drink = "notADrink";
            const result2 = backend.recordMeal(body);
            assert.isFalse(result2);
        });
    });
});

describe("Exercise Tests", function () {
    describe("recordExercise", function () {
        it("Return true for valid input of distance based exercise", function () {
            const result = backend.recordExercise({
                id: 1,
                name: "testExercise123",
                activity: 1,
                time: 100,
                distance: 100,
            });
            assert.isTrue(result.changes === 1);
        });

        it("Return true for valid input of time based exercise", function () {
            const result = backend.recordExercise({
                id: 1,
                name: "testExercise456",
                activity: 5,
                time: 100,
                distance: "",
            });
            assert.isTrue(result.changes === 1);
        });

        it("Return false when a field is empty", function () {
            const result = backend.recordExercise({
                id: 1,
                name: "testExercise789",
                activity: "",
                time: 100,
                distance: 200,
            });
            assert.isFalse(result);
        });
    });

    describe("getExercise", function () {
        it("Return true for valid input of exercise", function () {
            const result = backend.getExercises(1);
            assert.isTrue(result.length === 2);
        });

        it("Return false for invalid input of exercise", function () {
            const result = backend.getExercises(2);
            assert.isFalse(result === "");
        });
    });

    describe("getUserExercises", function () {
        let date = new Date().toISOString().slice(0, 10);
        it("Return true for valid output of exercise", function () {
            const result = backend.getUserExercises({ id: 1, date: date });
            assert.isTrue(result.length === 2);
        });

        it("Return false for invalid output of exercise", function () {
            const result = backend.getUserExercises({ id: 1, date: "" });
            assert.isFalse(result.length == 0);
        });

        it("Return false for invalid user", function () {
            const result = backend.getUserExercises({ id: 10, date: date });
            assert.isFalse(result.length == 0);
        });
    });
});

describe("Group Tests", function () {
    describe("createGroup", function () {
        it("Return true for valid creation of group", function () {
            const result = backend.createGroup({
                user_id: 1,
                name: "testGroup123",
            });
            assert.isTrue(result);
        });

        it("Return false for duplicate name of group", function () {
            const result = backend.createGroup({
                user_id: 1,
                name: "testGroup123",
            });
            assert.isFalse(result);
        });
    });

    describe("sendGroupInvite", function () {
        it("Return true for valid group invite", function () {
            const userData = {
                username: "unitTest5678",
                firstname: "Unit",
                lastname: "Test",
                email: "driverandrew@yahoo.com",
                password: "test",
                gender: "male",
                dob: new Date("2003-04-21").toDateString(),
                height: "170",
                weight: "60",
                tweight: "65",
            };

            const img = "default.png";
            const result = backend.createUser(userData, img);
            assert.isTrue(result !== false);

            const result2 = backend.sendGroupInvite({
                group_id: 1,
                email: "driverandrew@yahoo.com",
            });
            assert.isTrue(result2);
        });

        it("Return false where email isnt in database", function () {
            const result = backend.sendGroupInvite({
                group_id: 1,
                email: "driverandrew1@yahoo.com",
            });
            assert.isTrue(result.error === "User with this email not found");
        });

        it("Return false where user is already in group", function () {
            const result = backend.sendGroupInvite({
                group_id: 1,
                email: "driverandrew222@yahoo.com",
            });
            assert.isTrue(
                result.error === "User is already a member of this group"
            );
        });
    });

    describe("acceptGroupInvite", function () {
        it("Return true for a valid accepting of invite", function () {
            const userData = {
                username: "unitTest333",
                firstname: "Unit",
                lastname: "Test",
                email: "driverandrew333@yahoo.com",
                password: "test",
                gender: "male",
                dob: new Date("2003-04-21").toDateString(),
                height: "170",
                weight: "60",
                tweight: "65",
            };

            const img = "default.png";
            const result = backend.createUser(userData, img);
            assert.isTrue(result !== false);

            const result2 = backend.acceptGroupInvite({
                group_id: 1,
                email: "driverandrew@yahoo.com",
                user_id: 2,
            });
            assert.isTrue(result2);
        });

        it("Return false for an invalid email", function () {
            const result = backend.acceptGroupInvite({
                group_id: 1,
                email: "driverandrewbbb@yahoo.com",
                user_id: 2,
            });
            assert.isTrue(result.error === "Account with that email not found");
        });

        it("Return false when the member is already part of the group", function () {
            const result = backend.acceptGroupInvite({
                group_id: 1,
                email: "driverandrew222@yahoo.com",
                user_id: 1,
            });
            assert.isTrue(
                result.error === "User is already a member of this group"
            );
        });

        it("Return false when the not logged in as the correct user", function () {
            const result = backend.acceptGroupInvite({
                group_id: 1,
                email: "driverandrew333@yahoo.com",
                user_id: 1,
            });
            assert.isTrue(
                result.error ===
                    "Not logged in as the right user to accept this"
            );
        });
    });

    describe("addUserViaCode", function () {
        it("Return false for a valid invite code", function () {
            const result = backend.addUserViaCode({
                user_id: 3,
                group_id: 200,
            });
            assert.isTrue(result.error === "Group not found");
        });

        it("Return true for a valid invite", function () {
            const result = backend.addUserViaCode({ user_id: 3, group_id: 1 });
            assert.isTrue(result);
        });
    });

    describe("checkOwner", function () {
        it("Return true if it is the owner", function () {
            const result = backend.checkOwner({ user_id: 1, group_id: 1 });
            assert.isTrue(result);
        });

        it("Return false if it is not the owner", function () {
            const result = backend.checkOwner({ user_id: 2, group_id: 1 });
            assert.isFalse(result);
        });
    });

    describe("createGroupGoal", function () {
        let start = new Date().toISOString().slice(0, 10);
        let end = new Date();
        end.setDate(end.getDate() + 1);
        it("Return true if a valid group goal is made", function () {
            const result = backend.createGroupGoal({
                user_id: 1,
                name: "testGoal",
                group_id: 1,
                goalType: "exercise",
                target: 500,
                start: start,
                end: end,
                notes: "",
            });
            assert.isTrue(result);
        });

        it("Return false if an invalid end date is given", function () {
            const result = backend.createGroupGoal({
                user_id: 1,
                name: "testGoal",
                group_id: 1,
                goalType: "exercise",
                target: 500,
                start: "2023-05-10",
                end: "2023-05-09",
                notes: "",
            });
            assert.isFalse(result);
        });

        it("Return false if an empty field is given", function () {
            const result = backend.createGroupGoal({
                user_id: 1,
                name: "",
                group_id: 1,
                goalType: "exercise",
                target: 500,
                start: "2023-05-10",
                end: "2023-05-17",
                notes: "",
            });
            assert.isFalse(result);
        });
    });

    describe("acceptGoalInvite", function () {
        it("Return false if an invalid code", function () {
            const result = backend.acceptGoalInvite({
                goal_id: 123,
                user_id: 1,
            });
            assert.isTrue(result.error === "No goal found with this code.");
        });

        it("Return false if user not in group", function () {
            const userData = {
                username: "unitTest444",
                firstname: "Unit",
                lastname: "Test",
                email: "driverandrew444@yahoo.com",
                password: "test",
                gender: "male",
                dob: new Date("2003-04-21").toDateString(),
                height: "170",
                weight: "60",
                tweight: "65",
            };

            const img = "default.png";
            const result = backend.createUser(userData, img);
            assert.isTrue(result !== false);

            const result2 = backend.acceptGoalInvite({
                goal_id: 1,
                user_id: 4,
            });
            assert.isTrue(
                result2.error === "You are not a member of this group."
            );
        });

        it("Return false if user already has group goal", function () {
            const result = backend.acceptGoalInvite({ goal_id: 1, user_id: 1 });
            assert.isTrue(
                result.error ===
                    "User already has this group goal on their account."
            );
        });

        it("Return true if user validly adds group goal", function () {
            const result = backend.acceptGoalInvite({ goal_id: 1, user_id: 2 });
            assert.isTrue(result);
        });
    });

    describe("leaveGroup", function () {
        it("Return false if the owner tries to leave and the group is not empty", function () {
            const result = backend.leaveGroup({ group_id: 1, user_id: 1 });
            assert.isFalse(result);
        });

        it("Return true if other members try to leave a group", function () {
            const result = backend.leaveGroup({ group_id: 1, user_id: 2 });
            assert.isTrue(result);
            const result2 = backend.leaveGroup({ group_id: 1, user_id: 3 });
            assert.isTrue(result2);
        });

        it("Return true if the owner tries to leave an empty group", function () {
            const result = backend.leaveGroup({ group_id: 1, user_id: 1 });
            assert.isTrue(result);
        });
    });
});
