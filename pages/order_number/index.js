let app = getApp()
let base_url = require("../../utils/urls.js")
let param = require("../../utils/utils.js").param
let homePageUrl = base_url.baseUrl + '/clinic/drug_inquiry/home_page_info/'
let associateUrl = base_url.baseUrl + '/clinic/drug_inquiry/associate/'

Page({
    data: {
      orderList: [{
        id: 12345,
        team: '北京大队',
        code: '',
        empower: '',
        carList: [{
          name: '金晓然',
          id: '142223199305062345'
        }, {
            name: '金晓然',
            id: '142223199305062346'
          }, {
            name: '金晓然',
            id: '142223199305062347'
          }, {
            name: '金晓然',
            id: '142223199305062348'
          }],
        accompany: [],
        gift:[{
          id: 0,
          name: '礼物'
        }, {
            id: 1,
            name: '礼物'
          }]
      }],
      checkState: false,
      modelState: false,
      scrollState: true
    },
    
    onLoad: function (options) {
        //this.getOrder();
    },
    

    /**
     * 获取订单数据
     */
    getOrder () {
      wx.pro.request({
        url: ''
      }).then(( res )=>{
        this.data.orderList = res.data;
      })
    },

  /**
   * 点击查订单 显示订单详情
   */
  checkOrder() {
    this.setData({
      checkState: true
    })
  },

  /**
   * 查订单弹框
   */
  changeModel(e){
    this.setData({
      modelState: e.target.dataset.visible,
      scrollState: !e.target.dataset.visible
    })
  },

  /**
   * 查看报名人数
   */
  showSignPeople () {
    wx.showModal({
      content: `当前报名人数：${this.data.orderList[0].signPeople}`,
      showCancel: false,
      confirmText: '知道了',
      confirmColor: '#000000'
    })
  },

  


  toNextPage: function () {
    wx.redirectTo({
      url: "../adding_vehicles/index"
    })
  }
})

