# Yu-Recall-Plugin (防撤回监控)

<p align="center">
  <img src="https://img.shields.io/badge/Author-yuhold-blue" alt="Author">
  <img src="https://img.shields.io/badge/Yunzai-V3-brightgreen" alt="Yunzai V3">
  <img src="https://img.shields.io/badge/Guoba-Support-orange" alt="Guoba Support">
</p>

## 📖 简介 | Introduction

**Yu-Recall-Plugin** 是一个运行在 [Yunzai-Bot](https://github.com/Le-niao/Yunzai-Bot) V3 上的防撤回插件。
它可以实时监控群聊和好友的撤回消息，并将撤回的内容（文本、图片、表情等）自动转发给配置的主人 QQ。

插件支持 **锅巴面板 (Guoba-Plugin)** 全程可视化配置，拥有黑白名单模式、多语言切换及调试功能。

## ✨ 特性 | Features

- ⚡ **实时监控**：毫秒级响应群聊与私聊的撤回事件。
- 🖼️ **多类型支持**：支持转发文本、图片、表情包及混合消息。
- ⚙️ **锅巴面板**：支持 Guoba-Plugin，Web 界面一键配置。
- 🛡️ **黑白名单**：
  - **全局模式**：默认监听所有，可设置黑名单屏蔽特定群/人。
  - **指定模式**：默认不监听，仅监听白名单内的群/人。
- 🌍 **多语言支持**：界面支持 **简体中文** 与 **English** 切换。
- 🐞 **调试模式**：内置 Debug 开关，方便排查权限与转发问题。
- 📂 **动态路径**：支持任意文件夹重命名，不影响读取配置。

## 💿 安装 | Installation

请在云崽根目录下的 `plugins` 文件夹内执行以下命令：

```bash
git clone [https://github.com/yuhold/yu-recall-plugin.git](https://github.com/yuhold/yu-recall-plugin.git) ./plugins/yu-recall-plugin

```

> 推荐安装 [Guoba-Plugin](https://github.com/guoba-yunzai/guoba-plugin) 以获得最佳配置体验。

## ⚙️ 配置 | Configuration

### 方法一：锅巴面板（推荐）

1. 发送 `#锅巴登录`，进入 Web 配置界面。
2. 找到 **Yu防撤回 (Yu-Recall)** 插件。
3. 你可以进行如下设置：
* **开关**：一键开启/关闭插件。
* **模式**：切换全局监听或白名单模式。
* **名单管理**：输入群号/QQ号，多个号码用逗号或回车分隔。
* **语言**：切换 CN/EN 界面（保存后需刷新页面）。
* **调试**：开启后控制台会输出详细日志。



### 方法二：手动配置文件

配置文件位于：`plugins/yu-recall-plugin/config/system/config.yaml`

```yaml
enable: true          # 总开关
debug: false          # 调试模式
language: 'CN'        # 语言: CN 或 EN
globalMode: true      # true=黑名单模式, false=白名单模式
blackListGroup: []    # 群黑名单
whiteListGroup: []    # 群白名单
blackListFriend: []   # 好友黑名单
whiteListFriend: []   # 好友白名单

```

## 📩 消息格式 | Message Format

当检测到撤回时，Bot 会向主人发送如下格式的私聊：

**群聊撤回：**

```text
群名 群号 撤回内容：
[原消息内容/图片]

```

**好友撤回：**

```text
好友昵称 QQ号 撤回内容：
[原消息内容/图片]

```

## 🛠️ 常见问题 | FAQ

**Q: 为什么我自己撤回的消息没有转发？**
A: 为了防止刷屏，插件默认过滤了**机器人自己**和**配置的主人(Master)**的撤回动作。

**Q: 为什么有时候撤回无法检测到？**
A: 插件基于内存缓存（默认缓存125秒）。如果消息发送超过2分钟，或者在消息发送后机器人重启过，缓存丢失将无法获取原消息。

**Q: 文件夹改名后还能用吗？**
A: 可以。插件采用了动态路径获取方案，你可以随意重命名插件文件夹。

## ⚠️ 免责声明 | Disclaimer

本插件仅供学习与技术交流使用。请勿用于非法监控或侵犯他人隐私。使用本插件产生的任何后果由使用者自行承担。

---

**Author:** [yuhold](https://www.google.com/search?q=https://github.com/yuhold)