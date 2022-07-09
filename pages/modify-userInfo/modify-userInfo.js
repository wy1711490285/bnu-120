// pages/modify-userInfo/modify-userInfo.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        date: "",
        loading: false,
        infop: "您的信息",
        modifyID: ''
    },

    //上传到数据库
    submit: function (e) {
        //如果缺少信息：
        if (this.data.loading) {
            return;
        }
        let u = e.detail.value;
        if (!u.name) {
            wx.showToast({
                title: "请输入姓名",
                icon: "error",
            });
            return;
        }
        if (!u.gender) {
            wx.showToast({
                title: "请选择性别",
                icon: "error",
            });
            return;
        }
        if (!u.grade) {
            wx.showToast({
                title: "请选择年级",
                icon: "error",
            });
            return;
        }
        if (!u.phone) {
            wx.showToast({
                title: "请输入联系方式",
                icon: "error",
            });
            return;
        }
        //
        this.setData({
            loading: true,
        });
        wx.showLoading({});

        wx.cloud.callFunction({
                name: 'update_userInfo_for_id_wj',
                data: {
                    id: this.data.modifyID,
                    createdate: this.data.date,
                    name: u.name,
                    gender: u.gender,
                    grade: u.grade,
                    phone: u.phone,
                    // _openid: e.openid
                }
            })
            .then(res => {
                console.log("调用成功！", res)
                wx.hideLoading()
                //对界面进行操作
                this.setData({
                    loading: false
                });
                wx.hideLoading();
                wx.redirectTo({
                    url: "../admin-userList/admin-userList",
                });
            })
            .catch(res => {
                console.log("调用失败！！！！", res)
                wx.hideLoading();
                wx.showModal({
                    title: "提示",
                    content: "修改失败",
                    success: function () {
                        wx.navigateBack({
                            delta: 1,
                        });
                    },
                });
            })
    },
    //修改日期，调出日期列表
    dateChange: function (e) {
        this.setData({
            date: e.detail.value,
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            modifyID: options.modifyID
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