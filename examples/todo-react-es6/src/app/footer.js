import Filter from './filter'
import React from 'react'
import { RemoveCompletedTodosAction } from '../action/todo-action'

// import { data, inject } from 'statex/react'

// class Props {

//   @data((state: AppState) =>
//     (state.todos || []).reduce((count, item) => count + (item.completed ? 1 : 0), 0)
//   )
//   completedCount?: number

//   @data((state: AppState) =>
//     (state.todos || []).reduce((count, item) => count + (item.completed ? 0 : 1), 0)
//   )
//   pendingCount?: number
// }

// @inject(Props)
export default class Footer extends React.Component {

  clearCompleted() {
    new RemoveCompletedTodosAction().dispatch()
  }

  render() {
    const { pendingCount, completedCount } = this.props
    return (
      <footer id="footer">
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
    )
  }
}