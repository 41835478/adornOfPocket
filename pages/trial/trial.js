// pages/trial/trial.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tourGoodInfo: [],
    imgUrl: getApp().globalData.baseImgUrl,
    useUrl: 'mall/wx/free/findFreeList',
    lastPage: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.request({
      url: getApp().globalData.baseUrl + this.data.useUrl + "?pageNo=1&pageSize=10",
      success: res => {
        console.log("backdata=" + JSON.stringify(res))
        let arr = res.data.list
        if (arr) {
          that.setData({
            tourGoodInfo: arr
          })
        }
      }
    })
  },
  buyAction(e) {
    let goodId = e.currentTarget.id
    console.log("点击购买商品! id=" + goodId)
    wx.navigateTo({
      url: '/pages/good/good?goodId=' + goodId,
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