import {World} from 'eev-core'
import {Dispatcher} from 'eev-dispatcher'
import clamp from 'just-clamp'

import {getCanvas, getContext} from './canvas'
import {Position} from './components'
import {Renderer, Tick} from './systems'

const canvas = getCanvas()
const ctx = getContext()

const world = new World()
world.register(Position)

const entity = world.createEntity()
world.applyComponent(new Position({x: 200, y: 200}), entity)

world.events.on('add', ({x, y}) => {
  if (world.entities.size > 50000) {
    return
  }

  const entity = world.createEntity()
  world.applyComponent(
    new Position({
      x: (Math.random() * canvas.width) | 0,
      y: (Math.random() * canvas.height) | 0,
    }),
    entity
  )
})

world.events.on('remove', ({id}) => {
  // @TODO remove entity
})

const renderer = new Renderer(ctx)
const renderDispatcher = new Dispatcher()
renderDispatcher.register(renderer)

const tickSystem = new Tick()
const tickDispatcher = new Dispatcher()
tickDispatcher.register(tickSystem)

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#232730'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  renderDispatcher.dispatch(world)

  window.requestAnimationFrame(render)
}

function tick() {
  tickDispatcher.dispatch(world)

  setTimeout(() => {
    tick()
  }, 1000 / 20)
}

render()
tick()
