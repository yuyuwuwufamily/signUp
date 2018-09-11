let app = getApp()
let base_url = require("../../utils/urls.js")
let doPoint = require("../../utils/doPoint.js").doPoint
let param = require("../../utils/utils.js").param
let diseaseUrl = base_url.baseUrl + '/clinic/disease_inquiry/disease_index/'

Page({
    data: {
        diseaseList: [],
        hasNoPage: false,
        isLoading: false
    },
    onLoad: function (options) {
        this.getDiseaseList()
    },
    getDiseaseList: function () {
        wx.pro.request({
            url: diseaseUrl
        }).then((res) => {
            let data = res.data
            let curPage = this.data.curPage
                // 遍历数据，加上show属性
            for (let i = 0; i < data.disease_list.length; i++) {
                data.disease_list[i].show = false
                data.disease_list[i].tag = 'down'
            }
            this.setData({
                curPage: ++curPage,
                diseaseList: data.disease_list
            })
        }).catch(err => {
            wx.showToast({
                title: '加载失败，稍后重试',
                icon: "loading"
            })
        })
    },
    showSubList: function (event) {
        let index = event.currentTarget.dataset.index
        let item = this.data.diseaseList[index]

        item.show = !item.show
        if (item.tag === 'down') {
            item.tag = 'up'
        } else {
            item.tag = 'down'
        }
        
        // 减少setData数据量，局部更新数据
        let param = {}
        let dataName = "diseaseList[" + index + "]"
        param[dataName] = item;
        this.setData(param)
    },
    onShareAppMessage: function () {
        return {
            title: '疾病分类',
            path: '/pages/disease_list/index'
        }
    }
})