import * as chai from 'chai'

import { Action } from './action'
import { initialize } from './init'
import { ReplaceableState } from './replaceable-state'

// use spies
chai.use(require('chai-spies-next'))
const { expect } = chai

describe('Action', () => {

  class TestAction extends Action { }
  class UnrelatedAction extends Action { }

  beforeEach(() => {
    initialize({})
  })

  it('should call a reducer function when an action is dispatched', () => {
    const reducer = chai.spy()
    new TestAction().subscribe(reducer, this)
    new TestAction().dispatch()
    expect(reducer).to.have.been.called.once
  })

  it('should call all reducer functions when an action is dispatched', () => {
    const reducer1 = chai.spy()
    const reducer2 = chai.spy()
    new TestAction().subscribe(reducer1, this)
    new TestAction().subscribe(reducer2, this)
    new TestAction().dispatch()
    expect(reducer1).to.have.been.called.once
    expect(reducer2).to.have.been.called.once
  })

  it('should call reducer functions subscribed to an action when an action is dispatched', () => {
    const reducer1 = chai.spy()
    const reducer2 = chai.spy()
    new TestAction().subscribe(reducer1, this)
    new UnrelatedAction().subscribe(reducer2, this)
    new TestAction().dispatch()
    expect(reducer1).to.have.been.called.once
    expect(reducer2).not.to.have.been.called.once
  })

  it('should call reducer function with state and payload', () => {
    const reducer1 = chai.spy()
    new TestAction().subscribe(reducer1, this)
    const testAction = new TestAction()
    testAction.dispatch()
    expect(reducer1).to.have.been.called.with({}, testAction)
  })

  it('should merge the state returned by the reducer function into global state', () => {

    // create a reducer function and subscribe to TestAction
    const reducer1 = chai.spy(() => ({ testState: true }))
    new TestAction().subscribe(reducer1, this)

    // create an action
    const testAction = new TestAction()

    // update the state to { testState: true }
    testAction.dispatch()
    expect(reducer1).to.have.been.called.with({}, testAction)

    // checking if updated is made available to second call
    testAction.dispatch()
    expect(reducer1).to.have.been.called.with({ testState: true }, testAction)
  })

  it('should partially merge the state returned by the reducer function into global state', () => {

    // create a reducer function and subscribe to TestAction
    const reducer1 = chai.spy(() => ({ testState: true }))
    new TestAction().subscribe(reducer1, this)

    // create a reducer function and subscribe to TestAction
    const reducer2 = chai.spy(() => ({ anotherState: true }))
    new UnrelatedAction().subscribe(reducer2, this)

    // update the state to { testState: true }
    const testAction = new TestAction()
    testAction.dispatch()
    expect(reducer1).to.have.been.called.with({}, testAction)

    const unrelatedAction = new UnrelatedAction()
    unrelatedAction.dispatch()
    expect(reducer2).to.have.been.called.with({ testState: true }, unrelatedAction)
    unrelatedAction.dispatch()
    expect(reducer2).to.have.been.called.with({ testState: true, anotherState: true }, unrelatedAction)
  })

  it('should replace the entire state if reducer function returns replaceable state', () => {

    // create a reducer function and subscribe to TestAction
    const reducer1 = chai.spy(() => ({ testState: true }))
    new TestAction().subscribe(reducer1, this)

    // create a reducer function and subscribe to TestAction
    const reducer2 = chai.spy(() => new ReplaceableState({ anotherState: true }))
    new UnrelatedAction().subscribe(reducer2, this)

    // update the state to { testState: true }
    const testAction = new TestAction()
    testAction.dispatch()
    expect(reducer1).to.have.been.called.with({}, testAction)

    const unrelatedAction = new UnrelatedAction()
    unrelatedAction.dispatch()
    expect(reducer2).to.have.been.called.with({ testState: true }, unrelatedAction)
    unrelatedAction.dispatch()
    expect(reducer2).to.have.been.called.with({ anotherState: true }, unrelatedAction)
  })

  it('should not throw an error if an action is called without any subscription', () => {
    class SampleAction extends Action { }
    expect(() => new SampleAction().dispatch()).not.to.throw()
  })

  it('should call the returned callback function with current state, if reducer returns a function', () => {
    class SampleAction extends Action { }
    const callback = chai.spy(() => ({ testState: true }))
    const reducer1 = chai.spy(() => callback)
    new SampleAction().subscribe(reducer1, this)

    const action1 = new SampleAction()
    action1.dispatch()
    expect(reducer1).to.have.been.called.with({}, action1)
    action1.dispatch()
    expect(reducer1).to.have.been.called.with({ testState: true }, action1)
  })

})