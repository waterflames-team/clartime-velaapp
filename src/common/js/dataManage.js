/**
 * 数据管理工具，用于管理本地用户设置数据及课程数据
 */
import file from "@system.file"
const userSettingPath = "internal://files/data/userSetting.json"
/**
 * 对用户设置数据部分进行初始化
 * @returns {void}
 */
function initData() {
    
    // console.log(`init data`)

    // file.delete({
    //     uri: userSettingPath,
    //     success: function(data) {
    //         console.log('handling success')
    //     },
    //     fail: function(data, code) {
    //         console.log(`handling fail, code = ${code}`)
    //     }
    // })

    
    file.access({
        uri: userSettingPath,
        success: function (data) {
            // console.log(`init data already！`)
        },
        fail: function (data, code) {
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
    })

    // 之后初始化工具需要在这里走一些数据
}

/**
 * 获取用户设置 json
 * @returns {Object} 类似 JSON 的字典对象
 */
function getUserSetting() {
    return new Promise((resolve, reject) => {
        file.readText({
            uri: userSettingPath,
            success: function(data) {
                // console.log('text: ' + data.text)
                try {
                    resolve(JSON.parse(data.text));
                } catch (e) {
                    reject(new Error('JSON 解析失败: ' + e));
                }
            },
            fail: function(data, code) {
                console.log(`handling fail, code = ${code}`)
                reject(new Error(`读取文件失败，错误码: ${code}`));
            }
        })
    });
}


module.exports = {
  initData,
  getUserSetting
}