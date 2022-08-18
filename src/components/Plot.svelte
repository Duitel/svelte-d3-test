<script>
  import { water, provinces, erase, drawInPixels } from '../stores.js'
  import { geoMercator, geoPath } from 'd3-geo'

  const width = 700
  const height = 700

  const waterColor = "#4288c4"
  const landColor = "#ffffff"
  const drawColor = "#6d9dc7"

  const circleRadius = 10

  const projection = geoMercator()
      .scale(8000)
      .translate([width / 2, height / 2])
      .center([5.3, 52.12])

  const cellSize = 5 //in pixels
  const maxRow = Math.ceil(height/cellSize)
  const maxCol = Math.ceil(width/cellSize)

  let canvasLand
  let canvasWater
  let canvasDrawing

  let mouseDown = false;

  $: ctxLand = canvasLand ? canvasLand.getContext("2d") : null
  $: ctxWater = canvasWater ? canvasWater.getContext("2d") : null
  $: ctxDrawing = canvasDrawing ? canvasDrawing.getContext("2d") : null

  $: boundingRect = canvasDrawing ? canvasDrawing.getBoundingClientRect() : null

  $: {
    if (ctxLand) {
      drawMap($provinces, ctxLand, "#eeeeee", "#ffffff")
    }
  }
  $: {
    if (ctxWater) {
      drawMap($water, ctxWater, waterColor, waterColor)
    }
  }

  function drawMap(shapes, ctx, fillColor, strokeColor) {
    const drawGeoPaths = geoPath(projection, ctx)
    ctx.clearRect(0,0, width, height)

    ctx.beginPath();
    drawGeoPaths(shapes)
    if (fillColor) {
      ctx.fillStyle = fillColor
      ctx.fill();
    }
    if (strokeColor) {
      ctx.strokeStyle = strokeColor
      ctx.stroke();
    }

  }

  function onMouseMove(event) {
    if (mouseDown) {
      const x = event.clientX - boundingRect.left
      const y = event.clientY - boundingRect.top
      ctxDrawing.fillStyle = drawColor
      ctxDrawing.globalCompositeOperation = $erase
        ? 'destination-out'
        : 'source-over'
      if ($drawInPixels) {
        drawPixelsInCircle(
          Math.floor(x/cellSize),
          Math.floor(y/cellSize),
          Math.round(circleRadius/cellSize)
        )
      } else {
        ctxDrawing.beginPath()
        ctxDrawing.arc(x,y, circleRadius, 0, 2 * Math.PI)
        ctxDrawing.fill()
      }
    }
  }

  function drawPixelsInCircle(colCenter, rowCenter, radiusInNrOfCells) {
    const startRow = Math.max(0, rowCenter - radiusInNrOfCells)
    const endRow = Math.min(maxRow, rowCenter + radiusInNrOfCells)
    const startCol = Math.max(0, colCenter - radiusInNrOfCells)
    const endCol = Math.min(maxCol, colCenter + radiusInNrOfCells)
    //in a square, check for each cell if it fall inside circle
    for (let row=startRow; row<=endRow; row++) {
      for (let col=startCol; col<=endCol; col++) {
        const deltaRow = Math.abs(row - rowCenter)
        const deltaCol = Math.abs(col - colCenter)
        if (Math.sqrt(deltaRow * deltaRow + deltaCol * deltaCol) <= radiusInNrOfCells) {
          ctxDrawing.fillRect(col * cellSize, row*cellSize, cellSize, cellSize)
        }
      }
    }
  }

</script>

<div class="background" on:mousedown={() => mouseDown = true} on:mouseup={() => mouseDown = false}>
  <canvas id="land" class="canvas" {width} {height} bind:this={canvasLand}></canvas>
  <canvas id="user-drawing" class="canvas" {width} {height} bind:this={canvasDrawing}></canvas>
  <canvas id="water" class="canvas" {width} {height} bind:this={canvasWater}></canvas>
  <canvas id="mouse-capture" class="canvas" {width} {height} on:mousemove={onMouseMove}></canvas>
</div>

<style>
  .background {
    position: relative;
    background-color: "#eeeeee";
    width: 100%;
    height: 100%;
  }
  .canvas {
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
