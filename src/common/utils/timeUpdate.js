function updateTime() {
  let now = new Date()
  let hours = String(now.getHours()).padStart(2, "0")
  let minutes = String(now.getMinutes()).padStart(2, "0")
  let Seconds = String(now.getSeconds()).padStart(2, "0")
  return {
    hours,
    minutes,
    time: `${hours}:${minutes}`,
    seconds: Seconds,
    fullTime: `${hours}:${minutes}:${Seconds}`
  }
}

function updateTimePersecond(callback) {
  let timer = setInterval(() => {
    let timeData = updateTime()
    callback(timeData)
  }, 1000)
  return timer
}
function updateTimePerminute(callback) {
    let timer = setInterval(() => {
      let timeData = updateTime()
      callback(timeData)
    }, 60000)
    return timer
  }

function stopTimer(timer) {
  clearInterval(timer)
}

module.exports = {
  updateTime,
  updateTimePersecond,
  updateTimePerminute,
  stopTimer
}
