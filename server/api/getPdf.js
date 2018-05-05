var database = require('../database/database')
var Napchart = require('napchart')
var PDFDocument = require('pdfkit')

const getSleepingTime = elements => elements.reduce((acc, { start, end }) =>
    acc + (end - start), 0)

const getAwakeTime = elements => 1440 - getSleepingTime(elements)

const timeToStr = time => {
  const hours = Math.floor(time / 60)
  const minutes = time % 60

  return `${hours}h ${minutes}m`
}

module.exports = function (req, res) {
  var chartid = req.query.chartid
  var shape = req.query.shape

  if(typeof chartid == 'undefined'){
    return res.send('Invalid request')
  }

  var Canvas = require('canvas')
  Canvas.registerFont('server/Consolas.ttf', {family: 'Consolas'})

  var Image = Canvas.Image
  var canvas = Canvas.createCanvas(1200, 1200)
  var ctx = canvas.getContext('2d')

	database.getChart(chartid, function (err, response) {
	  if (err) throw new Error(err)


    if(typeof shape == 'undefined'){
      shape = response.chartData.shape
    }

    var chartData = {
      elements: response.chartData.elements,
      colorTags: response.chartData.colorTags,
      lanes: response.chartData.lanes,
      shape
    }

    var mynapchart = Napchart.init(ctx, chartData, {
      interaction:false,
      font: 'Consolas',
      background: 'white',
      baseFontSize: 'noscale:1.5'
    })

    var doc = new PDFDocument()

    const sleepingTime = getSleepingTime(response.chartData.elements)
    const awakeTime = getAwakeTime(response.chartData.elements)


    doc
      .fontSize(30)
      .text('Napchart', { align: 'center' })
      .moveDown()
      .image(canvas.toBuffer(), { scale: 0.33 })
      .fontSize(20)
      .moveDown()
      .text(`Sleeping: ${timeToStr(sleepingTime)}`)
      .text(`Awake: ${timeToStr(awakeTime)}`)
      .pipe(res)

    doc.end()
	})
}
