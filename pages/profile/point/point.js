// pages/profile/point/point.js
var netWork = require('../../../common/requestTool/request.js')
Page(Object.assign({},netWork,{
  /**
   * 页面的初始数据
   */
  data: {
    url: 'mall/wx/point/pointLog',
    pointInfo: [],
    windowH: '',
    haveMoreData: true,
    pageNo: 0,
  },
/**
 * 获取积分使用情况
 */
downLoadData(){
  let that = this
  let params = {}
  if (that.data.haveMoreData) {
    params.pageNo = that.data.pageNo + 1
    that.setData({
      haveMoreData:false
    })
  } else {
    console.log("no more data!")
    return
  }
  wx.showLoading({
    title: '加载中',
  })
    params.pageSize = 10,
    netWork.GET({
      url: that.data.url,
      wxCode: true,
      params: params,
      success: res => {
        wx.hideLoading()
        console.log(res.data.list)
        let arr = res.data.list
        let newArr = that.data.pointInfo.concat(arr)
        if (arr.length > 0) {
          that.setData({
            pageNo: res.data.pageNum,
            haveMoreData: true,
            pointInfo: newArr,
          })
        } else {
          console.log("no more data!")
          that.setData({
            haveMoreData: false,
          })
        }
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
      let that = this
      wx.getSystemInfo({
        success: function (res) {
          that.setData({
            windowH: res.windowHeight
          })
        },
      })
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