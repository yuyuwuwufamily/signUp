var base_url = require("./urls.js").baseUrl
module.exports.doPoint = function (key, segmentation) {
  wx.request({
    url: base_url + "/stat/h5/event_analyse/data_upload/",
    method: "POST",
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: {
      "events": JSON.stringify([
        {
          "key": key,
          "segmentation": segmentation
        }
      ])
    }
  })

}
