// pages/ticket/ticket.js
var netWrok = require('../../common/requestTool/request.js')

Page(Object.assign({},netWrok, {

  /**
   * 页面的初始数据
   */
  data: {
    url: 'mall/wx/ticket/findByUserId',
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

  },
/**
 * 我的优惠券
 */
  myTicketAction() {
   wx.showLoading({
     title: '加载中',
   })
    let that = this
    let params = {}
    params.pageNo = 1
    params.pageSize = 10
    netWrok.GET({
      url: 'mall/wx/ticket/findByUserId',
      params: params,
      wxCode: true,
      success: res => {
        wx.hideLoading()
        console.log(res)
        var arr = res.data.list
        that.setData({
          ticketList: arr
        })
      },
      fail: err => {
        wx.hideLoading()
        console.log(err)
      }
    })
  },

  /**
   * 获取全部优惠券信息
   */
  getDataFromNet() {
    wx.showLoading({
      title: '加载中',
    })
    let that = this
    let params = {}
    params.pageSize = 10
    params.pageNo = 1
    netWrok.GET({
      url: 'mall/wx/ticket/findAll',
      params: params,
      success: res => {
        wx.hideLoading()
        console.log(res.data)
        var arr = res.data.list
        that.setData({
          ticketList: arr
        })
      },
      fail: err => {
        wx.hideLoading()
        console.log(err)
      }
    })
  },
  /**
   * 领取优惠券 
   */
  selectAction(e) {
    let that = this
    let params = {}
    params.ticketId = e.currentTarget.id
    netWrok.GET({
      url: 'mall/wx/ticket/getTicket',
      wxCode: true,
      params: params,
      success: res => {
        console.log("优惠券结果:" + JSON.stringify(res.data))
        if (res.data.result == 1) {
          wx.showModal({
            title: '提示',
            content: '领取成功',
            showCancel: false,
          })
        } else {
          wx.showModal({
            title: '提示',
            content: res.data.error.message,
            showCancel: false,
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
}))