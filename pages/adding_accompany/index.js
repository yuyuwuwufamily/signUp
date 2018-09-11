let app = getApp()
let base_url = require("../../utils/urls.js")
let param = require("../../utils/utils.js").param
let homePageUrl = base_url.baseUrl + '/clinic/drug_inquiry/home_page_info/'
let associateUrl = base_url.baseUrl + '/clinic/drug_inquiry/associate/'

Page({

  data: {
    carList: [{
      id: 0,
      name: '潘晓',
      personInsurance: []
    }, {
      id: 1,
      name: '秦晶晶',
      personInsurance: []
    }, {
      id: 2,
      name: '贾磊',
      personInsurance: []
    }, {
      id: 3,
      name: '康勇',
      personInsurance: []
    }, {
      id: 4,
      name: '赵贤',
      personInsurance: []
    }],
    carIndex: 0,
    visible: false,
    mData:{},
    idcard:0,//身份证号码
    name:"",//名字
    goodNum:0,//购买物品数量
    allCost:0,//总消费

  },

  onLoad: function (options) {
   
    
  },

  calAllCost(){


    var carCost = this.data.carList.length*120;
    var personCost= 0;
    var datalist = this.data.carList;
    for (var i = 0; i < datalist.length;i++){
      personCost += datalist[i].personInsurance.length * 120
    }
    var goodCost = this.data.goodNum * 60;

    console.log("carCost::", carCost);
    console.log("personCost::", personCost);
    console.log("goodCost::", goodCost);
    

    var all = goodCost + carCost + personCost;
    this.setData({
      allCost: all
    })

  },

  showOrder(){
    wx.showActionSheet({
      itemList: ['A', 'B', 'C'],
      success: function (res) {
        console.log(res.tapIndex)
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })

  },

  /**
   * 获取车辆信息
   */
  getCarList() {
    wx.pro.request({
      url: ''
    }).then((res) => {
      res.data && res.data.length ?
        res.data.map((item, index) => {
          item.personInsurance = []
        }) : null;
      this.data.carList = res.data;
    })
  },
  changeCar(e) {
    this.setData({
      carIndex: e.target.dataset.imgindex
    })
    console.log("carIndex:::",this.data.carIndex)
  },
  showPersonModel() {
    this.setData({
      visible: true
    })
  },
  changeModel(){
    this.setData({
      visible: false
    })
  },
  /**
   * 增加随行人员保险
   */
  continueSign(){

    if (!this.data.mData[`name`]) {
      wx.showModal({
        title: '提示',
        content: '请填写用户名',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return;
    }

    if (!this.data.mData[`idcard`]) {
      wx.showModal({
        title: '提示',
        content: '请填写身份证号码',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
      return;
    }



    this.changeModel();
    this.data.carList[this.data.carIndex].personInsurance.push(this.data.mData);
    this.setData({
      carList: this.data.carList
    });
    this.calAllCost()
    console.log('this.data.carList',this.data.carList)

  },
  /**
  * 表单提交
  */
  formSubmit(e) {
    this.data.mData = e.detail.value;
  },
  /**
   * 删除随行人员
   */
  deletPerson(e){
   let index =  e.target.dataset.index;
    this.data.carList[this.data.carIndex].personInsurance.splice(index,1);
    this.setData({
      carList: this.data.carList
    })
    this.calAllCost()

    console.log('this.data.carList', this.data.carList)

  },

  delete(){

    var curGoodNum = this.data.goodNum;

    if (curGoodNum<=0){
      curGoodNum = 0
    }else{
      curGoodNum--
    }
    this.setData({
      goodNum: curGoodNum
    })
    this.calAllCost()

  },
  plug(){
    var curGoodNum = this.data.goodNum;
    this.setData({
      goodNum: ++curGoodNum
    })
    this.calAllCost()

  },



  toNextPage: function () {
    wx.navigateTo({
      url: "../adding_vehicles/index"
    })
  }
})

