module.exports={
    'search nightwatch on baidu':function (browser) {  
        browser
            .url('http://www.baidu.com')
            .waitForElementVisible('body',1000)
            .setValue('#kw','nightwatch')
            .click('#su')
            .pause(3000)
            .waitForElementVisible('#content₋left',3000)
            .end();
    }

}