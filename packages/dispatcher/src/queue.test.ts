import PriorityQueue from './queue'

it('Allows adding an item to the head of the queue', () => {
  const q = new PriorityQueue<string>()
  const testString = 'foo'

  q.add(testString)

  expect(q.head.data).toBe(testString)
})

it('Should add items in the correct order', () => {
  const q = new PriorityQueue<string>()
  const fixture = ['a', 'b', 'c', 'd', 'e']

  q.add('a', 10)
  q.add('d', 40)
  q.add('c', 30)
  q.add('b', 20)
  q.add('e', 50)

  const output = []
  q.forEach((data) => {
    output.push(data)
  })

  expect(output).toStrictEqual(fixture)
})

it('Allows removing an item from the head of the queue', () => {
  const q = new PriorityQueue<string>()
  const testString = 'foo'

  q.add(testString)
  q.remove(testString)

  expect(q.head).toBe(null)
})

it('Should remove an item from the queue', () => {
  const q = new PriorityQueue<string>()
  const fixture = ['a', 'b', 'd', 'e']

  q.add('a', 10)
  q.add('d', 40)
  q.add('c', 30)
  q.add('b', 20)
  q.add('e', 50)

  q.remove('c')

  const output = []
  q.forEach((data) => {
    output.push(data)
  })

  expect(output).toStrictEqual(fixture)
})
