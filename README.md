# WristAMap · 腕上高德

把 Android 高德地图的导航通知同步到**国行普通版小米手环 9**。基于 [Gu-Mie/wrist-navigation](https://github.com/Gu-Mie/wrist-navigation) 的独立 fork，针对 192×490 胶囊屏适配。

当前配套版本：**手机 0.3.3 / 手环 0.3.3**。用户已确认当前功能正常，包括前序确认的自动打开、手机亮屏/锁屏同步和通知隐藏；没有完成定时耗电与长期后台测试。详细范围见 [适配与验证记录](docs/band9-adaptation.md)。

## 功能

- 同步高德步行、骑行通知中的方向、距离与原文，不独立定位或规划路线。
- 大箭头、大距离显示，转向与临近路口振动；通知没有步骤 ID，提醒使用启发式判断。
- 导航开始自动打开手环，导航页前台常亮；结束导航后自动退出应用。
- 支持字号、箭头大小和粗细调整，采用系统字体，避免大字体包造成安装问题。
- 手机后台同步；本应用通知显示可关闭，读取高德的通知使用权仍需保留。

## 安装

使用本 fork 同签名配套的 `WristAMap-phone-0.3.3.apk` 与 `WristAMap-band9-0.3.3.rpk`。手机安装 APK，AstroBox 用“快应用”安装 RPK，然后恢复小米运动健康连接。开启手机应用的通知使用权、附近设备权限、互联授权及同步开关。

双端包名为 `io.github.azuresora.wristamap`，不可与上游安装包交叉配对。安装包和私钥不进入 Git；维护者本地产物在 `outputs/releases/band9-0.3.3/`，本次提交不等于发布 GitHub Release。

[首次使用](docs/getting-started.md) · [后台与耗电策略](docs/background-sync.md) · [开发指南](docs/development.md) · [更新记录](CHANGELOG.md) · [文档索引](docs/README.md)

## 开发

Node.js 22+，根目录无需安装依赖：

```sh
npm test
npm run check:public
npm run dev
```

浏览器预览使用模拟通信，不能替代真机证据。双端构建需另配置 Android SDK、小米互联 SDK 与本 fork 配套签名，见开发指南。

## 适用范围与许可

本轮实测手机为 Android 16 / HyperOS 3，高德 17.00.0.2005、运动健康 3.58.0；其他手机与固件待验证。最低 Android 8.0 是构建要求，不代表所有版本实测通过。长期后台、重启恢复、深度 Doze、ACK 回程及定量耗电仍待验证。

原创代码沿用 [MIT](LICENSE)，保留上游作者版权；依赖说明见 [第三方声明](THIRD_PARTY_NOTICES.md)，数据处理见 [隐私说明](PRIVACY.md)。本项目与高德、小米或 AstroBox 无隶属关系。
