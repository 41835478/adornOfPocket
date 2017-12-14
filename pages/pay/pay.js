// pages/pay/pay.js
var netWork = require('/../..//common/requestTool/request.js')
Page(Object.assign({}, netWork, {

  /**
   * 页面的初始数据
   */
  data: {
    url: 'mall/wx/good/findByGoodId',
    payUrl: 'mall/wx/jsapi/order/unifiedOrder',
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
    goodPrice: '',
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
    orderId:'', //订单id
    againPay: false,    //是否订单页过来
    activity: false,      //商品页传入,是否活动商品
    goodType: '',     //活动类型
  },
  /**
   * 给商家留言
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
   * 获取优惠券列表
   */
  toggleDialog() {

    let that = this
    let params = {}
    params.pageNo = 1
    params.pageSize = 10
    netWork.GET({
      url: that.data.tickUrl,
      params: params,
      wxCode: true,
      success: res => {
        console.log('data=====' + JSON.stringify(res.data.list))
        let arr = res.data.list
        arr = that.subString(arr)
        that.setData({
          ticketInfo: arr,
          showTokenDialog: !that.data.showTokenDialog
        })
      }
    })
  },
  /**
   * 选择优惠券
   */
  selectAction(e) {
    let that = this
    let ticketId = e.currentTarget.id
    let price = e.currentTarget.dataset.ticket.reduce_money
    that.setData({
      selectTicketId: ticketId,
      selectTicketPrice: price,
      ticketName: e.currentTarget.dataset.ticket.ticket_name,
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

    console.log(this.data.goodInfo)

    //测试 防止购买商品

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

    let that = this
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

      //判断商品类型
      if (that.data.activity) {
        if (that.data.goodType == 'FREE_ORDER') {
          //试用商品下单
          let url = 'mall/wx/free/apply'
          that.payActivityGood(url,1)
        } else if (that.data.goodType == 'SPELL_GROUP_ORDER') {
          //拼团商品下单
          let url = 'mall/wx/activity/joinGroup'
          that.payActivityGood(url,2)
        }
      } else {
        //普通商品下单
        that.payNormalGood()
      }
    }
  },

  /**
   * 正常商品支付
   */
  payNormalGood() {
    //正常商品支付
    let that = this
    let payMoney = that.data.quantity * that.data.goodInfo.price - that.data.selectTicketPrice - that.data.userPoint     //实付金额
    console.log("count = " + that.data.quantity + ";  paymoney=" + payMoney)
    let order = {}
    order.good_id = that.data.goodInfo.id
    order.delivery_id = that.data.deliveryId
    order.order_fee = that.data.quantity * that.data.goodInfo.price
    order.count = that.data.quantity
    order.message = that.data.word
    order.order_type = 2 //手机下单
    if (that.data.selectTicketId) {
      order.use_ticket = 1
    } else {
      order.use_ticket = 0
    }
    order.ticket = that.data.selectTicketId
    order.point = that.data.userPoint  //消耗积分
    order.payment_fee = 1
    order.reduce_fee = that.data.selectTicketPrice       //优惠金额
    order.freight_fee = 0       //运费金额
    order.good_fee = that.data.goodInfo.price //商品金额

    let params = {}
    params.order = order
    netWork.GET({
      url: that.data.payUrl,
      params: params,
      wxCode: true,
      success: res => {
        wx.hideLoading()
        console.log(res);
        if (res.data.error) {
          wx.showModal({
            title: '提示',
            content: res.data.error.message,
            showCancel: false,
            success: res => {
              if (res.confirm) {
                wx.navigateBack({})
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
      }
    })
  },
  /**
   * 活动商品支付
   */
  payActivityGood(url,goodType) {
    let that = this
    //拼团商品支付
    wx.login({
      success: res => {
        let wxFreeOrder = {}
        wxFreeOrder.wx_code = res.code
        wxFreeOrder.activity_id = that.data.goodInfo.activity_id
        wxFreeOrder.good_id = that.data.goodInfo.id
        wxFreeOrder.delivery_id = that.data.deliveryId
        wxFreeOrder.good_fee = that.data.goodInfo.price
        wxFreeOrder.order_fee = that.data.goodInfo.price
        if(goodType == 1){
          wxFreeOrder.payment_fee = 1
        }else if(goodType == 2){
          wxFreeOrder.payment_fee = 2
        }
        netWork.POST({
          url: url,
          params: wxFreeOrder,
          success: res => {
            console.log(res.data)
            if (res.data.result == 1) {
              that.setData({
                payInfo: res.data.data
              })
              that.readyToPay()
            } else {
              wx.hideLoading(),
                wx.showToast({
                  title: '支付失败',
                })
            }
          },
          fail: err => {
            wx.hideLoading()
          }
        })
      }
    })
  },

  /**
   * 订单页面重新付款
   */
  againToPay() {

    let url = ''
    if (this.data.goodType =='FREE_ORDER'){
      url = 'mall/wx/free/pay'
  }else{
      url = 'mall/wx/jsapi/order/pay'
  }
    wx.showLoading({
      title: '加载中',
    })
    let params = {}
    params.orderId = this.data.orderId
    netWork.GET({
      url: url,
      params: params,
      wxCode: true,
      success: res => {
        wx.hideLoading()
        //支付错误情况
        if (res.data.error) {
          wx.showModal({
            title: '提示',
            content: res.data.error.message,
            showCancel: false,
            success: res => {
              if (res.confirm) {
                wx.navigateBack({})
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
        console.log(err)
      }
    })
  },
  /**
   * 微信支付
   */
  readyToPay() {
    console.log(this.data.payInfo)
    wx.hideLoading()
    wx.requestPayment({
      timeStamp: this.data.payInfo.timeStamp,
      nonceStr: this.data.payInfo.nonceStr,
      package: this.data.payInfo.package,
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let that = this
    let goodId = options.goodId
    let quantity = options.quantity
    console.log("订单id=" + JSON.stringify(options));

    //是否订单页而来
    if (options.orderId) {
      that.setData({
        btnTitle: "去支付",
        againPay: true,
        goodType: options.activityType,
        orderId:options.orderId
      })
      //获取商品快照信息
      this.getGoodSnapshotData(options.orderId, quantity)
    } else {
      if (options.activity) {
        that.setData({
          activity: true,
          goodType: options.activity
        })
      }
      //获取商品信息
      this.getGoodInfo(goodId, quantity)
    }

    console.log("goodtype=" + that.data.goodType)

    //获取默认地址
    this.getDefaultAddress()
  },
  /**
   * 获取默认地址
   */
  getDefaultAddress() {
    wx.showLoading({
      title: '加载中',
    })
    let that = this
    netWork.GET({
      url: 'mall/wx/delivery/getDefault',
      wxCode: true,
      success: res => {
        wx.hideLoading()
        console.log('返回的地址数据' + JSON.stringify(res.data))
        if (res.data.result == 1) {
          that.setData({
            deliveryId: res.data.data.id,
            addressInfo: res.data.data,
            deliveryFlag: true
          })
        }
      },
      fail: err => {
        console.log(err)
        wx.hideLoading()
      }
    })
  },
  /**
   * 获取商品信息
   */
  getGoodInfo(goodId, quantity) {
    let that = this
    let params = {}
    params.goodId = goodId
    netWork.GET({
      url: that.data.url,
      params: params,
      success: res => {
        console.log(res.data.data)
        that.setData({
          goodInfo: res.data.data,
          goodImageUrl: getApp().globalData.baseImgUrl + res.data.data.main_image_url
        })
        let price = res.data.data.promotion * quantity
        that.setData({
          totalPrice: price.toFixed(2),
          quantity: quantity,
          goodPrice: res.data.data.promotion
        })
        console.log("price=" + price)
      }
    })
  },
  /**
   * 获取商品快照ID
   */
  getGoodSnapshotData(orderId, quantity) {
    let param = {}
    let that = this
    param.orderId = orderId
    netWork.GET({
      url: 'mall/wx/good/findByGoodSnapshotDetail',
      params: param,
      success: res => {
        console.log(res)
        that.setData({
          goodInfo: res.data.data,
          goodImageUrl: getApp().globalData.baseImgUrl + res.data.data.main_image_url
        })
        let price = res.data.data.price * quantity
        that.setData({
          totalPrice: price.toFixed(2),
          quantity: quantity,
          goodPrice: res.data.data.price,
        })
      }
    })
  },

  /**
 * 字符串截取
 */
  subString(arr) {
    for (let i = 0; i < arr.length; i++) {
      var startDate = arr[i].start_date
      arr[i].start_date = startDate.substring(0, 10)
      var endDate = arr[i].end_date
      arr[i].end_date = endDate.substring(0, 10)
    }
    return arr
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
}))