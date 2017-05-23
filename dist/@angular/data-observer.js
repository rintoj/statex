"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("../core");
/**
 * Every component that uses `@BindAction` must extends from this
 * class in order to make sure that AOT won't delete OnInit and
 * OnDestroy life-cycle events used by the decorator, irrespective
 * of the fact that it may or may not be used by the component itself
 *
 * @export
 * @class DataObserver
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
var DataObserver = (function () {
    function DataObserver() {
    }
    DataObserver.prototype.ngOnInit = function () {
        core_1.subscribe.bind(this)();
    };
    DataObserver.prototype.ngOnDestroy = function () {
        core_1.unsubscribe.bind(this)();
    };
    return DataObserver;
}());
exports.DataObserver = DataObserver;
