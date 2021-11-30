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

it('World queries will use the cache', () => {
  const world = new World()
  const entity = world.createEntity()
  const testString = 'hello'
  const testNumber = 42

  world.register(ITestComponent)
  world.register(ITestComponent2)

  world.applyComponent(new ITestComponent({str: testString}), entity)

  let entities = world.query<ITestComponent>(ITestComponent)

  for (let [id, [{str}]] of entities) {
    expect(str).toBe(testString)
    expect(id).toBe(entity)
  }
  expect(world.cache.size).toBe(1)

  // Cache will survive when adding a component without a cached query
  world.applyComponent(new ITestComponent2({num: testNumber}), entity)
  expect(world.cache.size).toBe(1)
  expect(world.cache.get('ITestComponent') != null).toBe(true)
  expect(world.cache.get('ITestComponent2') != null).toBe(false)

  // Cache will invalidate when adding a component with a query
  const entity2 = world.createEntity()
  const testString2 = 'world'
  world.applyComponent(new ITestComponent({str: testString2}), entity2)
  expect(world.cache.size).toBe(0)

  // Cache with multiple components will invalidate
  world.applyComponent(new ITestComponent2({num: testNumber}), entity)
  world.query<ITestComponent>(ITestComponent)
  world.query<ITestComponent, ITestComponent2>(ITestComponent, ITestComponent2)
  expect(world.cache.size).toBe(2)
  world.applyComponent(new ITestComponent2({num: 23}), entity2)
  expect(world.cache.size).toBe(1)
  expect(world.cache.get('ITestComponent2') == null).toBe(true)
  expect(world.cache.get('ITestComponent') == null).toBe(false)
})

it('World queries provide fresh data when component data changes, even from cache', () => {
  const world = new World()
  const entity = world.createEntity()
  const testNumber = 2

  world.register(ITestComponent2)

  world.applyComponent(new ITestComponent2({num: testNumber}), entity)

  let entities = world.query<ITestComponent2>(ITestComponent2)

  for (let [id, [{num}]] of entities) {
    expect(num).toBe(testNumber)
    expect(id).toBe(entity)
  }

  // Mutate data
  for (let [_, [component]] of entities) {
    component.num = component.num * component.num
  }

  // Check
  expect(world.cache.size).toBe(1)
  let query = world.query<ITestComponent2>(ITestComponent2)
  for (let [id, [{num}]] of query) {
    expect(num).toBe(testNumber * testNumber)
    expect(id).toBe(entity)
  }
})
