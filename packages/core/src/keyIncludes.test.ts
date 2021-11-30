import keyIncludes from './keyIncludes'

it('Returns true if the key includes certain string', () => {
  const target = 'end,world,hunger'

  // Start
  expect(keyIncludes('end', target)).toBe(true)
  // Middle
  expect(keyIncludes('world', target)).toBe(true)
  // End
  expect(keyIncludes('hunger', target)).toBe(true)
})

it('Returns false if the key does not include a certain string', () => {
  const target = 'stop,the,hate'

  // Start
  expect(keyIncludes('sto', target)).toBe(false)
  // After comma
  expect(keyIncludes('th', target)).toBe(false)
  // Before comma
  expect(keyIncludes('top', target)).toBe(false)
  // End
  expect(keyIncludes('ate', target)).toBe(false)
})

it('Returns true or false if the cacheKey is only one item', () => {
  const target = 'peace'

  expect(keyIncludes('peace', target)).toBe(true)
  expect(keyIncludes('war', target)).toBe(false)
})
