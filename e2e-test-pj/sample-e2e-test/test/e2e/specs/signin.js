
module.exports = {
    // 页面能否正常显示测试
    'signin test': function (browser) {
      // automatically uses dev Server port from /config.index.js
      // default: http://localhost:8080
      // see nightwatch.conf.js
      const devServer = browser.globals.devServerURL
  
      browser
        .url(devServer)
        .waitForElementVisible('.login-wrap', 1000)
        // .verify.elementPresent('.ms-title')
        // .verify.elementPresent('.ivu-tabs')
        // .verify.elementPresent('.ivu-input[placeholder="userId"]')
        // .verify.elementPresent('.ivu-input[placeholder="password"]')
        // .assert.containsText('h1', 'Welcome to Your Vue.js App')
        // .assert.elementCount('img', 1)
        .click('.ivu-tabs-nav .ivu-tabs-tab:last-of-type')
        .pause(1000)
        .verify.elementPresent('.ivu-tabs .ivu-tabs-tabpane:last-of-type .ivu-input[placeholder="userId"]')
        .verify.elementPresent('.ivu-tabs .ivu-tabs-tabpane:last-of-type .ivu-input[placeholder="password"]')
        .setValue('.ivu-tabs .ivu-tabs-tabpane:last-of-type .ivu-input[placeholder="userId"]','team')
        .setValue('.ivu-tabs .ivu-tabs-tabpane:last-of-type .ivu-input[placeholder="password"]','123456')
        .pause(1000)
        .click('.ivu-tabs .ivu-tabs-tabpane:last-of-type .ivu-btn')
        .pause(3000)
        .end()
  
    },
    
  }
  