//index.js
//获取应用实例
const app = getApp()
var Zan = require('../../component/zanui-weapp/dist/index');
var ZanTab = require('../../component/zanui-weapp/dist/tab/index');
var Hongbao = require('../../common/template/hongbao/hongbao');
var netWork = require('../../common/requestTool/request.js');
Page(Object.assign({}, Zan.NoticeBar, Hongbao, ZanTab, netWork, {
  data: {
    categoryUrl: 'mall/wx/category/findHomePage',
    goodListUrl: 'mall/wx/good/findHomePage',
    userInfo: {},
    goodList: [],
    baseUrl: getApp().globalData.baseImgUrl,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    pageNo: 1,
    tab: {
      list: [],
      selectedId: 0,
      style: 'index',
      scroll:true,
    },
    hasUserInfo: false,
    lastPage: false,
    animationData: {},
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
    //发起商品列表请求
    var params = {}
    params.pageSize = 10
    params.pageNo = 1
    params.categoryId = selectedId
    this.downLoadData(this.data.goodListUrl, params, 'goodList')
  },

  /**
   * 网络获取数据
   */
  downLoadData(requestUrl, params, style) {
    wx.showLoading({
      title: '加载中',
    })
    let that = this
    netWork.GET(
      {
        url: requestUrl,
        params: params,
        success: function (res) {
          wx.hideLoading()
          that.dataSuccBack(res, style)
        },
        fail: function () {
          //失败后的逻辑
          wx.hideLoading()
        },
      })
  },
  /**
   * 成功回调
   */
  dataSuccBack(res, style) {
    console.log(res)
    if (style == 'categroy') {
      let list = res.data.list
      let receive = []
      for (let i = 0; i < list.length; i++) {
        var dic = list[i]
        var receiveDic = {}
        receiveDic.id = dic.id
        receiveDic.title = dic.category_name
        receive[i] = receiveDic
      }
      this.setData({
        tab: {
          list: receive,
          selectedId: receive[0].id,
          style: 'index',
          scroll: true,
        },
      })
    }
    if (style == 'goodList') {
      if (res.statusCode == 200) {
        this.setData({
          goodList: res.data.list
        })
      }
    }
  },
  /**
   * 上拉刷新
   */
  pullUp: function () {
    //待定
  },
  /**
   * 点击查看商品详情
   */
  goTogoodInfo(e) {
    console.log(e)
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

    var params = {}
    params.searchKey = e.detail.value
    params.pageNo = 1
    params.pageSize = 20

    netWork.GET({
      url: "mall/wx/good/findBySearchKey",
      params:params,
      success:res=>{
        console.log(res)
        if(res.data){
          that.setData({
            goodList: res.data.list
          })
        }
      },
      fail:err=>{
        console.log(err)
      }
    })
  },
  /**
   * 每次进入加载页面请求数据
   */
  onShow() {

    //发起商品列表请求
    var params = {}
    params.pageSize = 10
    params.pageNo = 1
    params.categoryId = this.data.tab.selectedId
    this.downLoadData(this.data.goodListUrl, params, 'goodList')
  },

  onLoad: function () {
    //加载类目
    var params = {}
    params.pageSize = 100
    params.pageNo = 1
    params.type = 'PARENT_CATEGORY'
    this.downLoadData(this.data.categoryUrl, params, 'categroy')

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
    // this.pullUp()
  },
  // 下拉刷新事件
  onPullDownRefresh() {
    // this.pullUp()
    wx.stopPullDownRefresh();
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  /**获取手机号 */
  getPhoneNumber: function (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
  },
}))
