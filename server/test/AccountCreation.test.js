const assert = require('chai').assert;
const sinon = require('sinon');
const Database = require('better-sqlite3');

const { Interface } = require("../interface.js");
const backend = new Interface(new Database('../database.db'));



describe('Backend Tests', function() {
  describe('getUser', function() {
    it('should return the user with the given id', function() {
      const id = 1;
      const expectedUser = {
        id: 1,
        username: 'testuser',
        firstname: 'Andrew',
        lastname: 'Driver',
        // Include other user properties
      };

      const databaseStub = sinon.stub(Database.prototype, 'prepare').returns({
        all: sinon.stub().returns([expectedUser]),
      });

      const user = backend.getUser(id);

      assert.deepEqual(user, [expectedUser]);

      databaseStub.restore();
    });
  });



  describe('recordWeight', function() {
    it('should update the weight for the user with the given id', function() {
      const body = {
        id: 1,
        weight: 70,
      };

      const stmtRunStub = sinon.stub().returns({});

      const databaseStub = sinon.stub(Database.prototype, 'prepare').returns({
        run: stmtRunStub,
      });


      backend.recordWeight(body);

      sinon.assert.calledOnce(stmtRunStub);
      sinon.assert.calledWithExactly(stmtRunStub, body.weight, body.id);

      databaseStub.restore();
    });
  });




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

  // Add tests for other methods (checkEmail, checkUsername, createUser, etc.)
});