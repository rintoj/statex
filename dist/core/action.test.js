"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require("chai");
var action_1 = require("./action");
var init_1 = require("./init");
var Observable_1 = require("rxjs/Observable");
var replaceable_state_1 = require("./replaceable-state");
// use spies
chai.use(require('chai-spies-next'));
var expect = chai.expect;
describe('Action', function () {
    var TestAction = /** @class */ (function (_super) {
        __extends(TestAction, _super);
        function TestAction() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return TestAction;
    }(action_1.Action));
    var UnrelatedAction = /** @class */ (function (_super) {
        __extends(UnrelatedAction, _super);
        function UnrelatedAction() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return UnrelatedAction;
    }(action_1.Action));
    beforeEach(function () {
        init_1.initialize({});
    });
    it('should call a reducer function when an action is dispatched', function () {
        var reducer = chai.spy();
        new TestAction().subscribe(reducer, _this);
        new TestAction().dispatch();
        expect(reducer).to.have.been.called.once;
    });
    it('should call all reducer functions when an action is dispatched', function () {
        var reducer1 = chai.spy();
        var reducer2 = chai.spy();
        new TestAction().subscribe(reducer1, _this);
        new TestAction().subscribe(reducer2, _this);
        new TestAction().dispatch();
        expect(reducer1).to.have.been.called.once;
        expect(reducer2).to.have.been.called.once;
    });
    it('should call reducer functions subscribed to an action when an action is dispatched', function () {
        var reducer1 = chai.spy();
        var reducer2 = chai.spy();
        new TestAction().subscribe(reducer1, _this);
        new UnrelatedAction().subscribe(reducer2, _this);
        new TestAction().dispatch();
        expect(reducer1).to.have.been.called.once;
        expect(reducer2).not.to.have.been.called.once;
    });
    it('should call reducer function with state and payload', function () {
        var reducer1 = chai.spy();
        new TestAction().subscribe(reducer1, _this);
        var testAction = new TestAction();
        testAction.dispatch();
        expect(reducer1).to.have.been.called.with({}, testAction);
    });
    it('should merge the state returned by the reducer function into global state', function () {
        // create a reducer function and subscribe to TestAction
        var reducer1 = chai.spy(function () { return ({ testState: true }); });
        new TestAction().subscribe(reducer1, _this);
        // create an action
        var testAction = new TestAction();
        // update the state to { testState: true }
        testAction.dispatch();
        expect(reducer1).to.have.been.called.with({}, testAction);
        // checking if updated is made available to second call
        testAction.dispatch();
        expect(reducer1).to.have.been.called.with({ testState: true }, testAction);
    });
    it('should partially merge the state returned by the reducer function into global state', function () {
        // create a reducer function and subscribe to TestAction
        var reducer1 = chai.spy(function () { return ({ testState: true }); });
        new TestAction().subscribe(reducer1, _this);
        // create a reducer function and subscribe to TestAction
        var reducer2 = chai.spy(function () { return ({ anotherState: true }); });
        new UnrelatedAction().subscribe(reducer2, _this);
        // update the state to { testState: true }
        var testAction = new TestAction();
        testAction.dispatch();
        expect(reducer1).to.have.been.called.with({}, testAction);
        var unrelatedAction = new UnrelatedAction();
        unrelatedAction.dispatch();
        expect(reducer2).to.have.been.called.with({ testState: true }, unrelatedAction);
        unrelatedAction.dispatch();
        expect(reducer2).to.have.been.called.with({ testState: true, anotherState: true }, unrelatedAction);
    });
    it('should replace the entire state if reducer function returns replaceable state', function () {
        // create a reducer function and subscribe to TestAction
        var reducer1 = chai.spy(function () { return ({ testState: true }); });
        new TestAction().subscribe(reducer1, _this);
        // create a reducer function and subscribe to TestAction
        var reducer2 = chai.spy(function () { return new replaceable_state_1.ReplaceableState({ anotherState: true }); });
        new UnrelatedAction().subscribe(reducer2, _this);
        // update the state to { testState: true }
        var testAction = new TestAction();
        testAction.dispatch();
        expect(reducer1).to.have.been.called.with({}, testAction);
        var unrelatedAction = new UnrelatedAction();
        unrelatedAction.dispatch();
        expect(reducer2).to.have.been.called.with({ testState: true }, unrelatedAction);
        unrelatedAction.dispatch();
        expect(reducer2).to.have.been.called.with({ anotherState: true }, unrelatedAction);
    });
    it('should not throw an error if an action is called without any subscription', function () {
        var SampleAction = /** @class */ (function (_super) {
            __extends(SampleAction, _super);
            function SampleAction() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            return SampleAction;
        }(action_1.Action));
        expect(function () { return new SampleAction().dispatch(); }).not.to.throw();
    });
    it('should call the returned callback function with current state, if reducer returns a function', function () { return __awaiter(_this, void 0, void 0, function () {
        var SampleAction, callback, reducer1, action1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    init_1.initialize({ initialState: true });
                    SampleAction = /** @class */ (function (_super) {
                        __extends(SampleAction, _super);
                        function SampleAction() {
                            return _super !== null && _super.apply(this, arguments) || this;
                        }
                        return SampleAction;
                    }(action_1.Action));
                    callback = chai.spy(function () { return ({ testState: true }); });
                    reducer1 = chai.spy(function () {
                        return Observable_1.Observable.create(function (observer) {
                            setTimeout(function () {
                                observer.next(callback);
                                observer.complete();
                            }, 100);
                            observer.next({ reducerCalled: true });
                        });
                    });
                    new SampleAction().subscribe(reducer1, this);
                    action1 = new SampleAction();
                    return [4 /*yield*/, action1.dispatch()];
                case 1:
                    _a.sent();
                    expect(reducer1).to.have.been.called.with({ initialState: true }, action1);
                    return [4 /*yield*/, action1.dispatch()];
                case 2:
                    _a.sent();
                    expect(callback).to.have.been.called.with({ initialState: true, reducerCalled: true });
                    expect(reducer1).to.have.been.called.with({ initialState: true, reducerCalled: true, testState: true }, action1);
                    return [2 /*return*/];
            }
        });
    }); });
    it('should not fail even if the reducer function reject with an error', function () { return __awaiter(_this, void 0, void 0, function () {
        var SampleAction, reducer, errorHandler;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    SampleAction = /** @class */ (function (_super) {
                        __extends(SampleAction, _super);
                        function SampleAction() {
                            return _super !== null && _super.apply(this, arguments) || this;
                        }
                        return SampleAction;
                    }(action_1.Action));
                    reducer = chai.spy(function () { return Promise.reject('Simulated Error'); });
                    new SampleAction().subscribe(reducer, this);
                    errorHandler = chai.spy();
                    return [4 /*yield*/, new SampleAction().dispatch().then(function () { return undefined; }, errorHandler)];
                case 1:
                    _a.sent();
                    expect(errorHandler).to.have.been.called();
                    return [2 /*return*/];
            }
        });
    }); });
});
