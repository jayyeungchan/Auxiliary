/**
 * 龙湖APP自动签到脚本 - Shadowrocket 简化版
 * 
 * 功能：自动完成龙湖APP每日签到，获取积分
 * 兼容：Shadowrocket, Surge, Quantumult X, Loon
 */

const SCRIPT_NAME = '龙湖签到'
const TOKEN_KEY = 'longfor_token'

// 工具函数
function log(message) {
    console.log(`\n██ ${message}`)
    // 在 Shadowrocket 中也通过通知显示重要日志
    if (message.includes('开始') || message.includes('成功') || message.includes('失败') || message.includes('错误')) {
        notify("调试信息", message)
    }
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

function doSignIn() {
    let token = getVal(TOKEN_KEY, '')
    if (isEmpty(token)) {
        notify("签到失败", "请先打开龙湖APP登录获取token")
        log("签到失败: 没有找到token")
        done()
        return
    }

    log(`开始执行签到，使用token: ${token}`)

    const url = "https://gw2c-hw-open.longfor.com/lmarketing-task-api-mvc-prod/openapi/task/v1/signature/clock"
    const headers = {
        'Accept': 'application/json, text/plain, */*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'zh-CN,zh-Hans;q=0.9',
        'Content-Type': 'application/json;charset=UTF-8',
        'Origin': 'https://longzhu.longfor.com',
        'Referer': 'https://longzhu.longfor.com/',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 &MAIAWebKit_iOS_com.longfor.supera_1.14.0_202506052233_Default_3.2.4.8',
        'X-GAIA-API-KEY': 'c06753f1-3e68-437d-b592-b94656ea5517',
        'X-LF-Bu-Code': 'L00602',
        'X-LF-Channel': 'L0',
        'X-LF-DXRisk-Source': '2',
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
                notify("签到响应", `签到响应完成: ${JSON.stringify(result)}`)
                if (result.code === 200 || result.code === "200") {
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
        done()
    })
}

// 主执行逻辑
if (isRequest()) {
    // 请求阶段：获取token
    getToken()
    done()
} else {
    // 定时任务阶段：执行签到
    let token = getVal(TOKEN_KEY, '')
    if (isEmpty(token)) {
        notify("请先获取token", "请打开龙湖APP登录")
        log("请先打开龙湖APP登录获取token")
        done()
    } else {
        log(`开始执行签到，使用token: ${token}`)
        doSignIn()
    }
}
