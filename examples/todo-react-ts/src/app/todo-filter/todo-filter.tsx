import * as React from 'react'

import { AppState, Filter } from '../../state'
import { data, inject } from 'statex/react'

import { SetFilterAction } from '../../action'

class Props {

  @data((state: AppState) => state.filter)
  filter?: Filter
}

interface State { }

@inject(Props)
export class TodoFilter extends React.Component<Props, State> {

  setAllFilter = () => {
    new SetFilterAction('ALL').dispatch()
  }

  setActiveFilter = () => {
    new SetFilterAction('ACTIVE').dispatch()
  }

  setCompletedFilter = () => {
    new SetFilterAction('COMPLETED').dispatch()
  }

  render() {
    const { filter } = this.props
    return <ul id="filters">
      <li>
        <a href="#" className={filter == undefined || filter === 'ALL' ? 'selected' : undefined}
          onClick={this.setAllFilter}>All</a>
      </li>
      <li>
        <a href="#" className={filter === 'ACTIVE' ? 'selected' : undefined}
          onClick={this.setActiveFilter}>Active</a>
      </li>
      <li>
        <a href="#" className={filter === 'COMPLETED' ? 'selected' : undefined}
          onClick={this.setCompletedFilter}>Completed</a>
      </li>
    </ul>
  }
}