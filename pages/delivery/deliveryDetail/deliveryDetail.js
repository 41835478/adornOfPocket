// pages/delivery/deliveryDetail/deliveryDetail.js
Page({

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
    provList: ['选择省份', '浙江', '江苏', '安徽', '上海'],
    cityList: ['选择城市', '杭州', '南京', '合肥', '上海'],
    csideList: ['选择地区', '主城区', '鼓楼', '合肥', '徐家汇'],
    indexCity: 0,
    indexPro: 0,
    indexCount: 0,
    // val:["选择"],
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
   * 选择地区
   */
  getDataPick(val) {
    console.log(val)
    let obj = {}
    let id = val.currentTarget.id;
    let index = val.detail.value;
    let data = val.currentTarget.dataset.name[index];
    console.log("data =" + data)
    obj[id] = data;
    this.setData(obj)
    if (id == 'province') {
      this.setData({
        indexPro: index
      })
    }
    if (id == 'city') {
      this.setData({
        indexCity: index
      })
    }
    if (id == 'countryside') {
      this.setData({
        indexCount: index
      })
    }
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
          params.recipients = "张三"//that.data.name;
          params.phone = 18506823333 //that.data.phone;
          params.province = "安徽"// that.data.province;
          params.city = "合肥"//that.data.city;
          params.area = "主城区"//that.data.countrySide;
          params.address = "长江路345号"//that.data.address;
          params.postCode = "213320"//that.data.code;
          console.log(params);
          wx.request({
            url: getApp().globalData.baseUrl + that.data.addUrl,
            method: 'POST',
            data: params,
            success: function (res) {
              console.log("添加地址返回:" + JSON.stringify(res.data));
              // that.setData({
              // deliveryId: res.data.data.id
              // });
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
    params.id = this.data.deliveryId;
    params.recipients = "张三"//that.data.name;
    params.phone = 18506823333 //that.data.phone;
    params.province = "安徽"// that.data.province;
    params.city = "合肥"//that.data.city;
    params.area = "主城区"//that.data.countrySide;
    params.address = "长江路345号"//that.data.address;
    params.postCode = "213320"//that.data.code;
    let that = this
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
      this.setData({
        deliveryId: options.id,
        addressList: options.data,
        delFlag: true
      })
      console.log(JSON.stringify(options.data)
      )
      // this.init(this.data.de);
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