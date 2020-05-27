const axios = require('axios')

const instance = axios.create({
  baseURL: `http://${process.env.baseURL || 'localhost'}:${process.env.PORT || 3000}`,
  timeout: 10000,
  headers: {}
})

module.exports = instance
