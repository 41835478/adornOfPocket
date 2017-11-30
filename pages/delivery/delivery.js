// pages/address/address.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    url: 'mall/wx/delivery/findByWxCode',
    deliveryList: [],
    showList: [],
    showSelected: false,
    pageNo: 1,
    defaultSelect: 0,
    flag: '',
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
   * 现在默认地址
   */
  select(val) {

    let flag = this.data.flag
    if (flag == 1) {
      let item = val.currentTarget.dataset.index
      var pages = getCurrentPages()
      var prevPage = pages[pages.length - 2]
      prevPage.setData({
        addressInfo: item,
        deliveryId: item.id
      })
      wx.navigateBack({})
    } else {
      wx.showLoading({
        title: '加载中',
      })
      let that = this
      let index = val.currentTarget.id
      let item = val.currentTarget.dataset.index
      console.log("default address=" + JSON.stringify(index) + "item=" + JSON.stringify(item) + "addressArr=" + that.data.showList)

      wx.login({
        success: res => {
          if (res.code) {
            wx.request({
              url: getApp().globalData.baseUrl + 'mall/wx/delivery/defaultAddress' + '?wxCode=' + res.code + '&id=' + item.id,
              success: res => {
                wx.hideLoading()
                console.log("address  =====" + JSON.stringify(res.data))
                // 刷新页面数据
                let newArr = that.data.showList
                for (let i = 0; i < newArr.length; i++) {
                  if (i == index) {
                    newArr[i] = 'DEFAULT_ADDRESS'
                  } else {
                    newArr[i] = 'UN_DEFAULT_ADDRESS'
                  }
                }
                console.log("newarr="+newArr)
                that.setData({
                  showList: newArr
                })
                wx.showToast({
                  title: '设置默认地址成功',
                })
              },
              fail: err => {
                wx.hideLoading()
              }
            })
          }
        }
      })
    }
  },
  /**
   * 跳转
   */
  skipPage(val) {
    let id = val.currentTarget.id
    if (id == 'add') {

      let arr = this.data.deliveryList
      if(arr.length>=10){
        wx.showModal({
          title: '提示',
          content: '您最多可以添加10条地址信息 , 敬请谅解!',
        })
      }else{
        let addUrl = '/pages/delivery/deliveryDetail/deliveryDetail?flag=1'
        wx.navigateTo({
          url: addUrl,
        })
      }
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
    let pageNo = 1
    wx.login({
      success: res => {
        console.log(res);
        if (res.code) {
          let url = getApp().globalData.baseUrl + that.data.url + "?wxCode=" + res.code + "&pageNo=" + pageNo + "&pageSize=10"
          console.log("url=" + url)
          if (res.code) {
            wx.request({
              url: url,
              success: res => {
                wx.hideLoading()
                let arr = res.data.list
                console.log("arr =====" + JSON.stringify(arr))
                let showArr = []
                if (res.data.list.length > 0) {
                  for (let i = 0; i < arr.length; i++) {
                    let cell = arr[i]
                    showArr.push(cell.default_address)
                  }
                  that.setData({
                    deliveryList: res.data.list,
                    showList: showArr,
                    pageNo: pageNo,
                  })
                }
                console.log("showList =  " + that.data.showList)
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
    if (options.flag) {
      this.setData({
        flag: options.flag
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

    this.getDataFromNet()
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
    this.getDataFromNet()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})