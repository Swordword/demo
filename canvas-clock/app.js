function main() {
  const canvas = document.getElementById('canvas')
  const ctx = canvas.getContext('2d')
  console.log('ctx', ctx)
  ctx.strokeStyle = 'red'
  ctx.arc(200, 200, 100, 0, Math.PI * 2)
  ctx.stroke()
}

main()
