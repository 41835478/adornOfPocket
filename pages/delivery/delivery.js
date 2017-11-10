// pages/address/address.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: 'mall/wx/delivery/list',

    deliveryList: [],
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
          console.log("url=" +url)
          if (res.code) {
            wx.request({
              url: url,
              success: res => {
                wx.hideLoading()
                let str =JSON.stringify(res.data)
                console.log("收货地址:" + str)
                that.setData({
                  deliveryList: res.data.list,
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

    this.getDataFromNet(0)
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