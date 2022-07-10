var appInstance = getApp()
// console.log("werweadsfargfavadfv",appInstance.globalData) 
let menuButtonObject = wx.getMenuButtonBoundingClientRect()
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
    data: {
        // 头像
        avatarUrl: defaultAvatarUrl,
        //
        videolist: [],
        // 
        list: [],
        // 
        info: false,
        videoinfo: false,

        // 下拉菜单的数据
        tabType: 'tab1',
        key: 'tab1',
        conditionList: [{
                title: '修改您的信息',
                id: '1'
            },
            {
                title: '管理员登陆',
                id: '2'
            },
            {
                title: '联系我们',
                id: '3'
            },

        ],

        choosedCondition: {
            title: '选项1',
            id: '1'
        },
        conditionVisible: false,

        // 胶囊的数据
        navHeight: '',
        top: '',
        nav: '',

        show: [{
                image: "图片11111111地址",
                name: "图片111文字描述"
            },
            {
                image: "图片1地址",
                name: "图片1文字描述"
            },
            {
                image: "图片2地址",
                name: "图片2文字描述"
            },
            {
                image: "图片3地址",
                name: "图片3文字描述"
            },

        ]
    },

    // ----
    //完善个人信息界面
    upInfo: function () {
        wx.navigateTo({
            url: '../message/message',
        })
    },
    // 是否展开列表
    showCondition() {
        console.log("展开展开")
        this.setData({
            conditionVisible: !this.data.conditionVisible
        })
    },
    // 根据查询项跳转
    onChnageCondition(e) {
        // console.log("currentTarget.dataset.id::",e.currentTarget.dataset)

        if (e.currentTarget.dataset.id === "1") {
            wx.redirectTo({
                url: '../modify-userInfo/modify-userInfo',
            })
        } else if (e.currentTarget.dataset.id === "2") {
            wx.redirectTo({
                url: '../login/login'
            })
        } else if (e.currentTarget.dataset.id === "3") {
            wx.redirectTo({
                // 界面也没写
                url: '../about/about'
            })
        }
    },
    // ----

    // 上传视频
    gotoUpdate: function () {
        // 跳转至index页面
        wx.redirectTo({
            url: '../uploadVideo/uploadVideo'
        })
    },
    exit: function (e) {
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
                } else if (res.cancel) {}
            }
        })
    },
    onLoad: function () {


        this.setData({
            navHeight: appInstance.globalData.navHeight,
            nav: appInstance.globalData.nav,
            top: menuButtonObject.top
        })
        console.log("this.data:", this.data)

        // 数据库，用户信息
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
                    console.log("ahahhahh", res)
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

    onChooseAvatar(e) {
        const {
            avatarUrl
        } = e.detail
        this.setData({
            avatarUrl,
        })
    },
    onShow() {
        this.getvideolist();
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