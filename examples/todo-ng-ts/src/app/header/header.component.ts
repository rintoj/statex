import { AddTodoAction } from '../../action'
import { Component } from '@angular/core'

@Component({
  selector: 'todo-header',
  template: `
    <header id="header">
      <h1>todos</h1>
      <form id="todo-form" (submit)="addTodo()" action="#">
        <input id="new-todo" placeholder="What needs to be done?" [(ngModel)]="todoText" name="todo" autoFocus autoComplete="off">
      </form>
    </header>
  `
})
export class TodoHeaderComponent {

  todoText: string

  addTodo() {
    if (this.todoText === undefined || this.todoText.trim() === '') {
      return
    }

    new AddTodoAction({
      text: this.todoText,
      completed: false
    }).dispatch()
      .then(() => this.todoText = '')
  }

}