import {v4 as uuid} from 'uuid'

type ID = string

export class Component {
  id: ID
  data: any = {}
  onAdd(): void {}
  onRemove(): void {}

  constructor(attributes: object = {}) {
    this.data = attributes
  }
}

type TableEntityData = Map<ID, any>

type TableData = {
  entities: TableEntityData
  mask: number
}

// type QueryType = <
//   T extends Component = Component,
//   T1 extends Component = Component,
//   T2 extends Component = Component
// >(
//   arg0?: typeof Component,
//   arg1?: typeof Component,
//   arg2?: typeof Component
// ) => Map<ID, [T?, T1?, T2?]>

export class World {
  // Entities with a bitmask for their contained components
  entities: Map<ID, number> = new Map()

  // Tables contain components, each table a list of active components
  tables: Map<string, TableData> = new Map()

  // Available masks
  masks: Map<number, boolean> = new Map()

  /**
   * Creates a new entity and adds it to the world
   */
  createEntity(): ID {
    const entity = uuid()
    this.entities.set(entity, 0)
    return entity
  }

  /**
   * Registers a component type with the world
   */
  register(component: typeof Component): void {
    let mask = -1
    this.masks.forEach((isAvailable, n) => {
      if (isAvailable) {
        mask = n
      }
    })
    if (mask < 0) {
      mask = Math.pow(2, this.masks.size)
      this.masks.set(mask, false)
    }
    this.tables.set(component.name, {
      entities: new Map(),
      mask: mask,
    })
  }

  /**
   * Applies a component instance to an entity
   */
  applyComponent(component: Component, entity: ID): boolean {
    const table = this.tables.get(component.constructor.name)
    const currentMask = this.entities.get(entity)

    if (table == null || currentMask == null) {
      return false
    }

    table.entities.set(entity, component)
    this.entities.set(entity, currentMask | table.mask)
  }

  /**
   * Returns data from entities who match the supplied component
   */
  queryOne<T extends Component = Component>(
    component: typeof Component
  ): Map<ID, [T['data']]> {
    const table = this.tables.get(component.name)
    const components = new Map<ID, [T['data']]>()
    table.entities.forEach((component, key) => {
      components.set(key, [component.data as T['data']])
    })
    return components
  }

  /**
   * Returns data from entities who match the supplied components
   * @TODO cache the result
   */
  query<
    T extends Component = Component,
    T1 extends Component = Component,
    T2 extends Component = Component
  >(
    ...args: typeof Component[]
  ): Map<ID, [T['data']?, T1['data']?, T2['data']?]> {
    // Generate a bitmask from the supplied component types
    const allMasks = []
    for (let arg of args) {
      let table = this.tables.get(arg.name)
      if (table) {
        allMasks.push(table.mask)
      }
    }
    const mask = allMasks.reduce((masks, mask) => {
      return masks | mask
    }, 0)

    // Iterate entities looking for those who match the mask
    let entities = new Set<ID>()
    for (let [entity, entityMask] of this.entities) {
      if (entityMask & mask) {
        entities.add(entity)
      }
    }

    // Structure the output
    // let output = new Map<ID, [T['data']?, T1['data']?, T2['data']?]>()
    let output = new Map()
    let index = 0
    for (let arg of args) {
      let table = this.tables.get(arg.name)
      for (let id of entities) {
        let data = table.entities.get(id)
        if (data) {
          let contents = output.get(id)
          if (contents == null) {
            contents = []
          }
          contents[index] = data.data
          output.set(id, contents)
        }
      }
      index = index + 1
    }

    return output
  }
}
