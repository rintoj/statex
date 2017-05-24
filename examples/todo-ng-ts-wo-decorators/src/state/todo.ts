export interface Todo {
  id?: string
  text?: string
  completed?: boolean
}

export type Filter = 'ALL' | 'COMPLETED' | 'ACTIVE'