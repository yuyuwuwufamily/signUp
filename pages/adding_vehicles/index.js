var order = ['red', 'yellow', 'blue', 'green', 'red']

Page({
  data: {
    toView: 'red',
    scrollTop: 100,
    CarsList: [{ name: '', iden: '', phone: '', e_id:''}],//控制表单数量的状态
    flagList: [false],
    indicatorDots: false,
    current:0,
    duration: 500,
    previousMargin: 0,
    nextMargin: 0,
    state0:0,
    mData:{},//当前表单数据
    dataList: [],//车辆数据列表
    nameState: true,
    idState: true,
    phoneState: true

  },
  onLoad(options) {

  },
  onShow() {
  
  },
  /**
   * 表单提交
   */
  formSubmit (e) {
    this.data.mData = e.detail.value;

  },


  /**
   * 删除车辆
   */
  deleteCar(event){
    var index = event.currentTarget.dataset['index'];
    console.log('index:::',index)
    this.data.dataList.splice(index, 1);
    this.data.CarsList.splice(index, 1);
    this.data.flagList.splice(index, 1);

    
    let curState = 0;
    if(index === 0)
      curState = index;
    else
      curState = index - 1
    this.setData({
      dataList: this.data.dataList,
      CarsList: this.data.CarsList,
      flagList: this.data.flagList,
      current: curState,
    })
  },

  checkInput: function (){
    const pattrnName = /^([a-zA-Z\u4e00-\u9fa5\·]{1,10})$/,
          pattrnId = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/,
          pattrnPhone = /(^(13[0-9]|14[0-9]|15[0-9]|166|17[0-9]|18[0-9]|19[8|9])\d{8}$)/;
    let nameState, idState, phoneState;      
    if (!pattrnName.test(this.data.mData[`name`])) {
      wx.showModal({
        title: '提示',
        content: '请填写正确的用户名'
      })
      nameState = false
    }else{
      nameState = true
    }

    if (!pattrnId.test(this.data.mData[`iden`])) {
      wx.showModal({
        title: '提示',
        content: '请填写正确的身份证号码'
      })
      idState = false
    }else{
      idState = true
    }

    if (!pattrnPhone.test(this.data.mData[`phone`])) {
      wx.showModal({
        title: '提示',
        content: '请填写正确的手机号码'
      })
      phoneState = false
    }else{
      phoneState = true
    }
    this.setData({
      nameState: nameState,
      idState: idState,
      phoneState: phoneState
    })
  },

  /**
   * 新增车辆
   */
  addCar(e){
    this.checkInput();
    if (!this.data.nameState || !this.data.idState || !this.data.phoneState){
      return
    }
    // //验证提交数据
    // wx.pro.request({
    //   url: "",
    //   method: "POST",
    //   data: this.data.dataList
    // }).then((res) => {
    //   //成功回调

    // })


    let mObj = { name: '', iden: '', phone: '', e_id: '' };

    //this.data.CarsList[this.data.current] = this.data.mData;

    this.data.CarsList.splice(this.data.CarsList.length - 1, 0, this.data.mData)
    this.data.dataList.push(this.data.mData);
    // this.data.flagList.push(false)
    // this.data.flagList[this.data.flagList.length - 2] = true;
    this.data.flagList.splice(this.data.flagList.length - 1, 0, true)

    this.setData({
      CarsList: this.data.CarsList,
      current:  this.data.CarsList.length-1,
      flagList: this.data.flagList,
      dataList: this.data.dataList
    })

  },

  /**
   * 点击下一步提交所有数据
   */
  submitAllData(){
    this.checkInput();
    if (!this.data.nameState || !this.data.idState || !this.data.phoneState) {
      return
    }
    wx.pro.request({
      url:"",
      method:"POST",
      data:this.data.dataList
    }).then((res)=>{
      //成功回调
      wx.navigateTo({
        url: ''
      })

    })
  }
})