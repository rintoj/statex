import { ReplaceableState, action, store } from 'statex/react'

import { AddTodoAction } from '../action/todo-action'
import { Observable } from 'rxjs/Observable'
import { RemoveCompletedTodosAction } from '../action/todo-action'
import { RemoveTodoAction } from '../action/todo-action'
import { SetFilterAction } from '../action/todo-action'
import { ToggleAllTodosAction } from '../action/todo-action'
import { ToggleTodoAction } from '../action/todo-action'

@store()
export class TodoStore {

  @action(AddTodoAction)
  add(state, action) {
    return new ReplaceableState({
      todos: (state.todos || []).concat(
        Object.assign({
          id: this.generateId()
        }, action.todo)
      )
    })
  }

  @action(ToggleTodoAction)
  toggleTodo(state, action) {
    return {
      todos: (state.todos || []).map(todo =>
        (todo.id === action.id) ? Object.assign({}, todo, {
          completed: action.completed
        }) : todo
      )
    }
  }

  @action(RemoveTodoAction)
  remove(state, action) {
    return {
      todos: (state.todos || []).filter(todo => todo.id !== action.id)
    }
  }

  @action(RemoveCompletedTodosAction)
  removeCompleted(state, action) {
    return {
      todos: (state.todos || []).filter(todo => !todo.completed)
    }
  }

  @action(ToggleAllTodosAction)
  toggleAll(state, action){
    return new Promise((resolve, reject) => {
      resolve({
        todos: (state.todos || []).map(todo => Object.assign({}, todo, {
          completed: action.completed
        }))
      })
    })
  }

  @action(SetFilterAction)
  setFilter(state, action) {
    return Observable.create(observer => {
      observer.next({
        filter: action.filter
      })
      observer.complete()
    }).share()
  }

  generateId() {
    return btoa(Math.random() + '').toLowerCase().substr(6, 6)
  }

}