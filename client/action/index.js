const config = require('../config');
const host = config.service.host;

// 检查是否已获取指定权限，如果是则调用回调函数，否则引导用户打开权限
exports.getAauthorize = function(scope, callback) {

  function failHandel() {
    // 下面只进行简单处理，后面可以在这里弹出一个说明页面教导用户如何手动前往设置页面设置
    wx.showToast({
      title: "无法打开设置页面，请手动前往当前小程序设置里打开相应权限",
      icon: "none",
      duration: 2000,
    })
  }

  wx.getSetting({
    success(res) {
      if (!res.authSetting[scope]) {
        wx.authorize({
          scope: scope,
          success() {
            callback()
          },
          fail() {
            wx.showModal({
              content: "此功能需开通相应权限 (" + scope + ")",
              confirmText: "打开设置",
              success: function (res) {
                if (res.confirm) {
                  try {
                    // 此接口在后面可能会被废弃，失败后会在 catch 里使用其他替代方案来处理
                    wx.openSetting({
                      success: (res)=>{
                        if (res.authSetting[scope]){
                          callback()
                        }else {
                          failHandel()
                        }
                      },
                      fail: ()=>{
                        failHandel()
                      }
                    })
                  }catch(err) {
                    failHandel()
                  }
                }
              }
            })
          }
        })
      } else {
        callback()
      }
    }
  })
}

// 将图片传给后台
exports.addPhotos = function (fils) {
  const promises = fils.map(function(item) {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: host + "/weapp/uploadImage",
        filePath: item,
        name: 'file',
        success: (res) => {
          if(res.statusCode === 200) {
            var res = JSON.parse(res.data);
            if (res.state && res.state.toString() == '1') {
              resolve(res.data);
            } else {
              reject(res.stateInfo ? res.stateInfo : res);
            }
          }else {
            reject("服务器异常");
          }
        },
        fail: () => {
          reject("网络异常");
        }
      });
    })
  })
  return Promise.all(promises);
}

// 加载图片列表
exports.downloudImages = function(imagesList) {
  const promises = imagesList.map(function (item) {
    return new Promise((resolve, reject) => {
      wx.downloadFile({
        url: item,
        success: function (res) {
          if (res.statusCode === 200) {
            resolve(res.tempFilePath)
          }
        },
        fail: () => {
          reject({
            message: "网络异常"
          });
        }
      })
    })
  })
  return Promise.all(promises);
}




