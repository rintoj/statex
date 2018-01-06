import { Action } from './action'
import { Observer } from 'rxjs/Observer'
import { initialize } from './init'
import { Observable } from 'rxjs/Observable'
import { ReplaceableState } from './replaceable-state'

describe('Action', () => {

  class TestAction extends Action { }
  class UnrelatedAction extends Action { }

  beforeEach(() => {
    initialize({})
  })

  test('should call a reducer function when an action is dispatched', () => {
    const reducer = jest.fn()
    new TestAction().subscribe(reducer, this)
    new TestAction().dispatch()
    expect(reducer).toHaveBeenCalledTimes(1)
  })

  test('should call all reducer functions when an action is dispatched', () => {
    const reducer1 = jest.fn()
    const reducer2 = jest.fn()
    new TestAction().subscribe(reducer1, this)
    new TestAction().subscribe(reducer2, this)
    new TestAction().dispatch()
    expect(reducer1).toHaveBeenCalledTimes(1)
    expect(reducer2).toHaveBeenCalledTimes(1)
  })

  test('should call reducer functions subscribed to an action when an action is dispatched', () => {
    const reducer1 = jest.fn()
    const reducer2 = jest.fn()
    new TestAction().subscribe(reducer1, this)
    new UnrelatedAction().subscribe(reducer2, this)
    new TestAction().dispatch()
    expect(reducer1).toHaveBeenCalledTimes(1)
    expect(reducer2).not.toHaveBeenCalledTimes(1)
  })

  test('should call reducer function with state and payload', () => {
    const reducer1 = jest.fn()
    new TestAction().subscribe(reducer1, this)
    const testAction = new TestAction()
    testAction.dispatch()
    expect(reducer1).toHaveBeenCalledWith({}, testAction)
  })

  test('should merge the state returned by the reducer function into global state', () => {

    // create a reducer function and subscribe to TestAction
    const reducer1 = jest.fn(() => ({ testState: true }))
    new TestAction().subscribe(reducer1, this)

    // create an action
    const testAction = new TestAction()

    // update the state to { testState: true }
    testAction.dispatch()
    expect(reducer1).toHaveBeenCalledWith({}, testAction)

    // checking if updated is made available to second call
    testAction.dispatch()
    expect(reducer1).toHaveBeenCalledWith({ testState: true }, testAction)
  })

  test('should partially merge the state returned by the reducer function into global state', () => {

    // create a reducer function and subscribe to TestAction
    const reducer1 = jest.fn(() => ({ testState: true }))
    new TestAction().subscribe(reducer1, this)

    // create a reducer function and subscribe to TestAction
    const reducer2 = jest.fn(() => ({ anotherState: true }))
    new UnrelatedAction().subscribe(reducer2, this)

    // update the state to { testState: true }
    const testAction = new TestAction()
    testAction.dispatch()
    expect(reducer1).toHaveBeenCalledWith({}, testAction)

    const unrelatedAction = new UnrelatedAction()
    unrelatedAction.dispatch()
    expect(reducer2).toHaveBeenCalledWith({ testState: true }, unrelatedAction)
    unrelatedAction.dispatch()
    expect(reducer2).toHaveBeenCalledWith({ testState: true, anotherState: true }, unrelatedAction)
  })

  test('should replace the entire state if reducer function returns replaceable state', () => {

    // create a reducer function and subscribe to TestAction
    const reducer1 = jest.fn(() => ({ testState: true }))
    new TestAction().subscribe(reducer1, this)

    // create a reducer function and subscribe to TestAction
    const reducer2 = jest.fn(() => new ReplaceableState({ anotherState: true }))
    new UnrelatedAction().subscribe(reducer2, this)

    // update the state to { testState: true }
    const testAction = new TestAction()
    testAction.dispatch()
    expect(reducer1).toHaveBeenCalledWith({}, testAction)

    const unrelatedAction = new UnrelatedAction()
    unrelatedAction.dispatch()
    expect(reducer2).toHaveBeenCalledWith({ testState: true }, unrelatedAction)
    unrelatedAction.dispatch()
    expect(reducer2).toHaveBeenCalledWith({ anotherState: true }, unrelatedAction)
  })

  test('should not throw an error if an action is called without any subscription', () => {
    class SampleAction extends Action { }
    expect(() => new SampleAction().dispatch()).not.toThrow()
  })

  test('should call the returned callback function with current state, if reducer returns a function', async () => {
    initialize({ initialState: true })
    class SampleAction extends Action { }
    const callback = jest.fn(() => ({ testState: true }))
    const reducer1 = jest.fn(() => {
      return Observable.create((observer: Observer<any>) => {
        setTimeout(() => {
          observer.next(callback)
          observer.complete()
        }, 100)
        observer.next({ reducerCalled: true })
      })
    })
    new SampleAction().subscribe(reducer1, this)

    const action1 = new SampleAction()
    await action1.dispatch()
    expect(reducer1).toHaveBeenCalledWith({ initialState: true }, action1)
    await action1.dispatch()
    expect(callback).toHaveBeenCalledWith({ initialState: true, reducerCalled: true })
    expect(reducer1).toHaveBeenCalledWith({ initialState: true, reducerCalled: true, testState: true }, action1)
  })

  test('should not fail even if the reducer function reject with an error', async () => {
    class SampleAction extends Action { }
    const reducer = jest.fn(() => Promise.reject('Simulated Error'))
    new SampleAction().subscribe(reducer, this)

    const errorHandler = jest.fn()
    await new SampleAction().dispatch().then(undefined, errorHandler)
    expect(errorHandler).toHaveBeenCalled()
  })

  test('should return the last action', async () => {
    Action.showError = true
    class SampleAction1 extends Action { }
    class SampleAction2 extends Action { }
    await new SampleAction1().dispatch()
    await new SampleAction2().dispatch()
    expect(Action.lastAction).toBeInstanceOf(SampleAction2)
  })

  test('should show console errors if "showError" flag is set to true', async () => {
    console.error = jest.fn()
    Action.showError = true
    class SampleAction extends Action { }
    const reducer = jest.fn(() => Promise.reject('Simulated Error'))
    new SampleAction().subscribe(reducer, this)
    try {
      await new SampleAction().dispatch()
    } catch (e) {
      // do nothing
    }
    expect(console.error).toHaveBeenCalledWith('Simulated Error')
  })

})