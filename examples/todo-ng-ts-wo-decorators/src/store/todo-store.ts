import { AddTodoAction } from '../action'
import { AppState } from '../state'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Rx'
import { Observer } from 'rxjs/Rx'
import { RemoveCompletedTodosAction } from '../action'
import { RemoveTodoAction } from '../action'
import { ReplaceableState } from 'statex/angular'
import { SetFilterAction } from '../action'
import { TodoService } from './../service/todo.service'
import { ToggleAllTodosAction } from '../action'
import { ToggleTodoAction } from '../action'

@Injectable()
export class TodoStore {

  constructor(private todoService: TodoService) {
    new AddTodoAction(undefined).subscribe(this.add, this)
    new RemoveTodoAction(undefined).subscribe(this.remove, this)
    new RemoveCompletedTodosAction().subscribe(this.removeCompleted, this)
    new ToggleTodoAction(undefined, undefined).subscribe(this.toggleTodo, this)
    new ToggleAllTodosAction(undefined).subscribe(this.toggleAll, this)
    new SetFilterAction(undefined).subscribe(this.setFilter, this)
  }

  add(state: AppState, action: AddTodoAction): AppState {
    return new ReplaceableState({
      todos: (state.todos || []).concat(
        Object.assign({ id: this.generateId() }, action.todo)
      )
    })
  }

  toggleTodo(state: AppState, action: ToggleTodoAction): AppState {
    return {
      todos: (state.todos || []).map(todo =>
        (todo.id === action.id) ? Object.assign({}, todo, {
          completed: action.completed
        }) : todo
      )
    }
  }

  remove(state: AppState, action: RemoveTodoAction): AppState {
    return {
      todos: (state.todos || []).filter(todo => todo.id !== action.id)
    }
  }

  removeCompleted(state: AppState, action: RemoveCompletedTodosAction): AppState {
    return {
      todos: (state.todos || []).filter(todo => !todo.completed)
    }
  }

  toggleAll(state: AppState, action: ToggleAllTodosAction): Promise<AppState> {
    return new Promise((resolve, reject) => {
      resolve({
        todos: (state.todos || []).map(todo => Object.assign({}, todo, {
          completed: action.completed
        }))
      })
    })
  }

  setFilter(state: AppState, action: SetFilterAction): Observable<AppState> {
    return Observable.create((observer: Observer<AppState>) => {
      observer.next({ filter: action.filter })
      observer.complete()
    }).share()
  }

  private generateId(): AppState {
    return btoa(Math.random() + '').toLowerCase().substr(6, 6)
  }

}