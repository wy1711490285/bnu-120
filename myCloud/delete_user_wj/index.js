// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
    const e = event.e
    return cloud.database().collection("user").doc(e.currentTarget.dataset.id._id).remove()
}