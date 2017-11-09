// pages/order/order.js
var Zan = require('../../component/zanui-weapp/dist/tab/index');
Page(Object.assign({}, Zan, {
  data: {
    url: 'http://ycb8pe.natappfree.cc/mall/wx/order/findByUserId',
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
   * 去付款
   */
  goodsPayAction(e) {
    var data = {}
    data = e.currentTarget;
    console.log("data====" + data.id)
    let goodsId = data.id
    wx.navigateTo({
      url: '/pages/pay/pay?id=' + goodsId,
    })
  },
  goodsBackAction(e){
    var data = {}
    data = e.currentTarget;
    let url = 'http://ycb8pe.natappfree.cc/mall/wx/order/refund'
    wx.request({
      url: url,
      method: 'POST',
      data:{'orderId':data.id},
      success: res =>{

      }
      
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
    }//+that.data.wxCode
    wx.setStorageSync('selectedId',selectedId)

    wx.login({
      success: res => {
        console.log(res);
        if (res.code) {
          let url = that.data.url + "?wxCode=" + res.code + "&pageNo=" + pageNo + "&pageSize=5" + "&orderStatus=" + status
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
      success: function(res) {
        if(res){
          // console.log("onshow and selectedId=" + res.data)
          that.getDataFromNet(0, res.data)
        }else{
          that.getDataFromNet(0,'all')
        }
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
    this.getDataFromNet(1)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
}))