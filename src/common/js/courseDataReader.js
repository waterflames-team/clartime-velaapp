/**
 * 课程数据读取工具
 */

/**
 * 读取课程基本信息
 * @returns {Object} 包含课程基本信息的对象
 */
function getBasicInfo() {
  try {
    var courseData = require("../../common/data/courseData.json")
    return courseData.basic
  } catch (error) {
    console.error("读取课程基本信息失败:", error)
    return null
  }
}

/**
 * 获取所有课程信息
 * @returns {Array} 课程信息数组
 */
function getCoursesInfo() {
  try {
    var courseData = require("../../common/data/courseData.json")
    return courseData.courses
  } catch (error) {
    console.error("读取课程信息失败:", error)
    return null
  }
}

/**
 * 获取时间表模板信息
 * @returns {Array} 时间表模板数组
 */
function getTimetableTemplateInfo() {
  try {
    var courseData = require("../../common/data/courseData.json")
    return courseData.timetableTemplate
  } catch (error) {
    console.error("读取时间表模板信息失败:", error)
    return null
  }
}

/**
 * 获取课程次序信息
 * @returns {Array} 课程次序数组
 */
function getCourseScheduleInfo() {
  try {
    var courseData = require("../../common/data/courseData.json")
    return courseData.courseSchedule
  } catch (error) {
    console.error("读取课程次序信息失败:", error)
    return null
  }
}

module.exports = {
  getBasicInfo,
  getCoursesInfo,
  getTimetableTemplateInfo,
  getCourseScheduleInfo
}
