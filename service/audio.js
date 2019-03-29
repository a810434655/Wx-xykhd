const backgroundAudioManager = wx.getBackgroundAudioManager()
var audioList = {
  state: 0,
  list: [],
  current: 0
  }
module.exports = {
  init: function () {
    backgroundAudioManager.pause()
    backgroundAudioManager.onPlay(() => {
      console.log('开始播放1')
    })
    backgroundAudioManager.onPause(() => {
      console.log('暂停播放1')
    })
    backgroundAudioManager.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },
  play: function ({ title, epname, singer, coverImgUrl, src, hash },fallback) {
    if (audioList.current != hash){
      audioList.current = hash
      backgroundAudioManager.title = title
      backgroundAudioManager.epname = epname
      backgroundAudioManager.singer = singer
      // backgroundAudioManager.coverImgUrl = coverImgUrl
      backgroundAudioManager.coverImgUrl = 'http://y.gtimg.cn/music/photo_new/T002R300x300M000003rsKF44GyaSk.jpg?max_age=2592000'
      backgroundAudioManager.src = src
    }
    backgroundAudioManager.play()
    if (!backgroundAudioManager.paused){
      fallback()
    }else{
      setTimeout(function () {
        fallback()
      }, 300)
    }
  },
  pause: function (fallback) {
    backgroundAudioManager.pause()
  },
  playing: function () {
    return !backgroundAudioManager.paused;
  },
  duration: function () {
    return backgroundAudioManager.duration || 0;
  },
  curTime: function () {
    return backgroundAudioManager.currentTime || 0;
  },
  curIndex: function () {
    return audioList.current;
  }
}