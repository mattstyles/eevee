import {World, Component} from './world'

class ITestComponent extends Component {
  id = 'TestComponent'
  data: string = ''

  constructor(data: string) {
    super()
    this.data = data
  }

  onAdd(): void {}
  onRemove(): void {}
}

class ITestComponent2 extends Component {
  id = 'TestComponent2'
  data: number = 0

  constructor(data: number) {
    super()
    this.data = data
  }

  onAdd(): void {}
  onRemove(): void {}
}

it('World can create entities with a bitmask', () => {
  const world = new World()

  const entity = world.createEntity()

  expect(typeof entity).toBe('string')
  expect(world.entities.get(entity)).toBe(0)
})

it('World can register components by their class type', () => {
  const world = new World()
  world.register(ITestComponent)

  expect(world.tables.size).toBe(1)
  expect(world.tables.get(ITestComponent.name).mask).toBe(1)

  world.register(ITestComponent2)

  expect(world.tables.size).toBe(2)
  expect(world.tables.get(ITestComponent2.name).mask).toBe(2)
})

it('World can apply components to entities and set the bitmask correctly', () => {
  const world = new World()
  const entity = world.createEntity()

  world.register(ITestComponent)
  world.register(ITestComponent2)

  world.applyComponent(new ITestComponent('hello'), entity)
  world.applyComponent(new ITestComponent2(42), entity)

  let entityMask = world.entities.get(entity)
  expect((entityMask & 1) > 0).toBe(true)
  expect((entityMask & 2) > 0).toBe(true)
  expect((entityMask & (1 | 2)) > 0).toBe(true)
  expect((entityMask & 4) > 0).toBe(false)
})

it('World can get queries for entities that match the component set', () => {
  const world = new World()
  const entity = world.createEntity()
  const testString = 'hello'
  const testNumber = 42

  world.register(ITestComponent)
  world.register(ITestComponent2)

  world.applyComponent(new ITestComponent(testString), entity)
  world.applyComponent(new ITestComponent2(testNumber), entity)

  const entities = world.query<ITestComponent>(ITestComponent)

  for (let [data, id] of entities) {
    expect(data).toBe(testString)
  }
})
