


// 勾股定理
function clacDistance(a, b) {
  return Math.sqrt((a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1]));
}


/**
 * 三次贝塞尔表达式
 * @param {*} p0 起点
 * @param {*} cp1 控制点1
 * @param {*} cp2 控制点2
 * @param {*} p2 终点
 * @param {*} t 参数t 0-1
 * @returns 
 */
function cubicBezier(p0, cp1, cp2, p2, t) {
  const t1 = 1 - t;
  return t1 ** 3 * p0 + 3 * t1 ** 2 * t * cp1 + 3 * t1 * t ** 2 * cp2 + t ** 3 * p2
}

// 求三次贝塞尔曲线任意点
function cubicBezierPoint(x1, y1, c1x, c1y, c2x, c2y, x2, y2, t) {
  const t1 = 1 - t;
  return {
    x: cubicBezier(x1, c1x, c2x, x2, t),
    y: cubicBezier(y1, c1y, c2y, y2, t),
  };
}

// 求贝塞尔曲线长度长度
function calcCurveLength(x1, y1, c1x, c1y, c2x, c2y, x2, y2) {
  let length = 0;
  let x, y;
  let cur = [x1, y1];
  let t = 0;

  // bad perf when size = 300
  const sampleSize = 20;
  for (let j = 0; j <= sampleSize; j += 1) {
    t = j / sampleSize;
    ({ x, y } = cubicBezierPoint(x1, y1, c1x, c1y, c2x, c2y, x2, y2, t));
    length += clacDistance(cur, [x, y]);
    cur = [x, y];
  }

  return length
}


const NEWTON_ITERATIONS = 4;
const NEWTON_MIN_SLOPE = 0.001;
const SUBDIVISION_PRECISION = 0.0000001;
const SUBDIVISION_MAX_ITERATIONS = 10;

/**
 * 二分法解三次贝塞尔曲线
 * @param {*} x1 
 * @param {*} x2 
 * @param {*} targetX 
 * @returns 
 */
const binarySolveX = (p1, cp1, cp2, p2, targetX) => {
  let currentX,
    currentT,
    i = 0,
    left = 0,
    right = 1
  do {
    currentT = left + (right - left) / 2.0;
    currentX = cubicBezier(p1, cp1, cp2, p2, currentT) - targetX;
    // currentX = calc(x1, x2, currentT) - targetX;
    if (currentX > 0.0) right = currentT;
    else left = currentT;
  } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
  return currentT;
};


/**
* 线性差值
*/
function interpolate(from, to, f) {
  if (typeof from === 'number' && typeof to === 'number') {
    return from * (1 - f) + to * f;
  }
  if (
    (typeof from === 'boolean' && typeof to === 'boolean') ||
    (typeof from === 'string' && typeof to === 'string') // skip string, eg. path ['M', 10, 10]
  ) {
    return f < 0.5 ? from : to;
  }

  if (Array.isArray(from) && Array.isArray(to)) {
    // interpolate arrays/matrix
    if (from.length === to.length) {
      const r = [];
      for (let i = 0; i < from.length; i++) {
        r.push(interpolate(from[i], to[i], f));
      }
      return r;
    }
  }
}