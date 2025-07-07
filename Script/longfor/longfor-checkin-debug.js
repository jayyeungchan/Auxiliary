/**
 * 龙湖APP自动签到脚本 - Shadowrocket 调试版
 * 
 * 功能：自动完成龙湖APP每日签到，获取积分
 * 特点：包含详细的调试信息和通知
 */

const SCRIPT_NAME = '龙湖签到调试'
const TOKEN_KEY = 'longfor_token'
const DEBUG_MODE = true // 开启调试模式

// 工具函数
function log(message) {
    const logMsg = `\n██ ${message}`
    console.log(logMsg)
    
    // 调试模式下，重要信息也通过通知显示
    if (DEBUG_MODE && (message.includes('开始') || message.includes('成功') || message.includes('失败') || message.includes('错误') || message.includes('token'))) {
        notify("🐛调试", message.substring(0, 100)) // 限制通知长度
    }
}

function debugLog(message) {
    if (DEBUG_MODE) {
        log(`[DEBUG] ${message}`)
    }
}

function isEmpty(obj) {
    return typeof obj == "undefined" || obj == null || obj == "" || obj.length === 0
}

function getVal(key, defaultValue) {
    debugLog(`尝试获取存储值: ${key}`)
    let value
    if (typeof $persistentStore !== 'undefined') {
        value = $persistentStore.read(key)
        debugLog(`使用 $persistentStore 获取值: ${value}`)
    } else if (typeof $prefs !== 'undefined') {
        value = $prefs.valueForKey(key)
        debugLog(`使用 $prefs 获取值: ${value}`)
    } else {
        debugLog(`没有可用的存储API`)
    }
    const result = value || defaultValue
    debugLog(`最终返回值: ${result}`)
    return result
}

function setVal(key, val) {
    debugLog(`尝试设置存储值: ${key} = ${val}`)
    if (typeof $persistentStore !== 'undefined') {
        const result = $persistentStore.write(val, key)
        debugLog(`使用 $persistentStore 设置结果: ${result}`)
        return result
    } else if (typeof $prefs !== 'undefined') {
        const result = $prefs.setValueForKey(val, key)
        debugLog(`使用 $prefs 设置结果: ${result}`)
        return result
    } else {
        debugLog(`没有可用的存储API`)
        return false
    }
}

function notify(subtitle, message) {
    debugLog(`发送通知: ${subtitle} - ${message}`)
    if (typeof $notification !== 'undefined') {
        $notification.post(SCRIPT_NAME, subtitle, message)
        debugLog(`使用 $notification 发送通知`)
    } else if (typeof $notify !== 'undefined') {
        $notify(SCRIPT_NAME, subtitle, message)
        debugLog(`使用 $notify 发送通知`)
    } else {
        debugLog(`没有可用的通知API，使用日志代替`)
        log(`通知: ${subtitle} - ${message}`)
    }
}

function httpPost(options, callback) {
    debugLog(`发起HTTP POST请求: ${options.url}`)
    debugLog(`请求头: ${JSON.stringify(options.headers)}`)
    debugLog(`请求体: ${options.body}`)
    
    if (typeof $httpClient !== 'undefined') {
        debugLog(`使用 $httpClient 发送请求`)
        $httpClient.post(options, (error, response, body) => {
            debugLog(`$httpClient 响应 - error: ${error}, status: ${response?.status}, body: ${body}`)
            callback(error, response, body)
        })
    } else if (typeof $task !== 'undefined') {
        debugLog(`使用 $task 发送请求`)
        options.method = "POST"
        $task.fetch(options).then(response => {
            debugLog(`$task 响应 - status: ${response.status}, body: ${response.body}`)
            callback(null, response, response.body)
        }, reason => {
            debugLog(`$task 请求失败: ${reason.error}`)
            callback(reason.error, null, null)
        })
    } else {
        debugLog(`没有可用的HTTP客户端`)
        callback("HTTP client not available", null, null)
    }
}

function isRequest() {
    const result = typeof $request !== "undefined"
    debugLog(`isRequest: ${result}`)
    if (result && $request) {
        debugLog(`请求URL: ${$request.url}`)
        debugLog(`请求方法: ${$request.method}`)
    }
    return result
}

function isMatch(reg) {
    if (!$request) {
        debugLog(`isMatch: 没有 $request 对象`)
        return false
    }
    const result = !!($request.method != 'OPTIONS' && $request.url.match(reg))
    debugLog(`isMatch: ${reg} -> ${result}`)
    return result
}

function done(value = {}) {
    debugLog(`脚本执行完成: ${JSON.stringify(value)}`)
    if (typeof $done !== 'undefined') {
        $done(value)
    }
}

// 主要功能函数
function getToken() {
    log('🔍 开始获取token流程')
    
    if (isMatch(/\/supera\/member\/api\/bff\/pages\/v1_14_0\/v1\/user-info/)) {
        log('✅ URL匹配成功，开始解析token')
        
        if (!$request || !$request.headers) {
            log('❌ 请求对象或请求头为空')
            notify("获取token失败", "请求对象为空")
            return
        }
        
        let headers = $request.headers
        debugLog(`所有请求头: ${JSON.stringify(headers)}`)
        
        let token = headers["lmToken"] || headers["lmtoken"] || headers["LMTOKEN"] || ""
        debugLog(`提取的token: ${token}`)
        
        if (token) {
            let currentToken = getVal(TOKEN_KEY, '')
            debugLog(`当前存储的token: ${currentToken}`)
            
            if (currentToken === '') {
                log('🎉 首次获取token')
                setVal(TOKEN_KEY, token)
                notify("首次获取token成功", `token前20位: ${token.substring(0, 20)}...`)
            } else if (currentToken !== token) {
                log('🔄 token已更新')
                setVal(TOKEN_KEY, token)
                notify("token已更新", `新token前20位: ${token.substring(0, 20)}...`)
            } else {
                log('ℹ️ token未变化')
                notify("token检查", "token未变化，无需更新")
            }
        } else {
            log('❌ 未找到token')
            notify("获取token失败", "请求头中未找到lmToken字段")
            debugLog(`可用的header字段: ${Object.keys(headers).join(', ')}`)
        }
    } else {
        debugLog('URL不匹配，跳过token获取')
    }
}

function doSignIn() {
    log('🚀 开始执行签到流程')
    
    let token = getVal(TOKEN_KEY, '')
    if (isEmpty(token)) {
        log('❌ 签到失败：没有token')
        notify("签到失败", "请先打开龙湖APP登录获取token")
        done()
        return
    }

    log(`✅ 找到token，开始签到: ${token.substring(0, 20)}...`)

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

    log('📡 发送签到请求...')
    httpPost(options, (error, response, data) => {
        if (error) {
            log(`❌ 签到请求失败: ${error}`)
            notify("签到失败", `请求失败: ${error}`)
        } else {
            log(`📥 收到签到响应: ${data}`)
            try {
                const result = JSON.parse(data)
                debugLog(`解析后的响应: ${JSON.stringify(result)}`)
                
                if (result.code === 200 || result.code === "200") {
                    log('🎉 签到成功')
                    notify("签到成功", `签到完成: ${result.message || '获得积分'}`)
                } else {
                    log(`⚠️ 签到异常: code=${result.code}`)
                    notify("签到异常", `返回码: ${result.code}, 消息: ${result.message || '未知错误'}`)
                }
            } catch (e) {
                log(`❌ 响应解析失败: ${e}`)
                notify("签到失败", `响应解析失败: ${e}`)
                debugLog(`原始响应数据: ${data}`)
            }
        }
        done()
    })
}

// 主执行逻辑
log('🎬 脚本开始执行')
debugLog(`环境检测: $request=${typeof $request}, $httpClient=${typeof $httpClient}, $task=${typeof $task}, $notification=${typeof $notification}, $persistentStore=${typeof $persistentStore}`)

if (isRequest()) {
    log('📥 检测到请求阶段，执行token获取')
    getToken()
    done()
} else {
    log('⏰ 检测到定时任务阶段，执行签到')
    let token = getVal(TOKEN_KEY, '')
    if (isEmpty(token)) {
        log('⚠️ 未找到token，请先获取')
        notify("请先获取token", "请打开龙湖APP登录")
        done()
    } else {
        log('✅ 找到token，开始签到')
        doSignIn()
    }
}
