var database = require('../database/database')
var getImage = require('./getImage')
var getPdf = require('./getPdf')
var fs = require('fs')

module.exports = {
  create: function (req, res) {
    var data = JSON.parse(req.body.data)

    // which user does this belong to??
    if (req.user) {
      data.author = req.user.username
    }

    database.createChart(data, function (err, response) {
      if (err) throw new Error(err)

      res.send(response)
    })
  },

  get: function (req, res) {
    var chartid = req.query.chartid

    database.getChart(chartid, function (err, response) {
      if (err) throw new Error(err)

      res.send(response)
    })
  },

  getImage: getImage,

  getPdf: getPdf,

  postFeedback: function (req, res) {
    var data = JSON.parse(req.body.data)
    database.addFeedback(data, function (err, response) {
      if (err) throw new Error(err)

      res.send(response)
    })
  }
}
