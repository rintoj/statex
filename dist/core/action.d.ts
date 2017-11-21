import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/skipWhile';
import { ActionObserver } from './observers';
/**
 * Defines an action which an be extended to implement custom actions for a statex application
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
export declare class Action {
    private static _lastAction;
    private static _showError;
    private static identities;
    private static subscriptions;
    /**
     * The last action occurred
     *
     * @readonly
     * @static
     *
     * @memberOf Action
     */
    static readonly lastAction: Action;
    /**
     * Set show error flag, if set to true, this module must show errors on Action rejections
     */
    static showError: boolean;
    /**
     * Returns identity of this class
     *
     * @readonly
     * @type {string}
     */
    readonly identity: string;
    /**
     * Subscribe to this action. actionObserver will be called when 'dispatch()' is invoked
     *
     * @param {ActionObserver} actionObserver The function that process the action
     * @param {*} context Context binding
     * @returns {Action}
     */
    subscribe(actionObserver: ActionObserver, context: any): Action;
    /**
     * Dispatch this action. Returns an observable which will be completed when all action subscribers
     * complete it's processing
     *
     * @returns {Observable<S>}
     */
    dispatch(): Promise<any>;
}
