import * as Immutable from 'seamless-immutable'

import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import { StateSelector } from './state-selector'
import { Subscription } from 'rxjs/Subscription'

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
@Injectable()
export class State {

  private static state: State = new State()

  private currentState: any
  private subject: BehaviorSubject<any>

  static get current() {
    return State.state.currentState
  }

  /**
   * Publish next state
   * @param state
   */
  static next(state) {
    State.state.subject.next(state)
  }

  /**
   * Subscribe to the stream
   * @param onNext
   * @param onError
   * @param onComplete
   */
  static subscribe(onNext, onError, onComplete): Subscription {
    return State.state.subject.subscribe(onNext, onError, onComplete)
  }

  /**
   * Fires 'next' only when the value returned by this function changed from the previous value.
   *
   * @template T
   * @param {StateSelector<T>} selector
   * @returns {Observable<T>}
   */
  static select(selector: StateSelector): Observable<any> {

    return Observable.create(subscriber => {
      let previousState: any
      let subscription = this.subscribe(
        state => {
          let selection = select(state, selector)
          if (selection !== select(previousState, selector)) {
            previousState = state
            subscriber.next(selection)
          }
        },
        error => subscriber.error(error),
        () => subscriber.complete()
      )

      return subscription
    }).share()
  }

  constructor() {
    this.currentState = Immutable.from<any>({})
    this.subject = new BehaviorSubject(this.currentState)
  }

}

/**
 * Run selector function on the given state and return it's result. Return undefined if an error occurred
 *
 * @param {*} state
 * @param {StateSelector} selector
 * @returns The value return by the selector, undefined if an error occurred.
 */
function select(state: any, selector: StateSelector) {
  if (state == undefined) return
  if (selector == undefined) return state
  try {
    return selector(state)
  } catch (error) {
    return undefined
  }
}
