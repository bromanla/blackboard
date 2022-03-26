export interface Preprocessing {
  id: string,
  name: 'preprocessing',
  data: { a: string, b: string }
}

export interface Summation {
  id: string,
  name: 'summation',
  data: { a: string, b: string }
}

export interface Done {
  id: string,
  name: 'done',
  data: { c: string }
}

export type Task = Preprocessing | Summation | Done;
