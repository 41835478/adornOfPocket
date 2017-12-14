const app = getApp()
var Zan = require('../../../component/zanui-weapp/dist/index');
var netWork = require('../../../common/requestTool/request.js')
Page(Object.assign({}, Zan.CheckLabel, netWork, {
  // Page({
  /**
   * 页面的初始数据
   */
  data: {
    url: 'mall/wx/member/suggest',
    items: [
      {
        selected: true,
        value: '0',
        name: '界面优化',
      },
      {
        selected: false,
        value: '1',
        name: '购物体验',
      },
      {
        selected: false,
        value: '2',
        name: '售后服务',
      },
      {
        selected: false,
        value: '3',
        name: '其他建议',
      },
    ],
    checkedValue: 1,
    inputValue: '0',
  },
  /**
   * 点击回调
   */
  handleCheckLabelSelect(e) {
    console.log(e.currentTarget.dataset.data)
    let data = e.currentTarget.dataset.data
    let index = data.value
    let arr = this.data.items
    for (let i = 0; i < arr.length; i++) {
      if (i == index) {
        arr[i].selected = true
      } else {
        arr[i].selected = false
      }
    }
    this.setData({
      checkedValue:data.value,
      items: arr
    })
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
    wx.showLoading({
      title: '加载中',
    })
    wx.login({
      success: res => {
        var params = {}
        params.type = that.data.checkedValue
        params.content = that.data.inputValue
        params.wxCode = res.code
        netWork.POST({
          url: that.data.url,
          params: params,
          success: res => {
            wx.hideLoading()
            console.log(res)
            wx.showModal({
              title: '提示',
              content: '反馈成功!',
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.navigateBack({})
                }
              }
            })
          },
          fail:err=>{
            console.log(err)
            wx.hideLoading()
          }
        })
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