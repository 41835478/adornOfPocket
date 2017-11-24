// pages/pay/pay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: 'mall/wx/good/findByGoodId',
    payUrl: 'mall/wx/jsapi/order/preOrder',
    tickUrl: 'mall/wx/ticket/findByUserId',
    goodInfo: {},
    payInfo: {},
    ticketInfo: {},
    selectTicketId: null,
    selectTicketPrice: 0,
    ticketName: '',
    totalPrice: 0,
    userPoint: 0,
    word: '',
    goodImageUrl: '',
    customerOpt: {
      isMessage: true,
      word: ''
    },
    quantity: 1,
    deliveryId: null,
    addressInfo: {},
    btnTitle: "提交订单",
    showTokenDialog: false,//token优惠券Dialog开关
    deliveryFlag: false,
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

    let that = this
    wx.login({
      success: res => {
        if (res.code) {
          wx.request({
            url: getApp().globalData.baseUrl + that.data.tickUrl + '?pageNo=1&pageSize=10' + '&wxCode=' + res.code,
            success: res => {
              console.log('data=====' + JSON.stringify(res.data.list))
              that.setData({
                ticketInfo: res.data.list,
                showTokenDialog: !that.data.showTokenDialog
              })
            }
          })
        }
      }
    })
  },
  /**
   * 选择优惠券
   */
  selectAction(e) {
    let that = this
    let ticketId = e.currentTarget.id
    let price = e.currentTarget.dataset.ticket.reduceMoney
    that.setData({
      selectTicketId: ticketId,
      selectTicketPrice: price,
      ticketName: e.currentTarget.dataset.ticket.ticketName,
      showTokenDialog: !that.data.showTokenDialog
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

    // wx.showModal({
    //   title: '提示',
    //   content: '目前版本还在测试阶段,下单功能暂不提供,敬请谅解!',
    //   showCancel: false,
    //   success: res => {
    //     if (res.confirm) {
    //       wx.navigateBack({

    //       })
    //     }
    //   }
    // })
    // return

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
      let payMoney = that.data.quantity * that.data.goodInfo.price - that.data.selectTicketPrice - that.data.userPoint     //实付金额
      console.log("count = " + that.data.quantity + ";  paymoney=" + payMoney)
      let order = {}
      order.goodId = that.data.goodInfo.id
      order.deliveryId = that.data.deliveryId
      order.orderFee = that.data.quantity * that.data.goodInfo.price
      order.count = that.data.quantity
      order.message = that.data.word
      order.orderType = 2 //手机下单
      if (that.data.selectTicketId) {
        order.useTicket = 1
      } else {
        order.useTicket = 0
      }
      order.ticket = that.data.selectTicketId
      order.point = that.data.userPoint  //消耗积分
      // order.paymentFee = payMoney
      order.paymentFee = 1
      order.reduceFee = that.data.selectTicketPrice       //优惠金额
      order.freightFee = 0       //运费金额
      order.goodFee = that.data.goodInfo.price //商品金额
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
                wx.hideLoading()
                console.log("payInfo=" + JSON.stringify(res))

                if (res.data.error) {
                  wx.showModal({
                    title: '提示',
                    content: res.data.error.message,
                    showCancel: false,
                    success: res => {
                      if (res.confirm) {
                        wx.navigateBack({

                        })
                      }
                    }
                  })
                } else {
                  if (res.data.result == 1) {
                    that.setData({
                      payInfo: res.data.data
                    })
                    that.readyToPay()
                  }
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
          delta: 1
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
          let url = getApp().globalData.baseUrl + 'mall/wx/jsapi/order/pay?orderId=' + this.data.orderId + '&wxCode=' + res.code
          console.log("再次支付:" + url)
          wx.request({
            url: url,
            success: res => {
              wx.hideLoading()
              console.log("重新申请 =" + JSON.stringify(res.data))
              //支付错误情况
              if (res.data.error) {
                wx.showModal({
                  title: '提示',
                  content: res.data.error.message,
                  showCancel: false,
                  success: res => {
                    if (res.confirm) {
                      wx.navigateBack({

                      })
                    }
                  }
                })
              } else {
                wx.requestPayment({
                  timeStamp: res.data.data.timeStamp,
                  nonceStr: res.data.data.nonceStr,
                  package: res.data.data.package,
                  signType: 'MD5',
                  paySign: res.data.data.paySign,
                  'success': function (res) {
                    console.log(res)
                    wx.navigateBack({
                    })
                  },
                  'fail': function (res) { },
                  'complete': function (res) { }
                })
              }
            },
            fail: err => {
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
          goodImageUrl: getApp().globalData.baseImgUrl + res.data.data.mainImgUrl
        })
        let price = res.data.data.promotion * quantity
        this.setData({
          totalPrice: price.toFixed(2),
          quantity: quantity,
        })
        console.log("price=" + price)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let goodId = options.goodId
    let quantity = options.quantity
    console.log("订单id=" + JSON.stringify(options));
    if (options.id) {
      //订单页面而来
      this.setData({
        btnTitle: "去支付",
        orderId: options.id,
        againPay: true
      })
    }
    wx.login({
      success: res => {
        if (res.code) {
          wx.request({
            url: getApp().globalData.baseUrl + 'mall/wx/delivery/findByWxCode?wxCode=' + res.code + '&pageNo=1&pageSize=10',
            success: res => {
              console.log('返回的地址数据' + JSON.stringify(res.data.list[0]))
              that.setData({
                deliveryId: res.data.list[0].id,
                addressInfo: res.data.list[0],
                deliveryFlag: true
              })
            }
          })
        }
      }
    })
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