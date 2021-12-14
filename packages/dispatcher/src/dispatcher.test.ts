import {World, Component, System} from 'eev-core'
import {Dispatcher} from './dispatcher'

class TestComponent extends Component {
  id = 'TestComponent'
  data: {num: number}
  onAdd(): void {}
  onRemove(): void {}
}

class TestSystem extends System<TestComponent> {
  id = 'TestSystem'
  dependencies = [TestComponent]
  entities: Array<[string, number]> = []
  updateCount: number = 0

  constructor() {
    super()
    this.entities = []
    this.updateCount = 0
  }

  run(entities) {
    this.updateCount++
    for (let [id, [{num}]] of entities) {
      this.entities.push([id, num])
    }
  }
}

it('Allows registering a system with the dispatcher', () => {
  const dispatcher = new Dispatcher()

  dispatcher.register(new TestSystem())

  let count = 0
  let node = dispatcher.systems.head
  while (node != null) {
    count = count + 1
    node = node.next
  }
  expect(count).toBe(1)
})

it('Allows removal of a system from the dispatcher', () => {
  const dispatcher = new Dispatcher()
  const remove = dispatcher.register(new TestSystem())

  remove()
  expect(dispatcher.systems.head).toBe(null)
})

it('Systems run against queried entities', () => {
  const world = new World()
  const dispatcher = new Dispatcher()
  const entity = world.createEntity()
  const testNumber = 42

  world.register(TestComponent)
  world.applyComponent(new TestComponent({num: testNumber}), entity)

  const testSystem = new TestSystem()
  dispatcher.register(testSystem)
  dispatcher.dispatch(world)

  expect(testSystem.entities.length).toEqual(1)

  const systemEntity = testSystem.entities[0]
  expect(systemEntity[0]).toEqual(entity)
  expect(systemEntity[1]).toEqual(testNumber)
  expect(testSystem.updateCount).toEqual(1)
})
