// pages/pay/pay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: 'mall/wx/good/findByGoodId',
    payUrl: 'mall/wx/jsapi/order/preOrder',
    goodInfo: {},
    payInfo: {},
    totalPrice: 0,
    word: '',
    customerOpt: {
      isMessage: true,
      word: ''
    },
    quantity:1,
    btnTitle: "提交订单",
    showTokenDialog: false,//token优惠券Dialog开关
    deliveryFlag: true,
    orderId: '', //订单ID
    againPay: false //订单页过来
  },
  /**
   * 获取数据
   */
  getData(e) {
    let obj = {
      customerOpt: {}
    }
    var word = e.detail.value;
    this.setData({
      word: word
    });
    console.log("给卖家留言 =" + this.data.word);
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
   * 点击按钮 下单/付款
   */
  gotoPay() {

    if (this.data.againPay) {
        //去完成已下单的付款

        this.againToPay()

    } else {
      //第一次下单
      this.setData({
        btnTitle: "去支付",
      })
      wx.showLoading({
        title: '加载中',
      })
      let that = this
      var wxcode

      console.log("count = " + that.data.quantity)
      let order = {}
      order.goodId = that.data.goodInfo.id
      order.deliveryId = "10"
      order.orderFee = that.data.quantity * that.data.goodInfo.price
      order.count = that.data.quantity
      order.message = that.data.word
      order.ticket = "1"
      order.point = 22
      order.paymentFee = 1    //实付金额
      order.reduceFee = 0       //优惠金额
      order.freightFee = 0       //运费金额
      order.goodFee =  that.data.goodInfo.price //商品金额
      console.log("第一次下单order = " + JSON.stringify(order))
      wx.login({
        success: res => {
          console.log(res);
          if (res.code) {
            let url = getApp().globalData.baseUrl + that.data.payUrl + "?wxCode=" + res.code + "&order=" + JSON.stringify(order)
            console.log("下单地址:" + url)
            wx.request({
              url: url,
              method: 'GET',
              success: res => {
                console.log(res);
                wx.hideLoading()
                console.log("payInfo=" + JSON.stringify(res))
                if (res.data.result == 1) {
                  that.setData({
                    payInfo: res.data.data
                  })
                  that.readyToPay()
                }
              },
              fail: function (err) {
                console.log(err);
                wx.hideLoading()
              }
            })
          }
        }
      })
    }
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
      'success': function (res) { 
        console.log(res)
        wx.navigateBack({
          delta:1
        })
         },
      'fail': function (res) { },
      'complete': function (res) { }
    })
  },
  /**
   * 订单页面重新付款
   */
  againToPay() {
    
    wx.login({
      success: res => {
        wx.showLoading({
          title: '加载中',
        })
        if (res.code) {
          let url = getApp().globalData.baseUrl + 'wx/jsapi/order/pay?orderId=' + options.id + '&wxCode=' + res.code
          wx.request({
            url: url,
            success: res => {
              wx.hideLoading()
              console.log("重新申请 =" + res.data)
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
  },
  /**
   * 获取商品信息
   */
  getGoodInfo(goodId, quantity) {
    wx.request({
      url: getApp().globalData.baseUrl + this.data.url + "?goodId=" + goodId,
      method: 'GET',
      success: res => {
        console.log(res.data.data)
        this.setData({
          goodInfo: res.data.data,
        })
        let price = res.data.data.promotion * quantity
        this.setData({
          totalPrice: price.toFixed(2),
          quantity: quantity
        })
        console.log("price=" + price)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let goodId = options.goodId
    let quantity = options.quantity
    console.log("订单id=" + JSON.stringify(options));
    if (options.id) {
      //订单页面而来
      this.setData({
        btnTitle: "去支付",
        orderId: options.id,
        againPay:true
      })
    }
    //获取商品信息
    this.getGoodInfo(goodId, quantity)
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