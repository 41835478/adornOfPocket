const app = getApp()
var Zan = require('../../../component/zanui-weapp/dist/index');
Page(Object.assign({}, Zan.CheckLabel, {
  // Page({
  /**
   * 页面的初始数据
   */
  data: {
    items: [
      {
        padding: 0,
        value: '1',
        name: '给UI界面的建议',
      },
      {
        padding: 0,
        value: '2',
        name: '给应用使用便利的建议',
      },
      {
        padding: 0,
        value: '3',
        name: '给应用功能的建议',
      },
    ],
    checkedValue: 1,
  },

  handleZanCheckLabelSelect(e){
    this.setData({
      checkedValue: e.value
    });
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
    
  }
}))