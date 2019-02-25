require('babel-register')
var config = require('../../config')

// http://nightwatchjs.org/gettingstarted#settings-file
module.exports = {
  // 测试文件入口
  src_folders: ['test/e2e/specs'],
  // 输出报表路径
  output_folder: 'test/e2e/reports',
  // 加载自定义断言
  custom_assertions_path: ['test/e2e/custom-assertions'],
  // selenium配置
  selenium: {  
    start_process: true, // 是否自动管理selenium进程
    server_path: require('selenium-server').path, //selenium服务的地址
    host: '127.0.0.1',
    port: 4444,
    cli_args: {
      'webdriver.chrome.driver': require('chromedriver').path //webdriver的地址，可以添加多个，这里只用了chrome的
    }
  },
// 测试相关配置
  test_settings: {
    default: {
      selenium_port: 4444,
      selenium_host: 'localhost',
      silent: true,
      globals: {
        devServerURL: 'http://localhost:' + (process.env.PORT || config.dev.port)
      }
    },

    chrome: {
      desiredCapabilities: {
        browserName: 'chrome',
        javascriptEnabled: true,
        acceptSslCerts: true
      }
    },

    firefox: {
      desiredCapabilities: {
        browserName: 'firefox',
        javascriptEnabled: true,
        acceptSslCerts: true
      }
    }
  }
}
