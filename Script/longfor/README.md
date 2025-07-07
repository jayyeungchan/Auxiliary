# 🏢 龙湖APP自动签到脚本

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-iOS-lightgrey.svg)]()
[![Script](https://img.shields.io/badge/script-JavaScript-yellow.svg)]()
[![Version](https://img.shields.io/badge/version-v1.0-green.svg)]()

> 🎯 一个用于龙湖APP自动签到的脚本，支持Surge、Shadowrocket、Quantumult X、Loon等代理工具平台

## 🆕 更新日志

### v1.0 (2025-07-07)
- ✅ **实现自动签到功能** - 每日定时自动签到获取积分
- 🚀 **优化多平台兼容性** - 内联工具函数，无外部依赖
- 🔔 **完善通知系统** - 支持多种代理工具的通知推送
- 🔍 **详细日志记录** - 完整的执行日志和错误追踪

## ⚠️ 免责声明

**本项目仅供学习交流使用，请勿用于商业或非法用途！**

- 本项目是代理工具的模块脚本，用于为日常使用的app提供辅助功能
- 使用本项目代码所造成的任何后果由使用者自行承担
- 作者不对任何因使用本项目而导致的任何损失或法律责任负责
- 如有侵权请联系作者删除

## 📋 功能特性

- ✅ **自动签到** - 每日定时自动签到获取积分
- 🔄 **Token自动获取与更新** - 智能维护登录状态
- 📱 **多平台支持** - 支持Surge、Shadowrocket、Quantumult X、Loon
- 🔔 **通知推送** - 支持多种通知方式
- 🔍 **详细日志** - 完整的执行日志和错误追踪
- 🛠️ **无外部依赖** - 内联所有工具函数，兼容性更好

## 🚀 快速开始

### 环境要求

- iOS设备 + Surge/Shadowrocket/Quantumult X/Loon
- 龙湖APP (已登录状态)

### 安装步骤

#### 方法1：Surge 用户（推荐）

1. **下载模块文件**
   ```
   https://raw.githubusercontent.com/devkityeung/Auxiliary/main/Script/longfor/longfor-checkin.sgmodule
   ```

2. **导入模块** - Surge: 配置 → 模块 → 安装新模块

#### 方法2：Shadowrocket/Quantumult X/Loon 用户

1. **手动添加脚本配置**
   - 脚本地址：
   ```
   https://raw.githubusercontent.com/devkityeung/Auxiliary/main/Script/longfor/longfor-checkin.js
   ```

2. **添加MITM配置**
   ```
   hostname = gw2c-hw-open.longfor.com
   ```

3. **配置脚本规则**
   - **获取Token脚本**：匹配 `^https://gw2c-hw-open\.longfor\.com/supera/member/api/bff/pages/v1_14_0/v1/user-info`
   - **定时签到脚本**：设置定时任务，建议每天上午9点执行

### 获取Token

1. **安装脚本后**，打开龙湖APP并登录
2. **进入"我的"页面**，脚本会自动获取lmToken
3. **查看通知**确认Token获取成功

## ⚙️ 配置说明

### MITM配置

```ini
[MITM]
hostname = gw2c-hw-open.longfor.com
```

### 脚本配置参数

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `签到时间` | 每日签到执行时间 | 09:00 |
| `通知推送` | 签到结果通知 | 开启 |
| `日志记录` | 详细执行日志 | 开启 |

## 📱 使用方法

### 首次使用

1. **安装脚本**后，打开龙湖APP并登录
2. **进入"我的"页面**，脚本会自动获取lmToken
3. **查看通知**确认Token获取成功
4. **等待自动签到**

### 日常使用

- 脚本会在每天上午9点自动执行签到
- 签到结果会通过通知推送
- 可在代理工具的日志中查看详细信息

## 🔧 故障排除

### 常见问题

**Q: Token获取失败？**
- 确保已添加MITM域名配置：`gw2c-hw-open.longfor.com`
- 检查代理工具是否已安装并信任证书
- 尝试重新登录龙湖APP，并进入"我的"页面

**Q: 签到失败？**
- 检查网络连接是否正常
- 确认Token是否过期（重新获取Token）
- 查看代理工具日志定位具体错误

**Q: 通知不推送？**
- 检查设备通知权限设置
- 确认代理工具通知功能已开启
- 部分工具需要在前台运行才能推送通知

**Q: 脚本不执行？**
- 确认定时任务配置正确
- 检查脚本URL是否可访问
- 确保代理工具的脚本功能已启用

**Q: 出现签到异常？**
- 查看具体错误码和消息
- 如果是网络相关错误，稍后重试
- 如果持续失败，可能是活动已结束或规则变更

## ⚠️ 注意事项

1. **合规使用**: 请遵守龙湖APP的使用条款和相关法律法规
2. **账号安全**: 妥善保管Token信息，避免泄露给他人
3. **适度使用**: 避免频繁请求导致账号异常或被限制
4. **及时更新**: 关注脚本更新，确保功能正常运行
5. **网络环境**: 确保网络连接稳定，避免签到失败

## 📄 许可证

本项目采用 [MIT License](LICENSE) 许可证。

## 🙏 致谢

- 感谢各代理工具开发者提供的平台支持
- 感谢开源社区的贡献和反馈

## 📞 联系方式

- **GitHub**: [devkityeung/Auxiliary](https://github.com/devkityeung/Auxiliary)
- **Issues**: [提交问题和建议](https://github.com/devkityeung/Auxiliary/issues)

---

⭐ 如果这个项目对你有帮助，请给个Star支持一下！

**再次声明：本项目仅供学习交流使用，请遵守相关法律法规，不得用于商业用途！**
