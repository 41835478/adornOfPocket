// pages/pay/pay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: 'http://ycb8pe.natappfree.cc/mall/wx/good/findByGoodId?goodId=',
    payUrl: 'http://ycb8pe.natappfree.cc/mall/wx/jsapi/order/preOrder',
    goodInfo: {},
    payInfo: {},
    quantity: 1,
    totalPrice: 0,
    customerOpt: {
      isMessage: true,
      word: ''
    },
    btnTitle: "提交订单",
    showTokenDialog: false,//token优惠券Dialog开关
    deliveryFlag: true,
  },
  /**
   * 获取数据
   */
  getData(e) {
    let obj = {
      customerOpt: {}
    }
    obj.customerOpt[e.currentTarget.dataset.name] = e.detail.value;
    this.setData(obj);
    console.log(this.data.customerOpt);
  },
  /**
   * 页面跳转
   */
  skipToPage(e) {
    console.log(e);
    let url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: url
    })
  },
  /**
   * 打开token列表
   */
  toggleDialog() {
    this.setData({
      showTokenDialog: !this.data.showTokenDialog
    })
  },
  /**
   * 是否发送短信
   */
  isSendMessage(e) {
    this.setData({
      customerOpt: {
        isMessage: e.detail.value
      }
    })
  },
  /**
   * 下单
   */
  gotoPay() {
    this.setData({
      btnTitle: "去支付",
    })
    wx.showLoading({
      title: '加载中',
    })
    let that = this
    var wxcode
    let mainUrl = this.data.payUrl
    let order = {}
    order.goodId = "1"
    order.deliveryId = "3"
    order.orderFee = "1"
    order.count = "1"
    order.message = "尽量快点"
    order.ticket = "1"
    order.userTicket = false
    order.point = "22"
    order.totalFee = "1"
    wx.login({
      success: res => {
        console.log(res);
        if (res.code) {
          let url = mainUrl + "?wxCode=" + res.code + "&order=" + JSON.stringify(order)
          wx.request({
            url: url,
            method: 'GET',
            success: res => {
              console.log(res);
              wx.hideLoading()
              that.setData({
                payInfo: res.data.data
              })
              that.readyToPay()
            },
            fail: function (err) {
              console.log(err);
              wx.hideLoading()
            }
          })
      }
    }
    })
  },
  /**
   * 准备支付
   */
  readyToPay() {
    console.log(this.data.payInfo)
    wx.hideLoading()
    wx.requestPayment({
      timeStamp: this.data.payInfo.timeStamp,
      nonceStr: this.data.payInfo.nonce_str,
      package: 'prepay_id=' + this.data.payInfo.prepay_id,
      signType: 'MD5',
      paySign: this.data.payInfo.paySign,
      'success': function (res) { console.log(res) },
      'fail': function (res) { },
      'complete': function (res) { }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log(options);
    if(options.id){
      wx.showLoading({
        title: '加载中',
      })
      wx.login({
        success: res =>{
          if(res.code){
            let url = 'http://ycb8pe.natappfree.cc/mall/wx/jsapi/order/pay?orderId=' + options.id + '&wxCode=' + res.code
            wx.request({
              url: url,
              success: res => {
                wx.hideLoading()
                console.log(JSON.stringify(res))
                console.log("重新申请 =" + res.data)
                wx.hideLoading()
                wx.requestPayment({
                  timeStamp: res.data.data.timeStamp,
                  nonceStr: res.data.data.nonceStr,
                  package: res.data.data.package,
                  signType: 'MD5',
                  paySign: res.data.data.paySign,
                  'success': function (res) { console.log(res) },
                  'fail': function (res) { },
                  'complete': function (res) { }
                })
              }
            })
          
          }
        }
      })
      
    }else{
      wx.request({
        url: this.data.url + options.goodId,
        method: 'GET',
        success: res => {
          console.log(res.data.data)
          this.setData({
            goodInfo: res.data.data,
            quantity: options.quantity,
          })
          let price = res.data.data.promotion * options.quantity
          this.setData({
            totalPrice: price.toFixed(2)
          })
        }
      })
    }
    
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
    btnTitle: "立即下单"
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
})