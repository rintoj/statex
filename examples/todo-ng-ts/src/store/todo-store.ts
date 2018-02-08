import { ReplaceableState, Store, action } from 'statex/angular'

import { AddTodoAction } from '../action'
import { AppState } from '../state'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Rx'
import { Observer } from 'rxjs/Rx'
import { RemoveCompletedTodosAction } from '../action'
import { RemoveTodoAction } from '../action'
import { SetFilterAction } from '../action'
import { TodoService } from './../service/todo.service'
import { ToggleAllTodosAction } from '../action'
import { ToggleTodoAction } from '../action'

@Injectable()
export class TodoStore extends Store {

  constructor(private todoService: TodoService) {
    super()
  }

  @action()
  add(state: AppState, action: AddTodoAction): ReplaceableState {
    return new ReplaceableState({
      todos: (state.todos || []).concat(
        Object.assign({ id: this.generateId() }, action.todo)
      )
    })
  }

  @action()
  toggleTodo(state: AppState, action: ToggleTodoAction): AppState {
    return {
      todos: (state.todos || []).map(todo =>
        (todo.id === action.id) ? Object.assign({}, todo, {
          completed: action.completed
        }) : todo
      )
    }
  }

  @action()
  remove(state: AppState, action: RemoveTodoAction): AppState {
    return {
      todos: (state.todos || []).filter(todo => todo.id !== action.id)
    }
  }

  @action()
  removeCompleted(state: AppState, action: RemoveCompletedTodosAction): AppState {
    return {
      todos: (state.todos || []).filter(todo => !todo.completed)
    }
  }

  @action()
  toggleAll(state: AppState, action: ToggleAllTodosAction): Promise<AppState> {
    return new Promise((resolve, reject) => {
      resolve({
        todos: (state.todos || []).map(todo => Object.assign({}, todo, {
          completed: action.completed
        }))
      })
    })
  }

  @action()
  setFilter(state: AppState, action: SetFilterAction): Observable<AppState> {
    return Observable.create((observer: Observer<AppState>) => {
      observer.next({ filter: action.filter })
      observer.complete()
    }).share()
  }

  private generateId(): string {
    return btoa(Math.random() + '').toLowerCase().substr(6, 6)
  }

}