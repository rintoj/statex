import { State } from './state'

describe('State', () => {

  beforeEach(() => {
    State.next({ initialState: true })
  })

  test('should return the current state', async () => {
    expect(State.current).toEqual({ initialState: true })
  })

  test('should allow to update the current state', async () => {
    State.next({ nextState: true })
    expect(State.current).toEqual({ nextState: true })
  })

  test('should allow other functions to subscribe to the updates', async () => {
    const dataObserver = jest.fn()
    State.subscribe(dataObserver, undefined, undefined)
    State.next({ nextState: true })
    expect(dataObserver).toHaveBeenCalledWith({ nextState: true })
  })

  test('should return the current state to once subscribed', async () => {
    const dataObserver = jest.fn()
    State.subscribe(dataObserver, undefined, undefined)
    expect(dataObserver).toHaveBeenCalledWith({ initialState: true })
  })

  test('should allow a subscription based on selection', async () => {
    const dataObserver = jest.fn()
    State.select(state => state.currentUser).subscribe(dataObserver, undefined, undefined)
    expect(dataObserver).not.toHaveBeenCalledWith({ initialState: true })
    State.next({ currentUser: { id: 'statex-user' } })
    expect(dataObserver).toHaveBeenCalledWith({ id: 'statex-user' })
  })

  test('should not return a value if the selection has not changed', async () => {
    const dataObserver = jest.fn()
    State.select(state => state.currentUser).subscribe(dataObserver, undefined, undefined)
    expect(dataObserver).not.toHaveBeenCalledWith({ initialState: true })
    State.next({ user: { id: 'statex-user' } })
    expect(dataObserver).not.toHaveBeenCalledWith({ id: 'statex-user' })
  })

  test('should return the current state if selector function is undefined', async () => {
    const dataObserver = jest.fn()
    State.select(undefined).subscribe(dataObserver, undefined, undefined)
    expect(dataObserver).toHaveBeenCalledWith({ initialState: true })
  })

  test('should not emit a value if selector function returns an error', async () => {
    const dataObserver = jest.fn()
    State.select(() => { throw new Error('Simulated error') }).subscribe(dataObserver, undefined, undefined)
    expect(dataObserver).not.toHaveBeenCalled()
  })

})