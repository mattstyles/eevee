class Node<T> {
  next: Node<T> | null
  priority: number
  data: T

  constructor(data: T, priority: number) {
    this.data = data
    this.priority = priority
    this.next = null
  }

  linkTo(node: Node<T>) {
    this.next = node
  }
}

/**
 * We prioritise sorted iteration so a linked list seems like the best structure.
 */
export default class PriorityQueue<T> {
  head: Node<T> | null = null

  add(data: T, priority: number = 100): void {
    const newNode = new Node<T>(data, priority)
    let curr = this.head

    // Empty list
    if (curr == null) {
      this.head = newNode
      return
    }

    if (curr.priority > priority) {
      this.head = newNode
      newNode.linkTo(curr)
      return
    }

    // Iterate and find where it should go
    while (curr != null) {
      let next = curr.next

      // Tail insertion
      if (next == null) {
        curr.linkTo(newNode)
        return
      }

      if (next.priority > priority) {
        newNode.linkTo(curr.next)
        curr.linkTo(newNode)
        return
      }

      curr = curr.next
    }
  }

  remove(data: T): boolean {
    let curr = this.head

    // Empty list
    if (curr == null) {
      return false
    }

    // Head node
    if (curr.data === data) {
      this.head = curr.next
      delete curr.data
      return true
    }

    let prev = curr
    while (curr.next != null) {
      curr = curr.next

      if (curr.data === data) {
        prev.next = curr.next
        delete curr.data
        return true
      }

      prev = curr
    }

    return false
  }

  forEach(cb: (arg: T) => void): void {
    let curr = this.head
    while (curr != null) {
      cb(curr.data)
      curr = curr.next
    }
  }
}
