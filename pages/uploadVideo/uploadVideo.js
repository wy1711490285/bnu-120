// pages/index2/index2.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        openid: '',
        tempFilePath: '',
        fileID: "",
        makesure: false, //是否上传完成
        notmakesure: true,
        clickFlag: true, //防重复点击 
        name: '', //视频上传的名字
        num: 0, //账号下已经上传视频数量
        videolist: [],
        text: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let createtime = new Date()
        createtime = createtime.toLocaleString()
        console.log(createtime)
        wx.cloud.callFunction({
            name: 'get_openid_wj',
            success: res => {
                this.setData({
                    openid: res.result.openid,
                })
            },
            fail: res => {

            }
        })
        //this.getvideolist()
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },
    /**
     * 拍摄或选择视频并上传服务器
     */
    chooseVideo: function () {
        console.log("chooseVideo")
        this.setData({
            clickFlag: false
        })

        let that = this
        //1.拍摄视频或从手机相册中选择视频
        wx.chooseVideo({
            sourceType: ['album', 'camera'], // album 从相册选视频，camera 使用相机拍摄
            maxDuration: 60, // 拍摄视频最长拍摄时间，单位秒。最长支持60秒
            camera: 'back', //默认拉起的是前置或者后置摄像头，默认back
            compressed: false, //是否压缩所选择的视频文件
            success: function (res) {
                //console.log(res)
                // let tempFilePath = res.tempFilePath
                that.setData({
                    tempFilePath: res.tempFilePath
                })
                if (that.data.name == '') {
                    let path = res.tempFilePath
                    path = path.replace('.mp4', '')
                    path = path.replace('http://tmp/', '')
                    path = path.substring(0, 5)
                    console.log(path)
                    that.setData({
                        name: path
                    })
                }
                //选择定视频的临时文件路径（本地路径）
                let duration = res.duration //选定视频的时间长度
                let size = parseFloat(res.size / 1024 / 1024).toFixed(1) //选定视频的数据量大小
                // let height = res.height //返回选定视频的高度
                // let width = res.width //返回选中视频的宽度
                that.data.duration = duration
                if (parseFloat(size) > 100) {
                    that.setData({
                        clickFlag: true,
                        duration: ''
                    })
                    let beyondSize = parseFloat(size) - 100
                    wx.showToast({
                        title: '上传的视频大小超限，超出' + beyondSize + 'MB,请重新上传',
                        //image: '',//自定义图标的本地路径，image的优先级高于icon
                        icon: 'none'
                    })
                } else {
                    that.setData({
                        makesure: true,
                        notmakesure: false
                    })

                }
            },
            fail: function () {
                // fail
                that.setData({
                    clickFlag: true,
                    duration: ''
                })
            },
            complete: function () {
                // complete
                that.setData({
                    clickFlag: true,
                    duration: ''
                })
            }
        })
    },
    /**
     * 将本地资源上传到服务器
     * 
     */
    uploadFile: function (tempFilePath) {
        const that = this
        let third_session = wx.getStorageSync('third_session')
        wx.showLoading({
            title: '上传进度：0%',
            mask: true //是否显示透明蒙层，防止触摸穿透
        })
        const uploadTask = wx.cloud.uploadFile({
            filePath: tempFilePath, //要上传文件资源的路径（本地路径）
            cloudPath: that.data.name, //云存储的视频名称
            success: function (res) {
                //res
                // errMsg: "cloud.uploadFile:ok"
                // fileID: "cloud://cloud1-0g7v81g06ea4ad6b.636c-cloud1-0g7v81g06ea4ad6b-1312642793/video1"
                // statusCode: 204
                console.log("uploadFile", res)
                // success
                if (res.statusCode == 204) {
                    wx.hideLoading()
                    that.setData({
                        fileID: res.fileID,
                        clickFlag: true
                    })
                    //上传信息保存到数据库
                    let num = that.data.num + 1
                    let createtime = new Date()
                    createtime = createtime.toLocaleString()
                    console.log(createtime)
                    wx.cloud.database().collection('video').add({
                        data: {
                            name: that.data.name,
                            videourl: that.data.fileID,
                            num: num,
                            createtime: createtime,
                            text: that.data.text
                        }
                    }).then(
                        res => {
                            console.log('成功保存到数据库')
                            that.setData({
                                name: '',
                                text: '',
                                notmakesure: true
                            })
                            // that.getvideolist()
                            wx.showToast({
                                title: '上传成功',
                                icon: 'success'
                            })
                            setTimeout(() => {
                                wx.switchTab({
                                    url: '/pages/index/index',
                                })
                            }, 1000)
                        }
                    ).catch(
                        res => {
                            console.log('没有保存到数据库')
                            console.log(res)
                            wx.showToast({
                                title: '上传失败',
                                icon: 'none'
                            })
                        }
                    )
                } else {
                    that.setData({
                        fileID: '',
                        clickFlag: true
                    })
                    wx.showToast({
                        title: '上传失败',
                        icon: 'none'
                    })
                }

            },
            fail: function () {
                // fail
                wx.hideLoading()
                that.setData({
                    videoUrl: '',
                    poster: '',
                    duration: '',
                    clickFlag: true
                })
                wx.showToast({
                    title: '上传失败',
                    icon: 'none'
                })
            }
        })
        //监听上传进度变化事件
        uploadTask.onProgressUpdate((res) => {
            wx.showLoading({
                title: '上传进度：' + res.progress + '%',
                mask: true //是否显示透明蒙层，防止触摸穿透
            })
        })
    },
    //点击保存
    saveVideo() {
        //调用服务器保存视频信息接口
        if (this.data.makesure) {
            this.uploadFile(this.data.tempFilePath)

        } else {
            wx.showToast({
                title: '请上传视频',
                icon: 'error',
                mask: true
            })
        }

    },
    getvideolist() {
        // wx.cloud.callFunction({
        //     name: 'get_openid_wj',
        //     success: res => {
        //         this.setData({
        //             openid: res.result.openid,
        //         })
        //     },
        //     fail: res => {

        //     }
        // })
        wx.cloud.database().collection('video').where({
            _openid: this.data.openid
        }).get().then(res => {
            console.log('success', this.data.openid)
            console.log(res)
            this.setData({
                num: res.data[res.data.length - 1].num,
                videolist: res.data
            })
            console.log(this.data.num)

        }).catch(res => {
            console.log('fail')
            console.log(res)
        })
    },
    nameinput: () => {

    }
})