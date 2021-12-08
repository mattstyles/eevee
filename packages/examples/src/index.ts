import {World} from 'eev-core'
import {Dispatcher} from 'eev-dispatcher'
import clamp from 'just-clamp'

import {getCanvas, getContext} from './canvas'
import {Position, Decay} from './components'
import {Renderer, Tick, Entropy} from './systems'

const canvas = getCanvas()
const ctx = getContext()

const stat = document.querySelector('.js-stats')
const numEntities = document.createElement('div')
numEntities.innerHTML = '' + 0
stat.appendChild(numEntities)

const world = new World()
world.register(Position)
world.register(Decay)

const entity = world.createEntity()
world.applyComponent(new Position({x: 200, y: 200}), entity)
world.applyComponent(new Decay({life: 7, decay: 0.05}), entity)

world.events.on('add', ({x, y}) => {
  if (world.entities.size > 25000) {
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
  world.applyComponent(new Decay({life: 7, decay: 0.15}), entity)
  numEntities.innerHTML = '' + world.entities.size
})

world.events.on('remove', ({id}) => {
  world.removeEntity(id)
  numEntities.innerHTML = '' + world.entities.size
})

const renderer = new Renderer(ctx)
const renderDispatcher = new Dispatcher()
renderDispatcher.register(renderer)

const tickSystem = new Tick()
const entropySystem = new Entropy()

const tickDispatcher = new Dispatcher()
tickDispatcher.register(tickSystem)
tickDispatcher.register(entropySystem)

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
