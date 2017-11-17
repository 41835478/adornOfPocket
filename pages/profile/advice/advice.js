const app = getApp()
var Zan = require('../../../component/zanui-weapp/dist/index');
Page(Object.assign({}, Zan.CheckLabel, {
  // Page({
  /**
   * 页面的初始数据
   */
  data: {
    url: 'mall/wx/member/suggest',
    items: [
      {
        padding: 0,
        value: '0',
        name: '给小程序界面优化的建议',
      },
      {
        padding: 0,
        value: '1',
        name: '给购物体验的建议',
      },
      {
        padding: 0,
        value: '2',
        name: '给售后服务的建议',
      },
      {
        padding: 0,
        value: '3',
        name: '其他建议',
      },
    ],
    checkedValue: 1,
    inputValue: '0',
  },
  /**
   * template回调
   */
  handleZanCheckLabelSelect(e) {
    this.setData({
      checkedValue: e.value
    });
  },
  /**
   * 页面数据保存
   */
  inputDataAction(e) {
    this.setData({
      inputValue: e.detail.value
    })
    console.log("输入的建议为:" + this.data.inputValue)
  },
  /**
   * 提交建议
   */
  btnAction() {
    let that = this
    wx.login({
      success: res => {
        var params = {}
        params.type = that.data.checkedValue
        params.content = that.data.inputValue
        params.wxCode = res.code
        if (res.code) {
          wx.request({
            url: getApp().globalData.baseUrl + that.data.url,
            data: params,
            method: 'POST',
            success: res => {
              console.log('data=' + JSON.stringify(res.data))
              
              wx.showModal({
                title: '提示',
                content: '反馈成功!',
                showCancel:false,
                success: function (res) {
                  if (res.confirm) {
                      wx.navigateBack({})
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
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