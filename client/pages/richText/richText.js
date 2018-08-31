var config = require('../../config')
var util = require('../../utils/util.js')

const getAauthorize = function (scope, callback) {
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
                    wx.openSetting()
                  } catch (err) {
                    // 下面只进行简单处理，后面可以在这里弹出一个说明页面教导用户如何手动前往设置页面设置
                    wx.showToast({
                      title: "无法打开设置页面，请手动前往当前小程序设置里打开相应权限",
                      icon: "none",
                      duration: 2000,
                    })
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

const doUpload = function (filePath, callback) {
  var that = this
  wx.uploadFile({
    url: config.service.uploadUrl,
    filePath: filePath,
    name: 'file',

    success: function (res) {
      var data = JSON.parse(res.data)
      if(data.code === 0) {
        callback(data.data)
      }else {
        util.showModel('上传图片失败')
      }
    },

    fail: function (e) {
      util.showModel('上传图片失败')
    }
  })
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nodes: [{
      name: 'p',
      attrs: {
        class: 'text',
      },
      children: [{
        type: 'text',
        text: 'Hello&nbsp;World!'
      }]
    },
    {
      name: 'p',
      attrs: {
        class: 'text',
      },
      children: [{
        type: 'text',
        text: 'Hello&nbsp;World!'
      }]
    }],
    nodesJson: ""
  },

  addImage() {
    // https://u2ce2sbm.qcloud.la/1533966637628_1533966637065-CdMDQPhaC.png
    var that = this
    function chooseImg() {
      wx.chooseImage({
        count: 1,
        success: function (res) {
          // var nodes = that.data.nodes;
          // nodes.push({
          //   name: 'img',
          //   attrs: {
          //     src: res.tempFilePaths[0],
          //     width: '100%'
          //   }
          // })
          // that.setData({
          //   nodes: nodes,
          //   nodesJson: JSON.stringify(nodes)
          // })
          
          doUpload(res.tempFilePaths[0], (data)=> {
            var nodes = that.data.nodes;
            nodes.push({
              name: 'img',
              attrs: {
                src: data.imgUrl,
                width: '100%'
              }
            })
            that.setData({
              nodes: nodes
            })
          })
          
        },
        fail: function () {
          wx.showToast({
            icon: "none",
            title: "选取图片失败，请重新选取"
          })
        }
      })
    }

    getAauthorize('scope.camera', chooseImg)
  },
  tap(res) {
    console.log(res)
  }
})