import Footer from './footer'
import Header from './header'
import React from 'react'
import TodoList from './todo-list'

export default class App extends React.Component {
  render() {
    return <div id='todo-app'>
      <Header />
      <TodoList />
      <Footer />
    </div>
  }
}
