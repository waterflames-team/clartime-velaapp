// 导入系统互联模块
import interconnect from "@system.interconnect";

/**
 * 互联通信基础类
 * 提供基本的消息收发和事件监听功能
 */
export default class interconn{
    // 回调函数集合，按tag分类
    callbacks = {};
    // 事件监听器数组
    eventListeners = [];
    
    constructor() {
        // 获取互联实例
        this.conn = interconnect.instance();
        
        // 消息接收处理
        this.conn.onmessage = ({data}) => {
            // 解析消息数据
            const { tag, ...playload } = JSON.parse(data);
            // 调用对应tag的回调函数
            this.callbacks[tag](playload);
        }
    }
    /**
     * 添加消息监听器
     * @param {string} tag 消息标签
     * @param {Function} callback 回调函数
     */
    addListener(tag, callback) {
        this.callbacks[tag] = callback;
    }
    
    /**
     * 移除消息监听器
     * @param {string} tag 要移除的消息标签
     */
    removeListener(tag) {
        delete this.callbacks[tag];
    }
    
    /**
     * 发送消息
     * @param {string} tag 消息标签
     * @param {any} playload 消息内容
     * @return {Promise} 返回发送结果的Promise
     */
    send(tag, playload) {
        // 格式化消息数据
        const data = typeof playload === 'object' ? { ...playload, tag } : { msg: playload, tag }
        return new Promise((resolve, reject) => {
            this.conn.send({
                data, success: resolve, fail: reject
            });
        })
    }
}
export class interconnModule{
    static "__interconnModule__" = true;
}