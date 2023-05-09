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
backend.database.exec("DROP TABLE `group`");




backend.database.exec(
  fs.readFileSync(path.join(__dirname, "/../ddl.sql"), "utf8")
);



describe('Account Creation Tests', function() {
  // ...

  describe('checkEmailFormat', function() {


    it('should return true for a valid email format', function() {

      const email = 'test@example.com';
      const result = backend.checkEmailFormat(email);
      assert.isTrue(result);


    });

    it('should return false for an invalid email format', function() {

      const email = 'invalid_email_format';
      const result = backend.checkEmailFormat(email);
      assert.isFalse(result);

    });
  });

  describe('createUser', function() {

  
    it('should create a new user with the provided data', function() {
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


    it('should return false if the email has already been taken', function() {
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
    it('should return true if the email is available', function() {
      const email = 'test@example.com';
      const result = backend.checkEmail(email);
      assert.isTrue(result);

    });


    it('should return false if the email is already taken', function() {
      
      const email = 'driverandrew222@yahoo.com';
      const result = backend.checkEmail(email);
      assert.isFalse(result);

    });
  });

  describe('checkUsername', function() {
    it('should return true if the username is available', function() {


      const username = 'unitTest12345';
      const result = backend.checkUsername(username);
      assert.isTrue(result);

    });


    it('should return false if the username is already taken', function() {

      const username = 'unitTest1234';
      const result = backend.checkUsername(username);
      assert.isFalse(result);

    });
  });




});



describe('Login Tests', function() {
  describe('login', function() {
    it('should return true for a valid username and password', function() {

      const username = 'unitTest1234';
      const password = 'test';
      const result = backend.checkLogin(username, password);
      assert.isTrue(result == 1);


    });

    it('should return false for an invalid username or password', function() {
      const username = 'unitTest1234';
      const password = 'wrongpassword';

      const result = backend.checkLogin(username, password);

      assert.isFalse(result);

    });

    it('should return false for a non-existing username', function() {
      const username = 'nonexistinguser';
      const password = 'password123';

      const result = backend.checkLogin(username, password);

      assert.isFalse(result);
    });
  });

  
});

