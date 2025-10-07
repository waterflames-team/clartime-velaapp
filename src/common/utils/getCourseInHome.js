import timeUpdate from './timeUpdate'
import courseDataParse from './courseDataParse'

async function getCourses(dayNum) {
    let dayMap = {
        周一: "Mon",
        周二: "Tue",
        周三: "Wed",
        周四: "Thu",
        周五: "Fri",
        周六: "Sat",
        周日: "Sun"
    }
    let whichDay = dayMap[dayNum]
    return await courseDataParse.getCourseSchedule(whichDay)
    
    // console.log("首页课程数据表")
    // console.log(this.courseSchedule)
}

function getCurrentCourseIndex(courseSchedule) {
    //寻找最近项目的索引

    const currentTime = timeUpdate.updateTime()
    const currentHours = currentTime.hours
    const currentMinutes = currentTime.minutes

    // 如果当前时间小于第一节课时间，返回0
    if (
        courseSchedule.length > 0 &&
        (currentHours < courseSchedule[1].timeHour ||
            (currentHours === courseSchedule[1].timeHour &&
                currentMinutes < courseSchedule[1].timeMinute))
    ) {
        return 0
    }

    // 正常课程定位判断
    for (let i = 0; i < courseSchedule.length - 1; i++) {
        const currentItem = courseSchedule[i]
        const nextItem = courseSchedule[i + 1]

        if (
            (currentHours > currentItem.timeHour ||
                (currentHours === currentItem.timeHour && currentMinutes >= currentItem.timeMinute)) &&
            (currentHours < nextItem.timeHour ||
                (currentHours === nextItem.timeHour && currentMinutes < nextItem.timeMinute))
        ) {
            return i
        }
    }

    // 无法判断就返回最后一个
    return courseSchedule.length - 1
}

function getRemainingTime(courseSchedule) {
    // 取元列表

    const currentIndex = this.getCurrentCourseIndex()
    if (currentIndex === this.courseSchedule.length) {
        return "---"
    }

    const nextCourse = this.courseSchedule[currentIndex + 1]
    const thisCourse = this.courseSchedule[currentIndex]
    const currentTime = this.$app.$def.timeUpdate.updateTime()

    // 提前判断结束或无课，以防止下一项无法取到导致的出错，这个主题好像不影响
    if (thisCourse === -1) {
        return "---"
    }

    if (thisCourse.type === "end") {
        return "---"
    }

    // 计算分钟差
    const currentTotalMinutes = String(Number(currentTime.hours) * 60 + Number(currentTime.minutes))
    const nextCourseTotalMinutes = String(
        Number(nextCourse.timeHour) * 60 + Number(nextCourse.timeMinute)
    )
    const remainingMinutes = nextCourseTotalMinutes - currentTotalMinutes

    if (thisCourse.type === "course") {
        return remainingMinutes + "'"
    } else if (
        thisCourse.type === "interval" ||
        thisCourse.type === "rest" ||
        thisCourse.type === "start"
    ) {
        return remainingMinutes + "'"
    }

    return remainingMinutes
}

async function courseRelatedUpadate() {
    // console.log("课程更新1")
    await this.getCourses()
    // console.log("课程更新2")
    this.weekNum = await this.$app.$def.courseDataParse.getWeekNumber()
    this.remain = this.getRemainingTime()
    this.autoDistance = String(Number(this.getCurrentCourseIndex()) * 308) + "px"
    this.indexNow = this.getCurrentCourseIndex()
}



module.exports = {
    getCourses,
    getCurrentCourseIndex,
    getRemainingTime,
    courseRelatedUpadate
}