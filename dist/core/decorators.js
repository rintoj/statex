"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constance_1 = require("./constance");
var _angular_1 = require("../@angular");
var state_1 = require("./state");
/**
 * Bind data for give key and target using a selector function
 *
 * @param {any} target
 * @param {any} key
 * @param {any} selectorFunc
 */
function bindData(target, key, selector) {
    return state_1.State.select(selector)
        .subscribe(function (args) {
        if (typeof target.setState === 'function') {
            var state = {};
            state[key] = args;
            target.setState(state);
        }
        if (typeof target[key] === 'function')
            return target[key].call(target, args);
        target[key] = args;
    });
}
exports.bindData = bindData;
/**
 * Binds action to a function
 *
 * @example
 * class TodoStore {
 *
 *    @action
 *    addTodo(state: State, action: AddTodoAction): State {
 *       // return modified state
 *    }
 * }
 *
 * @export
 * @param {*} target
 * @param {string} propertyKey
 * @param {PropertyDescriptor} descriptor
 * @returns
 */
function action(targetAction) {
    return function (target, propertyKey, descriptor) {
        if (targetAction == undefined) {
            var metadata = Reflect.getMetadata('design:paramtypes', target, propertyKey);
            if (metadata.length < 2)
                throw new Error('@action() must be applied to a function with two arguments. ' +
                    'eg: reducer(state: State, action: SubclassOfAction): State { }');
            targetAction = metadata[1];
        }
        var statexActions = {};
        if (Reflect.hasMetadata(constance_1.STATEX_ACTION_KEY, target)) {
            statexActions = Reflect.getMetadata(constance_1.STATEX_ACTION_KEY, target);
        }
        statexActions[propertyKey] = targetAction;
        Reflect.defineMetadata(constance_1.STATEX_ACTION_KEY, statexActions, target);
        return {
            value: function (state, payload) {
                return descriptor.value.call(this, state, payload);
            }
        };
    };
}
exports.action = action;
/**
 * Add @data meta
 *
 * @export
 * @param {*} target
 * @param {any} propertyKey
 * @param {any} selector
 * @param {any} bindImmediate
 */
function data(selector, bindImmediate) {
    return function (target, propertyKey) {
        var metaTarget = target instanceof _angular_1.DataObserver ? target : target.constructor;
        var bindingsMeta = Reflect.getMetadata(constance_1.STATEX_DATA_BINDINGS_KEY, metaTarget);
        if (!Reflect.hasMetadata(constance_1.STATEX_DATA_BINDINGS_KEY, metaTarget)) {
            bindingsMeta = { selectors: {}, subscriptions: [], destroyed: !bindImmediate };
        }
        bindingsMeta.selectors[propertyKey] = selector;
        if (bindImmediate) {
            bindingsMeta.subscriptions.push(bindData(target, propertyKey, selector));
        }
        Reflect.defineMetadata(constance_1.STATEX_DATA_BINDINGS_KEY, bindingsMeta, metaTarget);
    };
}
exports.data = data;
/**
 * Subscribe to the state events and map it to properties
 *
 * @export
 */
function subscribe(propsClass) {
    var _this = this;
    var dataBindings = Reflect.getMetadata(constance_1.STATEX_DATA_BINDINGS_KEY, propsClass || this);
    if (dataBindings != undefined && dataBindings.destroyed === true) {
        dataBindings.subscriptions = dataBindings.subscriptions.concat(Object.keys(dataBindings.selectors)
            .map(function (key) { return bindData(_this, key, dataBindings.selectors[key]); }));
        dataBindings.destroyed = false;
        Reflect.defineMetadata(constance_1.STATEX_DATA_BINDINGS_KEY, dataBindings, this);
    }
}
exports.subscribe = subscribe;
/**
 * Unsubscribe from the state changes
 *
 * @export
 */
function unsubscribe() {
    var dataBindings = Reflect.getMetadata(constance_1.STATEX_DATA_BINDINGS_KEY, this);
    if (dataBindings != undefined) {
        dataBindings.subscriptions.forEach(function (subscription) { return subscription.unsubscribe(); });
        dataBindings.subscriptions = [];
        dataBindings.destroyed = true;
        Reflect.defineMetadata(constance_1.STATEX_DATA_BINDINGS_KEY, dataBindings, this);
    }
}
exports.unsubscribe = unsubscribe;
