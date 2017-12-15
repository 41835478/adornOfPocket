// pages/good/good.js
var wxParse = require("../../common/template/wxParse/wxParse.js")
let quantity = require("../../component/zanui-weapp/dist/quantity/index.js")
var netWork = require("../../common/requestTool/request.js")
Page(Object.assign({}, quantity, wxParse, netWork, {

  /**
   * 页面的初始数据
   */
  data: {
    goodInfo: {},
    goodSuggest: [],
    id: '', //商品ID
    imageUrl: getApp().globalData.baseImgUrl,
    goodUrl: 'mall/wx/good/findByGoodId',
    suggestUrl: 'mall/wx/good/findEstimate',
    showDialog: false,//dialog开关
    quantity: 1,//件数
    selectId: 0,
    activity: false,    //是否活动商品
    activityStyle: '', //活动类型
    btnTitle:'', //按钮标题
    btnBindTap:true
  },
  /**
   *跳转付款页面 
   */
  skipToPay(e) {
    console.log(e)
    var goodId = e.currentTarget.id
    this.setData({
      goodId: goodId
    })
    var quantityCount = e.currentTarget.dataset.count
    wx.navigateTo({
      url: '/pages/pay/pay?goodId=' + goodId + '&quantity=' + quantityCount + '&activity=' + this.data.activityStyle,
    })
  },
  /**
   * 购物数量事件
   */
  handleZanQuantityChange(e) {
    console.log(e)
    this.setData({
      quantity: e.quantity
    })
  },
  /**
   * 打开dialog
   */
  toggleDialog() {
    this.setData({
      showDialog: !this.data.showDialog
    })
  },
  /**
   * 打开选择数量页面
   */
  openDialog() {

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //商品id
    this.setData({
      id: options.goodId,
    })

    //商品评价
    // this.getGoodSuggest(options.goodId)

    //活动商品
    if (options.activity) {
      this.setData({
        activity: true,
        activityStyle: options.activity
      })
    }
    //商品详情
    this.getGoodDetail(options)
  },
  /**
   * 获取商品详情
   */
  getGoodDetail(options) {
    let that = this
    var params = {}
    params.goodId = options.goodId
    netWork.GET({
      url: that.data.goodUrl,
      params: params,
      success: res => {
        console.log(res.data)
        if (res.data.data) {
          var goodItem = res.data.data
          var btn_title = ''
          var btn_canBindtap = true
          if (that.data.activity){
            if (goodItem.activity_stock>0){
              if (that.data.activityStyle == 'FREE_ORDER'){
                btn_title = '立即试用'
              }else{
                btn_title = '立即下单'
              }
            }else{
              btn_title = '货源不足'
              btn_canBindtap = false
            }
          }else{
            if(goodItem.stock>0){
              btn_title = '立即下单'
            }else{
              btn_title = '货源不足'
              btn_canBindtap = false
            }
          }
          that.setData({
            goodInfo: res.data.data,
            btnTitle: btn_title,
            btnBindTap:btn_canBindtap
          })
          var article = res.data.data.rich_content
          wxParse.wxParse('article', 'html', article, that, 0)
        } else {
          //商品已下架
          let err = res.data.error
          wx.showModal({
            title: '提示',
            content: err.message,
            showCancel: false,
            success: res => {
              if (res.confirm) {
                wx.navigateBack({})
              }
            }
          })
        }
      },
      fail: err => {
        console.log(err)
      }
    })
  },

  /**
   * 获取商品评价
   */
  getGoodSuggest(goodId) {
    let that = this
    let param = {}
    param.goodId = goodId
    param.pageNo = 1
    param.pageSize = 5
    netWork.GET({
      url:that.data.suggestUrl,
      params:param,
      success:res=>{
        console.log(res)
        that.setData({
          goodSuggest: res.data.data
        })
      },
      fail:err=>{
        console.log(err)
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
    return {
      title: '爱美的人都爱妆口袋',
      path: '/pages/good/good?goodId=' + this.data.id
    }
  }
}))