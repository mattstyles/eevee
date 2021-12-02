const canvasId = 'js-canvas'

export function setCanvas(): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.setAttribute('id', canvasId)
  document.body.appendChild(canvas)

  const [width, height] = getScreenSize()
  canvas.width = width
  canvas.height = height
  // @TODO dpr?

  return canvas
}

export function getContext(): CanvasRenderingContext2D {
  const canvas = document.getElementById(canvasId)
  if (canvas instanceof HTMLCanvasElement) {
    const ctx = canvas.getContext('2d')

    if (ctx == null) {
      throw new Error('can not generate context')
    }

    return ctx
  }

  throw new Error('no canvas found')
}

export function getScreenSize(): [number, number] {
  return [window.innerWidth, window.innerHeight]
}

export function getDPR(): number {
  return window.devicePixelRatio || 1
}
