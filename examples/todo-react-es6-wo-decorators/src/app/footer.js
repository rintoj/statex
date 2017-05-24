import Filter from './filter'
import React from 'react'
import { RemoveCompletedTodosAction } from '../action/todo-action'
import { State } from 'statex'

export default class Footer extends React.Component {

  subscriptions = []

  constructor(props) {
    super(props)
    this.state = {
      completedCount: 0,
      pendingCount: 0
    }
  }

  componentDidMount() {
    this.subscriptions.push(
      State.select(state => state.todos).subscribe(todos => {
        this.setState({
          completedCount: (todos || []).filter(todo => todo.completed).length,
          pendingCount: (todos || []).filter(todo => !todo.completed).length
        })
      })
    )
  }

  componentWillUnmount() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe())
    this.subscriptions = []
  }

  clearCompleted() {
    new RemoveCompletedTodosAction().dispatch()
  }

  render() {
    const { pendingCount, completedCount } = this.state

    return <footer id="footer">
      {pendingCount != null &&
        <span id="todo-count"><strong>{pendingCount} </strong>
          {pendingCount > 1 ? 'items' : 'item'} left
        </span>
      }
      <Filter />
      {completedCount > 0 &&
        <button id="clear-completed"
          onClick={this.clearCompleted.bind(this)}>Clear completed</button>
      }
    </footer>
  }
}