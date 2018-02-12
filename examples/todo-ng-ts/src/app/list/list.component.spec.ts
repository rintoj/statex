import * as Immutable from 'seamless-immutable'
import { TestBed } from '@angular/core/testing'
import { ComponentFixture } from '@angular/core/testing'
import { DebugElement } from '@angular/core'
import { By } from '@angular/platform-browser'
import { State, initialize } from 'statex'
import { TodoListComponent } from '.'
import { ToggleAllTodosAction, ToggleTodoAction, RemoveTodoAction } from '../../action'

describe('TodoHeaderComponent', () => {

  let comp: TodoListComponent
  let fixture: ComponentFixture<TodoListComponent>
  let de: DebugElement
  let el: HTMLElement

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TodoListComponent]
    })

    fixture = TestBed.createComponent(TodoListComponent)
    comp = fixture.componentInstance
    initialize({})
  })

  it('should list all todos', (done) => {
    fixture.whenStable().then(() => {

      // setup todos
      comp.todos = [
        { text: 'Todo1' },
        { text: 'Todo2' }
      ]
      comp.ngOnChanges(undefined)
      fixture.detectChanges()

      // query form elements
      const todoItems = fixture.debugElement.queryAll(By.css('.view'))
      const todos = todoItems.map((todoItem) => todoItem.nativeElement.innerText.trim())

      // verify
      expect(todos).toContain('Todo1')
      expect(todos).toContain('Todo2')
      done()
    })
  })

  it('should trigger ToggleAllTodosAction when toggle all input is clicked', (done) => {
    let toggleTodoActionCall = jasmine.createSpy('spy').and.returnValue({})
    new ToggleAllTodosAction(undefined).subscribe(toggleTodoActionCall, undefined)

    fixture.whenStable().then(() => {
      // do action
      const input = fixture.debugElement.query(By.css('#toggle-all'))
      input.triggerEventHandler('click', {})
      fixture.detectChanges()

      // verify
      expect(toggleTodoActionCall).toHaveBeenCalledWith({}, new ToggleAllTodosAction(true))
      done()
    })
  })

  it('should trigger ToggleTodoAction when a todo item is toggled', (done) => {
    // prepare spy for the action
    let toggleTodoActionCall = jasmine.createSpy('spy').and.returnValue({})
    new ToggleTodoAction(undefined, undefined).subscribe(toggleTodoActionCall, undefined)
    fixture.whenStable().then(() => {
      // setup
      comp.todos = [
        { id: 'id1', text: 'Todo1' },
        { id: 'id2', text: 'Todo2' }
      ]
      comp.ngOnChanges(undefined)
      fixture.detectChanges()

      // do action
      const input = fixture.debugElement.query(By.css('input.toggle'))
      input.triggerEventHandler('click', {})

      // verify
      expect(toggleTodoActionCall).toHaveBeenCalledWith({}, new ToggleTodoAction('id1', true))
      done()
    })
  })

  it('should trigger RemoveTodoAction when a todo item is attempted to be removed', (done) => {
    // prepare spy for the action
    let removeTodoActionCall = jasmine.createSpy('spy').and.returnValue({})
    new RemoveTodoAction(undefined).subscribe(removeTodoActionCall, undefined)

    // setup test
    fixture.detectChanges()
    fixture.whenStable().then(() => {

      // setup
      comp.todos = [
        { id: 'id1', text: 'Todo1' },
        { id: 'id2', text: 'Todo2' }
      ]
      comp.ngOnChanges(undefined)
      fixture.detectChanges()

      // do action
      const button = fixture.debugElement.query(By.css('.view button'))
      button.triggerEventHandler('click', { stopPropagation: () => { /*nothing*/ } })

      // verify
      expect(removeTodoActionCall).toHaveBeenCalledWith({}, new RemoveTodoAction('id1'))
      done()
    })
  })

})