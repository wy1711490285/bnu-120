// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
    return cloud.database().collection("user").doc(event.id).update({
        data: {
            createdate: event.date,
            name: event.name,
            gender: event.gender,
            grade: event.grade,
            phone: event.phone,
            // _openid: event.openid
        }
    })
}