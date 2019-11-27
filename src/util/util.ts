export function debounce(func: () => void, delay: number, ctx: any) {
  let timeout: any
  return function() {
    clearTimeout(timeout)
    timeout = setTimeout(function() {
      func.apply(ctx)
    }, delay)
  }
}

export function countInterval(sd: any, ed: any) {
  let interval: number = (ed - sd) / 1000
  let continued = ''
  if (interval > 3600) {
    const hour = Math.floor(interval / 3600)
    continued += hour + '小时'
    interval -= hour * 3600
  }
  if (interval > 60 && interval < 3600) {
    const min = Math.floor(interval / 60)
    continued += min + '分'
    interval -= min * 60
  }
  if (interval < 60) {
    continued += Math.floor(interval) + '秒'
  }
  return continued
}
