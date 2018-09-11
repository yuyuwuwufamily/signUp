let app = getApp()
let base_url = require("../../utils/urls.js")
let param = require("../../utils/utils.js").param
let homePageUrl = base_url.baseUrl + '/clinic/drug_inquiry/home_page_info/'
let associateUrl = base_url.baseUrl + '/clinic/drug_inquiry/associate/'


Page({
  data: {
    
  },

  onLoad: function (options) {
    //this.getCarList();
  },


  toNextPage: function () {
    wx.navigateTo({
      url: "../adding_vehicles/index"
    })
  }
})
