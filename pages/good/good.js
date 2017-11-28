// pages/good/good.js
var wxParse = require("../../common/template/wxParse/wxParse.js")
let quantity = require("../../component/zanui-weapp/dist/quantity/index.js")
Page(Object.assign({}, quantity, wxParse, {

  /**
   * 页面的初始数据
   */
  data: {
    goodInfo: {},
    goodSuggest: [],
    id:'', //商品ID
    imageUrl: getApp().globalData.baseImgUrl,
    url: 'mall/wx/good/findByGoodId?goodId=',
    suggestUrl: 'mall/wx/good/findEstimate',
    showDialog: false,//dialog开关
    quantity: 1,//件数
    specs: [{
      id: 0,
      name: "100",
      showSelect: false
    }, {
      id: 1,
      name: "200",
      showSelect: false
    }, {
      id: 2,
      name: "300",
      showSelect: false
    },],
    selectId: 0
  },
  /**
   *跳转付款页面 
   */
  skipToPay(e) {
    console.log(e)
    var goodId = e.currentTarget.id
    this.setData({
      goodId : goodId
    })
    var quantityCount = e.currentTarget.dataset.count
    wx.navigateTo({
      url: '/pages/pay/pay?goodId=' + goodId + '&quantity=' + quantityCount,
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
  chickAction(e) {
    console.log(e)
    for (var i = 0; i < this.data.specs.length; i++) {
      if (e.currentTarget.id == this.data.specs[i].id) {
        this.data.specs[i].showSelect = true
      } else {
        this.data.specs[i].showSelect = false
      }
    }
    this.setData(this.data)
    console.log(this.data.specs)
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

    this.setData({
        id: options.goodId,
    })
    //商品评价
    this.getGoodSuggest(options.goodId)

    console.log("goodis = "+ JSON.stringify(options))

    wx.request({
      url: getApp().globalData.baseUrl + this.data.url + options.goodId,
      method: 'GET',
      success: res => {
        console.log(res.data)
        if(res.data.data){
          this.setData({
            goodInfo: res.data.data,
          })
          var article = res.data.data.rich_content
          var that = this
          wxParse.wxParse('article', 'html', article, that, 0)
        }else{
          //商品已下架
          let err = res.data.error
          wx.showModal({
            title: '提示',
            content: err.message,
            showCancel:false,
            success:res=>{
              if(res.confirm){
                wx.navigateBack({})
              }
            }
          })
        }
      },
      fail:err=>{
        console.log(err)
      }
    })
  },
  /**
   * 获取商品评价
   */
  getGoodSuggest(goodId) {
    let that = this
    let url = getApp().globalData.baseUrl + that.data.suggestUrl + '?goodId=' + goodId + '&pageNo=1&pageSize=5'
    wx.request({
      url: url,
      success: res => {
        that.setData({
          goodSuggest: res.data.data
        })
        console.log("backdata="+ JSON.stringify(res.data.data))
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
      path: '/pages/good/good?goodId='+this.data.id
    }
  }
}))