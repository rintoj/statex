import * as Constance from './constance'

describe('Constance', () => {

  test('should have been defined', () => {
    expect(typeof Constance).toEqual('object')
  })

  test('should have STATEX_ACTION_KEY defined', () => {
    expect(typeof Constance.STATEX_ACTION_KEY).toEqual('symbol')
    expect(Constance.STATEX_ACTION_KEY.toString()).toEqual('Symbol(statex:actions)')
  })

  test('should have STATEX_DATA_BINDINGS_KEY defined', () => {
    expect(typeof Constance.STATEX_DATA_BINDINGS_KEY).toEqual('symbol')
    expect(Constance.STATEX_DATA_BINDINGS_KEY.toString()).toEqual('Symbol(statex:dataBindings)')
  })

})