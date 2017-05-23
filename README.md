
# StateX

StateX is a state management library for modern web applications with unidirectional data flow and immutable uni-state (just like redux). StateX has specific APIs for seamless integration with [Angular (2 or above)](https://angular.io) and [React](https://facebook.github.io/react/).  StateX is inspired by [refluxjs](https://github.com/reflux/refluxjs) and [redux](http://redux.js.org/).

**Note: StateX was originally written for angular - [ angular-reflux ]( https://github.com/rintoj/angular-reflux ) and later modified for react - [react-reflux]( https://github.com/rintoj/react-reflux ). Both of these packages are being migrated to StateX, will be discontinued after the migration is completed**

- [StateX](#statex)
- [Architecture](#architecture)
- [Install](#install)
- [5 Simple Steps](#5-simple-steps)
  * [1. Define State](#1-define-state)
  * [2. Define Action](#2-define-action)
  * [3. Create Store & Bind Action](#3-create-store--bind-action)
  * [4. Dispatch Action](#4-dispatch-action)
  * [5. Consume Data](#5-consume-data)
- [Integrating with Angular](#integrating-with-angular)
  * [Create Store - Angular](#create-store---angular)
  * [Add Stores to Providers List](#add-stores-to-providers-list)
  * [Consume Data - Angular](#consume-data---angular)
- [Integrating with React](#integrating-with-react)
  * [Create Store - React](#create-store---react)
  * [Import Stores to Application](#import-stores-to-application)
  * [Consume Data - React](#consume-data---react)
- [Reducer Functions & Async Tasks](#reducer-functions--async-tasks)
- [Initialize State & Enable HotLoad](#initialize-state--enable-hotload)
  * [Angular](#angular)
  * [React](#react)
- [Immutable Application State](#immutable-application-state)
- [Examples](#examples)
- [About](#about)
  * [Contributing](#contributing)
  * [Author](#author)
  * [Versions](#versions)
  * [License](#license)

# Architecture

Flux is an architecture for unidirectional data flow. By forcing the data to flow in a single direction, Flux makes it easy to reason *how data-changes will affect the application* depending on what actions have been issued. The components themselves may only update  application-wide data by executing an action to avoid double maintenance nightmares.

![Flow](./docs/img/uni-flow.png)

* **STATE** - contains application wide data. Technically this is a single immutable JavaScript object containing every data that an application needs.

* **STORES** - contain business logic - how an action should transform the application wide data represented by `STATE`

* **VIEWS** - Views must react to the change in `STATE`. So an event is triggered when `STATE` changes, which `VIEWS` can consume to update itself with the new data.

* **ACTIONS** - are dispatched whenever a view needs to change application state. The actions contain payload to help store complete the updates.

# Install
```
npm install statex --save
```

# 5 Simple Steps

StateX works with any modern JavaScript framework, however there are minor differences to how it is implemented for each framework.

## 1. Define State
To get the best out of TypeScript, declare an interface that defines the structure of the application-state.

```ts
export interface Todo {
  id?: string
  title?: string
  completed?: boolean
}

export type Filter = 'ALL' | 'ACTIVE' | 'COMPLETED'

export interface AppState {
  todos?: Todo[]
  filter?: Filter
}
```

## 2. Define Action

Define actions as classes with the necessary arguments passed on to the constructor. This way we will benefit from the type checking; never again we will miss-spell an action, miss a required parameter or pass a wrong parameter. Remember to extend the action from `Action` class. This makes your action listenable and dispatch-able.

```ts
import { Action } from 'statex';

export class AddTodoAction extends Action {
  constructor(public todo: Todo) { super() }
}
```

## 3. Create Store & Bind Action

Stores are the central part of a Flux architecture. While most of the logics for a store are same, some of the minor details vary from framework to framework.

* [Create Store - Angular](#create-store---angular)
* [Create Store - React](#create-store---react)
* [Create Store - Generic](#create-store---generic)

## 4. Dispatch Action

No singleton dispatcher! Instead StateX lets every action act as dispatcher by itself. One less dependency to define, inject and maintain.

```ts
new AddTodoAction({ id: 'sd2wde', title: 'Sample task' }).dispatch();
```

## 5. Consume Data

Use `@data` decorator and a selector function (parameter to the decorator) to get updates from application state. The property gets updated only when the value returned by the selector function changes from previous state to the current state. Additionally, just like a map function, you could map the data to another value as you choose.

We may, at times need to derive additional properties from the data, sometimes using complex calculations. Therefore `@data` can be used with functions as well.

See framework specific implementation.

* [Consume Data - Angular](#consume-data---angular)
* [Consume Data - React](#consume-data---react)
* [Consume Data - Generic](#consume-data---generic)

# Integrating with Angular

## Create Store - Angular

Use `@action` decorator to bind a reducer function with an Action. The second parameter to the reducer function (`addTodo`) is an action (of type `AddTodoAction`); `@action` uses this information to bind the correct action. Also remember to extend this class from `Store`.

```ts
import { Injectable } from '@angular/core'
import { action, Store } from 'statex/angular'

@Injectable()
export class TodoStore extends Store {

  @action
  addTodo(state: AppState, action: AddTodoAction): AppState {
    return { todos: state.todos.concat([action.todo]) }
  }
}
```

Did you notice `@Injectable()`? Well, stores are injectable modules and uses Angular's dependency injection to instantiate. So take care of adding store to `providers` and to inject into `app.component`.

## Add Stores to Providers List

* Create `STORES` array and a class `Stores` (again injectable) to maintain stores.

```ts
import { Injectable } from '@angular/core';
import { TodoStore } from './todo.store';

@Injectable()
export class Stores {
  constructor( private todoStore: TodoStore) { }
}

export const STORES = [
  Stores,
  TodoStore
];
```

> When you create a new store remember to inject to the `Stores`'s constructor and add it to the `STORES` array.

* Add `STORES` to the `providers` in `app.module.ts`.

```ts
import { STORES } from './store/todo.store';

@NgModule({
  providers: [
    ...STORES
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

* And finally, inject `Stores` into your root component (`app.component.ts`)

```ts
@Component({
  ....
})
export class AppComponent {
  constructor(private stores: STORES) { }
}
```

## Consume Data - Angular

While creating container components, remember to extend it from `DataObserver`. It is essential to instruct Angular Compiler to keep `ngOnInit` and `ngOnDestroy` life cycle events, which can only be achieved by implementing `OnInit` and `OnDestroy` interfaces. `DataObserver` is  responsible for subscribing to state stream when the component is created and for unsubscribing when the component is destroyed.

```ts
import { data, DataObserver } from 'statex/angular';

export const selectState = (state: AppState) => state
export const selectTodos = (state: AppState) => state.todos
export const selectFilter = (state: AppState) => state.filter

@Component({
    ....
})
export class TodoListComponent extends DataObserver {

  protected filteredTodos: Todo[]

  // mapping a direct value from state
  @data(selectTodos)
  protected todos: Todo[];

  // mapping a different value from state
  @data(computeHasTodos)
  protected hasTodos: boolean;

  // works with functions to allow complex calculations
  @data(selectState)
  protected todosDidChange(state: AppState) {
    this.filteredTodos = (state.todos || []).filter(todo => {
      switch(state.filter) {
        case 'ALL': return true
        case 'ACTIVE': return !todo.completed
        case 'COMPLETED': return todo.completed
        default: return false
      }
    })
  }

}
```

# Integrating with React

## Create Store - React

Use `@action` decorator to bind a reducer function with an Action. The second parameter to the reducer function (`addTodo`) is an action (of type `AddTodoAction`); `@action` uses this information to bind the correct action.

```ts
import { AppState } from '../state';
import { AddTodoAction } from '../action';
import { action, store } from 'statex/react';

@store
export class TodoStore {

  @action
  addTodo(state: AppState, action: AddTodoAction): AppState {
    return { todos: state.todos.concat([action.todo]) }
  }
}
```

Stores must bind each action with the reducer function at the startup and also must have a singleton instance. Both of these are taken care by `@store` decorator.

## Import Stores to Application

Create `index.ts` in `stores` folder and import all stores. You must do this every store you create.

```ts
import './todo-store'
```

Import stores into application (`app.tsx`), so that application is aware of the stores. This has to be done once at the beginning of the setup. Next time you create a new store, it must only be added to `store/index.ts`

```ts
import './stores'
...
export class AppComponent extends React.Component<{}, {}> {
  ...
}
```

## Consume Data - React

Create `Props` class, add properties decorated with `@data`, and finally inject the `Props` to the container using `@inject` decorator.

```tsx
import * as React from 'react'
import { data, inject } from 'statex/react'

class Props {

  // mapping a direct value from state
  @data((state: AppState) => state.todos)
  todos: Todo[]

  // mapping a different value from state
  @data((state: AppState) => state.todos && state.todos.length > 0)
  hasTodos: boolean

  // works with functions to allow complex calculations
  @data((state: AppState) => state)
  stateDidChange(state: AppState) {
    this.filteredTodos = (state.todos || []).filter(todo => {
      switch(state.filter) {
        case 'ALL': return true
        case 'ACTIVE': return !todo.completed
        case 'COMPLETED': return todo.completed
        default: return false
      }
    })
  }

  filteredTodos: Todo[]
}

interface State { }

@inject(Props)
export class TodoListComponent extends React.Component<Props, State> {

  render() {
    const todos = this.props.todos.map(
      todo => <li key={todo.id}>{todo.text}</li>
    )

    return <div>
      { this.props.hasTodos && <ul> {todos} </ul> }
    </div>
  }
}
```

# Reducer Functions & Async Tasks

Reducer functions can return either of the following

* A portion of the application state as plain object

```ts
@action
add(state: AppState, action: AddTodoAction): AppState {
  return {
    todos: (state.todos || []).concat(action.todo)
  }
}
```

* A portion of the application state wrapped in Promise, if it needs to perform an async task.
```ts
@action
add(state: AppState, action: AddTodoAction): Promise<AppStore> {
  return new Promise((resolve, reject) => {
    asyncTask().then(() => {
      resolve({
        todos: (state.todos || []).concat(action.todo)
      })
    })
  })
}
```

* A portion of the application state wrapped in Observables, if the application state needs update multiple times over a period of time, all when handling an action. For example, you have to show loader before starting the process, and hide loader after you have done processing, you may use this.

```ts
import { Observable } from 'rxjs/Observable'
import { Observer } from 'rxjs/Observer'

@action
add(state: AppState, action: AddTodoAction): Observable<AppState> {
  return Observable.create((observer: Observer<AppState>) => {
    observer.next({ showLoader: true })
    asyncTask().then(() => {
      observer.next({
        todos: (state.todos || []).concat(action.todo),
        showLoader: false
      })
      observer.complete()
    })
  })
}
```

# Initialize State & Enable HotLoad

You can initialize the app state using the following code.

## Angular

```ts
...
import { INITIAL_STATE } from './../state'
import { environment } from '../environments/environment'
import { initialize } from 'statex/angular'

initialize(INITIAL_STATE, {
  hotLoad: !environment.production,
  domain: 'my-app'
})

@NgModule({
  ....
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## React

```ts
...
import { INITIAL_STATE } from './../state'
import { initialize } from 'statex/react'

initialize(INITIAL_STATE, {
  hotLoad: process.env.NODE_ENV !== 'production',
  domain: 'my-app'
})

import { AppComponent } from './app'
ReactDOM.render(<AppComponent />, document.getElementById('root'))
```

If you set `hotLoad` to true, every change to the state is preserved in localStorage and re-initialized upon refresh. If a state exists in localStorage `INITIAL_STATE` will be ignored. This is very useful for development builds because developers can return to the same screen after every refresh. Remember the screens must written to react to state (reactive UI) in-order to achieve this. `domain` is an optional string to uniquely identify your application.

# Immutable Application State
To take advantage of React's change detection strategy we need to ensure that the state is indeed immutable. This module uses [seamless-immutable](https://github.com/rtfeldman/seamless-immutable) for immutability.

Since application state is immutable, the reducer functions will not be able to update state directly; any attempt to update the state will result in error. Therefore a reducer function should either return a portion of the state that needs change (recommended) or a new application state wrapped in `ReplaceableState`, instead.

```ts
@action
selectTodo(state: AppState, action: SelectTodoAction): AppState {
  // merge with the existing state
  return {
    selectedTodo: action.todo
  }
}

@action
resetTodos(state: AppState, action: ResetTodosAction): AppState {
  // replace the current state completely with the new one
  return new ReplaceableState({
    todos: [],
    selectedTodo: undefined
  })
}
```

# Examples

* [React Application with WebPack & TypeScript](https://github.com/rintoj/statex/tree/master/examples/todo-react-ts)
* [Angular Application with @angular/cli & AOT](https://github.com/rintoj/statex/tree/master/examples/todo-ng-ts)

# About

### Hope StateX is helpful to you. Please make sure to checkout my other [projects](https://github.com/rintoj) and [articles](https://medium.com/@rintoj). Enjoy coding!

## Contributing
Contributions are very welcome! Just send a pull request. Feel free to contact [me](mailto:rintoj@gmail.com) or checkout my [GitHub](https://github.com/rintoj) page.

## Author

**Rinto Jose** (rintoj)

Follow me:
  [GitHub](https://github.com/rintoj)
| [Facebook](https://www.facebook.com/rinto.jose)
| [Twitter](https://twitter.com/rintoj)
| [Google+](https://plus.google.com/+RintoJoseMankudy)
| [Youtube](https://youtube.com/+RintoJoseMankudy)

## Versions
[Check CHANGELOG](https://github.com/rintoj/statex/blob/master/CHANGELOG.md)

## License
```
The MIT License (MIT)

Copyright (c) 2017 Rinto Jose (rintoj)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
