import './style/app.scss'
import './store'

import * as React from 'react'
import * as ReactDOM from 'react-dom'

import { App } from './app'
import { INITIAL_STATE } from './state'
import { initialize } from 'statex/react'

initialize(INITIAL_STATE, {
  hotLoad: process.env.NODE_ENV === 'development',
  domain: 'todo'
})

ReactDOM.render(<App />, document.getElementById('root'))
