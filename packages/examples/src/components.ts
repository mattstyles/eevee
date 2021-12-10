import {Component} from 'eev-core'

export class Position extends Component {
  id = 'PositionComponent'
  data: {x: number; y: number} = {x: 0, y: 0}

  constructor(attributes: {x: number; y: number}) {
    super(attributes)
    this.data = attributes
  }
}

export class Decay extends Component {
  id = 'DecayComponent'
  data: {life: number; rate: number} = {life: 1, rate: 0.5}

  constructor(attributes: {life: number; rate: number}) {
    super(attributes)
    this.data = attributes
  }
}
