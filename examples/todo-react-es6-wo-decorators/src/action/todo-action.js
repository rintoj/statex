import {
  Action,
} from 'statex/react'

export class AddTodoAction extends Action {
  constructor(todo) {
    super()
    this.todo = todo
  }
}

export class RemoveTodoAction extends Action {
  constructor(id) {
    super()
    this.id = id
  }
}

export class ToggleTodoAction extends Action {
  constructor(id, completed) {
    super()
    this.id = id
    this.completed = completed
  }
}

export class ToggleAllTodosAction extends Action {
  constructor(completed) {
    super()
    this.completed = completed
  }
}

export class RemoveCompletedTodosAction extends Action {}

export class SetFilterAction extends Action {
  constructor(filter) {
    super()
    this.filter = filter
  }
}