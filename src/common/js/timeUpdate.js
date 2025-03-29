function updateTime() {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, "0")
  const minutes = String(now.getMinutes()).padStart(2, "0")
  const Seconds = String(now.getSeconds()).padStart(2, "0")
  return {
    time: `${hours}:${minutes}`,
    fullTime: `${hours}:${minutes}:${Seconds}`
  }
}

function updateTimePersecond(callback) {
  const timer = setInterval(() => {
    const timeData = updateTime()
    callback(timeData)
  }, 1000)
  return timer
}
function updateTimePerminute(callback) {
    const timer = setInterval(() => {
      const timeData = updateTime()
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
