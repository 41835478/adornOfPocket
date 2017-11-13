// pages/delivery/deliveryDetail/deliveryDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    cityUrl : 'http://japi.zto.cn/zto/api_utf8/baseArea?msg_type=GET_AREA&data=',
    addUrl: 'mall/wx/delivery/add',
    delUrl: 'mall/wx/delivery/delete',
    saveUrl: 'mall/wx/delivery/update',
    typeFlag: "0",//页面标识：0,编辑;1,新增
    addressList: {},
    deliveryId: '',
    region: ['北京市', '北京市', '东城区'],
    delFlag: false
  },
  /**
   * input输入
   */
  getData(val) {
    console.log(val);
    let obj = {};
    let n = val.currentTarget.dataset.name;
    obj[n] = val.detail.value;
    this.setData(obj);
    console.log(obj[n])
  },
  /**
 * 选择收货地址
 */
  bindRegionChange(e) {
    console.log('选择的地址是:', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  /**
   * 初始化
   */
  init(id) {
    console.log(id);
  },
  submit() {
    this.data.typeFlag == '1' ? this.add() : this.save();
  },
  /**
   * 新增地址
   */
  add() {
    let that = this
    wx.login({
      success: res => {
        if (res.code) {
          let params = {};
          params.wxCode = res.code;
          params.recipients = that.data.name;
          params.phone = that.data.phone;
          params.province = that.data.region[0];
          params.city = that.data.region[1];
          params.area = that.data.region[2];
          params.address = that.data.address;
          params.postCode = that.data.code;
          wx.request({
            url: getApp().globalData.baseUrl + that.data.addUrl,
            method: 'POST',
            data: params,
            success: function (res) {
              console.log("添加地址返回:" + JSON.stringify(res.data));
              wx.navigateBack({ delta: 1 });
            },
            fail: function (err) {
              console.log(err);
            }
          })
        }
      }
    })
  },
  /**
   * 保存地址
   */
  save() {
    let params = {};
    let that = this
    params.id = that.data.deliveryId;
    params.recipients = that.data.name;
    params.phone = that.data.phone;
    params.province = that.data.region[0];
    params.city = that.data.region[1];
    params.area = that.data.region[2];
    params.address = that.data.address;
    params.postCode = that.data.code;
    console.log(params);
    wx.request({
      url: getApp().globalData.baseUrl + that.data.saveUrl,
      method: 'POST',
      data: params,
      success: function (res) {
        console.log(res);
        that.setData({
          // deliveryId: res.data.data.id
        })
        wx.navigateBack({ delta: 1 });
      },
      fail: function (err) {
        console.log(err);
      }
    })
  },
  /**
   * 删除收获地址
   */
  del() {
    let that = this;
    wx.showModal({
      content: "确定要删除该地址吗?",
      success: function () {
        console.log("确定;"+ that.data.deliveryId);
        wx.request({
          url: getApp().globalData.baseUrl + that.data.delUrl + "?id=" + that.data.deliveryId ,
          method: 'POST',
          success: res => {
            console.log(JSON.stringify(res.data))
            wx.navigateBack({ delta: 1 });
          },
          fail: err => {

          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.flag == "1") {
      this.setData({
        typeFlag: options.flag,
      })
      wx.setNavigationBarTitle({
        title: '新增收获地址',
      })
    } else {
      var data = JSON.parse(options.data)
      var province = data.province ? data.province:"北京市"
      var city = data.city?data.city:"北京市"
      var area = data.area?data.area:"东城区"
      this.setData({
        deliveryId: options.id,
        addressList: data,
        region: [province,city,area],
        delFlag: true
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
})