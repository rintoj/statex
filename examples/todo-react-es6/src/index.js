import './style/app.css';

import App from './App';
import {
  INITIAL_STATE,
} from './state'
import React from 'react';
import ReactDOM from 'react-dom';
import {
  initialize,
} from 'statex/react'
import registerServiceWorker from './registerServiceWorker';

initialize(INITIAL_STATE, {
  hotLoad: process.env.NODE_ENV === 'development',
  domain: 'todo'
})

ReactDOM.render( < App / > , document.getElementById('root'));
registerServiceWorker();