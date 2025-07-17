function updateDate() {
  let date = new Date()
  let month = date.getMonth() + 1
  let dayOfMonth = date.getDate()
  let dayOfWeek = date.getDay()
  let days = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]

  return {
    day: `${month}/${dayOfMonth}`,
    dayNum: days[dayOfWeek]
  }
}
module.exports = {
  updateDate
}
