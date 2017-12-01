var assert = require('chai').assert,
    DL = require('../components/DL.js'),
    data = require('../test/mocks/data-dl-mock.js'),
    component, componentEmail;


describe('Component', function() {
  describe('#DL()', function() {

    before(function() {
      component = DL('', data);
      componentEmail = DL('', data, email=true);
    });

    it('should return a string', function() {
      assert.isString(component);
    });

    it('should contain information from JSON', function() {
      assert.include(component, 'Google penalizes websites that are slow to load.');
    });

    it('should contain extra markup for emails', function() {
      assert.include(componentEmail, '<table ');
    })
  });
});
