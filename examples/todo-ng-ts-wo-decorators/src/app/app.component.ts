import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core'
import { Filter, Todo } from '../state'

import { AppState } from '../state'
import { State } from 'statex'
import { Stores } from '../store'
import { Subscription } from 'rxjs/Subscription'

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
export class AppComponent implements OnInit, OnDestroy {

  todos: Todo[]
  filter: Filter
  subscriptions: Subscription[] = []

  constructor(public stores: Stores) { }

  ngOnInit() {
    this.subscriptions.push(
      State.select(selectTodos).subscribe(todos => this.todos = todos)
    )
    this.subscriptions.push(
      State.select(selectFilter).subscribe(filter => this.filter = filter)
    )
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe())
    this.subscriptions = []
  }
}