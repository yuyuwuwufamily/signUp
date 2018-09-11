let app = getApp()
let base_url = require("../../utils/urls.js")
let doPoint = require("../../utils/doPoint.js").doPoint
let param = require("../../utils/utils.js").param
let recentUrl = base_url.baseUrl + '/clinic/drug_inquiry/recent_update_list/'

Page({
    data: {
        recentList: []
    },
    onLoad: function (options) {
        this.getRecentList()
    },
    getRecentList() {
        wx.pro.request({
            url: recentUrl
        }).then((res) => {
            let data = res.data
            this.setData({
                recentList: data.update_list
            })
        }).catch(err => {
            wx.showToast({
                title: "加载失败，稍后重试",
                icon: "loading"
            })
        })
    },
    onShareAppMessage: function () {
        return {
            title: '近期更新',
            path: '/pages/recent_update_list/index'
        }
    }
})