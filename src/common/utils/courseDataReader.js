/**
 * 课程数据读取工具
 */
import dataManage from './dataManage'
// dataManage.changeCourseData("system")

/**
 * 读取课程基本信息
 * @returns {Object} 包含课程基本信息的对象
 */
function getBasicInfo() {
  return new Promise((resolve, reject) => {
    try {
      dataManage.getCourseData().then(courseData => {
        resolve(JSON.parse(courseData).basic)
      }).catch(error => {
        console.error("读取课程基本信息失败:", error)
        reject(null)
      })
    } catch (error) {
      console.error("读取课程基本信息失败:", error)
      reject(null)
    }
  })
}

/**
 * 获取所有课程信息
 * @returns {Array} 课程信息数组
 */
function getCoursesInfo() {
  return new Promise((resolve, reject) => {
    try {
      dataManage.getCourseData().then(courseData => {
        resolve(JSON.parse(courseData).courses)
      }).catch(error => {
        console.error("读取课程信息失败:", error)
        reject(null)
      })
    } catch (error) {
      console.error("读取课程信息失败:", error)
      reject(null)
    }
  })
}

/**
 * 获取时间表模板信息
 * @returns {Array} 时间表模板数组
 */
function getTimetableTemplateInfo() {
  return new Promise((resolve, reject) => {
    try {
      dataManage.getCourseData().then(courseData => {
        resolve(JSON.parse(courseData).timetableTemplate)
      }).catch(error => {
        console.error("读取时间表模板信息失败:", error)
        reject(null)
      })
    } catch (error) {
      console.error("读取时间表模板信息失败:", error)
      reject(null)
    }
  })
}

/**
 * 获取课程次序信息
 * @returns {Array} 课程次序数组
 */
function getCourseScheduleInfo() {
  return new Promise((resolve, reject) => {
    try {
      dataManage.getCourseData().then(courseData => {
        resolve(JSON.parse(courseData).courseSchedule)
      }).catch(error => {
        console.error("读取课程次序信息失败:", error)
        reject(null)
      })
    } catch (error) {
      console.error("读取课程次序信息失败:", error)
      reject(null)
    }
  })
}

module.exports = {
  getBasicInfo,
  getCoursesInfo,
  getTimetableTemplateInfo,
  getCourseScheduleInfo
}
