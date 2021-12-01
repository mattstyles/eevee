import {World, System} from '@eevee/core'
import PriorityQueue from './queue'

type DispatcherRegisterOptions = {
  priority?: number
}

export class Dispatcher {
  systems: PriorityQueue<System>

  constructor() {
    this.systems = new PriorityQueue<System>()
  }

  register(system: System, opts: DispatcherRegisterOptions = {}) {
    const {priority = 100} = opts
    this.systems.add(system, priority)
  }

  dispatch(world: World) {
    this.systems.forEach((system) => {
      const entities = world.query(...system.dependencies)
      system.run(entities)
    })
  }
}
