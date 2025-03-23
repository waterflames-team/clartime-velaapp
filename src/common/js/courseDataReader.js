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
 * 获取课程表信息
 * @returns {Array} 课程表数组
 */
function getTimetableInfo() {
  try {
    var courseData = require("../../common/data/courseData.json")
    return courseData.timetable
  } catch (error) {
    console.error("读取课程表信息失败:", error)
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

module.exports = {
  getBasicInfo,
  getTimetableInfo,
  getCoursesInfo
}
