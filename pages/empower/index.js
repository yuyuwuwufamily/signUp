let app = getApp()
let base_url = require("../../utils/urls.js")
let param = require("../../utils/utils.js").param
let homePageUrl = base_url.baseUrl + '/clinic/drug_inquiry/home_page_info/'
let associateUrl = base_url.baseUrl + '/clinic/drug_inquiry/associate/'

Page({
    data: {
      team: {
        id: 2,
        name: '北京大队',
        remain: 100
      },
      visible: false,
      mData: {}
  
    },
    
    onLoad: function (options) {
        
    },
    

    

  /**
   * 点击授权
   */
  empower(e) {
    if( e.target.dataset.type ){
      this.setData({
        visible: true
      })
    }else{
      wx.showModal({
        content: `授权后不可撤回，确认授权给${this.data.team.name}吗？`,
        cancelText: '再想想',
        confirmText: '确定',
        confirmColor: '#000000',
        success: function(res){
          if (res.confirm) {
            this.submitEmpower()
          }
        }
      })
    }
  },

  changeModel(){
    this.setData({
      visible: false
    })
  },

  /**
   * 提交表单
   */
  formSubmit(e) {
    this.data.mData = e.detail.value;
  },

  /**
   * 确定授权给个人
   */
  continueSign() {

    if (!this.data.mData[`phone`]) {
      wx.showModal({
        title: '提示',
        content: '请填写手机号'
      })
      return;
    }

    if (!this.data.mData[`identify-code`]) {
      wx.showModal({
        title: '提示',
        content: '请填写验证码'
      })
      return;
    }
    this.setData({
      visible: false
    },()=>{
      wx.showModal({
        title: '提示',
        content: `授权后不可撤回，确定授权给手机号${this.data.mData.phone}吗？`,
        success: function (res) {
          if (res.confirm) {
            this.submitEmpower()
          }
        }
      })
    })
  },

  /**
   * 提交授权
   */
  submitEmpower( params ) {

  },
  getPhone(value){
    console.log(value)
  },
  /**
   * 获取验证码
   */
  getIdentifyCode( phone ){
    wx.showToast({
      title: '已发送',
      icon: 'success',
      duration: 3000
    })
    // wx.pro.request({
    //   url: ''
    // })
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

