// pages/info/info.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'
Page({
    /**
     * 页面的初始数据
     */
    data: {
        message: false,
        openId: '',
        list: [],
        avatarUrl: defaultAvatarUrl,
    },

    onChooseAvatar(e) {
        const { avatarUrl } = e.detail 
        this.setData({
          avatarUrl,
        })
      },
    //修改个人信息界面
    modify_info: function () {
        wx.navigateTo({
            url: '../message/message',
        })
    },

    get_openid_wj() {
        wx.cloud.callFunction({
            name: 'get_openid_wj',
            data: {
                type: 'get_openid_wj'
            }
        }).then((resp) => {
            console.log("调用成功", resp)
            this.setData({
                openId: resp.result.openid
            })
        }).catch((e) => {
            console.log("调用失败")
        });
    },

    /** 
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.cloud.callFunction({
            name: 'get_openid_wj',
            data: {
                type: 'get_openid_wj'
            }
        }).then((resp) => {
            console.log("调用成功", resp)
            this.setData({
                openId: resp.result.openid
            })
            //进行数据库操作
            console.log("openid：", this.data.openId)
            const db = wx.cloud.database()
            db.collection('user')
                .where({
                    _openid: this.data.openId
                })
                .get()
                .then(res => {
                    console.log("ahahhahh" ,res)
                    this.setData({
                        list: res.data,
                        message: true
                    })
                    console.log(this.data.list)
                })
                .catch(err => {
                    console.log(err + "请求失败")
                })


        }).catch((e) => {
            console.log("调用失败")
        });
    },
    exit:function(e){
        wx.showModal({
          title: '提示',
          content: '是否确认退出',
          success: function (res) {
            if (res.confirm) {
              wx.removeStorageSync('student');
              //页面跳转
              wx.redirectTo({
                url: '../login/login',
              })
            } else if (res.cancel) {
            }
          }
        })
      },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        wx.cloud.callFunction({
            name: 'get_openid_wj',
            data: {
                type: 'get_openid_wj'
            }
        }).then((resp) => {
            console.log("调用成功")
            this.setData({
                openId: resp.result.openid
            })
            //进行数据库操作
            console.log("openid：", this.data.openId)
            const db = wx.cloud.database()
            db.collection('user')
                .where({
                    _openid: this.data.openId
                })
                .get()
                .then(res => {
                    this.setData({
                        list: res.data,
                        message: true
                    })
                    console.log(this.data.list)
                })
                .catch(err => {
                    console.log(err + "请求失败")
                })


        }).catch((e) => {
            console.log("调用失败")
        });
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})