"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constance_1 = require("../core/constance");
/**
 * Extend this class to create a store
 *
 * @export
 * @class Store
 */
var Store = (function () {
    function Store() {
        var _this = this;
        if (!Reflect.hasMetadata(constance_1.STATEX_ACTION_KEY, this))
            return;
        var statexActions = Reflect.getMetadata(constance_1.STATEX_ACTION_KEY, this);
        Object.keys(statexActions).forEach(function (name) { return new statexActions[name]().subscribe(_this[name], _this); });
    }
    return Store;
}());
exports.Store = Store;
