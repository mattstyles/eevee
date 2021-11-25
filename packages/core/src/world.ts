import {v4 as uuid} from 'uuid'

type ID = string

export class Component {
  id: ID
  data: any
  onAdd(): void {}
  onRemove(): void {}

  constructor(attributes: any = {}) {
    for (let key in attributes) {
      this[key] = attributes[key]
    }
  }
}

type TableEntityData = Map<ID, any>

type TableData = {
  entities: TableEntityData
  mask: number
}

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
   * Returns a set of components that have the supplied components
   * @TODO for now just use one type parameter
   */
  query<T extends Component>(
    component: typeof Component
  ): Set<[T['data'], ID]> {
    const table = this.tables.get(component.name)
    const components = new Set<[T['data'], ID]>()
    table.entities.forEach((component, key) => {
      components.add([component.data as T, key])
    })
    return components
  }
}
