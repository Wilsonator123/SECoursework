const assert = require('chai').assert;
const Database = require('better-sqlite3');

const fs = require("fs");
const path = require("path");
const { start } = require("repl");


const { Interface } = require("../interface.js");
const backend = new Interface(new Database('../database.db'));
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







describe('Account Creation Tests', function() {


  describe('checkEmailFormat', function() {


    it('Returns true on a valid email format', function() {

      const email = 'test@example.com';
      const result = backend.checkEmailFormat(email);
      assert.isTrue(result);


    });

    it('Return false on an invalid email format', function() {

      const email = 'invalid_email_format';
      const result = backend.checkEmailFormat(email);
      assert.isFalse(result);

    });
  });


  describe('createUser', function() {

    it('Creates a user when valid data is given', function() {
      const userData = {
        username: 'unitTest1234',
        firstname: 'Unit',
        lastname: 'Test',
        email: 'driverandrew222@yahoo.com',
        password: 'test',
        gender: 'male',
        dob: new Date('2003-04-21').toDateString(),
        height: '170',
        weight: '60',
        tweight: '65'
      };

      const img = 'default.png';
      const result = backend.createUser(userData, img);
      assert.isTrue(result !== false);

    });


    it('Return false if email has already been taken', function() {
      const userData = {
        username: 'unitTest123',
        firstname: 'Unit',
        lastname: 'Test',
        email: 'driverandrew222@yahoo.com',
        password: 'test',
        gender: 'male',
        dob: new Date('2003-04-21').toDateString(),
        height: '170',
        weight: '60',
        tweight: '65'
      };

      const result = backend.createUser(userData);
      assert.isFalse(result);


    });
  });



  describe('checkEmail', function() {
    it('Return true if email is available', function() {
      const email = 'test@example.com';
      const result = backend.checkEmail(email);
      assert.isTrue(result);

    });


    it('Return false if email is already taken', function() {
      
      const email = 'driverandrew222@yahoo.com';
      const result = backend.checkEmail(email);
      assert.isFalse(result);

    });
  });

  describe('checkUsername', function() {
    it('Return true if username is available', function() {


      const username = 'unitTest12345';
      const result = backend.checkUsername(username);
      assert.isTrue(result);

    });


    it('Return false if the username is already taken', function() {

      const username = 'unitTest1234';
      const result = backend.checkUsername(username);
      assert.isFalse(result);

    });
  });




});



describe('Login Tests', function() {
  describe('login', function() {
    it('Return true for a valid username and password', function() {

      const username = 'unitTest1234';
      const password = 'test';
      const result = backend.checkLogin(username, password);
      assert.isTrue(result == 1);


    });

    it('Return false for an invalid username or password', function() {
      const username = 'unitTest1234';
      const password = 'wrongpassword';

      const result = backend.checkLogin(username, password);

      assert.isFalse(result);

    });

    it('Return false for a non-existing username', function() {
      const username = 'nonexistinguser';
      const password = 'password123';

      const result = backend.checkLogin(username, password);

      assert.isFalse(result);
    });
  });

  
});









describe('Diet Tests', function() {

  describe('recordNewFood', function() {
    it('Return true for valid input of food', function() {

      const result = backend.recordNewFood({id: 1, name: "testFood123", calories: 200});
      assert.isTrue(result.changes === 1);

    });

    it('Return false if any part of input is empty', function() {


      let result = backend.recordNewFood({id: "", name: "testFood123", calories: 200});
      assert.isFalse(result);
      result = backend.recordNewFood({id: 1, name: "", calories: 200});
      assert.isFalse(result);
      result = backend.recordNewFood({id: 1, name: "testFood123", calories: ""});
      assert.isFalse(result);

    });

  });




  describe('recordNewDrink', function() {
    it('Return true for valid input of drink', function() {

      const result = backend.recordNewDrink({id: 1, name: "testDrink123", calories: 200});
      assert.isTrue(result.changes === 1);

    });

    it('Return false if any part of input is empty', function() {

      let result = backend.recordNewDrink({id: "", name: "testDrink123", calories: 200});
      assert.isFalse(result);
      result = backend.recordNewDrink({id: 1, name: "", calories: 200});
      assert.isFalse(result);
      result = backend.recordNewDrink({id: 1, name: "testDrink123", calories: ""});
      assert.isFalse(result);

    });

  });




  describe('recordMeal', function() {
    it('Return true for valid input of meal', function() {

      const result = backend.recordMeal({user_id: 1, name: "testMeal123", mealType: "breakfast", food: "Apple", foodAmount: 200, drink: "Water", drinkAmount: 200});
      assert.isTrue(result);

    });

    it('Return false if any part of input is null', function() {

      const result = backend.recordMeal({user_id: 1, name: "", mealType: "breakfast", food: "Apple", foodAmount: 200, drink: "Water", drinkAmount: 200});
      assert.isFalse(result);

    });

  });

  
});











describe('Exercise Tests', function() {

  describe('recordExercise', function() {
    it('Return true for valid input of distance based exercise', function() {

      const result = backend.recordExercise({id: 1, name: "testExercise123", activity: 1, time: 100, distance: 100});
      assert.isTrue(result.changes === 1);

    });


    it('Return true for valid input of time based exercise', function() {
      const result = backend.recordExercise({id: 1, name: "testExercise456", activity: 5, time: 100, distance: ""});
      assert.isTrue(result.changes === 1);
    });


    it('Return false when a field is empty', function() {
      const result = backend.recordExercise({id: 1, name: "testExercise789", activity: "", time: 100, distance: 200});
      assert.isFalse(result);
    });

  });

  
});








describe('Group Tests', function() {

  describe('createGroup', function() {


    it('Return true for valid creation of group', function() {

      const result = backend.createGroup({user_id: 1, name: "testGroup123"});
      assert.isTrue(result);

    });


    it('Return false for duplicate name of group', function() {

      const result = backend.createGroup({user_id: 1, name: "testGroup123"});
      assert.isFalse(result);

    });

  });





  describe('sendGroupInvite', function() {


    it('Return true for valid group invite', function() {


      const userData = {
        username: 'unitTest5678',
        firstname: 'Unit',
        lastname: 'Test',
        email: 'driverandrew@yahoo.com',
        password: 'test',
        gender: 'male',
        dob: new Date('2003-04-21').toDateString(),
        height: '170',
        weight: '60',
        tweight: '65'
      };
      
      const img = 'default.png';
      const result = backend.createUser(userData, img);
      assert.isTrue(result !== false);


      const result2 = backend.sendGroupInvite({group_id: 1, email: "driverandrew@yahoo.com"});
      assert.isTrue(result2);

    });


    it('Return false where email isnt in database', function() {

      const result = backend.sendGroupInvite({group_id: 1, email: "driverandrew1@yahoo.com"});
      assert.isTrue(result.error === 'User with this email not found');

    });


    it('Return false where user is already in group', function() {

      const result = backend.sendGroupInvite({group_id: 1, email: "driverandrew222@yahoo.com"});
      assert.isTrue(result.error === 'User is already a member of this group');

    });



  });









  describe('acceptGroupInvite', function() {


    it('Return true for a valid accepting of invite', function() {

      const userData = {
        username: 'unitTest333',
        firstname: 'Unit',
        lastname: 'Test',
        email: 'driverandrew333@yahoo.com',
        password: 'test',
        gender: 'male',
        dob: new Date('2003-04-21').toDateString(),
        height: '170',
        weight: '60',
        tweight: '65'
      };
      
      const img = 'default.png';
      const result = backend.createUser(userData, img);
      assert.isTrue(result !== false);


      const result2 = backend.acceptGroupInvite({group_id: 1, email: "driverandrew@yahoo.com", user_id: 2});
      assert.isTrue(result2);

    });



    it('Return false for an invalid email', function() {

      const result = backend.acceptGroupInvite({group_id: 1, email: "driverandrewbbb@yahoo.com", user_id: 2});
      assert.isTrue(result.error === 'Account with that email not found');

    });


    it('Return false when the member is already part of the group', function() {

      const result = backend.acceptGroupInvite({group_id: 1, email: "driverandrew222@yahoo.com", user_id: 1});
      assert.isTrue(result.error === "User is already a member of this group");

    });


    it('Return false when the not logged in as the correct user', function() {

      const result = backend.acceptGroupInvite({group_id: 1, email: "driverandrew333@yahoo.com", user_id: 1});
      assert.isTrue(result.error === "Not logged in as the right user to accept this");

    });




  });








  describe('addUserViaCode', function() {



    it('Return false for a valid invite code', function() {

      const result = backend.addUserViaCode({user_id: 3, group_id: 200});
      assert.isTrue(result.error === 'Group not found');

    });

    it('Return true for a valid invite', function() {

      const result = backend.addUserViaCode({user_id: 3, group_id: 1});
      assert.isTrue(result);

    });




  });





  describe('checkOwner', function() {



    it('Return true if it is the owner', function() {

      const result = backend.addUserViaCode({user_id: 3, group_id: 200});
      assert.isTrue(result.error === 'Group not found');

    });

    it('Return false if it is not the owner', function() {

      const result = backend.addUserViaCode({user_id: 3, group_id: 1});
      assert.isTrue(result);

    });




  });






  
});




