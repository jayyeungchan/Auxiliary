# 🏢 龙湖app自动签到脚本

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-lightgrey.svg)]()
[![Script](https://img.shields.io/badge/script-JavaScript-yellow.svg)]()

> 🎯 一个用于龙湖app自动签到的脚本，支持多种代理工具平台

## 📋 功能特性

- ✅ **自动签到** - 每日定时自动签到获取积分
- 🔄 **Token自动刷新** - 智能维护登录状态
- 🛡️ **防重复签到** - 避免重复操作被检测
- 📱 **多平台支持** - 支持Surge、Loon、Quantumult X等
- 📊 **签到统计** - 记录签到天数和获得积分
- 🔔 **通知推送** - 支持多种通知方式
- 🎁 **奖励领取** - 自动领取签到奖励

## 🚀 快速开始

### 环境要求

- iOS设备 + Surge/Loon/Quantumult X/Stash
- 或 Android设备 + 支持JavaScript的代理工具
- 或 Node.js环境

### 安装步骤

#### 方法一：模块安装（推荐）

1. **下载模块文件**
   ```
   https://raw.githubusercontent.com/your-username/longhu-checkin/main/longhu.module
   ```

2. **导入到代理工具**
   - Surge: 配置 → 模块 → 安装新模块
   - Loon: 配置 → 插件 → 添加插件
   - Quantumult X: 风车 → 重写 → 引用

3. **获取Cookie**
   - 打开龙湖app并登录
   - 脚本会自动获取并保存认证信息

#### 方法二：手动配置

1. **添加重写规则**
   ```ini
   [Script]
   # 获取Cookie
   龙湖签到Cookie = type=http-response,pattern=^https:\/\/.*\.longhu\.net\/.*\/token,requires-body=1,script-path=longhu-checkin.js
   
   # 定时签到
   龙湖自动签到 = type=cron,cronexp="0 9 * * *",wake-system=1,script-path=longhu-checkin.js
   ```

2. **添加MITM域名**
   ```ini
   [MITM]
   hostname = %APPEND% *.longhu.net
   ```

## ⚙️ 配置说明

### 基本配置

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `签到时间` | 每日签到执行时间 | 09:00 |
| `通知开关` | 是否发送通知 | 开启 |
| `仅失败通知` | 只在失败时通知 | 关闭 |
| `调试日志` | 是否输出详细日志 | 开启 |

### 高级配置

- **Telegram通知**: 支持通过Telegram Bot发送通知
- **多账号支持**: 可配置多个龙湖账号同时签到
- **自定义User-Agent**: 模拟不同设备避免检测

## 📱 使用方法

### 首次使用

1. **安装脚本**后，打开龙湖app
2. **登录账号**，脚本会自动获取Cookie
3. **查看通知**确认Cookie获取成功
4. **等待自动签到**或手动执行测试

### 日常使用

- 脚本会在每天09:00自动执行签到
- 签到结果会通过通知推送
- 可在代理工具的日志中查看详细信息

## 🔧 故障排除

### 常见问题

**Q: Cookie获取失败？**
- 确保已添加MITM域名配置
- 检查代理工具是否已安装证书
- 尝试重新登录龙湖app

**Q: 签到失败？**
- 检查网络连接是否正常
- 确认Cookie是否过期
- 查看错误日志定位问题

**Q: 通知不推送？**
- 检查通知权限设置
- 确认代理工具通知功能已开启
- 验证Telegram配置（如使用）

### 日志分析

```javascript
// 成功日志示例
✅ 龙湖签到成功 - 第7天连续签到，获得积分+10

// 失败日志示例  
❌ 龙湖签到失败 - Token已过期，请重新获取Cookie
```

## 📊 功能展示

### 签到统计
- 连续签到天数
- 累计获得积分
- 本月签到记录
- 奖励领取状态

### 通知示例
```
🏢 龙湖签到通知
✅ 签到成功
📅 连续签到: 7天
🎁 获得积分: +10
💰 当前积分: 1250
```

## ⚠️ 注意事项

1. **合规使用**: 请遵守龙湖app的使用条款
2. **账号安全**: 妥善保管Cookie信息，避免泄露
3. **适度使用**: 避免频繁请求导致账号异常
4. **及时更新**: 关注脚本更新，确保功能正常

## 🤝 贡献指南

欢迎提交Issue和Pull Request来改进这个项目！

### 开发环境

```bash
# 克隆项目
git clone https://github.com/your-username/longhu-checkin.git

# 进入目录
cd longhu-checkin

# 安装依赖（如需要）
npm install
```

### 提交规范

- 🐛 `fix`: 修复bug
- ✨ `feat`: 新功能
- 📝 `docs`: 文档更新
- 🎨 `style`: 代码格式
- ♻️ `refactor`: 重构代码

## 📄 许可证

本项目采用 [MIT License](LICENSE) 许可证。

## 🙏 致谢

- 感谢 [lowking](https://github.com/lowking/Scripts) 提供的ToolKit框架
- 感谢各代理工具开发者提供的平台支持

## 📞 联系方式

- **Issues**: [GitHub Issues](https://github.com/your-username/longhu-checkin/issues)
- **Email**: your-email@example.com

---

⭐ 如果这个项目对你有帮助，请给个Star支持一下！
