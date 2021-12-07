import {Component} from 'eev-core'

export class Position extends Component {
  id = 'PositionComponent'
  data: {x: number; y: number} = {x: 0, y: 0}

  constructor(attributes: {x: number; y: number}) {
    super(attributes)
    this.data = attributes
  }
}

export class Grow extends Component {
  id = 'GrowComponent'
  data: {chance: number} = {chance: 0.5}

  constructor(attributes: {chance: number}) {
    super(attributes)
    this.data = attributes
  }
}

export class Colour extends Component {
  id = 'ColourComponent'
  data: {colour: string} = {colour: '#ff69b488'}

  constructor(attributes: {colour: string}) {
    super(attributes)
    this.data = attributes
  }
}
