import { Component, Input, OnChanges, SimpleChanges } from '@angular/core'
import { Filter, Todo } from '../../state'
import { RemoveCompletedTodosAction, SetFilterAction } from '../../action'

@Component({
  selector: 'todo-footer',
  template: `
    <footer id="footer">
      <span id="todo-count"><strong>{{leftCount}}</strong>
          {{leftCount > 1 ? 'items' : 'item' }} left
      </span>
      <ul id="filters">
        <li>
          <a [class.selected]="filter == undefined || filter === 'ALL'"
             (click)="setFilter('ALL')">All</a>
        </li>
        <li>
          <a [class.selected]="filter === 'ACTIVE'"
             (click)="setFilter('ACTIVE')">Active</a>
        </li>
        <li>
          <a [class.selected]="filter === 'COMPLETED'"
             (click)="setFilter('COMPLETED')">Completed</a>
        </li>
      </ul>
      <button id="clear-completed" (click)="clearCompletedTodos()" *ngIf="completedCount > 0">Clear completed</button>
    </footer>
  `
})
export class TodoFooterComponent implements OnChanges {

  @Input()
  todos: Todo[]

  @Input()
  filter: Filter

  leftCount: number
  completedCount: number

  ngOnChanges(changes: SimpleChanges) {
    if (this.todos === undefined) return
    this.completedCount = this.todos.filter(item => item.completed).length
    this.leftCount = this.todos.length - this.completedCount
  }

  clearCompletedTodos() {
    new RemoveCompletedTodosAction().dispatch()
  }

  setFilter(filter: Filter) {
    new SetFilterAction(filter).dispatch()
  }

}