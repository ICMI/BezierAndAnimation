

class Animation {
  from = {};
  to = {};
  duration = 0;
  ease = []; // 示例： [0.42,0,0.58,1] => ease-in-out
  repeat = true;
  done = false;
  currentTime = 0;

  constructor(option) {
    Object.assign(this, option)
  }

  update(dt) {
    // 累计耗时
    this.currentTime += dt;
    let progress = this.currentTime / this.duration;

    if (progress >= 1) {
      progress = 1;
    }
    // 默认线性
    let easedProgress = progress;
    if (this.ease) {
      // 如果存在缓冲曲线配置，计算缓动函数值
      const t = binarySolveX(0, this.ease[0], this.ease[2], 1, progress)
      easedProgress = cubicBezier(0, this.ease[1], this.ease[3], 1, progress);
    }

    // 对每个属性计算差值更新图形属性
    for (const [key, value] of Object.entries(this.from)) {
      if (this.to[key] === undefined || this.to[key] === null) continue
      // 计算差值
      const interpolatedValue = interpolate(this.from[key], this.to[key], easedProgress)
      // 更新节点
      this.target.attr(key, interpolatedValue)
    }

    // 如果动画进度结束，结束动画或repeat
    if (progress === 1) {
      if (this.repeat) {
        this.currentTime = 0
      } else {
        this.done = true;
      }
    }
  }
}

class AnimationManager {
  animations = []
  addAnimation(animation) {
    this.animations.push(animation)
  }
  update(dt) {
    [...this.animations].forEach((animation) => {
      animation.update(dt)
      if (animation.done) {
        this.animations.splice(this.animations.indexOf(animation), 1)
      }
    })
  }
}
