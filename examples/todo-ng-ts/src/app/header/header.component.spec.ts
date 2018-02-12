import { TodoHeaderComponent } from './header.component'
import { TestBed } from '@angular/core/testing'
import { ComponentFixture } from '@angular/core/testing'
import { DebugElement } from '@angular/core'
import { By } from '@angular/platform-browser'
import { FormsModule } from '@angular/forms'
import { AddTodoAction } from '../../action'
import { State, initialize } from 'statex'

describe('TodoHeaderComponent', () => {

  let comp: TodoHeaderComponent
  let fixture: ComponentFixture<TodoHeaderComponent>
  let de: DebugElement
  let el: HTMLElement

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TodoHeaderComponent], // declare the test component
      imports: [FormsModule]
    })

    fixture = TestBed.createComponent(TodoHeaderComponent)
    comp = fixture.componentInstance
    initialize({})
  })

  it('should dispatch AddTodoAction when form is submitted', (done) => {

    // prepare spy for the action
    let addTodoActionCall = jasmine.createSpy('spy').and.returnValue({})
    new AddTodoAction(undefined).subscribe(addTodoActionCall, undefined)

    // setup test
    fixture.detectChanges()
    fixture.whenStable().then(() => {
      // query form elements
      const input = fixture.debugElement.query(By.css('input'))
      const form = fixture.debugElement.query(By.css('form'))

      // setup form
      input.nativeElement.value = 'Sample todo123432'
      input.triggerEventHandler('input', { target: { value: 'Sample todo' } })
      fixture.detectChanges()

      // trigger submission
      form.triggerEventHandler('submit', {})

      // verify
      expect(addTodoActionCall).toHaveBeenCalledWith({}, new AddTodoAction({ text: 'Sample todo', completed: false }))

      done()
    })
  })

})