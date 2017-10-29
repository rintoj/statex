"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("rxjs/add/observable/empty");
require("rxjs/add/observable/from");
require("rxjs/add/operator/catch");
require("rxjs/add/operator/map");
require("rxjs/add/operator/mergeMap");
require("rxjs/add/operator/share");
require("rxjs/add/operator/skipWhile");
var Immutable = require("seamless-immutable");
var Observable_1 = require("rxjs/Observable");
var replaceable_state_1 = require("./replaceable-state");
var state_1 = require("./state");
/**
 * Defines an action which an be extended to implement custom actions for a reflux application
 *
 * @example
 *
 * // Create your own action class
 * class PageSwitchAction extends Action {
 *   constructor(public pageId: string) { super() }
 * }
 *
 * // Subscribe to your action
 * new PageSwitchAction(undefined).subscribe((state: State, action: PageSwitchAction): Observable<State> => {
 *   return Observable.create((observer: Observer<State>) => {
 *     observer.next(updatedState)
 *       observer.complete()
 *   }).share()
 * }, this)
 *
 * // Dispatch your action
 * new PageSwitchAction('page1').dispatch()
 *
 * @export
 * @class Action
 */
var Action = /** @class */ (function () {
    function Action() {
    }
    Object.defineProperty(Action, "lastAction", {
        /**
         * The last action occurred
         *
         * @readonly
         * @static
         *
         * @memberOf Action
         */
        get: function () {
            return Action._lastAction;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Action.prototype, "identity", {
        /**
         * Returns identity of this class
         *
         * @readonly
         * @type {string}
         */
        get: function () {
            var id = Action.identities.indexOf(this.constructor);
            if (id < 0) {
                Action.identities.push(this.constructor);
                id = Action.identities.indexOf(this.constructor);
            }
            return "c" + id;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Subscribe to this action. actionObserver will be called when 'dispatch()' is invoked
     *
     * @param {ActionObserver} actionObserver The function that process the action
     * @param {*} context Context binding
     * @returns {Action}
     */
    Action.prototype.subscribe = function (actionObserver, context) {
        if (!Action.subscriptions[this.identity]) {
            Action.subscriptions[this.identity] = [];
        }
        Action.subscriptions[this.identity].push(actionObserver.bind(context));
        return this;
    };
    /**
     * Dispatch this action. Returns an observable which will be completed when all action subscribers
     * complete it's processing
     *
     * @returns {Observable<S>}
     */
    Action.prototype.dispatch = function () {
        var _this = this;
        Action._lastAction = this;
        var subscriptions = Action.subscriptions[this.identity];
        if (subscriptions == undefined || subscriptions.length === 0) {
            return new Promise(function (resolve) { return resolve(); });
        }
        var observable = Observable_1.Observable.from(subscriptions)
            .flatMap(function (actionObserver) {
            var result = actionObserver(state_1.State.current, _this);
            if (!(result instanceof Observable_1.Observable || result instanceof Promise)) {
                return Observable_1.Observable.create(function (observer) {
                    observer.next(result);
                    observer.complete();
                });
            }
            return result;
        })
            .map(function (state) {
            if (state instanceof replaceable_state_1.ReplaceableState) {
                // replace the state with the new one if not 'undefined'
                return Immutable.from(state.state || {});
            }
            else if (state != undefined) {
                // merge the state with existing state
                return state_1.State.current.merge(state, { deep: true });
            }
        })
            .skipWhile(function (state, i) { return i + 1 < subscriptions.length; })
            .map(function (state) {
            if (state != undefined) {
                state_1.State.next(state);
            }
            return state;
        })
            .share();
        return new Promise(function (resolve, reject) {
            // to trigger observable
            observable.subscribe(function () {
                // empty function
            }, reject, function () { return resolve(state_1.State.current); });
        });
    };
    Action.identities = [];
    Action.subscriptions = [];
    return Action;
}());
exports.Action = Action;
