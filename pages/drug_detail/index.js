let app = getApp()
let base_url = require("../../utils/urls.js")
let doPoint = require("../../utils/doPoint.js").doPoint
let param = require("../../utils/utils.js").param

Page({
    data: {
        drug_id: '',
        show: false,
        show_text: '展开孕妇儿童用药、注意事项等更多信息',
        down_tag: 'down-tag',
        detail: {}, // 药品详情,
        comment_list: [], // 全部评论
        hot_comment: [], // 热门评论
        comments_num: 0, // 全部评论数量
        hasNoPage: false,
        isLoading: false,
        curPage: 1,
        from_type: '',
        drugDetailList: [],
        reply: true,
        toView: '', //锚点定位到评论处
        quote_id: ''
    },
    onLoad: function (options) {
        this.setData({
            drug_id: options.drug_id || '',
            from_type: options.from_type,
            quote_id: options.quote_id  //锚点评论
        })
        this.getDrugDetail()
        this.getComments()
    },
    // 获取药品详情
    getDrugDetail: function () {
        let detailUrl = base_url.baseUrl + '/clinic/drug_inquiry/' + this.data.drug_id + '/detail/'

        wx.pro.request({
            url: detailUrl,
            data: {
                from_type: this.data.from_type
            }
        }).then((res) => {
            let data = res.data
            this.setData({
                detail: data
            })
            this.setDrugDetailList()
            wx.setNavigationBarTitle({
                title: data.name
            })
        }).catch(err => {
            wx.showToast({
                title: '加载失败，稍后重试',
                icon: "loading"
            })
        })
    },
    setDrugDetailList: function () {
        let list = []
        let detail = this.data.detail

        for (var item in detail) {
            detail[item] = String(detail[item]).replace(/<br>/g, '\n')
        }
        list = [{
                title: '适用症',
                item: detail.indication,
            },{
                title: '规格',
                item: detail.form,
            }, {
                title: '用法用量',
                item: detail.dosage,
            }, {
                title: '禁忌症',
                item: detail.contraindications,
            }, {
                title: '不良反应',
                item: detail.adverse_reactions,
            }, {
                title: '孕妇用药',
                item: detail.use_in_preg_lac,
            }, {
                title: '儿童用药',
                item: detail.use_in_children,
            }, {
                title: '注意事项',
                item: detail.precautions,
            }, {
                title: '相互作用',
                item: detail.drug_interactions,
            }, {
                title: '成分',
                item: detail.component,
            }, {
                title: '药理',
                item: detail.mechanism_action,
            }, {
                title: '药代动力学',
                item: detail.pharmacokinetics,
            }, {
                title: '贮藏',
                item: detail.storage,
            }]
        this.setData({
            drugDetailList: list
        })  
    },
    // 点击展开和收起
    showAll: function () {
        let show = this.data.show
        if (show == false) {
            this.setData({
                show: true,
                show_text: '收起孕妇儿童用药、注意事项等更多信息',
                down_tag: 'up-tag'
            })
        } else {
            this.setData({
                show: false,
                show_text: '展开孕妇儿童用药、注意事项等更多信息',
                down_tag: 'down-tag'
            })
        }
    },
    // 获取评论
    getComments: function () {
        let commentsUrl = base_url.baseUrl + '/clinic/drug_inquiry/' + this.data.drug_id + '/comment_info/'

        if (this.data.isLoading) return
        this.setData({
            isLoading: true
        })
        wx.pro.request({
            url: commentsUrl,
            data: {
                page: this.data.curPage
            }
        }).then((res) => {
            let data = res.data
            let length = data.comment_list.length
            let count = data.count
            let comment_list = []
            let comments_num = 0
            let hot_comment = []
            let hasNoPage = false
            let curPage = this.data.curPage
            // 全部评论
            data.comment_list.forEach(function (value, index) {
                if (Number(value.favor_num) > 999) {
                    data.comment_list[index].favor_num = '999+'
                }
            })
            comment_list = this.data.comment_list.concat(data.comment_list)
            // 热评
            if (data.hot_comment) {
                data.hot_comment.forEach(function (value, index) {
                    if (Number(value.favor_num) > 999) {
                        data.hot_comment[index].favor_num = '999+'
                    }
                })
                hot_comment = this.data.hot_comment.concat(data.hot_comment)
                this.setData({
                    hot_comment: hot_comment
                })
            }
            
            if (count > 999) {
                comments_num = '999+'
            } else {
                comments_num = count
            }
            if (!length || length < 20) {
                hasNoPage = true
            }
            this.setData({
                isLoading: false,
                comment_list: comment_list,
                comments_num: comments_num,
                curPage: ++curPage,
                hasNoPage: hasNoPage,
                toView: `anchor${this.data.quote_id}`
            })
        })
    },
    jumpToComment: function () {
        this.setData({
            toView: 'comment-top-pos'
        })
    },
    onReachBottom: function () {
        if (!this.data.hasNoPage) {
            this.getComments()
        }
    },
    onShareAppMessage: function () {
        return {
            title: this.data.detail.name,
            path: `/pages/drug_detail/index?drug_id=${this.data.drug_id}`
        }
    }
})