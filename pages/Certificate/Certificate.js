// pages/Certificate/Certificate.js
Page({
 
    /**
     * 页面的初始数据
     */
    data: {
        //证书
        posterDatas: {
            width: 300, //画布宽度
            height: 300, //画布高度
            // 缓冲区，无需手动设定
            openId: '',
            cert_name: '',
            pic: null,
            buttonType: 1,
            show: false, // 显示隐藏证书弹窗
            success: false, // 是否成功生成过证书
            canvas: null, // 画布的节点
            ctx: null, // 画布的上下文
            dpr: 1, // 设备的像素比
        },
    },
   
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      var that = this;
      //生成证书初始化
      var posterDatas = that.data.posterDatas
      const query = wx.createSelectorQuery()
      query.select('#firstCanvas').fields({
          node: true,
          size: true
        },
        function (res) {
          const canvas = res.node
          const ctx = canvas.getContext('2d')
          const dpr = wx.getSystemInfoSync().pixelRatio
          canvas.width = posterDatas.width * dpr
          canvas.height = posterDatas.height * dpr
          ctx.scale(dpr, dpr)
          posterDatas.canvas = canvas
          posterDatas.ctx = ctx
          posterDatas.dpr = dpr
          //存储
          that.setData({
            posterDatas
          })
        }).exec()

        //获取证书需要的信息
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
                    posterDatas['cert_name'] = res.data[0].name 
                })
                .catch(err => {
                    //console.log("ddsds:",re)
                    console.log(err + "请求失败")
                })


        }).catch((e) => {
            console.log("调用失败")
        });

    },
   
    //证书生成
    //画布 生成 证书[证书]
    onBuildPosterSaveAlbum: function () {
      var that = this;
      var posterDatas = that.data.posterDatas
      var canvas = posterDatas.canvas
      var ctx = posterDatas.ctx
      //已生成过证书的直接显示弹窗
      if (posterDatas.success) {
        posterDatas["show"] = true;
        that.setData({
          posterDatas
        })
        return;
      }
      posterDatas.show = true;
      that.setData({
        posterDatas
      })
      wx.showLoading({
        title: '证书生成中',
        mask: true
      });
      //证书
      var promise1 = new Promise(function (resolve, reject) {
        const photo = canvas.createImage();
        photo.src = "https://s3.bmp.ovh/imgs/2022/07/06/f9e91a32255b178f.jpg";
        photo.onload = (e) => {
          resolve(photo);
        }
      });
      var promise2 = new Promise(function (resolve, reject) {
        const photo = canvas.createImage();
        photo.src = "https://s3.bmp.ovh/imgs/2022/07/06/8aba11e4205ec9f0.png";
        photo.onload = (e) => {
          resolve(photo);
        }
      });
      //获取图片信息
      Promise.all(
        [promise1,promise2]
      ).then(res => {
        // 绘制白色背景
        // util.roundRect(ctx, 0, 0, posterDatas.width, posterDatas.height, 10);
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        //绘制[证书图片]
        ctx.drawImage(res[0], 0, 0, posterDatas.width, 300);
        ctx.drawImage(res[1], 95, 195, posterDatas.width/2.7, 70);
        //名称
        //底部说明
        ctx.font = "bold 15px Arial"; //字体大小
        ctx.fillStyle = "#000"; //字体颜色
        ctx.textAlign = "center"
        ctx.fillText('姓名:' + posterDatas.cert_name, 65, 140);
        ctx.fillText('感谢您在120周年校庆中作出的贡献！', 155, 170);
        //ctx.fillText('证书已生成', 155, 250);

        // 关闭loading
        wx.hideLoading();
        //显示证书
        posterDatas.success = true;
        that.setData({
          posterDatas
        })
      }).catch(err => {
        console.log(err)
        wx.hideLoading();
        wx.showToast({
          icon: 'none',
          title: '证书生成失败,请稍后再试.',
        })
      })
    },
   
     //画布 转 图片[证书]
     onCanvasBuildImges: function () {
      var that = this;
      var posterDatas = that.data.posterDatas;
      wx.canvasToTempFilePath({
        canvas: posterDatas.canvas,
        width: posterDatas.width,
        height: posterDatas.height,
        destWidth: posterDatas.width * 3,
        destHeight: posterDatas.height * 3,
        success: function success(res) {
          posterDatas["pic"] = res.tempFilePath;
          that.setData({
            posterDatas
          })
          that.onDownloadImges();
        },
        fail: function complete(e) {
          wx.hideLoading();
          wx.showToast({
            icon: 'none',
            title: 'sorry 保存失败,请稍后再试.',
          })
          return;
        }
      });
    },
   
    //下载图片[证书]
    onDownloadImges: function () {
      wx.showLoading({
        title: '保存中',
        mask: true
      });
      var that = this;
      var posterDatas = that.data.posterDatas;
      if (!posterDatas.pic) {
        that.onCanvasBuildImges();
        return;
      }
      //可写成函数调用 这里不做解释
      wx.saveImageToPhotosAlbum({
        filePath: posterDatas.pic,
        success(res) {
          wx.hideLoading();
          wx.showToast({
            icon: 'none',
            title: '已保存到相册',
          })
          posterDatas["buttonType"] = 2;
          that.setData({
            posterDatas
          })
        },
        fail: function (res) {
          wx.hideLoading();
          wx.showToast({
            icon: 'none',
            title: '无相册权限或取消保存',
          })
          posterDatas["buttonType"] = 3;
          that.setData({
            posterDatas
          })
          return;
        }
      })
    },
   
    //在打开授权设置页后回调
    onBindOpenSetting: function () {
      var that = this;
      var posterDatas = that.data.posterDatas;
      posterDatas["buttonType"] = 1;
      that.setData({
        posterDatas
      })
    },
   
    //隐藏证书[证书]
    onIsCanvas: function () {
      var that = this;
      var posterDatas = that.data.posterDatas;
      posterDatas["buttonType"] = 1;
      posterDatas["show"] = false;
      that.setData({
        posterDatas
      })
    },
   
    //自定义弹窗后禁止屏幕滚动（滚动穿透）[证书]
    preventTouchMove: function () {
      //在蒙层加上 catchtouchmove 事件
      //这里什么都不要放
    },
  })