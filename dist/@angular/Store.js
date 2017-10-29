"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var constance_1 = require("../core/constance");
/**
 * Extend this class to create a store
 *
 * @export
 * @class Store
 */
var Store = /** @class */ (function () {
    function Store() {
        var _this = this;
        if (!Reflect.hasMetadata(constance_1.STATEX_ACTION_KEY, this))
            return;
        var refluxActions = Reflect.getMetadata(constance_1.STATEX_ACTION_KEY, this);
        Object.keys(refluxActions).forEach(function (name) { return new refluxActions[name]().subscribe(_this[name], _this); });
    }
    return Store;
}());
exports.Store = Store;
