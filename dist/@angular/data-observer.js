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
var DataObserver = /** @class */ (function () {
    function DataObserver() {
        var _this = this;
        var originalInit = this.ngOnInit;
        this.ngOnInit = function () {
            core_1.subscribe.bind(_this)();
            originalInit.bind(_this)();
        };
        var originalDestroy = this.ngOnDestroy;
        this.ngOnDestroy = function () {
            core_1.unsubscribe.bind(_this)();
            originalDestroy.bind(_this)();
        };
    }
    DataObserver.prototype.ngOnInit = function () {
        // empty on purpose
    };
    DataObserver.prototype.ngOnDestroy = function () {
        // empty on purpose
        core_1.unsubscribe.bind(this)();
    };
    return DataObserver;
}());
exports.DataObserver = DataObserver;
