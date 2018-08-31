Page({
  data: {
    windowWidth: '',
    windowHeight: '',
    canPusher: true
  },
  onLoad() {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        that.setData({
          windowWidth: res.windowWidth,
          windowHeight: res.windowHeight,
        })
      }
    });
  },
  onReady(res) {
    this.ctx = wx.createLivePusherContext('pusher')
  },
  statechange(e) {
    console.log('live-pusher code:', e.detail.code)
  },
  bindStart() {
    var that = this;
    this.ctx.start({
      success: res => {
        that.setData({
          canPusher: false
        })
        console.log(that.data)
        console.log('start success')
      },
      fail: res => {
        console.log('start fail')
      }
    })
  },
  bindStop() {
    var that = this;
    this.ctx.stop({
      success: res => {
        that.setData({
          canPusher: true
        })
        console.log('stop success')
      },
      fail: res => {
        console.log('stop fail')
      }
    })
  },
  
  bindSwitchCamera() {
    this.ctx.switchCamera({
      success: res => {
        console.log('switchCamera success')
      },
      fail: res => {
        console.log('switchCamera fail')
      }
    })
  }
})