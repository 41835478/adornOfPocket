const app = getApp()
var Zan = require('../../component/zanui-weapp/dist/index')
var netWork = require('../../common/requestTool/request.js')
// pages/my/my.js
Page(Object.assign({}, Zan.Toast, netWork,{

  /**
   * 页面的初始数据
   */
  data: {
    url: 'mall/wx/point/findByUserId',
    userInfo: {},
    pointInfo: {}
  },
  /**
   * 页面跳转
   */
  pageSkip(val) {
    let url = val.currentTarget.dataset.url;
    console.log("url ===" + url)
    wx.navigateTo({
      url: url
    })
  },
  showToast() {
    // this.showZanToast('toast的内容')
    wx.navigateTo({
      url: '/pages/profile/advice/advice',
    })
  },
  /**
   * 获取积分信息
   */
  getDataFromNet() {
    let that = this
    netWork.GET({
      url:that.data.url,
      wxCode:true,
      success:res=>{
        console.log(res.data)
        let result = res.data.result
        if (result == 1) {
          that.setData({
            pointInfo: res.data.data
          })
        }
      },
      fail:err=>{
        console.log(err)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: app.globalData.userInfo
    })
    // this.getDataFromNet()
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
    this.getDataFromNet()
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
    wx.stopPullDownRefresh();
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