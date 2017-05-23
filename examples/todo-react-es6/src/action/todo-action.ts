import { Filter, Todo } from '../state'

import { Action } from 'statex/react'

export class AddTodoAction extends Action {
  constructor(public todo: Todo) { super() }
}

export class RemoveTodoAction extends Action {
  constructor(public id: string) { super() }
}

export class ToggleTodoAction extends Action {
  constructor(public id: string, public completed: boolean) { super() }
}

export class ToggleAllTodosAction extends Action {
  constructor(public completed: boolean) { super() }
}

export class RemoveCompletedTodosAction extends Action {
  constructor() { super() }
}

export class SetFilterAction extends Action {
  constructor(public filter: Filter) { super() }
}
