// app.js
App({
  // onLaunch() {
  //   // 展示本地存储能力
  //   const logs = wx.getStorageSync('logs') || []
  //   logs.unshift(Date.now())
  //   wx.setStorageSync('logs', logs)

  //   // 登录
  //   wx.login({
  //     success: res => {
  //       // 发送 res.code 到后台换取 openId, sessionKey, unionId
  //     }
  //   })
  // },
  // globalData: {
  //   userInfo: null
  // }
  onLaunch: function() {
    wx.cloud.init({
      env: "cloud1-0g7v81g06ea4ad6b"
    })
  }
})
