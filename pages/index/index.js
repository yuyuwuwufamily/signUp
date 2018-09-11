let app = getApp()
let base_url = require("../../utils/urls.js")
let param = require("../../utils/utils.js").param
let homePageUrl = base_url.baseUrl + '/clinic/drug_inquiry/home_page_info/'
let associateUrl = base_url.baseUrl + '/clinic/drug_inquiry/associate/'

Page({
    data: {
      teamList: [{
        id: 0,
        name: '请选择俱乐部',
        remain: 13
      },{
          id: 1,
          name: '北京队（空余13席）',
          remain: 13
        }, {
            id: 2,
            name: '上海队（空余12席）',
            remain: 12
          }, {
            id: 3,
            name: '天津队（空余13席）',
            remain: 13
          }, {
            id: 4,
            name: '四川队（空余11席）',
            remain: 11
          }, {
            id: 5,
            name: '山西队（空余1席）',
            remain: 1
          }, {
            id: 6,
            name: '河北队（空余13席）',
            remain: 13
          }, {
            id: 7,
            name: '陕西队（车位已达上限）',
            remain: 0
          }],
        team: 0,
        teamButton: false,
        personButton: false,
        signButton: false,
        showModel: false,
        agree: false,
        count: 0
    },
    
    onLoad: function (options) {
        //this.getTeamList();
        //this.getCount();
      wx.login({
        success: function (res) {
          console.log(res.code,'code------------')
          if (res.code) {
            //发起网络请求
            wx.request({
              url: 'https://alxa.fblife.com/wx/getopenid',
              method: 'POST',
              data: {
                code: res.code
              }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      });
    },
    

    /**
     * 获取大队俱乐部数据
     */
    getTeamList: function () {
      wx.pro.request({
        url: ''
      }).then(( res )=>{
        res.data && res.data.length?
        res.data.map(( item, index )=>{
          item.remain === 0?
          item.name+= '车位已达上限':
          item.name+= `(空余${item.remain}席)` 
        }):null;
        this.data.teamList = this.data.teamList.concat(res.data);
      })
    },

  /**
   * 获取报名人数
   */
  getCount: function () {
    wx.pro.request({
      url: ''
    }).then((res) => {
      this.data.count = res.data;
    })
  },

  /**
   * 选择俱乐部Picker
   */
  bindTeamChange: function (e) {
    let selectedValue = e.detail.value,
        teamList = this.data.teamList;
    this.setData({
      team: selectedValue,
      teamButton: selectedValue == 0 ? false : true,
      signButton: selectedValue == 0 ? false : true,
      personButton: false
    })
   
    if ( teamList.length && !teamList[selectedValue].remain ) {
      wx.showModal({
        content: '该板块容量已达上限,可能无法如愿在营地扎营，请联系版主',
        showCancel: false,
        confirmText: '知道了',
        confirmColor: '#000000',
        success: () => {
          this.setData({
            teamButton: false,
            signButton: false 
          }) }
      })
    }
    
  },

  /**
   * 选择散客
   */
  clickPerson: function () {
    this.setData({
      teamButton: false,
      personButton: true,
      signButton: true,
      team: 0
    })
  },

  /**
   * 报名须知
   */
  changeModel: function (event) {
    this.data.signButton?
      this.setData({
        showModel: event.target.dataset.visible
      }):null;
  },

  continueSign: function(){
    this.setData({
      agree: true,
      showModel: false
    })
  },

  countSignUp: function() {
    wx.showModal({
      content: `当前报名人数：${this.data.count}`,
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

