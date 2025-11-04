process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHttp = require('chai-http');

// Properly initialize chai-http
chai.use(chaiHttp);

global.expect = chai.expect;
global.should = chai.should();