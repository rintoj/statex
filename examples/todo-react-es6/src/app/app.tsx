import * as React from 'react'

import { TodoFooter, TodoHeader, TodoList } from './'

export class App extends React.Component<{}, {}> {

  render() {
    return <div id="todo-app">
      <TodoHeader />
      <TodoList />
      <TodoFooter />
    </div>
  }
}
