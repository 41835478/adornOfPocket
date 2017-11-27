const app = getApp()
var Zan = require('../../component/zanui-weapp/dist/index')
// pages/my/my.js
Page(Object.assign({}, Zan.Toast, {

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
   * 查看积分使用情况
   */
  checkPointAction() {
    console.log("积分查看")
    wx.navigateTo({
      url: '/pages/profile/point/point',
    })
  },
  /**
   * test 接口
   */
  anctions() {
    // wx.showLoading({
    //   title: '加载中',
    // })
    //  wx.login({
    //    success:res=>{
    //      if(res.code){
    //        wx.request({
    //          url: getApp().globalData.baseUrl +'mall/wx/delivery/findById?id=10',
    //          success:res=>{
    //            wx.hideLoading()
    //            if(res.data.result == 1){
    //              console.log( res.data.data)
    //            }else{
    //              console.log(res.data)
    //            }
    //          },
    //          fail: err =>{
    //            wx.hideLoading()
    //          }
    //        })
    //      }
    //    }
    //  })
  },

  /**
   * 获取积分信息
   */
  getDataFromNet() {
    let that = this
    wx.login({
      success: res => {
        if (res.code) {
          let wxCode = res.code
          let url = getApp().globalData.baseUrl + this.data.url + "?wxCode=" + wxCode
          console.log("url = " + url)
          wx.request({
            url: url,
            success: res => {
  console.log("data="+res.data)
              let result = res.data.result
              if (result == 1) {
                that.setData({
                  pointInfo: res.data.data
                })
              }
              console.log("backData=" + JSON.stringify(res.data.data))
            },
            fail: err => {

              console.log("err=" + JSON.stringify(err))
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
      userInfo: app.globalData.userInfo
    })
    this.getDataFromNet()
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