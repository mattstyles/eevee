import {World, System} from 'eev-core'
import PriorityQueue from './queue'

type DispatcherRegisterOptions = {
  priority?: number
}

export class Dispatcher {
  systems: PriorityQueue<System>

  constructor() {
    this.systems = new PriorityQueue<System>()
  }

  register(system: System, opts: DispatcherRegisterOptions = {}): () => void {
    const {priority = 100} = opts
    this.systems.add(system, priority)

    function remove() {
      this.remove(system)
    }

    return remove.bind(this)
  }

  remove(system): void {
    this.systems.remove(system)
  }

  dispatch(world: World) {
    this.systems.forEach((system) => {
      const entities = world.query(...system.dependencies)
      system.run(entities, world)
    })
  }
}
