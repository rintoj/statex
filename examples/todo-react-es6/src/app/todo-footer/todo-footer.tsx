import * as React from 'react'

import { data, inject } from 'statex/react'

import { AppState } from '../../state'
import { RemoveCompletedTodosAction } from '../../action'
import { TodoFilter } from '../'

class Props {

  @data((state: AppState) =>
    (state.todos || []).reduce((count, item) => count + (item.completed ? 1 : 0), 0)
  )
  completedCount?: number

  @data((state: AppState) =>
    (state.todos || []).reduce((count, item) => count + (item.completed ? 0 : 1), 0)
  )
  pendingCount?: number
}

interface State { }

@inject(Props)
export class TodoFooter extends React.Component<Props, State> {

  clearCompleted() {
    new RemoveCompletedTodosAction().dispatch()
  }

  render() {
    const { pendingCount, completedCount } = this.props
    return (
      <footer id="footer">
        {pendingCount != undefined &&
          <span id="todo-count"><strong>{pendingCount} </strong>
            {pendingCount > 1 ? 'items' : 'item'} left
          </span>
        }
        <TodoFilter />
        {completedCount > 0 &&
          <button id="clear-completed"
            onClick={this.clearCompleted.bind(this)}>Clear completed</button>
        }
      </footer>
    )
  }
}