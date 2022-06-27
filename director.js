class Director {
  rafId = null;
  lastTimestamp = null;
  animationManager = null;
  nodeManager = null;
  context = null;

  constructor(context) {
    this.context = context;
    this.nodeManager = new NodeManager(context);
    this.animationManager = new AnimationManager()
  }

  mainLoop(dt) {
    // 每帧清除重画
    this.context.clearRect(0, 0, context.canvas.width, context.canvas.height)
    // 驱动动画
    this.animationManager.update(dt)
    // 绘制图形
    this.nodeManager.draw()
  }

  start() {
    const runner = (timestamp) => {
      this.mainLoop(this.lastTimestamp ? timestamp - this.lastTimestamp : 0);
      this.lastTimestamp = timestamp
      this.rafId = requestAnimationFrame(runner)
    }
    this.rafId = requestAnimationFrame(runner)
  }

  end() {
    cancelAnimationFrame(this.rafId)
  }
}
