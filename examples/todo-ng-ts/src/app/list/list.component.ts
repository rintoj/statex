import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Filter, Todo } from '../../state';
import { RemoveTodoAction, ToggleAllTodosAction, ToggleTodoAction } from '../../action';

@Component({
  selector: 'todo-list',
  template: `
    <input id="toggle-all" type="checkbox" [checked]="allChecked" (click)="markAll(!allChecked)">
    <div id="todo-list">
      <li  *ngFor="let todo of filteredTodos">
        <div class="view">
          <input class="toggle" type="checkbox" [checked]="todo.completed" (click)="toggleTodo(todo)">
          <label>{{todo.text}}</label>
          <button class="destroy" (click)="removeTodo($event, todo)"></button>
        </div>
      </li>
    </div>
  `
})
export class TodoListComponent implements OnChanges {

  @Input()
  todos: Todo[];

  @Input()
  filter: Filter;

  filteredTodos: Todo[];
  allChecked: boolean;

  ngOnChanges(changes: SimpleChanges) {
    this.filteredTodos = this.filterTodos(this.todos, this.filter);
    this.allChecked = this.filteredTodos.filter(item => item.completed).length === this.filteredTodos.length;
  }

  markAll(complete: boolean) {
    new ToggleAllTodosAction(complete).dispatch();
  }

  toggleTodo(todo: Todo) {
    new ToggleTodoAction(todo.id, !todo.completed).dispatch();
  }

  removeTodo(event, todo: Todo) {
    event.stopPropagation();
    new RemoveTodoAction(todo.id).dispatch();
  }

  private filterTodos(todos: Todo[], filter: Filter) {
    return (todos || []).filter(item => {
      switch (filter) {
        case 'ALL': return true
        case 'COMPLETED': return item.completed
        case 'ACTIVE': return !item.completed
        default: return true
      }
    });
  }
}