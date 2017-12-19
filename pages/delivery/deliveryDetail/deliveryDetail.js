// pages/delivery/deliveryDetail/deliveryDetail.js
var netWork = require('../../../common/requestTool/request.js')
Page(Object.assign({},netWork, {

  /**
   * 页面的初始数据
   */
  data: {
    addUrl: 'mall/wx/delivery/add',
    delUrl: 'mall/wx/delivery/delete',
    saveUrl: 'mall/wx/delivery/update',
    typeFlag: "0",//页面标识：0,编辑;1,新增
    addressList: {},
    deliveryId: '',
    region: ['北京市', '北京市', '东城区'],
    delFlag: false,
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
        let params = {};
        params.wx_code = res.code;
        params.recipients = that.data.name;
        params.phone = that.data.phone;
        params.province = that.data.region[0];
        params.city = that.data.region[1];
        params.area = that.data.region[2];
        params.address = that.data.address;
        params.post_code = that.data.code;

        netWork.POST({
          url: that.data.addUrl,
          params: params,
          success: res => {
            wx.hideLoading()
            console.log(res.data);
            wx.showModal({
              title: '提示',
              content: '地址添加成功',
              showCancel: false,
              success: res => {
                wx.navigateBack({ delta: 1 });
              }
            })
          },
          fail: err => {
            wx.hideLoading()
            console.log(err)
          }
        })
      }
    })
  },
  /**
   * 保存地址
   */
  save() {
    let params = {};
    let that = this
    wx.login({
      success: res => {
        params.id = that.data.deliveryId
        params.wx_code = res.code
        params.recipients = that.data.name ? that.data.name : that.data.addressList.recipients;
        params.phone = that.data.phone ? that.data.phone : that.data.addressList.phone;
        params.province = that.data.region[0];
        params.city = that.data.region[1]
        params.area = that.data.region[2];
        params.address = that.data.address ? that.data.address : that.data.addressList.address;
        params.post_code = that.data.code ? that.data.code : that.data.addressList.post_code;
        console.log(params);

        netWork.POST({
          url: that.data.saveUrl,
          params: params,
          success: res => {
            wx.hideLoading()
            console.log(res);
            that.setData({
              deliveryId: res.data.data.id
            })
            wx.showModal({
              title: '提示',
              content: '地址修改成功',
              showCancel: false,
              success: res => {
                wx.navigateBack({ delta: 1 });
              }
            })
          },
          fail: err => {
            console.log(err);
            wx.hideLoading()
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if (options.flag == "1") {
      this.setData({
        typeFlag: options.flag,
      })
      wx.setNavigationBarTitle({
        title: '新增收获地址',
      })
    } else {
      var data = JSON.parse(options.data)
      var province = data.province ? data.province : "北京市"
      var city = data.city ? data.city : "北京市"
      var area = data.area ? data.area : "东城区"
      this.setData({
        deliveryId: options.id,
        addressList: data,
        region: [province, city, area],
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
}))