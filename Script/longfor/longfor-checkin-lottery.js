/**
 * 龙湖APP自动签到脚本 - Shadowrocket 简化版
 *
 * 功能：
 * 1. 自动完成龙湖APP每日签到，获取积分
 * 2. 自动完成抽奖活动签到和抽奖
 * 兼容：Shadowrocket, Surge, Quantumult X, Loon
 */

const SCRIPT_NAME = '龙湖签到'
const TOKEN_KEY = 'longfor_token'

// 工具函数
function log(message) {
    console.log(`\n██ ${message}`)
}

function isEmpty(obj) {
    return typeof obj == "undefined" || obj == null || obj == "" || obj.length === 0
}

function getVal(key, defaultValue) {
    let value
    if (typeof $persistentStore !== 'undefined') {
        value = $persistentStore.read(key)
    } else if (typeof $prefs !== 'undefined') {
        value = $prefs.valueForKey(key)
    }
    return value || defaultValue
}

function setVal(key, val) {
    if (typeof $persistentStore !== 'undefined') {
        return $persistentStore.write(val, key)
    } else if (typeof $prefs !== 'undefined') {
        return $prefs.setValueForKey(val, key)
    }
    return false
}

function notify(subtitle, message) {
    if (typeof $notification !== 'undefined') {
        $notification.post(SCRIPT_NAME, subtitle, message)
    } else if (typeof $notify !== 'undefined') {
        $notify(SCRIPT_NAME, subtitle, message)
    } else {
        log(`通知: ${subtitle} - ${message}`)
    }
}

function httpPost(options, callback) {
    if (typeof $httpClient !== 'undefined') {
        $httpClient.post(options, callback)
    } else if (typeof $task !== 'undefined') {
        options.method = "POST"
        $task.fetch(options).then(response => {
            callback(null, response, response.body)
        }, reason => callback(reason.error, null, null))
    } else {
        callback("HTTP client not available", null, null)
    }
}

function isRequest() {
    return typeof $request !== "undefined"
}

function isMatch(reg) {
    return !!($request && $request.method != 'OPTIONS' && $request.url.match(reg))
}

function done(value = {}) {
    if (typeof $done !== 'undefined') {
        $done(value)
    }
}

// 主要功能函数
function doLotteryCheckIn() {
    let token = getVal(TOKEN_KEY, '')
    if (isEmpty(token)) {
        notify("抽奖签到失败", "请先打开龙湖APP登录获取token")
        log("抽奖签到失败: 没有找到token")
        done()
        return
    }

    log(`开始执行抽奖签到，使用token: ${token}`)

    // 第一步：签到API
    const signInUrl = "https://gw2c-hw-open.longfor.com/llt-gateway-prod/api/v1/activity/auth/lottery/sign"
    const commonHeaders = {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
        'Content-Type': 'application/json',
        'Cookie': 'acw_tc=276aede117516477058858009e29e85ba7429dd0c2a1b3c6f8c5a55d36958a',
        'Origin': 'https://llt.longfor.com',
        'Referer': 'https://llt.longfor.com/',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 &MAIAWebKit_iOS_com.longfor.supera_1.14.0_202506052233_Default_3.2.4.8',
        'X-LF-DXRisk-Source': '2',
        'X-LF-DXRisk-Token': '686808d2zGtwOykELsEwuul5epDPUIFcSTYY0Xr1',
        'authtoken': token,
        'bucode': 'L00602',
        'channel': 'L0',
        'x-gaia-api-key': '2f9e3889-91d9-4684-8ff5-24d881438eaf'
    }

    const signInBody = {
        "component_no": "CO15400F29R2ZFJZ",
        "activity_no": "AP25K062Q6YYQ7FX"
    }

    let signInOptions = {
        url: signInUrl,
        headers: commonHeaders,
        body: JSON.stringify(signInBody)
    }

    log("开始执行抽奖活动签到...")
    httpPost(signInOptions, (error, response, data) => {
        if (error) {
            notify("抽奖签到失败", `签到请求失败: ${error}`)
            log(`抽奖签到请求失败: ${error}`)
            done()
            return
        }

        log(`抽奖签到响应: ${data}`)
        try {
            const signInResult = JSON.parse(data)

            if (signInResult.code === "0000") {
                log("抽奖活动签到成功，开始执行抽奖...")
                performLottery(commonHeaders, token)
            } else if (signInResult.code === "863036") {
                log("今日已签到，直接执行抽奖...")
                performLottery(commonHeaders, token)
            } else {
                notify("抽奖签到异常", `签到返回码: ${signInResult.code}, 消息: ${signInResult.message || '未知错误'}`)
                log(`抽奖签到返回异常: ${data}`)
                done()
            }
        } catch (e) {
            notify("抽奖签到失败", `签到响应解析失败: ${e}`)
            log(`抽奖签到响应解析失败: ${e}, 原始数据: ${data}`)
            done()
        }
    })
}

function performLottery(headers, token) {
    const lotteryUrl = "https://gw2c-hw-open.longfor.com/llt-gateway-prod/api/v1/activity/auth/lottery/click"
    const lotteryBody = {
        "component_no": "CO15400F29R2ZFJZ",
        "activity_no": "AP25K062Q6YYQ7FX",
        "batch_no": ""
    }

    let lotteryOptions = {
        url: lotteryUrl,
        headers: headers,
        body: JSON.stringify(lotteryBody)
    }

    log("开始执行抽奖...")
    httpPost(lotteryOptions, (error, response, data) => {
        if (error) {
            notify("抽奖失败", `抽奖请求失败: ${error}`)
            log(`抽奖请求失败: ${error}`)
        } else {
            log(`抽奖响应: ${data}`)
            try {
                const lotteryResult = JSON.parse(data)

                if (lotteryResult.code === "0000") {
                    const prize = lotteryResult.data?.prize_name || "未知奖品"
                    notify("抽奖成功", `恭喜获得: ${prize}`)
                    log(`抽奖成功，获得奖品: ${prize}`)
                } else if (lotteryResult.code === "863033") {
                    notify("抽奖提醒", "今日已抽奖，明天再来吧")
                    log("今日已抽奖")
                } else {
                    notify("抽奖异常", `返回码: ${lotteryResult.code}, 消息: ${lotteryResult.message || '未知错误'}`)
                    log(`抽奖返回异常: ${data}`)
                }
            } catch (e) {
                notify("抽奖失败", `抽奖响应解析失败: ${e}`)
                log(`抽奖响应解析失败: ${e}, 原始数据: ${data}`)
            }
        }
        done()
    })
}

function getToken() {
    if (isMatch(/\/supera\/member\/api\/bff\/pages\/v1_14_0\/v1\/user-info/)) {
        log('开始获取token')
        let headers = $request.headers
        let token = headers["lmToken"] || headers["lmtoken"] || headers["LMTOKEN"] || ""
        
        if (token) {
            let currentToken = getVal(TOKEN_KEY, '')
            if (currentToken === '') {
                setVal(TOKEN_KEY, token)
                notify("首次获取token成功", `token: ${token.substring(0, 20)}...`)
                log(`首次获取token成功: ${token}`)
            } else if (currentToken !== token) {
                setVal(TOKEN_KEY, token)
                notify("token已更新", `新token: ${token.substring(0, 20)}...`)
                log(`token已更新: ${token}`)
            } else {
                log(`token未变化: ${token}`)
            }
        } else {
            notify("获取token失败", "请检查请求header中是否包含lmToken")
            log(`获取token失败, 所有header字段: ${JSON.stringify(headers)}`)
        }
    }
}

function doSignIn(callback) {
    let token = getVal(TOKEN_KEY, '')
    if (isEmpty(token)) {
        notify("签到失败", "请先打开龙湖APP登录获取token")
        log("签到失败: 没有找到token")
        if (callback) callback()
        return
    }

    log(`开始执行签到，使用token: ${token}`)

    const url = "https://gw2c-hw-open.longfor.com/lmarketing-task-api-mvc-prod/openapi/task/v1/signature/clock"
    const headers = {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
        'Content-Type': 'application/json;charset=UTF-8',
        'Cookie': 'acw_tc=ac11000117515948134458251e007763cde29cc35ff7b19c704ac2843e03fa',
        'Origin': 'https://longzhu.longfor.com',
        'Referer': 'https://longzhu.longfor.com/',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 &MAIAWebKit_iOS_com.longfor.supera_1.14.0_202506052233_Default_3.2.4.8',
        'X-GAIA-API-KEY': 'c06753f1-3e68-437d-b592-b94656ea5517',
        'X-LF-Bu-Code': 'L00602',
        'X-LF-Channel': 'L0',
        'X-LF-DXRisk-Captcha-Token': 'undefined',
        'X-LF-DXRisk-Source': '2',
        'X-LF-DXRisk-Token': '68673780TZSEnm6nueRfRAziVGwXc5NyaH5z5vo1',
        'X-LF-UserToken': token,
        'token': token
    }

    let options = {
        url: url,
        headers: headers,
        body: JSON.stringify({"activity_no":"11111111111736501868255956070000"})
    }

    httpPost(options, (error, response, data) => {
        if (error) {
            notify("签到失败", `请求失败: ${error}`)
            log(`签到请求失败: ${error}`)
        } else {
            log(`签到响应: ${data}`)
            try {
                const result = JSON.parse(data)
                if (result.code === 200 || result.code === "0000") {
                    notify("签到成功", `签到完成: ${result.message || '获得积分'}`)
                    log(`签到成功: ${data}`)
                } else {
                    notify("签到异常", `返回码: ${result.code}, 消息: ${result.message || '未知错误'}`)
                    log(`签到返回异常: ${data}`)
                }
            } catch (e) {
                notify("签到失败", `响应解析失败: ${e}`)
                log(`签到响应解析失败: ${e}, 原始数据: ${data}`)
            }
        }
        if (callback) callback()
    })
}

// 独立抽奖功能 - 可单独调用
function doLotteryOnly() {
    let token = getVal(TOKEN_KEY, '')
    if (isEmpty(token)) {
        notify("抽奖失败", "请先打开龙湖APP登录获取token")
        log("抽奖失败: 没有找到token")
        done()
        return
    }

    log(`开始执行独立抽奖，使用token: ${token}`)
    doLotteryCheckIn()
}

// 主执行逻辑
if (isRequest()) {
    // 请求阶段：获取token
    getToken()
    done()
} else {
    // 定时任务阶段：执行签到和抽奖
    let token = getVal(TOKEN_KEY, '')
    if (isEmpty(token)) {
        notify("请先获取token", "请打开龙湖APP登录")
        log("请先打开龙湖APP登录获取token")
        done()
    } else {
        log(`开始执行签到和抽奖，使用token: ${token}`)

        // 先执行常规签到，完成后执行抽奖签到
        doSignIn(() => {
            log("常规签到完成，开始执行抽奖签到...")
            setTimeout(() => {
                doLotteryCheckIn()
            }, 1000) // 延迟1秒避免请求冲突
        })
    }
}
