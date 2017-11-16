// pages/ticket/ticket.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ticketList: [],//卡券列表

  },
  /**
   * 初始化
   */
  init() {
    // 根据用户id获取卡券列表
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getDataFromNet()
  },
  /**
   * 获取优惠券信息
   */
  getDataFromNet() {
    let that = this
    wx.login({
      success: res => {
        if (res.code) {
          wx.request({
            url: getApp().globalData.baseUrl + "mall/wx/ticket/findByUserId?wxCode=" + res.code + "&pageNo=1&pageSize=5",
            success: res => {
              console.log("优惠券结果:" + JSON.stringify(res.data))
              var arr = res.data.list
              var timestamp3 = 1503058804;
              var newDate = new Date();
              newDate.setTime(timestamp3 * 1000);
              // 2014/6/18
              console.log(newDate.toLocaleDateString());
              that.setData({
                ticketList: arr
              })
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