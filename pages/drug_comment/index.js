let app = getApp()
let base_url = require("../../utils/urls.js")
let doPoint = require("../../utils/doPoint.js").doPoint
let param = require("../../utils/utils.js").param
let commentUrl = base_url.baseUrl + '/clinic/drug_inquiry/comment/rank_comment/'

Page({
    data: {
        active: true, // true选中热评,false选中最新
        hot_comment: [],
        new_comment: [],
        dataList: [],
        hotActive: true,
        newActive: false
    },
    onLoad: function (options) {
        this.getCommentData()
    },
    getCommentData: function () {
        wx.pro.request({
            url: commentUrl
        }).then((res) => {
            let data = res.data
            data.hot_comment.forEach(function (value, index){
                if (Number(value.favor_num) > 999) {
                    data.hot_comment[index].favor_num = '999+' 
                }
            })
            data.new_comment.forEach(function (value, index) {
                if (Number(value.favor_num) > 999) {
                    data.new_comment[index].favor_num = '999+'
                }
            })
            this.setData({
                hot_comment: data.hot_comment,
                new_comment: data.new_comment,
                dataList: data.hot_comment
            })
        }).catch((error) => {
            wx.showToast({
                title: '评论加载失败，稍后重试',
                icon: "loading"
            })
        })
    },
    showTab: function (event) {
        let active = event.currentTarget.dataset.active
        let type = event.currentTarget.dataset.type
        // 点击已选中
        if (active) {
            return
        }
        if (type == 'hotActive') {
            this.setData({
                dataList: this.data.hot_comment,
                hotActive: true,
                newActive: false
            })
        } else if (type == 'newActive') {
            this.setData({
                dataList: this.data.new_comment,
                hotActive: false,
                newActive: true

            })
        }
    },
    linkTo: function (event) {
        let drugId = event.currentTarget.dataset.drugid || ''
        let id = event.currentTarget.dataset.id || ''
        wx.navigateTo({
            url: `../drug_detail/index?drug_id=${drugId}&quote_id=${id}&from_type=hotcomment`
        })
    },
    onShareAppMessage: function () {
        return {
            title: '热门评论',
            path: '/pages/drug_comment/index'
        }
    }
})