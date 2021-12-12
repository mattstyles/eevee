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

  run(entities: Map<ID, [Position['data'], Decay['data']]>, world: World) {
    const {x: width, y: height} = world.getResource<{x: number; y: number}>(
      'cellSize'
    )

    for (let [_, [{x, y}, {life}]] of entities) {
      // We should clamp based on max life etc but we'll predicate that life is always 0-7
      const alpha = (life * 2).toString(16)
      this.ctx.fillStyle = '#44ff22' + alpha + alpha
      this.ctx.fillRect(x, y, width, height)
    }
  }
}

export class Tick extends System<Position> {
  id = 'TickSystem'
  dependencies = [Position]

  run(entities: Map<ID, [Position['data']]>, world: World) {
    for (let [_, [{x, y}]] of entities) {
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
    for (let [id, [decay]] of entities) {
      if (Math.random() > decay.rate) {
        const newLife = decay.life - 1
        if (newLife <= 0 && world.entities.size > 100) {
          world.events.emit('remove', {id})
        }

        // Entity map is a mutable reference to components
        decay.life = newLife
      }
    }
  }
}
