// pages/order/order.js
var Zan = require('../../component/zanui-weapp/dist/tab/index');
Page(Object.assign({}, Zan, {
  data: {
    url: 'mall/wx/order/findByUserId',
    confirmUrl: 'mall/wx/order/confirmReceipt',
    cancelUrl: 'mall/wx/order/cancelOrder',
    tab: {
      list: [{
        id: 'all',
        title: '全部',
      }, {
        id: 'topay',
        title: '待付款',
      }, {
        id: 'tosend',
        title: '待发货',
      }, {
        id: 'send',
        title: '待收货',
      }, {
        id: 'sign',
        title: '已完成',
      }, {
        id: 'close',
        title: '已关闭',
      }],
      selectedId: 'all',
      scroll: false,
      fixed: true
    },
    wxCode: '', //微信code
    lastPage: false,
    pageComplete: true,
    pageNo: 1,
    goods: [],
    selectType: '',//当前目录
    goodsTest: '',
    baseImgUrl: getApp().globalData.baseImgUrl,
  },
  handleZanTabChange(e) {
    console.log(e)
    var componentId = e.componentId;
    var selectedId = e.selectedId;
    //控制选中样式
    this.setData({
      [componentId + `.selectedId`]: selectedId
    });
    console.log("selected ==" + selectedId)
    this.getDataFromNet(0, selectedId)
  },
  /**
   * 再次购买
   */
  goodsBuyAction(e) {
    var data = {}
    data = e.currentTarget.id;
    console.log("data====" + data.id)
    wx.navigateTo({
      url: '/pages/good/good?goodId=' + data,
    })
  },
  /**
   * 去付款
   */
  goodsPayAction(e) {
    var data = {}
    data = e.currentTarget.dataset.good;
    console.log("data====" + JSON.stringify(data))
    let id = data.id
    let count = data.count
    let goodId = data.goodId
    wx.navigateTo({
      url: '/pages/pay/pay?id=' + id + '&quantity=' + count + '&goodId=' + goodId,
    })
  },
  /**
   * 去退款
   */
  goodsBackAction(e) {
    let that = this
    wx.showLoading({
      title: '加载中',
    })
    let selectId = this.data.selectedId
    if(!selectId){
      selectId = 'all'
    }
    console.log("select=" + selectId)
    var data = {}
    data = e.currentTarget;
    console.log(e.currentTarget)
    let url = getApp().globalData.baseUrl + 'mall/wx/order/refund?orderId=' + data.id
    wx.request({
      url: url,
      method: 'POST',
      success: res => {
        wx.hideLoading()
        console.log(res.data)
        wx.showModal({
          title: '提示',
          content: res.data.data,
          showCancel:false,
          success:function(res){
            if(res.confirm){
              that.getDataFromNet(0, selectId)
            }
          }
        })
      },
      fail: err => {
        wx.hideLoading()
        console.log(err)
      }
    })
  },
  /**
   * 确认收货,取消订单
   */
  confirmGood(e) {
    let url 
    let that = this
    let status = e.currentTarget.dataset.good.orderStatus
    console.log("status="+status)
    if (status == 3) {
      console.log("确认收货!")
      url = getApp().globalData.baseUrl + that.data.confirmUrl
    }
    if (status == 1) {
      console.log("取消订单!")
      url = getApp().globalData.baseUrl + that.data.cancelUrl
    }
    let id = e.currentTarget.id
    wx.login({
      success: res => {
        if (res.code) {
          let requestUrl = url + '?id=' + id + '&wxCode=' + res.code
          console.log("url=" + requestUrl)
          wx.request({
            url:requestUrl,
            success: res => {
              var result = res.data.result
              if (result == 1) {
                wx.showModal({
                  title: '提示',
                  content: res.data.data,
                  showCancel:false,
                  success: function (res) {
                    if (res.confirm) {
                      that.getDataFromNet(0, that.data.selectedId)
                    }
                  }
                })
              }
              console.log("返回数据=" + JSON.stringify(res.data))
            }
          })
        }
      }
    })
  },
  /**
   * 商品评论
   */
  goodsSuggestAction(e){
      console.log("评价商品!"+JSON.stringify(e.currentTarget.dataset))
      let goodItem = e.currentTarget.dataset.good
      let goodId = e.currentTarget.id
      let goodName = goodItem.goodName
      let goodUrl = goodItem.goodMainImage
      wx.navigateTo({
        url: '/pages/order/evaluate/evaluate?goodId='+goodId+"&goodName="+goodName+"&goodUrl="+goodUrl,
      })
  },
  /**
   * 获取当前列订单信息 e:0 导航栏点击 1:上拉刷新
   */
  getDataFromNet(e, selectedId) {

    let that = this
    wx.showLoading({
      title: '加载中',
    })
    let pageNo
    if (e == 0) {
      that.setData({
        pageNo: 1
      })
      pageNo = 1
    } else
      if (e == 1) {
        pageNo = this.data.pageNo + 1
        if (that.data.lastPage || !that.data.pageComplete) {
          wx.hideLoading()
          return;
        }
        // 防止过度频繁请求
        this.setData({
          pageComplete: false
        })
      }
    //根据selectId设置请求orderStatus
    var status = 0
    console.log("code=" + selectedId)
    if (selectedId == 'all') {
      status = 0
    }
    if (selectedId == 'topay') {
      status = 1
    }
    if (selectedId == 'tosend') {
      status = 2
    }
    if (selectedId == 'send') {
      status = 3
    }
    if (selectedId == 'sign') {
      status = 4
    }
    if(selectedId == 'close'){
      status = 6
    }
    wx.setStorageSync('selectedId', selectedId)

    wx.login({
      success: res => {
        console.log(res);
        if (res.code) {
          let url = getApp().globalData.baseUrl + that.data.url + "?wxCode=" + res.code + "&pageNo=" + pageNo + "&pageSize=5" + "&orderStatus=" + status
          console.log(url)
          wx.request({
            url: url,
            method: 'GET',
            success: function (res) {
              wx.hideLoading()
              if (res.statusCode == 200) {
                console.log(res);
                if (e == 0) {
                  that.setData({
                    goods: res.data.list,
                    lastPage: res.data.lastPage,
                    pageComplete: true,
                    pageNo: pageNo
                  })
                } else {
                  let arr = that.data.goods.concat(res.data.list);
                  console.log(res.data.list)
                  that.setData({
                    goods: arr,
                    lastPage: res.data.lastPage,
                    pageComplete: true,
                    pageNo: pageNo
                  })
                }
              }
            },
            fail: function (err) {
              wx.hideLoading()
              console.log(err)
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
    // this.getDataFromNet(0, 'all')
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
    //重新进入页面刷新数据
    let that = this
    wx.getStorage({
      key: 'selectedId',
      //重载
      success: function (res) {
        if (res) {
          console.log("onshow and selectedId=" + res.data)
          that.getDataFromNet(0, res.data)
        } 
      },
      //初始化
      fail:function(err){
        console.log("onshow and selectedId=all")
        that.getDataFromNet(0, 'all')
      },
    })
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

    let that = this
    wx.getStorage({
      key: 'selectedId',
      success: function (res) {
        if (res) {
          that.getDataFromNet(1, res.data)
        }
      },
      fail:function(err){
        that.getDataFromNet(1, "all")
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
}))