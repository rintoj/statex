"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Constance = require("./constance");
var chai_1 = require("chai");
describe('Constance', function () {
    it('should have been defined', function () {
        chai_1.expect(typeof Constance).to.equal('object');
    });
    it('should have STATEX_ACTION_KEY defined', function () {
        chai_1.expect(typeof Constance.STATEX_ACTION_KEY).to.equal('symbol');
        chai_1.expect(Constance.STATEX_ACTION_KEY.toString()).to.equal('Symbol(statex:actions)');
    });
    it('should have STATEX_DATA_BINDINGS_KEY defined', function () {
        chai_1.expect(typeof Constance.STATEX_DATA_BINDINGS_KEY).to.equal('symbol');
        chai_1.expect(Constance.STATEX_DATA_BINDINGS_KEY.toString()).to.equal('Symbol(statex:dataBindings)');
    });
});
