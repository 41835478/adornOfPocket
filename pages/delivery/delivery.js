// pages/address/address.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: 'mall/wx/delivery/list',

    deliveryList: [
      {
        id: 1,
        name: "你好",
        mobile: "15757135983",
        address: "中国武林路346号"
      },
      {
        id: 2,
        name: "你好",
        mobile: "15757135983",
        address: "中国武林路346号"
      },
      {
        id: 3,
        name: "你好",
        mobile: "15757135983",
        address: "中国武林路346号"
      },
    ],
    selectId: 0,
    pageNo:1
  },
  /**
   * input输入
   */
  getData(val) {
    let obj = {};
    let n = val.target.dataset.name;
    obj[n] = val.detail.value;
    this.setData(obj);
  },
  /**
   * 
   */
  select(val) {
    this.setData({
      selectId: val.currentTarget.dataset.index
    })
  },
  /**
   * 跳转
   */
  skipPage(val) {
    let url = val.currentTarget.dataset.url
    wx.navigateTo({
      url: url,
    })
  },
  /**
   * 网络获取地址信息 style: 0 获取第1页5条数据 1 上拉获取数据
   */
  getDataFromNet(style) {
    let that = this
    wx.showLoading({
      title: '加载中',
    })
    let pageNo 
    if(style == 0){
      pageNo = 1;
    }else if(style == 1){
      pageNo = that.data.pageNo +1
    }
    wx.login({
      success: res => {
        console.log(res);
        if (res.code) {
          let url = getApp().globalData.baseUrl + that.data.url + "?wxCode=" + res.code + "&pageNo="+ pageNo +"&pageSize=5"
          if (res.code) {
            wx.request({
              url: url,
              success: res => {
                wx.hideLoading()
                console.log("收货地址:" + res)
                that.setData({
                  deliveryList: res.data,
                  pageNo: pageNo
                })
              },
              fail: err => {
                wx.hideLoading()
                console.log(res)
              }
            })
          }
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.getDataFromNet(0)
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
    this.getDataFromNet(1)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})