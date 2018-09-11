let app = getApp()
let base_url = require("../../utils/urls.js")
let doPoint = require("../../utils/doPoint.js").doPoint
let param = require("../../utils/utils.js").param
let getListUrl = base_url.baseUrl + '/clinic/drug_inquiry/drug_index/'
Page({
    data: {
        hasNoPage: false,
        isLoading: false,
        curPage: 1,
        drugList: [],
        lastIndex: 'a',
        category_id: '',
        category: '',
        category_name: ''
    },
    onLoad: function (options) {
        this.setData({
            category_id: options.drug_id,
            category: options.type,
            category_name: options.drug_name
        })
        wx.setNavigationBarTitle({
            title: options.drug_name
        })
        this.getSecondList()
    },
    getSecondList: function () {
        if (this.isLoading) return
        this.isLoading = true

        wx.pro.request({
            url: getListUrl,
            data: {
                page: this.data.curPage,
                type: 'level_2',
                category_id: this.data.category_id,
                category: this.data.category
            }
        }).then((res) => {
            this.isLoading = false
            let data = res.data
            let length = data.drug_list.length
            let list = data.drug_list
            // 遍历处理数据，首字母只显示一个
            for (var i = 0; i < length; i++) {
                if (list[i].pinyin_index !== this.data.lastIndex) {
                    list[i].index_flag = true
                    this.data.lastIndex = list[i].pinyin_index
                }
            }
            this.curPage++
            this.data.drugList = this.data.drugList.concat(list)
            this.setData({
                drugList: this.data.drugList,
                curPage: ++this.data.curPage,
                isLoading: false
            })
            if (!length || length < 20) {
                this.setData({
                    hasNoPage: true
                })
            }
        })
    },
    onReachBottom: function () {
        if (!this.data.hasNoPage) {
            this.getSecondList()
        }
    },
    onShareAppMessage: function () {
        return {
            title: this.data.category_name,
            path: `/pages/drug_second_list/index?category_id=${this.data.category_id}&type=${this.data.category}&drug_name=${this.data.category_name}`
        }
    }
})