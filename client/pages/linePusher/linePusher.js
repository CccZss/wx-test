Page({
  data: {
    windowWidth: '',
    windowHeight: '',
    canPusher: true,
    playUrl: 'rtmp://pull-g.kktv8.com/livekktv/100987038',
    pushUrl: 'https://domain/push_stream'
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
  playStatechange(e) {
    console.log('live-player code:', e.detail.code)
  },
  pushStatechange(e) {
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
  },
  error(e) {
    console.error('live-player error:', e.detail.errMsg)
  }
})