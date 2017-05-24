import { AddTodoAction } from '../action/todo-action'
import { Observable } from 'rxjs/Observable'
import { RemoveCompletedTodosAction } from '../action/todo-action'
import { RemoveTodoAction } from '../action/todo-action'
import { ReplaceableState } from 'statex'
import { SetFilterAction } from '../action/todo-action'
import { ToggleAllTodosAction } from '../action/todo-action'
import { ToggleTodoAction } from '../action/todo-action'

export class TodoStore {

  constructor() {
    new AddTodoAction().subscribe(this.add, this)
    new RemoveTodoAction().subscribe(this.remove, this)
    new ToggleTodoAction().subscribe(this.toggleTodo, this)
    new RemoveCompletedTodosAction().subscribe(this.removeCompleted, this)
    new ToggleAllTodosAction().subscribe(this.toggleAll, this)
    new SetFilterAction().subscribe(this.setFilter, this)
  }

  add(state, action) {
    return new ReplaceableState({
      todos: (state.todos || []).concat(
        Object.assign({
          id: this.generateId()
        }, action.todo)
      )
    })
  }

  toggleTodo(state, action) {
    return {
      todos: (state.todos || []).map(todo =>
        (todo.id === action.id) ? Object.assign({}, todo, {
          completed: action.completed
        }) : todo
      )
    }
  }

  remove(state, action) {
    return {
      todos: (state.todos || []).filter(todo => todo.id !== action.id)
    }
  }

  removeCompleted(state, action) {
    return {
      todos: (state.todos || []).filter(todo => !todo.completed)
    }
  }

  toggleAll(state, action){
    return new Promise((resolve, reject) => {
      resolve({
        todos: (state.todos || []).map(todo => Object.assign({}, todo, {
          completed: action.completed
        }))
      })
    })
  }

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

new TodoStore()