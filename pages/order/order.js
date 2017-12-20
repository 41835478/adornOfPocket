// pages/order/order.js
var Zan = require('../../component/zanui-weapp/dist/tab/index');
var netWork = require('../../common/requestTool/request.js')
Page(Object.assign({}, Zan, netWork, {
  data: {
    url: 'mall/wx/order/findByUserId',
    confirmUrl: 'mall/wx/order/confirmReceipt',
    cancelUrl: 'mall/wx/order/cancelOrder',
    tab: {
      list: [{
        id: 'ALL',
        title: '全部',
      }, {
        id: 'UN_PAY',
        title: '待付款',
      }, {
        id: 'UN_DELIVERY',
        title: '待发货',
      }, {
        id: 'UN_RECEIVE',
        title: '待收货',
      }, {
        id: 'DONE',
        title: '已完成',
      }, {
        id: 'CLOSING',
        title: '已关闭',
      }],
      selectedId: 'ALL',
    },
    goods: [],
    baseImgUrl: getApp().globalData.baseImgUrl,
    windowH: '',
    haveMoreData: true,
    pageNo: 0,
  },
  /**
   * 点击导航切换数据
   */
  handleZanTabChange(e) {
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
    let data = e.currentTarget.dataset.data
    let goodId = e.currentTarget.id;
    console.log(data)
    wx.navigateTo({
      url: '/pages/good/good?goodId=' + goodId + '&activity=' + data.order_type,
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
    let goodId = data.good_id
    wx.navigateTo({
      url: '/pages/pay/pay?orderId=' + id + '&quantity=' + count + '&goodId=' + goodId + '&orderType=' + data.order_type,
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
    if (!selectId) {
      selectId = 'ALL'
    }
    console.log("select=" + e.currentTarget.id)
    let id = e.currentTarget.id
    var params = {}
    params.orderId = id
    netWork.POST({
      url: 'mall/wx/order/refund',
      params: params,
      success: res => {
        wx.hideLoading()
        console.log(res)
        wx.showModal({
          title: '提示',
          content: res.data.data,
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
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
    let status = e.currentTarget.dataset.good.order_status

    if (status == 'UN_RECEIVE') {
      console.log("确认收货!")
      url = that.data.confirmUrl
    } else {
      url = that.data.cancelUrl
    }
    let id = e.currentTarget.id
    console.log("status=" + status + " url = " + url)
    let params = {}
    params.id = id
    netWork.GET({
      url: url,
      params: params,
      success: res => {
        var result = res.data.result
        if (result == 1) {
          wx.showModal({
            title: '提示',
            content: res.data.data,
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log(that.data.selectedId)
                  that.getDataFromNet(0, that.data.selectedId)
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
   * 商品评论
   */
  goodsSuggestAction(e) {
    console.log("评价商品!" + JSON.stringify(e.currentTarget.dataset))
    let goodItem = e.currentTarget.dataset.good
    let goodId = e.currentTarget.id
    let goodName = goodItem.good_name
    let goodUrl = goodItem.good_main_image
    wx.navigateTo({
      url: '/pages/order/evaluate/evaluate?goodId=' + goodId + "&goodName=" + goodName + "&goodUrl=" + goodUrl,
    })
  },

  /**
   * 获取当前列订单信息 e:0 点击刷新
   */
  getDataFromNet(e, selectedId) {
    let that = this
    let pageNo
    if (e == 0) {
      //点击目录刷新
      pageNo = 1
      this.setData({
        pageNo: 1,
        haveMoreData: true
      })
    } else {
      //上拉刷新
      if (this.data.haveMoreData) {
        pageNo = this.data.pageNo + 1
        that.setData({
          haveMoreData:false
        })
      } else {
       console.log("no more data!")
        return
      }
    }
    //根据selectId设置请求orderStatus
    var status = ''
    console.log("code=" + selectedId + "  e= " + e)
    if(selectedId){
      status = selectedId
      wx.setStorageSync('selectedId', selectedId)
      that.downLoadData(pageNo,status,e)
    }else{
      wx.getStorage({
        key: 'selectedId',
        //重载
        success: function (res) {
          if (res) {
            console.log("selectedId=" + res.data)
            status = res.data
            that.downLoadData(pageNo, status,e)
          }
        },
        //初始化
        fail: function (err) {
            status = 'ALL'
            that.downLoadData(pageNo, status,e)
        },
      })
    }
  },
/**
 * 下载数据
 */
downLoadData(pageNo,status,e){
  let that = this
  wx.showLoading({
    title: '加载中',
  })
  var params = {}
  params.pageNo = pageNo
  params.pageSize = 10
  params.orderStatus = status
  netWork.GET({
    url: that.data.url,
    wxCode: true,
    params: params,
    success: res => {
      console.log(res)
      if (res.statusCode == 200) {
        console.log(res.data.list)
        if (e == 0) {
          that.setData({
            goods: res.data.list,
            pageNo: res.data.pageNum
          })
          wx.hideLoading()

        } else {
          let arr = that.data.goods.concat(res.data.list)
          if (res.data.list.length > 0) {
            that.setData({
              goods: arr,
              haveMoreData: true,
              pageNo: res.data.pageNum
            })
            wx.hideLoading()

          } else {
            that.setData({
              haveMoreData: false
            })
            wx.hideLoading()

          }
        }
      }
    },
    fail: err => {
      wx.hideLoading()
      console.log(err)
    }
  })
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowH: res.windowHeight
        })
      },
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
      fail: function (err) {
        that.getDataFromNet(0, 'ALL')
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
    wx.stopPullDownRefresh();
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