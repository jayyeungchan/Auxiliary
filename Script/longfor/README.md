# 🏢 龙湖APP自动签到脚本

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-lightgrey.svg)]()
[![Script](https://img.shields.io/badge/script-JavaScript-yellow.svg)]()

> 🎯 一个用于龙湖APP自动签到的脚本，支持Surge、Shadowrocket(小火箭)等代理工具平台

## ⚠️ 免责声明

**本项目仅供学习交流使用，请勿用于商业或非法用途！**

- 本项目是Surge、Shadowrocket(小火箭)等工具的模块脚本，用于为日常使用的app提供辅助功能
- 使用本项目代码所造成的任何后果由使用者自行承担
- 作者不对任何因使用本项目而导致的任何损失或法律责任负责
- 如有侵权请联系作者删除

## 📋 功能特性

- ✅ **自动签到** - 每日定时自动签到获取积分
- 🔄 **Token自动获取与更新** - 智能维护登录状态
- 📱 **多平台支持** - 支持Surge、Shadowrocket(小火箭)等
- 🔔 **通知推送** - 支持多种通知方式

## 🚀 快速开始

### 环境要求

- iOS设备 + Surge/Shadowrocket(小火箭)
- 龙湖APP (已登录状态)

### 安装步骤

#### 模块安装（推荐）

1. **下载模块文件**
   ```
   https://raw.githubusercontent.com/devkityeung/Auxiliary/main/Script/longfor/longfor-checkin.sgmodule
   ```

2. **导入到代理工具**
   - Surge: 配置 → 模块 → 安装新模块
   - Shadowrocket(小火箭): 配置 → 模块 → 添加模块

3. **获取Token**
   - 安装模块后打开龙湖APP,登录APP并切到“我的”页面
   - 脚本会自动获取并保存lmToken
   - 查看通知确认Token获取成功

## ⚙️ 配置说明

### 模块配置

龙湖签到模块(`longfor-checkin.sgmodule`)包含以下组件：

```ini
[Script]
# 获取Token脚本，获取成功后可以注释
龙湖签到Token = type=http-response,pattern=^https:\/\/gw2c-hw-open\.longfor\.com\/supera\/member\/api\/bff\/pages\/v1_14_0\/v1\/user-info,requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/devkityeung/Auxiliary/main/Script/longfor/longfor-checkin.js?_=${timestamp}

# 定时签到脚本
龙湖自动签到 = type=cron,cronexp="0 9 * * *",wake-system=1,script-path=https://raw.githubusercontent.com/devkityeung/Auxiliary/main/Script/longfor/longfor-checkin.js?_=${timestamp}
```

### MITM配置

```ini
[MITM]
hostname = %APPEND% gw2c-hw-open.longfor.com
```

### 基本配置

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `签到时间` | 每日签到执行时间 | 09:00 |
| `通知开关` | 是否发送通知 | 开启 |
| `仅失败通知` | 只在失败时通知 | 关闭 |
| `调试日志` | 是否输出详细日志 | 开启 |

## 📱 使用方法

### 首次使用

1. **安装模块**后，打开龙湖APP,登录APP并切到“我的”页面
2. **浏览任意页面**，脚本会自动获取lmToken
3. **查看通知**确认Token获取成功
4. **等待自动签到**

### 日常使用

- 脚本会在每天09:00自动执行签到
- 签到结果会通过通知推送
- 可在代理工具的日志中查看详细信息

## 🔧 故障排除

### 常见问题

**Q: Token获取失败？**
- 确保已添加MITM域名配置
- 检查代理工具是否已安装证书
- 尝试重新登录龙湖APP

**Q: 签到失败？**
- 检查网络连接是否正常
- 确认Token是否过期
- 查看错误日志定位问题

**Q: 通知不推送？**
- 检查通知权限设置
- 确认代理工具通知功能已开启

### 日志分析

```javascript
// 成功日志示例
✅ 首次获取token成功, token: xxxxxxxx

// 更新日志示例  
✅ token已更新, 新token: xxxxxxxx

// 未变化日志示例
✅ token未变化, 当前token: xxxxxxxx
```

## ⚠️ 注意事项

1. **合规使用**: 请遵守龙湖APP的使用条款
2. **账号安全**: 妥善保管Token信息，避免泄露
3. **适度使用**: 避免频繁请求导致账号异常
4. **及时更新**: 关注脚本更新，确保功能正常

## 📄 许可证

本项目采用 [MIT License](LICENSE) 许可证。

## 🙏 致谢

- 感谢 [lowking](https://github.com/lowking/Scripts) 提供的ToolKit框架
- 感谢各代理工具开发者提供的平台支持

## 📞 联系方式

- **GitHub**: [devkityeung/Auxiliary](https://github.com/devkityeung/Auxiliary)

---

⭐ 如果这个项目对你有帮助，请给个Star支持一下！

**再次声明：本项目仅供学习交流使用，请遵守相关法律法规，不得用于商业用途！**