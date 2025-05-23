function updateDate() {
  const date = new Date()
  const month = date.getMonth() + 1
  const dayOfMonth = date.getDate()
  const dayOfWeek = date.getDay()
  const days = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]

  return {
    day: `${month}/${dayOfMonth}`,
    dayNum: days[dayOfWeek]
  }
}
module.exports = {
  updateDate
}
