import type {ID} from './entity'
import {Component} from './component'
import {World} from './world'

export abstract class System<
  A extends Component = Component,
  B extends Component = Component,
  C extends Component = Component,
  D extends Component = Component,
  E extends Component = Component,
  F extends Component = Component,
  G extends Component = Component,
  H extends Component = Component,
  I extends Component = Component,
  J extends Component = Component,
  K extends Component = Component,
  L extends Component = Component
> {
  id: ID
  dependencies: typeof Component[]
  run(
    entities: Map<
      ID,
      [
        A['data']?,
        B['data']?,
        C['data']?,
        D['data']?,
        E['data']?,
        F['data']?,
        G['data']?,
        H['data']?,
        I['data']?,
        J['data']?,
        K['data']?,
        L['data']?
      ]
    >,
    world: World
  ): void {}
}
