const express = require('express')
const router = express.Router()
const axios = require('./utils/axios')

router.get('/geo/getPosition', async (req, res) => {
  const ip = req.headers['x-forwarded-for']
    ? req.headers['x-forwarded-for'].split(',')[0]
    : req.connection.remoteAddress

  try {
    const { status: status1, data: data1 } = await axios.get('https://api.myip.com')

    const geoIp = ip === '127.0.0.1' ? data1.ip : ip

    const { status, data } = await axios.get(
      `http://api.ipstack.com/${geoIp}?access_key=b7ef6c248e401c010df499d5bee56ac9&format=1`
    )

    if (status === 200) {
      return res.send({ msg: '成功獲取城市資料', data, geoRetCode: 0 })
    }
    return res.send({ msg: '獲取城市失敗', data, geoRetCode: -1 })
  } catch (e) {
    console.log(e)
  }
})

module.exports = router
