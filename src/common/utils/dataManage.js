/**
 * 数据管理工具，用于管理本地用户设置数据及课程数据
 */
import file from "@system.file"
const userSettingPath = "internal://files/data/userSetting.json"

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
                "themeName": "Nucleus",
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
 * 清空数据（用于测试）
 * @returns {boolean}
 */
function clearData() {
    file.delete({
        uri: userSettingPath,
        success: function(data) {
            return true
        },
        fail: function(data, code) {
            return false
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

function changeUserSetting(item, value) {
    file.readText({
        uri: userSettingPath,
        success: function(data) {
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
        fail: function(data, code) {
            console.log(`handling fail, code = ${code}`)
        }
    })
}

module.exports = {
    isDataExist,
    initData,
    clearData,
    getUserSetting,
    changeUserSetting
}