
class NodeManager {
  context = null;
  nodes = []
  constructor(context) {
    this.context = context
  }
  addNode(node) {
    node.setContext(this.context)
    this.nodes.push(node)
  }
  draw() {
    this.nodes.forEach((node) => {
      node.draw()
    })
  }
}


class Node {
  context = null
  model = {}
  constructor(context) {
    this.context = context
  }

  setContext(context) {
    this.context = context
  }

  attr(...args) {
    if (args.length === 2 && typeof args[0] === 'string') {
      this.model[args[0]] = args[1]
    }
    if (args.length === 1 && typeof args[0] === 'object' && args[0] !== null) {
      Object.assign(this.model, args[0])
    }
  }

  draw() { }
}

class Cubic extends Node {
  model = {
    points: [],
    lineWidth: 1,
    fill: 'none',
    stroke: 'none',
    lineDash: [],
    lineDashOffset: 0
  }

  getTotalLength() {
    return calcCurveLength(...this.model.points)
  }

  getPointAt(ratio) {
    return cubicBezierPoint(...this.model.points, ratio)
  }

  draw() {
    const { points, fill: fillStyle, stroke: strokeStyle, lineWidth, lineDash, lineDashOffset } = this.model
    this.context.save()
    this.context.fillStyle = fillStyle;
    this.context.strokeStyle = strokeStyle;
    this.context.lineWidth = lineWidth;
    this.context.beginPath()
    this.context.setLineDash(lineDash)
    this.context.lineDashOffset = lineDashOffset
    this.context.moveTo(points[0], points[1])
    this.context.bezierCurveTo(points[2], points[3], points[4], points[5], points[6], points[7])
    this.context.stroke()
    this.context.closePath()
    this.context.restore()
  }
}

class Circle extends Node {
  model = {
    x: 0,
    y: 0,
    r: 10,
    lineWidth: 1,
    fill: 'none',
    stroke: 'none',
    lineDashOffset: 0,
    lineDash: [],
    offsetPath: null,
    offsetDistance: 0
  }
  draw() {
    let { x, y, offsetDistance } = this.model;
    const { r, lineWidth, fill: fillStyle, stroke: strokeStyle, lineDashOffset, lineDash, offsetPath } = this.model

    if (offsetPath) {
      offsetDistance = offsetDistance > 1 ? 1 : offsetDistance;
      offsetDistance = offsetDistance < 0 ? 0 : offsetDistance;
      const point = offsetPath.getPointAt(offsetDistance)
      x = point.x;
      y = point.y
    }

    this.context.save()
    this.context.fillStyle = fillStyle;
    this.context.strokeStyle = strokeStyle;
    this.context.lineWidth = lineWidth;
    this.context.beginPath()
    this.context.setLineDash(lineDash)
    this.context.lineDashOffset = lineDashOffset
    this.context.arc(x, y, r, 0, 2 * Math.PI);
    this.context.fill()
    this.context.stroke()
    this.context.closePath()
    this.context.restore()
  }
}
