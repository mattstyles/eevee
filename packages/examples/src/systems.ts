import type {ID, World} from 'eev-core'
import {System} from 'eev-core'

import {Position} from './components'

export class Renderer extends System<Position> {
  id = 'RendererSystem'
  dependencies = [Position]
  ctx: CanvasRenderingContext2D

  constructor(ctx: CanvasRenderingContext2D) {
    super()
    this.ctx = ctx
  }

  run(entities: Map<ID, [Position['data']]>) {
    for (let [_, [{x, y}]] of entities) {
      this.ctx.fillStyle = '#44ff2244'
      this.ctx.fillRect(x, y, 4, 4)
    }
  }
}

export class Tick extends System<Position> {
  id = 'TickSystem'
  dependencies = [Position]

  run(entities: Map<ID, [Position['data']]>, world: World) {
    for (let [id, [{x, y}]] of entities) {
      if (Math.random() > 0.95 && world.entities.size < 50000) {
        world.events.emit('add', {x, y})
      }

      if (Math.random() > 0.85 && world.entities.size > 10000) {
        world.events.emit('remove', {id})
      }
    }
  }
}
