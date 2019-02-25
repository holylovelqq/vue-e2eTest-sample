// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

// -----------------------------------------------
// 注意：该文件所在目录下不能创建文件夹，不然会报错：Cannot read property 'reduce' of null
// 可以创建新文件，且会执行所有新建文件进行测试
// -----------------------------------------------

module.exports = {
  // 页面能否正常显示测试
  'login test step one': function (browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    const devServer = browser.globals.devServerURL

    browser
      .url(devServer)
      .waitForElementVisible('.login-wrap', 5000)
      .verify.elementPresent('.ms-title')
      .verify.elementPresent('.ivu-tabs')
      .verify.elementPresent('.ivu-tabs .ivu-tabs-tabpane:first-of-type .ivu-input[placeholder="userId"]')
      .verify.elementPresent('.ivu-tabs .ivu-tabs-tabpane:first-of-type .ivu-input[placeholder="password"]')
      // .assert.containsText('h1', 'Welcome to Your Vue.js App')
      // .assert.elementCount('img', 1)

  },
  // 登陆失败测试
  'step tow': function (browser) {

    browser
      .setValue('.ivu-tabs .ivu-tabs-tabpane:first-of-type .ivu-input[placeholder="userId"]','adminn')
      .setValue('.ivu-tabs .ivu-tabs-tabpane:first-of-type .ivu-input[placeholder="password"]','123456')
      .click('.ivu-tabs .ivu-tabs-tabpane:first-of-type .ivu-btn')
      .pause(3000)
      .setValue('.ivu-tabs .ivu-tabs-tabpane:first-of-type .ivu-input[placeholder="userId"]','admin')
      .setValue('.ivu-tabs .ivu-tabs-tabpane:first-of-type .ivu-input[placeholder="password"]','1234566')
      .click('.ivu-tabs .ivu-tabs-tabpane:first-of-type .ivu-btn')
      .pause(3000)

  },
  // 成功登陆测试
  'step three':function (browser) {  
    browser
    .setValue('.ivu-tabs .ivu-tabs-tabpane:first-of-type .ivu-input[placeholder="userId"]','admin')
    .setValue('.ivu-tabs .ivu-tabs-tabpane:first-of-type .ivu-input[placeholder="password"]','123456')
    .click('.ivu-tabs .ivu-tabs-tabpane:first-of-type .ivu-btn')
    .pause(1000)    

    .end()
  }
}
