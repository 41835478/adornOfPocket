// pages/profile/point/point.js
var netWork = require('../../../common/requestTool/request.js')
Page(Object.assign({},netWork,{

  /**
   * 页面的初始数据
   */
  data: {
    url: 'mall/wx/point/pointLog',
    pointInfo: [],
  },
/**
 * 获取积分使用情况
 */
downLoadData(){
  let that = this
  wx.showLoading({
    title: '加载中',
  })
  let params = {}
  params.pageNo = 1,
    params.pageSize = 10,
    netWork.GET({
      url: that.data.url,
      wxCode: true,
      params: params,
      success: res => {
        wx.hideLoading()
        console.log(res.data.list)
        that.setData({
          pointInfo: res.data.list
        })
      },
      fail: err => {
        wx.hideLoading()
        console.log(err)
      }
    })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.downLoadData()
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
}))