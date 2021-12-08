import type {ID, World} from 'eev-core'
import {System} from 'eev-core'

import {Position, Decay} from './components'

export class Renderer extends System<Position, Decay> {
  id = 'RendererSystem'
  dependencies = [Position, Decay]
  ctx: CanvasRenderingContext2D

  constructor(ctx: CanvasRenderingContext2D) {
    super()
    this.ctx = ctx
  }

  run(entities: Map<ID, [Position['data'], Decay['data']]>) {
    for (let [_, [{x, y}, {life}]] of entities) {
      // We should clamp based on max life etc but we'll predicate that life is always 0-7
      const alpha = (life * 2).toString(16)
      this.ctx.fillStyle = '#44ff22' + alpha + alpha
      this.ctx.fillRect(x, y, 4, 4)
    }
  }
}

export class Tick extends System<Position> {
  id = 'TickSystem'
  dependencies = [Position]

  run(entities: Map<ID, [Position['data']]>, world: World) {
    for (let [id, [{x, y}]] of entities) {
      if (Math.random() > 0.85 && world.entities.size < 25000) {
        world.events.emit('add', {x, y})
      }
    }
  }
}

export class Entropy extends System<Decay> {
  id = 'EntropySystem'
  dependencies = [Decay]

  run(entities: Map<ID, [Decay['data']]>, world: World) {
    for (let [id, [{life, decay}]] of entities) {
      if (Math.random() > decay) {
        const newLife = life - 1
        if (newLife <= 0) {
          world.events.emit('remove', {id})
        }

        // Setting component props -> @TODO this needs to be handled somehow by the query mechanism, needs to expose a way to set component data
        const table = world.tables.get(Decay.name)
        const component = table.entities.get(id)

        if (component) {
          component.data.life = newLife
        }
      }
    }
  }
}
