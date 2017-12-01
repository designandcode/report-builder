var assert = require('chai').assert,
    TABLE = require('../components/TABLE.js'),
    data = require('../test/mocks/data-table-mock.js'),
    component, componentEmail;


describe('Component', function() {
  describe('#TABLE()', function() {

    before(function() {
      component = TABLE('', data);
      componentEmail = TABLE('', data, email=true);
    });

    it('should return a string', function() {
      assert.isString(component);
    });

    it('should contain information from JSON', function() {
      assert.include(component, 'forbes.com');
    });

  });
});
