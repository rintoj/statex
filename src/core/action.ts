import 'rxjs/add/observable/empty'
import 'rxjs/add/observable/from'
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/operator/share'
import 'rxjs/add/operator/skipWhile'

import * as Immutable from 'seamless-immutable'

import { ActionObserver } from './observers'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import { ReplaceableState } from './replaceable-state'
import { State } from './state'

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
export class Action {

  private static _lastAction: Action
  private static identities: any[] = []
  private static subscriptions: any[] = []

  /**
   * The last action occurred
   *
   * @readonly
   * @static
   *
   * @memberOf Action
   */
  public static get lastAction() {
    return Action.lastAction
  }

  /**
   * Returns identity of this class
   *
   * @readonly
   * @type {string}
   */
  get identity(): string {
    let id = Action.identities.indexOf(this.constructor)
    if (id < 0) {
      Action.identities.push(this.constructor)
      id = Action.identities.indexOf(this.constructor)
    }
    return `c${id}`
  }

  /**
   * Subscribe to this action. actionObserver will be called when 'dispatch()' is invoked
   *
   * @param {ActionObserver} actionObserver The function that process the action
   * @param {*} context Context binding
   * @returns {Action}
   */
  public subscribe(actionObserver: ActionObserver, context: any): Action {
    if (!Action.subscriptions[this.identity]) {
      Action.subscriptions[this.identity] = []
    }
    Action.subscriptions[this.identity].push(actionObserver.bind(context))
    return this
  }

  /**
   * Dispatch this action. Returns an observable which will be completed when all action subscribers
   * complete it's processing
   *
   * @returns {Observable<S>}
   */
  dispatch(): Promise<any> {

    Action._lastAction = this
    let subscriptions: ActionObserver[] = Action.subscriptions[this.identity]
    if (subscriptions == undefined || subscriptions.length === 0) {
      return new Promise(resolve => resolve())
    }

    let observable: Observable<any> = Observable.from(subscriptions)

      // convert 'Observable' returned by action subscribers to state
      .flatMap((actionObserver: ActionObserver): Observable<any> => {
        const result = actionObserver(State.current, this)
        if (!(result instanceof Observable || result instanceof Promise)) {
          return Observable.create((observer: Observer<any>) => {
            observer.next(result)
            observer.complete()
          })
        }
        return result as Observable<any>
      })

      // merge or replace state
      .map((state: any) => {
        if (state instanceof ReplaceableState) {
          // replace the state with the new one if not 'undefined'
          return Immutable.from((state as ReplaceableState).state || {})
        } else if (state != undefined) {
          // merge the state with existing state
          return State.current.merge(state, { deep: true })
        }
      })

      // wait until all the subscripts have completed processing
      .skipWhile((state: any, i: number) => i + 1 < subscriptions.length)

      // push 'next' state to 'stateStream' if there has been a change to the state
      .map((state: any) => {
        if (state != undefined) {
          State.next(state)
        }
        return state
      })

      // make this sharable (to avoid multiple copies of this observable being created)
      .share()

    return new Promise((resolve, reject) => {
      // to trigger observable
      observable.subscribe(() => {
        // empty function
      }, reject, () => resolve(State.current))
    })
  }
}
