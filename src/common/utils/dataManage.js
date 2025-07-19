/**
 * 数据管理工具，用于管理本地用户设置数据及课程数据
 */
import file from "@system.file"
let allData = "internal://files/data/"
let userSettingPath = "internal://files/data/userSetting.json"
let courseDataPath = "internal://files/data/courseData.json"

/**
 * 清空数据（用于测试）
 * @returns {boolean}
 */
function clearData() {
    file.delete({
        uri: userSettingPath,
        success: function (data) {
        },
        fail: function (data, code) {
        }
    })
    file.delete({
        uri: courseDataPath,
        success: function (data) {
        },
        fail: function (data, code) {
        }
    })
}


/**
 * 检测是否存在用户数据
 * @returns {boolean}
 */
function isDataExist() {
    file.access({
        uri: userSettingPath,
        success: function (data) {
            // console.log(`access success`)
            return true
        },
        fail: function (data, code) {
            console.log(`access fail, code = ${code}`)
            return false
        }
    })
}

/**
 * 对用户设置数据部分进行初始化
 * @returns {void}
 */
function initData() {
    file.writeText({
        uri: userSettingPath,
        text: JSON.stringify({
            "dataStructureVersion": "1.1",
            "createTime": "",
            "lastUpdateTime": "",
            "setting": {
                "themeName": "Horizon",
                "dynamicEffects": true,
            }
        }),
        success: function () {
            // console.log(`write success`)
        },
        fail: function (data, code) {
            console.log(`write fail, code = ${code}`)
        }
    })
}



/**
 * 获取用户设置 json
 * @returns {Object} 类似 JSON 的字典对象
 */
function getUserSetting() {
    return new Promise((resolve, reject) => {
        file.readText({
            uri: userSettingPath,
            success: function (data) {
                // console.log('text: ' + data.text)
                try {
                    resolve(JSON.parse(data.text));
                } catch (e) {
                    reject(new Error('JSON 解析失败: ' + e));
                }
            },
            fail: function (data, code) {
                console.log(`handling fail, code = ${code}`)
                reject(new Error(`读取文件失败，错误码: ${code}`));
            }
        })
    });
}


/**
 * 改变用户设置 json
 * @param {string} item 要修改的设置项
 * @param {any} value 要设置的值
 * @returns {void}
 */
function changeUserSetting(item, value) {
    file.readText({
        uri: userSettingPath,
        success: function (data) {
            // 获取完整的设置对象
            let settings = JSON.parse(data.text);
            // 修改指定项的值
            settings.setting[item] = value;
            // console.log(settings);
            file.writeText({
                uri: userSettingPath,
                text: JSON.stringify(settings),
                success: function () {
                    // console.log(`write success`)
                },
                fail: function (data, code) {
                    console.log(`write fail, code = ${code}`)
                }
            })
        },
        fail: function (data, code) {
            console.log(`handling fail, code = ${code}`)
        }
    })
}


/**
 * 获取课程数据 json
 * @returns {Object} 类似 JSON 的字典对象
 */
function getCourseData() {
    return new Promise((resolve, reject) => {
        file.readText({
            uri: courseDataPath,
            success: function (data) {
                // console.log('text: ' + data.text)
                try {
                    resolve(JSON.parse(data.text));
                } catch (e) {
                    reject(new Error('JSON 解析失败: ' + e));
                }
            },
            fail: function (data, code) {
                console.log(`handling fail, code = ${code}`)
                reject(new Error(`读取文件失败，错误码: ${code}`));
            }
        })
    });
}


/**
 * 改变课程数据 json
 * @param {string} type 数据类型，可以是"system"或"user"
 * @param {Object} [value={}] 当type为"user"时传入的课程数据对象
 * @returns {void}
 */
function changeCourseData(type, value = {}) { //之后要保留本地调课信息的替换（？）
    // console.log(JSON.stringify(require("../../common/data/courseData.json")))
    if (type === "system") {
        file.writeText({
            uri: courseDataPath,
            text: JSON.stringify(require("../../common/data/courseData.json")),
            success: function () {
                // console.log(`write success`)
            },
            fail: function (data, code) {
                console.log(`write fail, code = ${code}`)
            }
        })
    } else if (type === "user") {
        file.writeText({
            uri: courseDataPath,
            text: JSON.stringify(value.replace(/\n/g, '')),
            success: function () {
                // console.log(`write success`)
            },
            fail: function (data, code) {
                console.log(`write fail, code = ${code}`)
            }
        })
    }
}

module.exports = {
    isDataExist,
    initData,
    clearData,
    getUserSetting,
    changeUserSetting,
    getCourseData,
    changeCourseData
}