import * as React from 'react'

import { findRenderedDOMComponentWithTag, renderIntoDocument } from 'react-dom/test-utils'

import { App } from './app'
import { expect } from 'chai'

require('jsdom-global')()

describe('App', () => {

  it('should render', () => {
    const component = renderIntoDocument(
      <App />
    )
    const div = findRenderedDOMComponentWithTag(component, 'div')
    expect(div).be.defined
  })
})
