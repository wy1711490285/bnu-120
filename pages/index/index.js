Page({
    data: {
        openid: '',
        videolist: [],
        ti: true
    },

    zhengshu: function () {
        wx.navigateTo({
            url: '../Certificate/Certificate',
        })
    },

    onload() {
        wx.cloud.callFunction({
            name: 'get_openid_wj',
            success: (res) => {
                this.setData({
                    openid: res.result.openid
                })
            },
            fail: (res) => {
                console.log("onload fail")
            }
        });

    },
    onShow() {
        this.getvideolist();
    },
    onHide() {
        this.setData({
            ti: false
        })
    },
    getvideolist() {
        const that = this
        wx.cloud.database().collection('video').where({
            _openid: that.data.openid
        }).get().then(res => {
            that.setData({
                videolist: res.data
            })
            console.log(res)
        }).catch(res => {
            console.log('fail')
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
                    that.delvideo(e)
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    delvideo(e) {
        const that = this;
        wx.cloud.deleteFile({
            fileList: [e.currentTarget.dataset.id.videourl],
        }).then(res => {
            // console.log("del file success")
        }).catch(err => {
            console.error("del file fail")
        });
        wx.cloud.database().collection('video').doc(e.currentTarget.dataset.id._id).remove({
            success(res) {
                that.getvideolist()
            },
            fail(res) {
                console.log("del fail")
            }
        });

    }

})