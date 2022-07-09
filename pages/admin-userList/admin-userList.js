// pages/admin-userList/admin-userList.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userList: [],
    },
    modifyInfo: function (e) {
        wx.navigateTo({
            url: '../modify-userInfo/modify-userInfo?modifyID=' + e.currentTarget.dataset.id._id,
        })
    },

    del(e) {
        const that = this;
        wx.showModal({
            title: '提示',
            content: '确认删除？',
            confirmColor: '#FF0000',
            success(res) {
                if (res.confirm) {
                    that.delUser(e)
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    delUser(e) {
        console.log(e)
        const that = this;
        wx.cloud.callFunction({
            name: 'delete_user_wj',
            data: {
                e
            },
            success(res) {
                console.log(res);
                // this.getUserList()
                // wx.redirectTo({
                //   url: '../admin-userList/admin-userList',
                // })
                wx.navigateBack({
                    delta: 1,
                });
            },
            fail(e) {
                console.log(e, "false")
            }
        })

    },
    getUserList() {
        wx.cloud.callFunction({
            name: 'get_user_info_wj',
            data: {
                type: 'get_user_info_wj'
            }
        }).then(resp => {
            this.setData({
                userList: resp.result.dbResult.data
            })
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getUserList()
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
        this.getUserList()
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