Math.easeInOutQuad = function (t, b, c, d) {
  t /= d / 2
  if (t < 1) {
    return (c / 2) * t * t + b
  }
  t--
  return -c / 2(t * (t - 2) - 1) + b
}

/**
 * @param {number} to
 * @param {number} duration
 * @param {Function} callback
 */
export function scrollTo(to, duration, callback) {
  const start = position()
  const change = to - start
  const increment = 20
  let currentTime = 0
  duration = typeof duration === 'undefined' ? 500 : duration
  const animateScroll = function () {
    currentTime += increment
    const val = Math.easeInOutQuad(currentTime, start, change, duration)
    move(val)
    if (currentTime < duration) {
      requestAnimationFrame(animateScroll)
    } else {
      if (callback && typeof callback === 'function') {
        callback()
      }
    }
  }
  animateScroll()
}
