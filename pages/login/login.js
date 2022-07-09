// pages/login/login.js
Page({
    data: {
        account: '',
        password: '',
        name: '',
        openId: '',
        db_account: '',
        db_password: '',
    },
  /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.get_admin_info()
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

    },
    // 获取输入账号 
    phoneInput: function (e) {
        this.setData({
            account: e.detail.value
        })
    },

    // 获取输入密码 
    passwordInput: function (e) {
        this.setData({
            password: e.detail.value
        })
    },

    
    get_admin_info: function() {
        wx.cloud.callFunction({
            name: 'get_admin_info_wj',
            data: {
                type: 'get_info_admin_wj'
            }
        }).then(resp => {
            this.setData({
                openId: resp.result.openid,
                name: resp.result.dbResult.data[0].name,
                db_account: resp.result.dbResult.data[0].account,
                db_password: resp.result.dbResult.data[0].password,
            })
        }).catch((e) => {
            console.log("调用失败", e)
        });
    },

    // 登录 
    login: function () {
        console.log(this.data)

        if (this.data.account.length == 0 || this.data.password.length == 0) {
            wx.showToast({
                title: '账号或密码不能为空',
                icon: 'none',
                duration: 2000
            })
        } else if (this.data.account == this.data.db_account && this.data.password == this.data.db_password) {
            // 这里修改成跳转的页面 
            wx.showToast({
                title: '登录成功',
                icon: 'success',
                duration: 2000
            })
            // 跳转至index页面
            wx.redirectTo({
                url: '../port/port'
            })
        } else {
            console.log("密码错误", this.data)
            wx.showToast({
                title: '账号或密码错误',
                icon: 'error',
                duration: 2000
            })
        }
    },
    //游客登陆
    loginAsTourist: function () {
        // // 跳转至index页面
        // wx.switchTab({
        //   url: '../index/index'
        // })
        wx.cloud.callFunction({
            name: 'get_openid_wj',
            data: {
                type: 'get_openid_wj'
            }
        }).then((resp) => {
            this.setData({
                openId: resp.result.openid
            })
            // console.log(resp.result.openid)
            // console.log(this.data.openId)

            const db = wx.cloud.database()
            db.collection('user').where({
                _openid: this.data.openId
            }).get().then(res => {
                console.log("res:",res)
                if (res.data.length != 0) {
                    wx.switchTab({
                        url: '../index/index'
                    });
                } else {
                    db.collection('user').add({
                            data: {
                                createdate: this.data.date,
                                name: "无",
                                gender: "无",
                                grade: "无",
                                phone: "无",
                                // _openid: this.data.openId
                            }
                        })
                        .then((res) => { //连接数据库操作完成之后
                            //如果成功，则返回
                            if (res.errMsg == "collection.add:ok") {
                                wx.switchTab({
                                    url: '../index/index'
                                });
                            } else {
                                wx.showModal({
                                    title: "提示",
                                    content: res.result.errorMessage,
                                    success: function () {
                                        wx.navigateBack({
                                            delta: 1,
                                        });
                                    },
                                });
                            }
                        })
                }
            })
        })
    },
    wx_login: function () {
        wx.getUserProfile({
            desc: '获取用户的信息', //获取用户的信息
            success: res => { //用户成功授权
                this.setData({
                    nickName: res.userInfo.nickName,
                    touxian: res.userInfo.avatarUrl
                })
                wx.showToast({
                    title: '登录成功',
                    icon: 'success',
                    duration: 2000
                })
                // 跳转至index页面
                wx.redirectTo({
                    url: '../index/index'
                })
            },
            fail: res => {
                wx.showToast({
                    title: '登录失败',
                    icon: 'error',
                    duration: 2000
                })
            }
        })
    }
})