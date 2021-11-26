import {World, Component} from './world'

class ITestComponent extends Component {
  id = 'TestComponent'
  data: {str: string}

  onAdd(): void {}
  onRemove(): void {}
}

class ITestComponent2 extends Component {
  id = 'TestComponent2'
  data: {num: number}

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

  world.applyComponent(new ITestComponent({str: 'yo'}), entity)
  world.applyComponent(new ITestComponent2({num: 42}), entity)

  let entityMask = world.entities.get(entity)
  expect((entityMask & 1) > 0).toBe(true)
  expect((entityMask & 2) > 0).toBe(true)
  expect((entityMask & (1 | 2)) > 0).toBe(true)
  expect((entityMask & 4) > 0).toBe(false)
})

it('World can be queried for entities that contain a component', () => {
  const world = new World()
  const entity = world.createEntity()
  const testString = 'hello'
  const testNumber = 42

  world.register(ITestComponent)
  world.register(ITestComponent2)

  world.applyComponent(new ITestComponent({str: testString}), entity)
  world.applyComponent(new ITestComponent2({num: testNumber}), entity)

  const entities = world.queryOne<ITestComponent>(ITestComponent)

  let count = 0
  for (let [id, [{str}]] of entities) {
    count = count + 1
    expect(str).toBe(testString)
    expect(id).toBe(entity)
  }
  expect(count).toBe(1)
})

it('World can be queried for entities that match the component set', () => {
  const world = new World()
  const entity = world.createEntity()
  const testString = 'hello'
  const testNumber = 42

  world.register(ITestComponent)
  world.register(ITestComponent2)

  world.applyComponent(new ITestComponent({str: testString}), entity)
  world.applyComponent(new ITestComponent2({num: testNumber}), entity)

  const entities = world.query<ITestComponent, ITestComponent2>(
    ITestComponent,
    ITestComponent2
  )

  let count = 0
  for (let [id, [{str}, {num}]] of entities) {
    count = count + 1
    expect(str).toBe(testString)
    expect(num).toBe(testNumber)
    expect(id).toBe(entity)
  }
  expect(count).toBe(1)
})
