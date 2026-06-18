export async function restorePhotoWithCanvas(source: string): Promise<string> {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('浏览器不支持 Canvas 修复')

  if (!source) {
    canvas.width = 640
    canvas.height = 420
    const gradient = ctx.createLinearGradient(0, 0, 640, 420)
    gradient.addColorStop(0, '#f2ead7')
    gradient.addColorStop(1, '#9fb7aa')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 640, 420)
    ctx.fillStyle = 'rgba(38, 54, 46, 0.76)'
    ctx.font = '36px Georgia'
    ctx.fillText('LegacyTree Restored', 150, 210)
    return canvas.toDataURL('image/png')
  }

  const image = await loadImage(source)
  canvas.width = image.width
  canvas.height = image.height
  ctx.drawImage(image, 0, 0)
  const frame = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const data = frame.data
  for (let index = 0; index < data.length; index += 4) {
    const avg = (data[index] + data[index + 1] + data[index + 2]) / 3
    data[index] = clamp(avg * 1.16 + 12)
    data[index + 1] = clamp(avg * 1.12 + 10)
    data[index + 2] = clamp(avg * 1.05 + 8)
  }
  ctx.putImageData(frame, 0, 0)
  ctx.filter = 'contrast(1.08) saturate(1.12)'
  ctx.drawImage(canvas, 0, 0)
  ctx.filter = 'none'
  return canvas.toDataURL('image/png')
}

function clamp(value: number) {
  return Math.max(0, Math.min(255, value))
}

function loadImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('照片读取失败，无法执行修复'))
    image.src = source
  })
}
