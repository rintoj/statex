import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'
import { Todo } from '../state/todo'

@Injectable()
export class TodoService {

  private readonly url = '/todos'
  private _todos: Todo[]

  fetch(): Observable<Todo[]> {
    return Observable.create((observer: Observer<Todo[]>) => {
      this._todos = JSON.parse(localStorage.getItem(this.url) || '[]')
      observer.next(this._todos)
      observer.complete()
    })
  }

  add(todo: Todo): Observable<Todo[]> {
    return Observable.create((observer: Observer<Todo[]>) => {
      if (todo == undefined) {
        observer.error('"todo" is undefined!')
        return observer.complete()
      }

      this.todos = this.todos.concat([Object.assign({
        id: this.generateId()
      }, todo)])
      observer.next(this.todos)
      observer.complete()
    })
  }

  remove(id: string): Observable<Todo[]> {
    return Observable.create((observer: Observer<Todo[]>) => {
      if (id == undefined) {
        observer.error('"id" is undefined!')
        return observer.complete()
      }

      this.todos = this.todos.filter(item => item.id !== id)
      observer.next(this.todos)
      observer.complete()
    })
  }

  update(todo: Todo): Observable<Todo[]> {
    return Observable.create((observer: Observer<Todo[]>) => {
      if (todo == undefined) {
        observer.error('"todo" is undefined!')
        return observer.complete()
      }

      this.todos = this.todos.map(item => item.id === todo.id ? todo : item)
      observer.next(this.todos)
      observer.complete()
    })
  }

  toggle(id: string): Observable<Todo[]> {
    return Observable.create((observer: Observer<Todo[]>) => {
      if (id == undefined) {
        observer.error('"id" is undefined!')
        return observer.complete()
      }

      this.todos = this.todos.map(item => item.id === id ? Object.assign({}, item, {
        completed: !item.completed
      }) : item)
      observer.next(this.todos)
      observer.complete()
    })
  }

  clearCompleted(): Observable<Todo[]> {
    return Observable.create((observer: Observer<Todo[]>) => {
      this.todos = this.todos.filter(item => !item.completed)
      observer.next(this.todos)
      observer.complete()
    })
  }

  markAll(complete: boolean): Observable<Todo[]> {
    return Observable.create((observer: Observer<Todo[]>) => {
      this.todos = this.todos.map(item => Object.assign({}, item, {
        completed: complete
      }))
      observer.next(this.todos)
      observer.complete()
    })
  }

  private generateId() {
    return btoa(Math.random() + '').substr(4, 6).toLowerCase()
  }

  private get todos() {
    return this._todos || []
  }

  private set todos(todos: Todo[]) {
    this._todos = todos
    localStorage.setItem(this.url, JSON.stringify(this._todos))
  }

}