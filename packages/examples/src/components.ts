import {Component} from 'eev-core'

export class Position extends Component {
  id = 'PositionComponent'
  data: {x: number; y: number} = {x: 0, y: 0}

  constructor(attributes: {x: number; y: number}) {
    super(attributes)
    this.data = attributes
  }
}
