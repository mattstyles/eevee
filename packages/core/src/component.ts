import type {ID} from './entity'

export abstract class Component {
  id: ID
  data: any = {}
  onAdd(): void {}
  onRemove(): void {}

  constructor(attributes: Record<string, any> = {}) {
    this.data = attributes
  }
}
