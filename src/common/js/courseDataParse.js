import courseDataReader from "./courseDataReader"

/**
   * 获取课程安排
   * @param {string} weekday - 星期几（如'星期一'）
   * @returns {Array} 对应星期几的课程安排数据
   */
function getCourseSchedule(weekday) {
  /**
   * 读取数据
   */
  const basicInfo = courseDataReader.getBasicInfo()
  const coursesInfo = courseDataReader.getCoursesInfo()
  const timetableInfo = courseDataReader.getTimetableTemplateInfo()
  const scheduleInfo = courseDataReader.getCourseScheduleInfo()

  /**
   * 周数计算
   */
  // 1.解析日期格式
  const parseDate = (dateStr) => {
    const year = "20" + dateStr.substring(0, 2)
    const month = dateStr.substring(2, 4)
    const day = dateStr.substring(4, 6)
    return `${year}-${month}-${day}`
  }

  // 2.转换courseStart格式
  const formattedStartDate = parseDate(basicInfo.courseStart)

  // 3.计算开学日是星期几 (0-6, 0表示周日)
  const startDate = new Date(formattedStartDate)
  const startDayOfWeek = startDate.getDay()

  // 4.计算下一个周一的具体日期
  const nextMonday = new Date(startDate)
  const daysUntilMonday = (7 - startDayOfWeek + 1) % 7
  nextMonday.setDate(startDate.getDate() + daysUntilMonday)
  const nextMondayDate = `${nextMonday.getFullYear()}-${String(nextMonday.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(nextMonday.getDate()).padStart(2, "0")}`
  console.log("下一个周一的日期是：" + nextMondayDate)

  // 5.初始化开学周数
  const startWeekNumber = 1

  // 6.计算当前周数
  const today = new Date()
  const nextMondayDateInCalc = new Date(nextMondayDate)
  const timeDiff = today.getTime() - nextMondayDateInCalc.getTime()
  const weekDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 7))
  const currentWeekNumber = startWeekNumber + weekDiff + 1
  console.log("当前是第" + currentWeekNumber + "周")

  /**
   * 周数循环器函数
   * @param {number} num - 输入循环次数
   * @returns {number} 返回根据当前周数计算的应该取第几次课的索引
   * @example
   * calculateWeekRemainder(3) // 如果当前周数是1，返回0；如果当前周数是2，返回1；如果当前周数是3，返回2；如果当前周数是4，返回0
   */
  const calculateWeekRemainder = (num) => {
    const remainder = currentWeekNumber % num
    return (remainder === 0 ? num : remainder) - 1
  }

  console.log(calculateWeekRemainder(3))

  /**
   * 信息拼接
   */
  // 1.明确所需要的是第几天的信息
  let WhichDay = 0
  if (weekday === "Mon") WhichDay = 0
  else if (weekday === "Tue") WhichDay = 1
  else if (weekday === "Wed") WhichDay = 2
  else if (weekday === "Thu") WhichDay = 3
  else if (weekday === "Fri") WhichDay = 4
  else if (weekday === "Sat") WhichDay = 5
  else if (weekday === "Sun") WhichDay = 6
  const daySchedule = scheduleInfo[WhichDay]
  // 2.计算时间样表选取
  const timetableRepeatability = daySchedule.timetableRepeatability
  console.log("timetableRepeatability:", timetableRepeatability)
  const timetableId = daySchedule.timetableId
  const timetableIndex = calculateWeekRemainder(timetableRepeatability)
  const selectedTimetable = timetableId[timetableIndex]
  console.log("当前周对应的timetable:", selectedTimetable)
  const timetableData = timetableInfo[selectedTimetable]
  console.log("当前课程表信息:", timetableData)
  // 3.拼接信息
  let courseCounter = 0

  // 处理timetableData数组
  const processedData = timetableData.map((item) => {
    if (item.type === "course") {
      const courseItem = daySchedule.courseList[courseCounter]
      courseCounter++
      const courseId = courseItem.courseId
      const courseRepeatability = courseItem.courseRepeatability
      const finalCourseId = courseId[calculateWeekRemainder(courseRepeatability)]
      const courseData = coursesInfo[finalCourseId]
      console.log("课程信息:", courseData)
      /**
       * 数据返回
       */
      return {
        type: item.type,
        courseName: courseData.courseName,
        courseTeacher: courseData.courseTeacher,
        courseRoom: courseData.courseRoom,
        timeHour: item.timeHour,
        timeMinute: item.timeMinute
      }
    } else if (item.type === "interval" || item.type === "end" || item.type === "rest") {
      return item
    }
  })
  console.log("处理后的timetableData:", processedData)
  return processedData
}

module.exports = {
  getCourseSchedule
}
