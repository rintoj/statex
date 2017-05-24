import React from 'react'
import { SetFilterAction } from '../action/todo-action'
import { State } from 'statex'

export default class Filter extends React.Component {

  subscriptions = []

  constructor(props) {
    super(props)
    this.state = { filter: undefined}
  }

  componentDidMount() {
    this.subscriptions.push(
      State.select(state => state.filter)
        .subscribe(filter => this.setState({ filter }))
    )
  }

  componentWillUnmount() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe())
    this.subscriptions = []
  }

  setAllFilter() {
    new SetFilterAction('ALL').dispatch()
  }

  setActiveFilter() {
    new SetFilterAction('ACTIVE').dispatch()
  }

  setCompletedFilter() {
    new SetFilterAction('COMPLETED').dispatch()
  }

  render() {
    const { filter } = this.state
    return <ul id="filters">
      <li>
        <a className={filter == null || filter === 'ALL' ? 'selected' : undefined}
          onClick={this.setAllFilter.bind(this)}>All</a>
      </li>
      <li>
        <a className={filter === 'ACTIVE' ? 'selected' : undefined}
          onClick={this.setActiveFilter.bind(this)}>Active</a>
      </li>
      <li>
        <a className={filter === 'COMPLETED' ? 'selected' : undefined}
          onClick={this.setCompletedFilter.bind(this)}>Completed</a>
      </li>
    </ul>
  }
}