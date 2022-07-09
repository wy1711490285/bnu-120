// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:'cloud1-0g7v81g06ea4ad6b'
})

// 云函数入口函数
exports.main = async (event, context) => {
  let e = event.e;
  let state = false;
  cloud.database().collection('video').doc(e.currentTarget.dataset.id._id).remove({
    success(res) {
      console.log("del success")
    },
    fail(res){
        console.log("del fail",res)
    }
  });
  cloud.deleteFile({
      fileList: [e.currentTarget.dataset.id.videourl],
    }).then(res => {
      console.log("del file success");
      state=true;
    }).catch(err => {
      console.error("del file fail",res);
    });
   
    return {
      state
    }
}