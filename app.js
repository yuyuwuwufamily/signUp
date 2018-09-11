var base_url = require("./utils/urls.js").baseUrl
var LOGIN_URL = base_url + '/cooperation/wap/get_session_id/'
var STATUS_URL = base_url + "/cooperation/wap/wx_mini_update_user_login_status/"
var param = require('./utils/utils').param
require('./utils/wx_promise.js') //request promise
App({
    globalData: {
        partner: 'chunyu_wap',
        sessionid: "",
    },
    login: function () {
        var that = this
        var session_id = that.globalData.sessionid || wx.getStorageSync('sessionid')
        wx.checkSession({
            success: function () {
                if (session_id) {
                    that.globalData.sessionid = session_id
                    that.sendOnlineStatus(1)
                } else {
                    that.weixinLogin()
                }
            },
            fail: function () {
                that.weixinLogin()  
            }
        })
    },
    weixinLogin: function () {
        var that = this
        var data = null
        wx.login({
            success: function (res) {
                console.log('wxlogin-success')
                var code = res.code
                if (code) {
                    wx.getUserInfo({
                        success: function (res) {
                            console.log('getuserInfo-success')
                            var encryptedData = res.encryptedData
                            var iv = res.iv
                            data = {
                                from_wx_mini: 1,
                                code: code,
                                encryptedData: encryptedData,
                                iv: iv,
                                app: 'drug_assistant'
                            }
                            wx.request({
                                url: LOGIN_URL,
                                method: 'POST',
                                data: param(data),
                                success: function (data) {
                                    console.log('getsessionid-success')
                                    data = data.data
                                    if (data.sessionid) {
                                        that.globalData.sessionid = 'sessionid=' + data.sessionid
                                        wx.setStorageSync('sessionid', 'sessionid=' + data.sessionid)
                                        
                                        that.sendOnlineStatus(1)
                                    } else {
                                        wx.showToast({
                                            title: "登录失败",
                                            icon: "loading"
                                        })
                                    }
                                },
                                fail: function (res) {
                                    wx.showToast({
                                        title: "登录失败",
                                        icon: "loading"
                                    })
                                }
                            })
                        },
                        fail: function () {
                            wx.showToast({
                                title: "登录失败",
                                icon: "loading"
                            })
                        }
                    })
                } else {
                    wx.showToast({
                        title: "登录失败",
                        icon: "loading"
                    })
                }
            }
        })
    },
    sendOnlineStatus: function (status) {
        var that = this
        var data = {
            from_wx_mini: 1,
            login_status: status,
            partner: 'chunyu_wap_mini'
        }
        var session_id = wx.getStorageSync('sessionid')
        wx.request({
            url: STATUS_URL,
            header: {
                'Content-Type': 'application/json',
                'Cookie': session_id
            },
            data: param(data),
            method: 'POST',
            success: function (res) {
                res = res.data
                if (res.error != 0) {
                    console.log(res)
                }
            },
            fail: function (res) {
                console.log(res)
            }
        })
    },
    onShow: function () {
        var that = this
       // that.sendOnlineStatus(1)
    },
    onHide: function () {
        var that = this
        //that.sendOnlineStatus(0)
    },
    onLaunch: function () {
        var that = this
        //that.login()
    }
})