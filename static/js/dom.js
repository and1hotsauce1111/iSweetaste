// 縮放
try {
  // 禁用雙擊縮放
  document.addEventListener('touchstart', function(event) {
    if (event.touches.length > 1) {
      event.preventDefault()
    }
  })
  var lastTouchEnd = 0
  document.addEventListener(
    'touchend',
    function(event) {
      var now = new Date().getTime()
      if (now - lastTouchEnd <= 300) {
        event.preventDefault()
      }
      lastTouchEnd = now
    },
    false
  )
  // 禁用雙指手勢操作
  document.addEventListener('gesturestart', function(event) {
    event.preventDefault()
  })
} catch (error) {}
