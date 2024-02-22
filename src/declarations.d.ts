declare module '*.svg' {
  import { SVGComponent } from '@src/mytypes'
  const content: SVGComponent
  export default content
}

type Mutable<T> = { -readonly [P in keyof T]: T[P] }
