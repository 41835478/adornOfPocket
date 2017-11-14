// pages/address/address.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: 'mall/wx/delivery/findByWxCode',
    deliveryList: [],
    selectId: 0,
    pageNo: 1,
    lastPage: false,
    completData:false
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
    let id = val.currentTarget.id
    if (id == 'add') {
      let addUrl = '/pages/delivery/deliveryDetail/deliveryDetail?flag=1'
      wx.navigateTo({
        url: addUrl,
      })
    }
    if (id == 'modify') {
      console.log("val=", val)
      var modityData = val.currentTarget.dataset.address
      let modifyUrl = '/pages/delivery/deliveryDetail/deliveryDetail?flag=0&id=' + modityData.id + '&data=' + JSON.stringify(modityData)
      wx.navigateTo({
        url: modifyUrl,
      })
    }
  },
  /**
   * 网络获取地址信息
   */
  getDataFromNet() {
    wx.showLoading({
      title: '加载中',
    })
    let that = this
    console.log("是否最后一页:",that.data.lastPage)
    if (that.data.lastPage) {
      wx.hideLoading()
      return
    }
    
    let pageNo
    if (that.data.completData) {
      pageNo = that.data.pageNo + 1;
    } else {
      pageNo = 1
    }
    wx.login({
      success: res => {
        console.log(res);
        if (res.code) {
          let url = getApp().globalData.baseUrl + that.data.url + "?wxCode=" + res.code + "&pageNo=" + pageNo + "&pageSize=5"
          console.log("url=" + url)
          if (res.code) {
            wx.request({
              url: url,
              success: res => {
                wx.hideLoading()
                let arr = that.data.deliveryList.concat(res.data.list)
                console.log(JSON.stringify(res.data))
                if (res.data.list.length > 0) {
                  that.setData({
                    deliveryList: res.data.list,
                    pageNo: pageNo,
                    completData:true
                  })
                } else {
                  that.setData({
                    lastPage: true,
                  })
                }

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

    this.getDataFromNet()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
      this.setData({
        lastPage:false,
        completData:false
      })
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
    this.getDataFromNet()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})