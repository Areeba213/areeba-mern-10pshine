const { expect } = require('chai');

describe('Basic Test Setup', () => {
  it('should pass basic arithmetic', () => {
    expect(1 + 1).to.equal(2);
  });

  it('should have working test functions', () => {
    expect(typeof describe).to.equal('function');
    expect(typeof it).to.equal('function');
  });
});