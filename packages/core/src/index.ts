export const str: string = 'hello world'

export function say(pre?: string): void {
  console.log(`${pre}${pre != null ? ' ' : ''}${str}`)
}

export function exclaim(): void {
  console.log(`${str}!!!`)
}

interface MyObject {
  foo: string
  bar: number
}

export const obj: MyObject = {
  foo: str,
  bar: 23,
}
