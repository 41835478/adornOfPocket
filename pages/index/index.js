//index.js
//获取应用实例
const app = getApp()
var Zan = require('../../component/zanui-weapp/dist/index');
var Hongbao = require('../../common/template/hongbao/hongbao');
Page(Object.assign({}, Zan.NoticeBar, Hongbao, {
  data: {
    userInfo: {},
    goodList: [],
    baseUrl: getApp().globalData.baseImgUrl,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),

    pageNo: 1,

    activityShow: false,//红包活动显示标识
    hasUserInfo: false,
    lastPage: false,
    // pageComplete: true,
    animationData: {},
  },
/**
 * 每次进入加载页面请求数据
 */
  onShow() {
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: getApp().globalData.baseUrl + 'mall/wx/good/findAll?pageNo=1&pageSize=10',
      method: 'GET',
      success: res => {
        wx.hideLoading()
        console.log(res);
        this.setData({
          goodList: res.data.list,
          lastPage: res.data.lastPage,
          pageNo:1,
        })
      },
      fail:err=>{
        wx.hideLoading()
      }
    })
  },
  // 上拉加载
  pullUp: function () {
    console.log('是否最后一页:' + this.data.lastPage)
    //最后一页，不再进行请求
    if (this.data.lastPage) {
      return;
    }
    // 防止过度频繁请求
    // this.setData({
    //   pageComplete: false
    // })
    wx.showLoading({
      title: '加载中'
    });
    let pageNo = this.data.pageNo + 1;
    console.log(pageNo);
    let url = getApp().globalData.baseUrl + 'mall/wx/good/findAll?pageNo=' + pageNo + '&pageSize=10';
    wx.request({
      url: url,
      method: "GET",
      success: res => {
        if (res.statusCode == 200) {
          let arr = this.data.goodList.concat(res.data.list);
          console.log(res.data);
          if (res.data.list.length > 0) {
            this.setData({
              goodList: arr,
              lastPage: res.data.lastPage,
              pageNo: pageNo,
              // pageComplete: true
            });
          }else{
            console.log("没有更多了")
            this.setData({
              lastPage:true
            })
          }
          console.log("lastPage="+this.data.lastPage)
          wx.hideLoading();
        }
      },
      fail: error => {
        console.log(error)
        wx.hideLoading();
        this.setData({
          // pageComplete: true
        })
      }
    })
  },
  /**获取手机号 */
  getPhoneNumber: function (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
  },
  //事件处理函数
  // bindViewTap: function () {
  //   wx.navigateTo({
  //     url: '../logs/logs'
  //   })
  // },
  /**
   * 点击查看商品详情
   */
  goTogoodInfo(e) {
    console.log("点击的数据=" + e)
    var goodID = e.currentTarget.id
    wx.navigateTo({
      url: '/pages/good/good?goodId=' + goodID,
    })
  },

  /**
   * 搜索商品
   */
  searchGoodAction(e) {
    let that = this
    console.log("搜索的内容为:" + JSON.stringify(e.detail.value))
    wx.request({
      url: getApp().globalData.baseUrl + "mall/wx/good/findBySearchKey" + "?searchKey=" + e.detail.value + "&pageNo=1&pageSize=20",
      success: function (res) {
        console.log(JSON.stringify(res.data))
        that.setData({
          goodList: res.data.list
        })
      }
    })
  },

  onLoad: function () {
    //判断本地是否有缓存
    wx.getStorage({
      key: 'token',
      success: function (res) {
        console.log(res);
      },
      fail: function (err) {
      }
    })
    wx.authorize({
      scope: 'scope.userInfo',
      success: res => {
        wx.getUserInfo({
          success: res => {
            console.log(res);
          }
        })
      }
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        },
        fail: res => {
          console.log(res);
        }
      })
    }
  },
  // 页面上拉触底事件的处理函数
  onReachBottom: function () {
    this.pullUp()
  },
  // 下拉刷新事件
  onPullDownRefresh() {
    this.pullUp()
    // wx.stopPullDownRefresh();
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
}))
