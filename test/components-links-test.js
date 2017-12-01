var assert = require('chai').assert,
    LINKS = require('../components/LINKS.js'),
    data = require('../test/mocks/data-links-mock.js'),
    component, componentEmail;


describe('Component', function() {
  describe('#LINKS()', function() {

    before(function() {
      component = LINKS('', data);
      componentEmail = LINKS('', data, email=true);
    });

    it('should return a string', function() {
      assert.isString(component);
    });

    it('should contain information from JSON', function() {
      assert.include(component, 'www.google.com');
    });

    it('should contain extra markup for emails', function() {
      assert.include(componentEmail, '<table ');
    })
  });
});
