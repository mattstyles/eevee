import type {ID} from '@eevee/core'
import {System} from '@eevee/core'
import randomInt from 'just-random-integer'

import {Position, Colour, Grow} from './components'
import emitter from './emitter'

export class Renderer extends System<Position, Colour> {
  id = 'RendererSystem'
  dependencies = [Position, Colour]
  ctx: CanvasRenderingContext2D

  constructor(ctx: CanvasRenderingContext2D) {
    super()
    this.ctx = ctx
  }

  run(entities: Map<ID, [Position['data'], Colour['data']]>) {
    for (let [_, [{x, y}, {colour}]] of entities) {
      this.ctx.fillStyle = colour
      this.ctx.fillRect(x, y, 4, 4)
    }
  }
}

export class Grower extends System<Position, Grow> {
  id = 'GrowSystem'
  dependencies = [Position, Grow]

  run(entities: Map<ID, [Position['data'], Grow['data']]>) {
    // For now clamp the amount of growth that can happen
    if (entities.size > 5000) {
      return
    }
    for (let [_, [{x, y}, {chance}]] of entities) {
      if (Math.random() > chance) {
        // @TODO ping message here to generate a new entity
        // do we need a emitter attached to the world? and pass the world to
        // systems? or is there a better solution?
        // Use a quick hack for now to send messages around
        const newX = randomInt(4, 8)
        const newY = randomInt(4, 8)
        emitter.emit('add', {
          x: Math.random() > 0.5 ? x + newX : x - newX,
          y: Math.random() > 0.5 ? y + newY : y - newY,
        })
      }
    }
  }
}
