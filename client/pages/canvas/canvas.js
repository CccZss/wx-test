//index.js
var action = require('../../action/index')

// 获取图片大小
function getImageInfo(url) {
  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: url,
      success: function (res) {
        resolve(res)
      },
      fail: function (err) {
        reject(err)
      }
    })
  })
}

// 绘制背景图
function drawBackgroundImage(ctx, img, imageWidth, imageHeight, screenWidth, screenHeight, canvasWidth, canvasHeight) {

  // 图片按宽度设配canvas宽度，如果缩放后图片高度高于canvas高度，则 y 为截图图片时截取框需要向下偏移的高度（单位：图片像素）
  var y = (imageHeight - (canvasHeight / canvasWidth) * imageWidth) / 2

  /* 绘制背景图 
  * 截图框， 画布大小 (这里的大小只能使用 px，需要做处理)
  */
  ctx.drawImage(img, 0, y, imageWidth, (canvasHeight / canvasWidth) * imageWidth,
    0, 0, canvasWidth, canvasHeight);
}

// 裁剪圆形头像
function circleImg(ctx, img, x, y, r) {
  ctx.save();
  var d = 2 * r;
  var cx = x + r;
  var cy = y + r;
  ctx.arc(cx, cy, r, 0, 2 * Math.PI);
  ctx.clip();
  ctx.drawImage(img, x, y, d, d);

  ctx.lineWidth = 3
  ctx.setStrokeStyle('#dfdfdf')
  ctx.stroke()

  ctx.restore();
}

// 在某一区域填充文本
function drawFonts(ctx, info, width, x, y, lineHeight) {
  var result = [];
  while (info.length > 0) {
    var i = 0;
    while (ctx.measureText(info.slice(0, i)).width < width && i < info.length) {
      i++;
    }
    result.push(info.slice(0, i))
    info = info.substr(i);
  }
  for (var i = 0; i < result.length; i++) {
    var text = result[i];
    ctx.fillText(text, x, y + lineHeight * i);
  }
}

// 绘制并生成图片
function createImage(ctx, canvasId) {
  return new Promise((resolve, reject) => {
    ctx.draw(false, () => {
      setTimeout(() => {
        wx.canvasToTempFilePath({
          canvasId: canvasId,
          success: function (res) {
            resolve(res.tempFilePath)
          },
          fail: function (err) {
            reject("绘图失败")
          }
        })
      }, 500)
    })
  })
}

Page({
  data: {
    shareImageUrl: "",
    showSharePic: false,
    screenWidth: 0,
    screenHeight: 0,
    canvasWidth: 0,
    canvasHeight: 0,
    rate: 0.9,
    rpxRatePx: 2,
    questionId: "",
    hasAnswer: false,
  },
  onLoad: function (options) {
    var that = this
    if (!this.data.showSharePic) {
      wx.getSystemInfo({
        success: function (res) {
          var rpxRatePx = 750 / res.screenWidth;
          that.setData({
            screenWidth: res.screenWidth,
            screenHeight: res.screenHeight,
            rpxRatePx: rpxRatePx
          })
        }
      });
    }
    this.init();
  },
  onShareAppMessage: function (options) {
    return {
      title: '标题',
      path: '/pages/canvas/canvas'
    }
  },

  drawImageHandel: async function (backgroundImage, avatarImage, fontInfo) {
    var that = this
    var imageList = await action.downloudImages([backgroundImage, avatarImage]);
    var backgroundImageInfo = await getImageInfo(imageList[0]);
    const backgroundUrl = imageList[0]
    const avatarUrl = imageList[1]
    const imageWidth = backgroundImageInfo.width;
    const imageHeight = backgroundImageInfo.height;
    const screenHeight = this.data.screenHeight;
    const screenWidth = this.data.screenWidth;
    const rpxRatePx = this.data.rpxRatePx;
    
    const canvasWidth = this.data.screenWidth; 
    // 根据背景图片和屏幕各自的高宽比确定画布的高宽比
    if (imageHeight/imageWidth > screenHeight/screenWidth) {
      var canvasHeight = canvasWidth * (screenHeight / screenWidth);  //px
    }else {
      var canvasHeight = canvasWidth * (imageHeight / imageWidth);  //px
    }
    // 需要先设置画布大小才能开始绘制
    this.setData({
      canvasWidth: canvasWidth,
      canvasHeight: canvasHeight
    })

    const avatarWidth = 120;
    const ctx = wx.createCanvasContext('shareCanvas');

    // 绘制背景图
    drawBackgroundImage(ctx, backgroundUrl, imageWidth, imageHeight, screenWidth, screenHeight, canvasWidth, canvasHeight)

    // 绘制头像
    circleImg(ctx, avatarUrl, (canvasWidth - avatarWidth)/2,  25,  avatarWidth/2)

    // 绘制文字
    ctx.save()
      ctx.setFillStyle('#ff5722');
      ctx.font = '20px bold'
      ctx.setTextAlign('left');
      drawFonts(ctx, fontInfo, 500/rpxRatePx, (750-500)/rpxRatePx/2, 180, 30);
    ctx.restore()

    // 渲染
    var imageUrl = await createImage(ctx, 'shareCanvas');
    this.setData({
      shareImageUrl: imageUrl,
      showSharePic: true
    })
  },

  previewImage(res) {
    var that = this;
    wx.previewImage({
      urls: [that.data.shareImageUrl]
    })
  },

  init() {
    var avatarImage = 'http://ougnqxz83.bkt.clouddn.com/18-7-18/15968950.jpg';
    var backgroundImageList = ['http://ougnqxz83.bkt.clouddn.com/18-8-22/83821829.jpg', 
      'http://ougnqxz83.bkt.clouddn.com/18-8-22/58097281.jpg',
      'http://ougnqxz83.bkt.clouddn.com/18-8-22/6835288.jpg']
    var info = "燎沉香，消溽暑。鸟雀呼晴，侵晓窥檐语。叶上初阳干宿雨、水面清圆。aaaaaaaaaaabbbbbbbb(･ω´･ )(･ω´･ )(･ω´･ )(･ω´･ )(･ω´･ )"

    wx.showLoading()
    this.drawImageHandel(backgroundImageList[1], avatarImage, info).then((res) => {
      wx.hideLoading()
    }).catch((err) => {
      wx.showToast({
        title: err,
        icon: "none"
      })
    })
    
  },

  saveImageHandel() {
    var that = this;
    function saveImage() {
      wx.saveImageToPhotosAlbum({
        filePath: that.data.shareImageUrl,
        success: function (res) {
          wx.showToast({
            icon: "success",
            title: "保存成功"
          })
        },
        fail: function () {
          wx.showToast({
            icon: "none",
            title: "保存失败，请重试"
          })
        }
      })
    }
    action.getAauthorize('scope.camera', saveImage)
  },
})
