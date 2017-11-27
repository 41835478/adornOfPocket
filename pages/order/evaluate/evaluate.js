// pages/order/evaluate/evaluate.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: 'mall/wx/order/estimate',
    baseImgUrl: getApp().globalData.baseImgUrl,
    goodName: '',
    goodUrl: '',
    goodId: '',
    goodSuggest: ''
  },
  /**
   *保存页面数据 
   */
  inputSuggestAction(e) {
    this.setData({
      goodSuggest: e.detail.value
    })
    console.log(this.data.goodSuggest)
  },
  /**
   * 商品添加评价
   */
  sendSuggestAction() {
    let that = this
    wx.login({
      success: res => {
        if (res.code) {
          let url = getApp().globalData.baseUrl + that.data.url
          let params = {}
          params.goodId = that.data.goodId
          params.message = that.data.goodSuggest
          params.wxCode = res.code
          console.log("send data=" + JSON.stringify(params))
          wx.request({
            url: url,
            data: params,
            method: 'POST',
            success: res => {
              console.log('back data='+JSON.stringify(res.data))
              if (res.data.result == 1) {
                wx.showModal({
                  title: '提示',
                  content: res.data.data,
                  showCancel: false,
                  success: function (res) {
                    if (res.confirm) {
                      wx.navigateBack
                    }
                  }
                })
              }else{
                
              }
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.setData({
      goodName: options.goodName,
      goodUrl: options.goodUrl,
      goodId: options.goodId
    })
    console.log(options)
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