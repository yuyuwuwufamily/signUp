let app = getApp()
let base_url = require("../../utils/urls.js")
let doPoint = require("../../utils/doPoint.js").doPoint
let param = require("../../utils/utils.js").param
let getListUrl = base_url.baseUrl + '/clinic/drug_inquiry/search/'
Page({
    data: {
        drugList: [],
        keywords: '',
        curPage: 1,
        hasNoPage: false,
        isLoading: false,
    },
    onLoad: function (options) {
       let keywords = options.drug
       this.setData({
           keywords: keywords,
           isLoading: true
       })
       this.getResult()
    },
    getResult: function () {
        wx.pro.request({
            url: getListUrl,
            data: {
                page: this.data.curPage,
                keywords: this.data.keywords
            }
        }).then((res) => {
            let data = res.data
            let length = data.drug_list.length
            let hasNoPage = false
            let curPage = this.data.curPage
            let drugList = this.data.drugList.concat(data.drug_list)

            if (!length || length < 20) {
                hasNoPage = true
            }
            this.setData({
                isLoading: false,
                drugList: drugList,
                curPage: ++curPage,
                hasNoPage: hasNoPage
            })
        })
    },
    onReachBottom: function () {
        if (!this.data.hasNoPage) {
            this.getResult()
        }
    },
    onShareAppMessage: function () {
        return {
            title: '搜索结果',
            path: `/pages/drug_result/index?drug=${this.data.keywords}`
        }
    }
})