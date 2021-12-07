import {World, Component, System} from 'eev-core'
import {Dispatcher} from 'eev-dispatcher'

import emitter from './emitter'
import {setCanvas, getContext} from './canvas'
import {Position, Grow, Colour} from './components'
import {Renderer, Grower} from './systems'

// nextjs shenanigans
export default () => null

const canvas = setCanvas()
const ctx = getContext()

let isRunning = true

const world = new World()

world.register(Position)
world.register(Grow)
world.register(Colour)

const ent1 = world.createEntity()
world.applyComponent(new Position({x: 240, y: 160}), ent1)
world.applyComponent(new Colour({colour: '#c6e2ff'}), ent1)
world.applyComponent(new Grow({chance: 0.4}), ent1)

const renderer = new Renderer(ctx)

const renderDispatcher = new Dispatcher()
renderDispatcher.register(renderer)

const grower = new Grower()
const tickDispatcher = new Dispatcher()
tickDispatcher.register(grower)

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  renderDispatcher.dispatch(world)
  if (isRunning) {
    window.requestAnimationFrame(render)
  }
}

// const TPS = 1000 / 20
const TPS = 1000 / 20
function tick() {
  tickDispatcher.dispatch(world)

  if (isRunning) {
    setTimeout(() => {
      tick()
    }, TPS)
  }
}

// Lets start the render loop
render()

// Lets start the update loop
tick()

// Listen for stuffs
emitter.on('add', ({x, y}) => {
  const entity = world.createEntity()
  world.applyComponent(new Position({x, y}), entity)
  world.applyComponent(new Colour({colour: '#ff69b444'}), entity)
  world.applyComponent(new Grow({chance: 0.4}), entity)
})
//
// emitter.emit('add', {x: 40, y: 40})

window.stop = () => {
  isRunning = false
}

window.start = () => {
  isRunning = true
  render()
  tick()
}
