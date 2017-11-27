// pages/profile/point/point.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: 'mall/wx/point/pointLog',
    pointInfo: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.login({
      success: res => {
        if (res.code) {
          wx.request({
            url: getApp().globalData.baseUrl + this.data.url + "?wxCode=" + res.code + "&pageNo=1&pageSize=10",
            success: res => {
              console.log(res.data.list)
              that.setData({
                pointInfo: res.data.list
              })
            },
            fail: err => {
              console.log(JSON.stringify(err))
            }
          })
        }
      }
    })
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

  }
})