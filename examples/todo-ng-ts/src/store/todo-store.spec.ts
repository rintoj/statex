import { TodoStore } from './todo-store'
import { AddTodoAction, ToggleTodoAction, RemoveTodoAction, RemoveCompletedTodosAction } from 'action'
import { TestBed } from '@angular/core/testing'
import { inject } from '@angular/core/testing'
import { TodoService } from 'service/todo.service'
import { Observable } from 'rxjs/Observable'
import { Todo } from 'state'
import { Observer } from 'rxjs'
import { State, initialize } from 'statex'
import { fakeAsync } from '@angular/core/testing'
import { ToggleAllTodosAction, SetFilterAction } from '../action/todo-action'

class MockTodoService {
  fetch(): Observable<Todo[]> { return undefined }  // mock functionality here
  add(todo: Todo): Observable<Todo[]> { return undefined }  // mock functionality here
  remove(id: string): Observable<Todo[]> { return undefined }  // mock functionality here
  update(todo: Todo): Observable<Todo[]> { return undefined }  // mock functionality here
  toggle(id: string): Observable<Todo[]> { return undefined }  // mock functionality here
  clearCompleted(): Observable<Todo[]> { return undefined }  // mock functionality here
  markAll(complete: boolean): Observable<Todo[]> { return undefined }  // mock functionality here
  private generateId() { return undefined }  // mock functionality here
}

describe('Todo Store', () => {

  let todoStore

  beforeEach((done) => {
    TestBed.configureTestingModule({
      providers: [TodoStore, { provide: TodoService, useClass: MockTodoService }]
    })
    initialize({}) // reset state before every test case
    done()
  })

  it('should add a todo when AddTodoAction is dispatched', inject([TodoStore], () => new Promise(async () => {
    const state = await new AddTodoAction({ text: 'First Todo' }).dispatch()
    const todo = state.todos[0]
    expect(todo).toBeDefined()
    expect(todo.text).toEqual('First Todo')
  })))

  it('should toggle a todo when ToggleTodoAction is dispatched', inject([TodoStore], () => new Promise(async () => {
    let state = await new AddTodoAction({ text: 'Todo1' }).dispatch()
    let todo: Todo = state.todos[0]
    expect(todo).toBeDefined()
    state = await new ToggleTodoAction(todo.id, true).dispatch()
    todo = state.todos[0]
    expect(todo.completed).toEqual(true)
  })))

  it('should remove a todo when RemoveTodoAction is dispatched', inject([TodoStore], () => new Promise(async () => {
    let state = await new AddTodoAction({ text: 'Todo1' }).dispatch()
    let todo = state.todos[0]
    expect(todo).toBeDefined()
    state = await new RemoveTodoAction(todo.id).dispatch()
    expect(state.todos.length).toEqual(0)
  })))

  it('should remove a todo if completed when RemoveCompletedTodosAction is dispatched', inject([TodoStore], () => new Promise(async () => {
    await new AddTodoAction({ text: 'Todo1' }).dispatch()
    await new AddTodoAction({ text: 'Todo2', completed: true }).dispatch()
    await new AddTodoAction({ text: 'Todo3', completed: true }).dispatch()
    const state = await new RemoveCompletedTodosAction().dispatch()
    expect(state.todos.length).toEqual(1)
  })))

  it('should set the view filter when SetFilterAction is dispatched', inject([TodoStore], () => new Promise(async () => {
    let { filter } = await new SetFilterAction('COMPLETED').dispatch()
    expect(filter).toEqual('COMPLETED')
  })))

})