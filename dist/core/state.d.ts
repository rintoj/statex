import { Observable } from 'rxjs/Observable';
import { StateSelector } from './state-selector';
import { Subscription } from 'rxjs/Subscription';
/**
 * Defines a stream for changing state in a reflux application
 *
 * @example
 *
 * // replace state
 * State.next(state)
 *
 * // subscribe to state stream
 * State.subscribe((state: State) => {
 *   // do your action here
 * })
 *
 * // or listen to a portion of the state
 * State
 *   .select((state: State) => state.application.pageContainer)
 *   .subscribe((state: State) => {
 *     // do your action here
 *   })
 *
 * @export
 * @class StateStream
 * @extends {BehaviorSubject}
 */
export declare class State {
    private static state;
    private currentState;
    private subject;
    static readonly current: any;
    /**
     * Publish next state
     * @param state
     */
    static next(state: any): void;
    /**
     * Subscribe to the stream
     * @param onNext
     * @param onError
     * @param onComplete
     */
    static subscribe(onNext: any, onError: any, onComplete: any): Subscription;
    /**
     * Fires 'next' only when the value returned by this function changed from the previous value.
     *
     * @template T
     * @param {StateSelector<T>} selector
     * @returns {Observable<T>}
     */
    static select(selector: StateSelector): Observable<any>;
    constructor();
}
