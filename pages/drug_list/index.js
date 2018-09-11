let app = getApp()
let base_url = require("../../utils/urls.js")
let doPoint = require("../../utils/doPoint.js").doPoint
let param = require("../../utils/utils.js").param
let drugUrl = base_url.baseUrl + '/clinic/drug_inquiry/drug_index/'
Page({
    data: {
        curPage: 1,
        type: 'foreign',
        categoryList: [],
        foreignPage: 1,
        foreignList: [],
        chinaPage: 1,
        chinaList: [],
        foreignHasNoPage: false,
        chinaHasNoPage: false,
        isLoading: false
    },
    onLoad: function (options) {
        this.getDrugList()
    },
    getDrugList() {
        if (this.isLoading) return
        this.setData({
            isLoading: true
        })
        wx.pro.request({
           url: drugUrl,
            data: {
                category: this.data.type,
                type: 'level_1'
            }
        }).then((res) => {
            this.isLoading = false

            let data = res.data
            let length = data.category_list.length
            let list = []

            if (this.data.type === 'foreign') {
                list = this.data.foreignList.concat(data.category_list)
                this.setData({
                    categoryList: list,
                    isLoading: false
                })
            } else {
                list = this.data.chinaList.concat(data.category_list)
                this.setData({
                    chinaList: list,
                    isLoading: false
                })
            }
        }).catch(err => {
            wx.showToast({
                title: "加载失败，稍后重试",
                icon: "loading"
            })
        })
    },
    changeTab: function (event) {
        let type = event.currentTarget.dataset.type
        if (type !== this.data.type) {
            this.setData({
                type: type
            })
            if (!this.data.chinaList.length) {
                this.getDrugList()
            }
        } 
    },
    onShareAppMessage: function () {
        return {
            title: '药品分类',
            path: '/pages/drug_list/index'
        }
    }
})