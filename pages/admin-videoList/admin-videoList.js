// pages/adminvideo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allchecked: false,
    videolist: [],
    count: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getvideolist()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  download() {
    for (let i = 0; i < this.data.count; i++) {
      console.log(this.data.videolist[i].checked)
      if (this.data.videolist[i].checked) {
        this.downloadfile(i);
      }
    }
  },
  downloadfile(index) {
    const that = this;
    wx.showLoading({
      title: '下载进度：0%',
      mask: true //是否显示透明蒙层，防止触摸穿透
    })
    const downloadTask = wx.cloud.downloadFile({
      fileID: that.data.videolist[index].videourl,
      // filePath:wx.env.USER_DATA_PATH+'/1.mp4',
      success: function (res) {
        wx.hideLoading();
        console.log("下载视频成功", res.tempFilePath) //成功后的回调函数
        let time = new Date().getTime();
        let filePath = wx.env.USER_DATA_PATH + '/' + time + '.mp4';
        console.log(filePath);
        wx.getFileSystemManager().saveFile({
          tempFilePath: res.tempFilePath,
          filePath: filePath,
          success(res) {
            console.log('保存视频成功', res.savedFilePath)
            wx.saveVideoToPhotosAlbum({ //保存到本地
              filePath: res.savedFilePath,
              success(res) {
                wx.showToast({
                  title: '保存成功',
                  icon: 'success',
                  duration: 2000
                })
              },
              fail: function (err) {
                console.log('保存失败', err);
                if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
                  wx.openSetting({
                    success(settingdata) {
                      console.log(settingdata)
                      if (settingdata.authSetting['scope.writePhotosAlbum']) {

                        console.log('获取权限成功，给出再次点击视频保存到相册的提示。');
                      } else {

                        console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                      }
                    }
                  })
                }
              }
            })

          },
          fail(err) {
            wx.hideLoading();
            console.log("保存失败", err)
          }
        })
      },
      fail(err) {
        wx.hideLoading();
        console.log('down fail', err)
      }
    });
    downloadTask.onProgressUpdate((res) => {
      wx.showLoading({
        title: '下载进度：' + res.progress + '%',
        mask: true //是否显示透明蒙层，防止触摸穿透
      })
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
    wx.cloud.callFunction({
      name: 'delvideo',
      data: {
        e
      },
      success(res) {
        console.log(res);
        that.getvideolist();
      },
      fail() {
        console.log("false")
      }
    })
  },
  changeall() {
    let allchecked = this.data.allchecked;
    console.log(allchecked)
    let temp = this.data.videolist;
    for (let i = 0; i < this.data.count; i++) {
      temp[i].checked = allchecked
    }
    this.setData({
      allchecked: allchecked,
      videolist: temp
    })
    // console.log(temp)
  },
  changeitem(e) {
    console.log(e.currentTarget.dataset.id._id);
    for (let i = 0; i < this.data.count; i++) {
      if (this.data.videolist[i]._id == e.currentTarget.dataset.id._id) {
        this.data.videolist[i].checked = !this.data.videolist[i].checked;
      }
    }
  },
  getvideolist() {
    const that = this;
    wx.cloud.callFunction({
      name: 'get_allvideo',
      success(res) {
        that.setData({
          count: res.result.count,
          videolist: res.result.data.data
        });
      },
      fail(res) {
        console.log('fail', res)
      }
    })
  }
})