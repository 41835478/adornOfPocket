// pages/address/address.js
var netWork = require('../../common/requestTool/request.js')
Page(Object.assign({}, netWork, {
  /**
   * 页面的初始数据
   */
  data: {
    url: 'mall/wx/delivery/findByWxCode',
    delUrl: 'mall/wx/delivery/delete',
    deliveryList: [],
    showList: [],
    showSelected: false,
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
   * 设置默认地址
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

      let param = {}
      param.id = item.id
      netWork.GET({
        url:'mall/wx/delivery/defaultAddress',
        wxCode:true,
        params:param,
        success:res=>{
          wx.hideLoading()
          console.log(res)
          // 刷新页面数据
          if(res.data.result == 1){
            let newArr = that.data.showList
            for (let i = 0; i < newArr.length; i++) {
              if (i == index) {
                newArr[i] = 'DEFAULT_ADDRESS'
              } else {
                newArr[i] = 'UN_DEFAULT_ADDRESS'
              }
            }
            console.log("newarr=" + newArr)
            that.setData({
              showList: newArr
            })
            wx.showToast({
              title: '设置成功',
            })
          }else{
            wx.showToast({
              title: '设置失败',
            })
          }
        },
        fail:err=>{
          wx.hideLoading()
          console.log(err)
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
      if (arr.length >= 10) {
        wx.showModal({
          title: '提示',
          content: '您最多可以添加10条地址信息 , 敬请谅解!',
        })
      } else {
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
    let param = {}
    param.pageSize = 10
    param.pageNo = 1

    netWork.GET({
      url: that.data.url,
      params: param,
      wxCode: true,
      success: res => {
        wx.hideLoading()
        let arr = res.data.list
        console.log(res)
        if(arr.length>0){
          let showArr = []
          if (res.data.list.length > 0) {
            for (let i = 0; i < arr.length; i++) {
              let cell = arr[i]
              showArr.push(cell.default_address)
            }
            that.setData({
              deliveryList: res.data.list,
              showList: showArr,
            })
          }
        }else{
          that.setData({
            deliveryList: arr,
          })
        }
      },
      fail: err => {
        wx.hideLoading()
        console.log(err)
      }
    })
  },
/**
 * 删除地址
 */
  deleteAction(val){
    let item = val.currentTarget.dataset.address
    let that = this;
    wx.showModal({
      content: "确定要删除该地址吗?",
      success: function (res) {
        if (res.confirm) {
          console.log("确定;" + item.id);
          wx.showLoading({
            title: '加载中',
          })
          wx.login({
            success: res => {
              let params = {}
              params.id = item.id
              params.wx_code = res.code
              //request
              netWork.POST({
                url: that.data.delUrl,
                params: params,
                success: res => {
                  console.log(res)
                  wx.hideLoading()
                  if (res.data.result == 1) {
                    wx.showModal({
                      title: '提示',
                      content: '地址删除成功',
                      showCancel: false,
                      success: res => {
                          that.getDataFromNet()
                      }
                    })
                  } else {
                    wx.showModal({
                      title: '提示',
                      content: '地址删除失败',
                      showCancel: false,
                    })
                  }
                },
                fail: err => {
                  console.log(err)
                  wx.hideLoading()
                }
              })
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
}))