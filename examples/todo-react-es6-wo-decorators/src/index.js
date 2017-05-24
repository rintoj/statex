import './style/app.css';
import './store/index'

import App from './app/app';
import INITIAL_STATE from './state/initial-state'
import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';

const statex = require('statex/react')

statex.initialize(INITIAL_STATE, {
  hotLoad: process.env.NODE_ENV === 'development',
  domain: 'todo'
})

ReactDOM.render(<App /> , document.getElementById('root'));
registerServiceWorker();
