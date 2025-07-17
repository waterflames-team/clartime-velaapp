import courseDataReader from "./courseDataReader"

/**
 * 获取指定星期几的课程安排数据
 * @param {string} weekday - 星期几的英文缩写（如'Mon'表示星期一）
 * @returns {Array} 返回对应星期几的课程安排数据数组，包含以下字段：
 *   - type: 条目类型（'course'/'interval'/'end'/'rest'）
 *   - courseName: 课程名称（仅type='course'时有）
 *   - courseTeacher: 授课教师（仅type='course'时有）
 *   - courseRoom: 教室（仅type='course'时有）
 *   - timeHour: 小时（仅type='course'/'interval'时有）
 *   - timeMinute: 分钟（仅type='course'/'interval'时有）
 */
function getCourseSchedule(weekday) {
  /**
   * 读取数据
   */
  let basicInfo = courseDataReader.getBasicInfo()
  let coursesInfo = courseDataReader.getCoursesInfo()
  let timetableInfo = courseDataReader.getTimetableTemplateInfo()
  let scheduleInfo = courseDataReader.getCourseScheduleInfo()

  /**
   * 周数计算
   */
  // 1.解析日期格式
  let parseDate = (dateStr) => {
    let year = "20" + dateStr.substring(0, 2)
    let month = dateStr.substring(2, 4)
    let day = dateStr.substring(4, 6)
    return `${year}-${month}-${day}`
  }

  // 2.转换courseStart格式
  let formattedStartDate = parseDate(basicInfo.courseStart)

  // 3.计算开学日是星期几 (0-6, 0表示周日)
  let startDate = new Date(formattedStartDate)
  let startDayOfWeek = startDate.getDay()

  // 4.计算下一个周一的具体日期
  let nextMonday = new Date(startDate)
  let daysUntilMonday = (7 - startDayOfWeek + 1) % 7
  nextMonday.setDate(startDate.getDate() + daysUntilMonday)
  let nextMondayDate = `${nextMonday.getFullYear()}-${String(nextMonday.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(nextMonday.getDate()).padStart(2, "0")}`
  // console.log("下一个周一的日期是：" + nextMondayDate)

  // 5.初始化开学周数
  let startWeekNumber = 1

  // 6.计算当前周数
  let today = new Date()
  let nextMondayDateInCalc = new Date(nextMondayDate)
  let timeDiff = today.getTime() - nextMondayDateInCalc.getTime()
  let weekDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 7))
  let currentWeekNumber = startWeekNumber + weekDiff + 1
  // console.log("当前是第" + currentWeekNumber + "周")

  /**
   * 周数循环器函数
   * @param {number} num - 输入循环次数
   * @returns {number} 返回根据当前周数计算的应该取第几次课的索引
   * @example
   * calculateWeekRemainder(3) // 如果当前周数是1，返回0；如果当前周数是2，返回1；如果当前周数是3，返回2；如果当前周数是4，返回0
   */
  let calculateWeekRemainder = (num) => {
    let remainder = currentWeekNumber % num
    return (remainder === 0 ? num : remainder) - 1
  }

  // console.log(calculateWeekRemainder(3))

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
  let daySchedule = scheduleInfo[WhichDay]
  // 2.计算时间样表选取
  let timetableRepeatability = daySchedule.timetableRepeatability
  // console.log("timetableRepeatability:", timetableRepeatability)
  let timetableId = daySchedule.timetableId
  let timetableIndex = calculateWeekRemainder(timetableRepeatability)
  let selectedTimetable = timetableId[timetableIndex]
  // console.log("当前周对应的timetable:", selectedTimetable)
  let timetableData = timetableInfo[selectedTimetable]
  // console.log("当前课程表信息:", timetableData)
  // 3.拼接信息
  let courseCounter = 0 // 课程计数器

  // 处理timetableData数组
  let processedData = timetableData.map((item) => {
    if (item.type === "course") {
      let courseItem = daySchedule.courseList[courseCounter] // 取出课程信息
      courseCounter++
      let courseId = courseItem.courseId
      let courseRepeatability = courseItem.courseRepeatability
      let finalCourseId = courseId[calculateWeekRemainder(courseRepeatability)]
      let courseData = coursesInfo[finalCourseId]
      // console.log("课程信息:", courseData)

      // 数据描述
      // let description;
      // if (item.timeHour <= 12) {
      //   description = `上午 · 第 ${courseCounter} 节课`;
      // } else if (item.timeHour < 18) {
      //   description = `下午 · 第 ${courseCounter} 节课`;
      // } else {
      //   description = `晚上 · 第 ${courseCounter} 节课`;
      // }
      let description = `第 ${courseCounter} 节课`

      // 计算时间范围
      let nextItem = timetableData[timetableData.indexOf(item) + 1]
      let timeRange = null
      if (nextItem && nextItem.timeHour !== undefined && nextItem.timeMinute !== undefined) {
        timeRange = `${item.timeHour}:${String(item.timeMinute).padStart(2, "0")} - ${
          nextItem.timeHour
        }:${String(nextItem.timeMinute).padStart(2, "0")}`
      }

      // 数据返回
      return {
        type: item.type,
        description,
        courseCounter: courseCounter,
        courseName: courseData.courseName,
        courseTeacher: courseData.teacher,
        courseRoom: courseData.classroom,
        timeHour: item.timeHour,
        timeMinute: item.timeMinute,
        timeRange
      }
    } else if (item.type === "rest") {
      let nextItem = timetableData[timetableData.indexOf(item) + 1]
      let timeRange = null
      if (nextItem && nextItem.timeHour !== undefined && nextItem.timeMinute !== undefined) {
        timeRange = `${item.timeHour}:${String(item.timeMinute).padStart(2, "0")} - ${
          nextItem.timeHour
        }:${String(nextItem.timeMinute).padStart(2, "0")}`
      }

      // 数据返回
      return {
        type: item.type,
        courseName: "休息中",
        timeHour: item.timeHour,
        timeMinute: item.timeMinute,
        timeRange
      }
    } else if (item.type === "interval") {
      let nextItem = timetableData[timetableData.indexOf(item) + 1]
      let timeRange = null
      if (nextItem && nextItem.timeHour !== undefined && nextItem.timeMinute !== undefined) {
        timeRange = `${item.timeHour}:${String(item.timeMinute).padStart(2, "0")} - ${
          nextItem.timeHour
        }:${String(nextItem.timeMinute).padStart(2, "0")}`
      }

      // 数据返回
      return {
        type: item.type,
        courseName: "课间休息",
        timeHour: item.timeHour,
        timeMinute: item.timeMinute,
        timeRange
      }
    } else if (item.type === "end") {
      // 数据返回
      return {
        type: item.type,
        courseName: "今日课程结束",
        courseTeacher: "",
        courseRoom: "",
        timeHour: item.timeHour,
        timeMinute: item.timeMinute,
        timeRange: ""
      },{
        type: item.type,
        courseName: "明天见",
        courseTeacher: "",
        courseRoom: "",
        timeHour: item.timeHour,
        timeMinute: item.timeMinute,
        timeRange: ""
      }
    } else if (item.type === "start") {
      // 数据返回
      return {
        type: item.type,
        courseName: "今日课程还没开始噢",
        courseTeacher: "",
        courseRoom: "",
        timeHour: item.timeHour,
        timeMinute: item.timeMinute,
        timeRange: ""
      }
    }
  })
  // console.log("处理后的timetableData:", processedData)
  return processedData
}

function getWeekNumber() {
  let basicInfo = courseDataReader.getBasicInfo()
  /**
   * 周数计算
   */
  // 1.解析日期格式
  let parseDate = (dateStr) => {
    let year = "20" + dateStr.substring(0, 2)
    let month = dateStr.substring(2, 4)
    let day = dateStr.substring(4, 6)
    return `${year}-${month}-${day}`
  }

  // 2.转换courseStart格式
  let formattedStartDate = parseDate(basicInfo.courseStart)

  // 3.计算开学日是星期几 (0-6, 0表示周日)
  let startDate = new Date(formattedStartDate)
  let startDayOfWeek = startDate.getDay()

  // 4.计算下一个周一的具体日期
  let nextMonday = new Date(startDate)
  let daysUntilMonday = (7 - startDayOfWeek + 1) % 7
  nextMonday.setDate(startDate.getDate() + daysUntilMonday)
  let nextMondayDate = `${nextMonday.getFullYear()}-${String(nextMonday.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(nextMonday.getDate()).padStart(2, "0")}`
  // console.log("下一个周一的日期是：" + nextMondayDate)

  // 5.初始化开学周数
  let startWeekNumber = 1

  // 6.计算当前周数
  let today = new Date()
  let nextMondayDateInCalc = new Date(nextMondayDate)
  let timeDiff = today.getTime() - nextMondayDateInCalc.getTime()
  let weekDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 7))
  let currentWeekNumber = startWeekNumber + weekDiff + 1
  // console.log("当前是第" + currentWeekNumber + "周")
  return "第" + currentWeekNumber + "周"
}

module.exports = {
  getCourseSchedule,
  getWeekNumber
}
