import {v4 as uuid} from 'uuid'
import keyIncludes from './keyIncludes'

type ID = string

export abstract class Component {
  id: ID
  data: any = {}
  onAdd(): void {}
  onRemove(): void {}

  constructor(attributes: Record<string, any> = {}) {
    this.data = attributes
  }
}

type TableEntityData = Map<ID, Component>

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

  // Query cache
  cache: Map<string, TableEntityData> = new Map()

  /**
   * Returns the cached result if it exists
   */
  getCache<
    A = Component,
    B = Component,
    C = Component,
    D = Component,
    E = Component,
    F = Component,
    G = Component,
    H = Component,
    I = Component,
    J = Component,
    K = Component,
    L = Component
  >(key: Array<string>): Map<ID, [A, B, C, D, E, F, G, H, I, J, K, L]> | null {
    const cached: unknown = this.cache.get(key.join(','))

    if (cached == null) {
      return null
    }

    return cached as Map<ID, [A, B, C, D, E, F, G, H, I, J, K, L]>
  }

  /**
   * Sets the cache key based on the list of components used for the query
   */
  setCache(key: Array<string>, data: Map<ID, unknown>): void {
    this.cache.set(key.join(','), data as TableEntityData)
  }

  /**
   * Deletes a key from the cache
   */
  deleteCache(key: Array<string>): void {
    this.cache.delete(key.join(','))
  }

  /**
   * Iterates the cache looking for items that contain the passed component
   */
  invalidateCache(key: string): void {
    for (let [cacheKey] of this.cache) {
      if (keyIncludes(key, cacheKey)) {
        this.deleteCache([cacheKey])
      }
    }
  }

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

    // Invalidate where component is a part of the cache
    this.invalidateCache(component.constructor.name)
  }

  /**
   * Returns data from entities who match the supplied component
   */
  queryOne<T extends Component = Component>(
    component: typeof Component
  ): Map<ID, [T['data']]> {
    const cached: unknown = this.getCache<T>([component.name])
    if (cached != null) {
      return cached as Map<ID, [T['data']]>
    }

    const table = this.tables.get(component.name)
    const components = new Map<ID, [T['data']]>()
    table.entities.forEach((component, key) => {
      components.set(key, [component.data as T['data']])
    })

    this.setCache([component.name], components)
    return components
  }

  /**
   * Returns data from entities who match the supplied components
   *
   * Should we implement per query caching? Returning an object to cache and run the query?
   */
  query<
    A extends Component = Component,
    B extends Component = Component,
    C extends Component = Component,
    D extends Component = Component,
    E extends Component = Component,
    F extends Component = Component,
    G extends Component = Component,
    H extends Component = Component,
    I extends Component = Component,
    J extends Component = Component,
    K extends Component = Component,
    L extends Component = Component
  >(
    ...args: typeof Component[]
  ): Map<
    ID,
    [
      A['data']?,
      B['data']?,
      C['data']?,
      D['data']?,
      E['data']?,
      F['data']?,
      G['data']?,
      H['data']?,
      I['data']?,
      J['data']?,
      K['data']?,
      L['data']?
    ]
  > {
    if (args.length === 1) {
      return this.queryOne<A>(args[0])
    }

    const cached: unknown = this.getCache<A, B, C, D, E, F, G, H, I, J, K, L>(
      args.map((arg) => arg.name)
    )
    if (cached != null) {
      return cached as Map<
        ID,
        [
          A['data']?,
          B['data']?,
          C['data']?,
          D['data']?,
          E['data']?,
          F['data']?,
          G['data']?,
          H['data']?,
          I['data']?,
          J['data']?,
          K['data']?,
          L['data']?
        ]
      >
    }

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

    this.setCache(
      args.map((arg) => arg.name),
      output
    )
    return output
  }
}
