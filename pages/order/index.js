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
        accompany: [{
          name: '金晓然',
          id: '142223199305062349'
        }, {
            name: '金晓然',
            id: '142223199305062340'
          }],
        gift:[{
          id: 0,
          name: '礼物'
        }, {
            id: 1,
            name: '礼物'
          }],
          total: 900,
          signPeople: 30
      }],
      checkState: false,
      modelState: false,
      scrollState: true,
      mData: null
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
   * 表单提交
   */
  formSubmit(e) {
    this.data.mData = e.detail.value;
  },

  /**
   * 确定查询
   */
  continueSign() {

    if (!this.data.mData[`number`]) {
      wx.showModal({
        title: '提示',
        content: '请填写订单号或身份证号'
      })
      return;
    }
    this.toNextPage(this.data.mData[`number`] )
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

  toNextPage( params ) {
    wx.redirectTo({
      url: `../adding_vehicles/index?number=${params}`
    })
  }
})

