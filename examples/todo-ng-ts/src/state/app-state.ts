import { Filter, Todo } from './todo'

export interface AppState {
  todos?: Todo[]
  filter?: Filter
}