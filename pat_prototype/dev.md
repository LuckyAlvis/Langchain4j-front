# 宠物助手APP架构文档

## 1. 产品概述

宠物助手APP是一款为12-35岁年轻宠物主人量身定制的应用程序，提供宠物日常管理的全方位解决方案。应用通过一系列简单实用的小工具，如提醒、记账、相册、体重管理和病历管理等，帮助宠物主人轻松管理宠物的日常生活。应用设计简洁，操作便捷，专注于提升用户体验，去除了复杂的功能，让用户和宠物享受更美好的时光。

## 2. 技术架构

### 2.1 架构模式

本项目采用**Flutter**框架进行跨平台开发，采用**MVVM(Model-View-ViewModel)**架构模式，结合**Provider**状态管理，实现数据与UI的有效分离。

![MVVM架构模式](https://example.com/mvvm-diagram.png)

#### 架构层次：

1. **Model层**：表示业务数据和业务规则
   - 数据模型
   - 数据验证
   - 数据存储逻辑

2. **View层**：用户界面
   - Flutter Widget
   - 页面布局
   - 用户交互组件

3. **ViewModel层**：连接Model和View
   - 数据转换
   - 命令处理
   - 状态管理

4. **服务层**：提供通用功能
   - 本地存储服务
   - 通知服务
   - 图片处理服务

### 2.2 项目结构

```
lib/
├── main.dart                  # 应用入口
├── app.dart                   # 应用配置
├── routes.dart                # 路由管理
├── constants/                 # 常量定义
│   ├── app_constants.dart     # 应用常量
│   └── theme_constants.dart   # 主题常量
├── models/                    # 数据模型
│   ├── user_model.dart        # 用户模型
│   ├── pet_model.dart         # 宠物模型
│   ├── health_record_model.dart # 健康记录模型
│   ├── reminder_model.dart    # 提醒模型
│   ├── finance_model.dart     # 财务模型
│   ├── photo_model.dart       # 照片模型
│   └── diary_model.dart       # 日记模型
├── view_models/               # 视图模型
│   ├── user_view_model.dart   # 用户视图模型
│   ├── pet_view_model.dart    # 宠物视图模型
│   ├── health_view_model.dart # 健康视图模型
│   ├── reminder_view_model.dart # 提醒视图模型
│   ├── finance_view_model.dart # 财务视图模型
│   ├── album_view_model.dart  # 相册视图模型
│   └── diary_view_model.dart  # 日记视图模型
├── services/                  # 服务
│   ├── storage_service.dart   # 存储服务
│   ├── notification_service.dart # 通知服务
│   ├── photo_service.dart     # 照片服务
│   ├── backup_service.dart    # 备份服务
│   └── analytics_service.dart # 分析服务
├── views/                     # 视图页面
│   ├── splash/                # 启动页
│   ├── onboarding/            # 引导页
│   ├── home/                  # 主页
│   ├── user/                  # 用户相关页面
│   ├── pet/                   # 宠物相关页面
│   ├── health/                # 健康相关页面
│   ├── reminder/              # 提醒相关页面
│   ├── finance/               # 财务相关页面
│   ├── album/                 # 相册相关页面
│   ├── diary/                 # 日记相关页面
│   └── settings/              # 设置页面
├── widgets/                   # 共用组件
│   ├── custom_app_bar.dart    # 自定义应用栏
│   ├── pet_card.dart          # 宠物卡片
│   ├── health_chart.dart      # 健康图表
│   ├── reminder_item.dart     # 提醒项目
│   ├── photo_grid.dart        # 照片网格
│   └── custom_form_fields.dart # 自定义表单字段
├── styles/                    # 样式
│   ├── app_theme.dart         # 应用主题
│   ├── text_styles.dart       # 文本样式
│   └── color_schemes.dart     # 颜色方案
├── utils/                     # 工具类
│   ├── date_formatter.dart    # 日期格式化
│   ├── validators.dart        # 数据验证
│   ├── file_helpers.dart      # 文件辅助
│   └── analytics_helpers.dart # 分析辅助
└── localization/              # 本地化
    ├── app_localizations.dart # 本地化支持
    └── l10n/                  # 语言文件
```

### 2.3 依赖管理

主要依赖库：

```yaml
dependencies:
  flutter:
    sdk: flutter
  flutter_localizations:
    sdk: flutter
  
  # 状态管理
  provider: ^6.0.5
  
  # 本地存储
  shared_preferences: ^2.2.0
  sqflite: ^2.3.0
  path_provider: ^2.1.0
  
  # UI组件
  flutter_svg: ^2.0.7
  cached_network_image: ^3.2.3
  table_calendar: ^3.0.9
  fl_chart: ^0.63.0
  photo_view: ^0.14.0
  image_picker: ^1.0.2
  
  # 功能支持
  intl: ^0.18.1
  uuid: ^3.0.7
  image_cropper: ^5.0.0
  local_notifications: ^4.0.1+1
  permission_handler: ^10.4.3
  file_picker: ^5.3.3
  share_plus: ^7.1.0
  pdf: ^3.10.4
  
  # 辅助工具
  logger: ^1.4.0
  connectivity_plus: ^4.0.2
```

### 2.4 组件关系图

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    视图层   │ ◄── │  视图模型层  │ ◄── │   模型层    │
│   (Views)   │     │(ViewModels) │     │  (Models)   │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   UI组件    │     │ 业务逻辑处理 │     │ 数据存储与  │
│  (Widgets)  │     │(Business    │     │ 验证        │
│             │     │ Logic)      │     │(Data & Rules)│
└─────────────┘     └─────────────┘     └─────────────┘
       ▲                   ▲                   ▲
       │                   │                   │
       │                   │                   │
┌──────┴──────┐     ┌──────┴──────┐     ┌──────┴──────┐
│  公共组件    │     │   服务层    │     │  工具类     │
│(Common      │     │ (Services)  │     │ (Utils)     │
│ Components) │     │             │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
```

### 2.5 网络通信方案

由于本应用主要以本地存储为主，不涉及复杂的网络通信。主要网络通信包括：

- **备份与恢复**：可选的云端备份功能
- **图片分享**：通过系统分享功能实现
- **软件更新**：检查应用更新

## 3. UI/UX设计

### 3.1 设计语言与风格指南

- **设计系统**：基于Material Design 3
- **设计风格**：简约现代，清新活泼
- **主色调**：蓝色系(#4285F4)和白色(#FFFFFF)为主，辅以活泼的强调色
- **字体**：Roboto字体，主标题24sp，副标题18sp，正文14sp
- **圆角**：元素统一使用8dp圆角
- **图标**：线性图标，保持视觉一致性
- **间距**：采用8dp网格系统，确保布局统一

### 3.2 界面布局与线框图

#### 3.2.1 主要页面结构

1. **引导页面**
   - 轮播式介绍页面
   - 跳过/继续按钮
   - 进度指示器

2. **主页**
   - 宠物选择器
   - 功能模块网格
   - 今日提醒
   - 最近记录

3. **宠物管理页**
   - 宠物列表
   - 宠物详情
   - 添加/编辑宠物表单

4. **健康记录页**
   - 健康数据视图
   - 体重趋势图表
   - 记录添加界面

5. **提醒页面**
   - 提醒列表
   - 日历视图
   - 添加提醒表单

6. **记账页面**
   - 消费列表
   - 支出分析图表
   - 添加支出表单

7. **相册页面**
   - 照片网格
   - 照片查看器
   - 编辑工具栏

8. **日记页面**
   - 日记列表
   - 日历视图
   - 日记编辑器

9. **设置页面**
   - 设置项列表
   - 主题预览
   - 备份还原界面

### 3.3 交互流程与状态转换

#### 3.3.1 主要交互流

1. **应用启动流程**
   ```
   启动屏幕 → 首次使用检查 → [是]引导页 → 主页
                          → [否]直接进入主页
   ```

2. **宠物管理流程**
   ```
   主页 → 宠物管理 → 宠物列表 → [添加]填写表单 → 上传照片 → 保存
                             → [查看]宠物详情 → [编辑]修改信息 → 保存
   ```

3. **健康记录流程**
   ```
   主页 → 健康记录 → 健康概览 → 选择健康模块 → [体重]记录体重 → 查看趋势
                                           → [疫苗]添加接种记录 → 设置下次提醒
   ```

4. **提醒流程**
   ```
   主页 → 提醒管理 → 查看提醒列表 → [添加]设置提醒内容 → 选择提醒方式 → 保存
                               → [完成]标记已完成 → 更新状态
   ```

5. **相册流程**
   ```
   主页 → 相册功能 → 浏览照片 → [添加]拍摄/选择照片 → 编辑照片 → 保存
                             → [查看]照片详情 → 分享/编辑
   ```

### 3.4 响应式适配策略

- **屏幕尺寸适配**：使用Flutter的Flexible、Expanded组件和MediaQuery进行动态布局
- **方向适配**：支持竖屏和横屏布局
- **平台适配**：针对iOS和Android分别提供符合平台特性的UI组件
- **屏幕密度适配**：使用Flutter的设备像素比(devicePixelRatio)进行图像资源适配
- **暗色模式支持**：提供亮色和暗色主题，跟随系统设置自动切换

## 4. 数据模型

### 4.1 核心数据结构

#### 4.1.1 用户模型(UserModel)

```dart
class UserModel {
  final String id;
  String name;
  String avatar;
  String contactInfo;
  String bio;
  Map<String, dynamic> preferences;
  DateTime createdAt;
  DateTime updatedAt;
  
  // 构造函数、工厂方法等
}
```

#### 4.1.2 宠物模型(PetModel)

```dart
class PetModel {
  final String id;
  String name;
  String species; // 物种(猫/狗等)
  String breed;   // 品种
  DateTime birthDate;
  String gender;
  bool isNeutered;
  double weight;
  List<String> photos;
  Map<String, dynamic> identifiers; // 芯片号、环颈圈ID等
  List<String> tags;
  String notes;
  DateTime createdAt;
  DateTime updatedAt;
  
  // 构造函数、工厂方法等
}
```

#### 4.1.3 健康记录模型(HealthRecordModel)

```dart
class HealthRecordModel {
  final String id;
  final String petId;
  String recordType; // 体重/疫苗/就医等
  DateTime recordDate;
  Map<String, dynamic> data; // 根据recordType存储不同类型数据
  List<String> attachments; // 附件(如照片、文档)
  String notes;
  DateTime createdAt;
  
  // 构造函数、工厂方法等
}
```

#### 4.1.4 提醒模型(ReminderModel)

```dart
class ReminderModel {
  final String id;
  final String petId; // 可选，特定宠物的提醒
  String title;
  String description;
  String type; // 喂食/药物/检查等
  DateTime dueDate;
  RecurrenceRule recurrence; // 重复规则
  int priority; // 优先级
  NotificationSettings notificationSettings;
  bool isCompleted;
  DateTime completedAt;
  DateTime createdAt;
  
  // 构造函数、工厂方法等
}
```

#### 4.1.5 财务记录模型(FinanceModel)

```dart
class FinanceModel {
  final String id;
  final String petId; // 可选，特定宠物的支出
  double amount;
  String category; // 食品/医疗/用品等
  DateTime date;
  String merchant;
  String notes;
  List<String> receiptImages;
  DateTime createdAt;
  
  // 构造函数、工厂方法等
}
```

#### 4.1.6 相册模型(PhotoModel & AlbumModel)

```dart
class PhotoModel {
  final String id;
  final String petId;
  String path;
  DateTime takenAt;
  List<String> tags;
  String description;
  String albumId;
  DateTime createdAt;
  
  // 构造函数、工厂方法等
}

class AlbumModel {
  final String id;
  String name;
  String coverPhotoId;
  String description;
  List<String> photoIds;
  DateTime createdAt;
  DateTime updatedAt;
  
  // 构造函数、工厂方法等
}
```

#### 4.1.7 日记模型(DiaryModel)

```dart
class DiaryModel {
  final String id;
  final String petId;
  String title;
  String content;
  DateTime date;
  String mood;
  bool isMilestone;
  List<String> photos;
  List<String> tags;
  DateTime createdAt;
  DateTime updatedAt;
  
  // 构造函数、工厂方法等
}
```

### 4.2 本地存储方案

本应用采用混合存储策略：

1. **SQLite数据库**：存储结构化数据
   - 用户信息
   - 宠物信息
   - 健康记录
   - 提醒事项
   - 财务记录
   - 日记内容

2. **文件系统**：存储媒体文件和文档
   - 照片和视频
   - 病历附件
   - 导出的报告
   - 备份文件

3. **SharedPreferences**：存储应用配置和用户偏好
   - 应用设置
   - 用户界面偏好
   - 首次运行标志
   - 上次同步时间

#### 4.2.1 数据库架构

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  users      │     │  pets        │     │  health     │
│             │     │             │     │  records    │
│ id          │─1───┼─*─petOwnerId│     │             │
│ name        │     │ id          │─1───┼─*─petId     │
│ avatar      │     │ name        │     │ id          │
│ contactInfo │     │ species     │     │ recordType  │
│ bio         │     │ breed       │     │ recordDate  │
│ preferences │     │ birthDate   │     │ data        │
│ createdAt   │     │ gender      │     │ attachments │
│ updatedAt   │     │ isNeutered  │     │ notes       │
└─────────────┘     │ weight      │     │ createdAt   │
                    │ photos      │     └─────────────┘
                    │ identifiers │
                    │ tags        │     ┌─────────────┐
                    │ notes       │     │  reminders  │
                    │ createdAt   │     │             │
                    │ updatedAt   │     │ id          │
                    └─────────────┘     │ petId       │
                                        │ title       │
┌─────────────┐     ┌─────────────┐     │ description │
│  finances   │     │  photos     │     │ type        │
│             │     │             │     │ dueDate     │
│ id          │     │ id          │     │ recurrence  │
│ petId       │     │ petId       │     │ priority    │
│ amount      │     │ path        │     │ notification│
│ category    │     │ takenAt     │     │ isCompleted │
│ date        │     │ tags        │     │ createdAt   │
│ merchant    │     │ description │     │ completedAt │
│ notes       │     │ albumId     │     └─────────────┘
│ receipts    │     │ createdAt   │
│ createdAt   │     └─────────────┘     ┌─────────────┐
└─────────────┘                         │  diaries    │
                    ┌─────────────┐     │             │
                    │  albums     │     │ id          │
                    │             │     │ petId       │
                    │ id          │     │ title       │
                    │ name        │     │ content     │
                    │ coverPhotoId│     │ date        │
                    │ description │     │ mood        │
                    │ photoIds    │     │ isMilestone │
                    │ createdAt   │     │ photos      │
                    │ updatedAt   │     │ tags        │
                    └─────────────┘     │ createdAt   │
                                        │ updatedAt   │
                                        └─────────────┘
```

### 4.3 数据同步机制

虽然应用主要基于本地存储，但提供以下同步机制：

1. **本地备份与恢复**
   - 将所有数据打包为加密ZIP文件
   - 存储在用户可访问的位置
   - 支持从备份文件恢复

2. **设备间同步**（可选功能）
   - 使用云存储服务存储加密备份
   - 多设备间共享同一账户
   - 定时或手动同步

3. **冲突解决策略**
   - 基于时间戳的简单合并
   - 冲突时提示用户选择版本
   - 保留冲突前的备份

## 5. 安全方案

### 5.1 数据加密

- 敏感数据使用AES-256加密存储
- 本地数据库文件加密
- 备份文件加密保护

### 5.2 安全存储

- 使用系统安全存储API保存敏感信息
- 避免在日志中记录敏感信息
- 应用内截屏保护(可选)

### 5.3 隐私保护

- 明确的隐私政策
- 最小权限请求原则
- 用户可控的数据共享选项

## 6. 测试计划

### 6.1 单元测试

- 针对模型和服务逻辑的测试
- 数据验证和转换测试
- 业务规则测试

### 6.2 组件测试

- UI组件渲染测试
- 交互逻辑测试
- 状态管理测试

### 6.3 集成测试

- 功能流程测试
- 数据一致性测试
- 跨页面交互测试

### 6.4 性能测试

- 启动时间优化
- 滚动流畅度测试
- 内存使用监控
- 电池消耗测试

## 7. 发布与维护计划

### 7.1 版本规划

- **v1.0**：核心功能（用户、宠物、健康记录、提醒）
- **v1.1**：财务管理功能
- **v1.2**：相册与照片管理
- **v1.3**：宠物日记功能
- **v2.0**：多设备同步、社区分享

### 7.2 持续集成与部署

- GitHub Actions自动化工作流
- 自动测试与构建
- 测试渠道发布

### 7.3 监控与反馈

- 应用内错误报告
- 用户反馈收集
- 使用分析

## 8. 结论

本架构文档提供了宠物助手APP的全面技术蓝图，从架构设计到数据模型，再到UI/UX和测试计划。采用Flutter框架和MVVM架构模式，确保了应用的跨平台兼容性和代码的可维护性。本文档将作为开发团队的指导方针，确保项目按计划高质量地实施。 