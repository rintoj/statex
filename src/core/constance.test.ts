import * as Constance from './constance'
import { expect } from 'chai'

describe('Constance', () => {

  it('should have been defined', () => {
    expect(typeof Constance).to.equal('object')
  })

  it('should have STATEX_ACTION_KEY defined', () => {
    expect(typeof Constance.STATEX_ACTION_KEY).to.equal('symbol')
    expect(Constance.STATEX_ACTION_KEY.toString()).to.equal('Symbol(statex:actions)')
  })

  it('should have STATEX_DATA_BINDINGS_KEY defined', () => {
    expect(typeof Constance.STATEX_DATA_BINDINGS_KEY).to.equal('symbol')
    expect(Constance.STATEX_DATA_BINDINGS_KEY.toString()).to.equal('Symbol(statex:dataBindings)')
  })

})