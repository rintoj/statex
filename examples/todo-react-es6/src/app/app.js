import Footer  from './footer'
import Header  from './header'
import React from 'react'

export default class App extends React.Component {
  render() {
    return <div id='todo-app'>
      <Header />
      <Footer />
    </div>
  }
}
