// pages/ticket/ticket.js
var netWrok = require('../../common/requestTool/request.js')

Page(Object.assign({}, netWrok, {

  /**
   * 页面的初始数据
   */
  data: {
    url: 'mall/wx/ticket/findByUserId',
    ticketList: [],//卡券列表
    mySelect: true,
    allSelect: false,
    btnTitle: '去使用',
    windowH: '',
    haveMoreData: true,
    pageNo: 0,
  },
  /**
   * 初始化
   */
  init() {
    // 根据用户id获取卡券列表
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    this.myTicketAction()
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowH: res.windowHeight
        })
      },
    })
    console.log(that.data.windowH)
  },
  /**
   * 我的优惠券
   */
  myTicketAction(pull) {

    this.setData({
      mySelect: true,
      allSelect: false,
      btnTitle: '去使用',
    })
    let that = this
    let params = {}
    if (pull == 'pull') {
      if (that.data.haveMoreData) {
        params.pageNo = that.data.pageNo + 1
      } else {
        wx.showModal({
          title: '提示',
          content: '没有更多了',
          showCancel: false
        })
        return
      }
    } else {
      params.pageNo = 1
    }
    params.pageSize = 10
    wx.showLoading({
      title: '加载中',
    })

    netWrok.GET({
      url: 'mall/wx/ticket/findByUserId',
      params: params,
      wxCode: true,
      success: res => {
        wx.hideLoading()
        console.log(res)
        var arr = res.data.list
        arr = that.subString(arr)
        let newArr = that.data.ticketList.concat(arr)
        if (pull != "pull") {
          newArr = arr
        }
        if (arr.length > 0) {
          that.setData({
            pageNo: res.data.pageNum,
            haveMoreData: true,
            ticketList: newArr,
          })
        } else {
          console.log("no more data!")
          that.setData({
            haveMoreData: false,
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
   * 获取全部优惠券信息
   */
  getDataFromNet(pull) {
    this.setData({
      mySelect: false,
      allSelect: true,
      btnTitle: '立即领取',
    })
    let that = this
    let params = {}
    if (pull == 'pull') {
      if (that.data.haveMoreData) {
        params.pageNo = that.data.pageNo + 1
      }else{
        wx.showModal({
          title: '提示',
          content: '没有更多了',
          showCancel: false
        })
        return
      }
    }else{
      params.pageNo = 1
    }
    params.pageSize = 10
    wx.showLoading({
      title: '加载中',
    })
    netWrok.GET({
      url: 'mall/wx/ticket/findAll',
      params: params,
      success: res => {
        wx.hideLoading()
        console.log(res.data)
        var arr = res.data.list
        arr = that.subString(arr)
        let newArr = that.data.ticketList.concat(arr)
        if(pull != "pull"){
          newArr = arr
        }
        if (arr.length > 0) {
          that.setData({
            pageNo: res.data.pageNum,
            haveMoreData: true,
            ticketList: newArr,
          })
        } else {
          console.log("no more data!")
          that.setData({
            haveMoreData: false,
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
   * 领取优惠券 
   */
  selectAction(e) {
    let that = this
    let myTicket = that.data.mySelect
    if (myTicket) {
      console.log("去使用=>")
    } else {
      let params = {}
      params.ticketId = e.currentTarget.id
      netWrok.GET({
        url: 'mall/wx/ticket/getTicket',
        wxCode: true,
        params: params,
        success: res => {
          console.log("优惠券结果:" + JSON.stringify(res.data))
          if (res.data.result == 1) {
            wx.showModal({
              title: '提示',
              content: '领取成功',
              showCancel: false,
            })
          } else {
            wx.showModal({
              title: '提示',
              content: res.data.error.message,
              showCancel: false,
            })
          }
        }
      })
    }
  },
  /**
   * 上拉刷新
   */
  refreshDataAction(event) {
    console.log("pullup")
    if (this.data.mySelect) {
      this.myTicketAction("pull")
    } else {
      this.getDataFromNet("pull")
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