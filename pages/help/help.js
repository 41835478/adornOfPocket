// pages/help/help.js
Page({

        /**
         * 页面的初始数据
         */
        data: {
               
        },

        /**
         * 生命周期函数--监听页面加载
         */
        onLoad: function (options) {

        },

        /**
         * 生命周期函数--监听页面初次渲染完成
         */
        onReady: function () {

        },

        /**
         * 生命周期函数--监听页面显示
         */
        onShow: function () {

        },

        /**
         * 生命周期函数--监听页面隐藏
         */
        onHide: function () {

        },

        /**
         * 生命周期函数--监听页面卸载
         */
        onUnload: function () {

        },

        /**
         * 页面相关事件处理函数--监听用户下拉动作
         */
        onPullDownRefresh: function () {

        },

        /**
         * 页面上拉触底事件的处理函数
         */
        onReachBottom: function () {

        },

        /**
         * 用户点击右上角分享
         */
        onShareAppMessage: function () {

        },

        /**
         * 显示不同模板
         */
        showHelpDetail: function (index) {
                console.log("currentIndex" + index.currentTarget.dataset.hi);
                wx.navigateTo({
                        url: "/pages/help/help_detail/help_detail?index=" + index.currentTarget.dataset.hi
                })
        },
        /**
         * 帮助客服电话
         */
        startHelpCall: function (event) {
                console.log(event.currentTarget.dataset.phone);
                wx.makePhoneCall({
                        phoneNumber: event.currentTarget.dataset.phone,
                        fail: function () {
                                console.log("启动拨号失败");
                        },
                        success: function () {
                                console.log("启动拨号成功");
                        }
                })
        }

})