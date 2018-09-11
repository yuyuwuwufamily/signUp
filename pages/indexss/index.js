let app = getApp()
let base_url = require("../../utils/urls.js")
let doPoint = require("../../utils/doPoint.js").doPoint
let param = require("../../utils/utils.js").param
let homePageUrl = base_url.baseUrl + '/clinic/drug_inquiry/home_page_info/'
let associateUrl = base_url.baseUrl + '/clinic/drug_inquiry/associate/'

Page({
    data: {
        recent_update: [],
        hot_comment_rank: [],
        search: false,
        keywords: '',
        isFocus: false,
        historyShow: true,
        history: [],
        associate: [],
        associateShow: false,
    },
    /**
     * 1.获取热评榜和更新榜
     * 2.获取搜索历史
     **/
    onLoad: function (options) {
        this.getHomePageInfo()
        this.getHistory()
        doPoint('WXmini_MedicineSearch_Homepage_Load')
    },
    onShow: function () {
        this.setData({
            historyShow: true
        })
    },
    // 获取热评榜数据
    getHomePageInfo: function () {
        wx.pro.request({
            url: homePageUrl,
        }).then((res) => {
            let status = res.status
            let data = res.data

            // 处理首页热评榜药品
            for (let i = 0; i < data.hot_comment_rank.length; i++) {
                let drugName = data.hot_comment_rank[i].drug_info.name
                if (Number(data.hot_comment_rank[i].favor_num) > 999) {
                    data.hot_comment_rank[i].favor_num = '999+'
                }
                if (drugName.length > 8) {
                    drugName = drugName.substring(0, 7).concat('...')
                    data.hot_comment_rank[i].drug_info.name = drugName
                }
            }
            this.setData({
                recent_update: data.recent_update,
                hot_comment_rank: data.hot_comment_rank
            })  
        }).catch(err => {
            wx.showToast({
                title: "加载失败，稍后重试",
                icon: "loading"
            })
        })
    },
    //搜索框输入文字
    searchDrug: function (event) {
        let keywords = event.detail.value
        let historyShow = true
        if (keywords) {
            historyShow = false
        }
        this.setData({
            keywords: keywords,
            historyShow: historyShow
        })
        this.getAssociate()
    },
    /**
     * 根据输入关键字，获取联想搜索列表，输入文字为空时不请求数据
     * 关键字跟搜索到列表文字相匹配时，分开存储为first_name，end_name
     * 为了标红显示处理
     **/
    getAssociate: function () {
        let keywords = this.data.keywords

        if (!keywords) {
            this.setData({
                associate: [],
                associateShow: true
            })
            return;
        }
        wx.pro.request({
            url: associateUrl,
            data: {
                keywords: keywords
            }
        }).then((res) => {
            let status = res.status
            let data = res.data
            let associate = data.drug_list
            for (let index in associate) {
                if (associate[index].name.indexOf(keywords) === 0) {
                    associate[index].end_name = associate[index].name.replace(keywords, '')
                    associate[index].first_name = keywords
                }
            }
            this.setData({
                associate: associate,
                associateShow: true
            })
        })
    },
    //改变搜索框中的搜索词，同时更新搜索列表
    replaceKeywords: function (event) {
        let keywords = event.currentTarget.dataset.value
        this.setData({
            keywords: keywords
        })
        this.getAssociate()
    },
    searchNow: function () {
        this.setData({
            search: true,
            isFocus: true
        })
    },
    searchHide: function () {
        this.setData({
            search: false,
            isFocus: false
        })
    },
    // 删除搜索框数据
    clearInput: function () {
        this.setData({
            keywords: ''
        })
        this.getAssociate()
    },
    // 提交搜索
    submitForm: function () {
        if (this.data.keywords.trim() === '') {
            wx.showToast({
                title: "请输入关键词",
                icon: "loading"
            })
            return
        }
        this.saveHistory()
        wx.navigateTo({
            url: `../drug_result/index?drug=${this.data.keywords}`
        })
    },
    // 从本地获取历史记录
    getHistory: function () {
        let history = ''
        let historyArray = []
        wx.pro.getStorage('history_array').then((res) => {
            // 当缓存为空时返回undefined,否则返回数据从res.data中获取
            history = res ? res.data : ''
            if (history) {
                historyArray = JSON.parse(history)
                this.setData({
                    history: historyArray
                })
            }
        })
    },
    /**
     * 存储搜索历史
     * 当作为绑定事件携带参数时，参数赋值给关键字，存储为搜索历史
     * 当作为函数使用时，直接把关键字保存为搜索历史
     **/
    saveHistory: function (event) {
        let history = this.data.history
        let keywords = this.data.keywords

        if (event && event.currentTarget.dataset.value) {
            keywords = event.currentTarget.dataset.value
        }
        if (history.length) {
            this.arrageArray(history, keywords)
        } else {
            // 第一次存储
            history.push(keywords)
        }
        this.setData({
            history: history,
            keywords: ''
        })
        wx.pro.setStorage('history_array', JSON.stringify(history))
    },
    // 对数组进行处理，存储5个，不能重复，最新在最前面
    arrageArray: function (array, name) {
        let len = array.length
        let index = array.indexOf(name)
        // 元素不在数组中
        if (index === -1) {
            array.unshift(name)
            if (len >= 5) {
                array.pop()
            }
        } else {
            // 元素在数组中
            array.splice(index, 1)
            array.unshift(name)
        }
        return array
    },
    // 删除搜索历史
    clearHistory: function () {
        wx.pro.removeStorage('history_array').then(res => {
            wx.showToast({
                title: "删除成功",
                icon: "success"
            })
            this.setData({
                history: [],
                historyShow: false
            })
        }).catch(res => {
            wx.showToast({
                title: "删除失败",
                icon: "loading"
            })
        })
    },
    doPointEvent: function (event) {
        let type = event.currentTarget.dataset.type
        let name = ''
        if (type == 'classify') {
            name = 'WXmini_MedicineSearch_HomePage_MedicineClassificationIcon_Click'
        } else if (type == 'disease') {
            name = 'WXmini_MedicineSearch_HomePage_DiseaseIcon_Click'
        } else if (type == 'comment') {
            name = 'WXmini_MedicineSearch_HomePage_HotCommentIcon_Click'
        }
        doPoint(name)
    },
    onShareAppMessage: function () {
        return {
            title: '春雨用药查询',
            path: '/pages/index/index'
        }
    },
})