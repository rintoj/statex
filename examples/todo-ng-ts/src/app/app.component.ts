import { Component, ViewEncapsulation } from '@angular/core'
import { DataObserver, data } from 'statex/angular'
import { Filter, Todo } from '../state'

import { AppState } from '../state'
import { Stores } from '../store'

export const selectTodos = (state: AppState) => state.todos
export const selectFilter = (state: AppState) => state.filter

@Component({
  selector: 'app-root',
  template: `
    <div id="todoapp">
      <todo-header></todo-header>
      <todo-list [todos]="todos" [filter]="filter"></todo-list>
      <todo-footer [todos]="todos" [filter]="filter"></todo-footer>
    </div>
    `,
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent extends DataObserver {

  @data(selectTodos)
  todos: Todo[]

  @data(selectFilter)
  filter: Filter

  constructor(public stores: Stores) {
    super()
  }
}