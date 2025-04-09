# AI财务助手聊天接口文档

本文档描述了AI财务助手聊天功能所需的API接口。

## 基础信息

- 基础URL: `http://your-domain.com/api`
- 所有请求和响应都使用JSON格式
- 所有请求都需要在header中包含认证信息: `Authorization: Bearer {token}`
- 所有响应都遵循统一的格式结构:

```json
{
  "code": 0,            // 状态码，0表示成功，非0表示失败
  "message": "success", // 状态消息
  "data": {}            // 响应数据，具体结构根据接口而异
}
```

## 接口列表

### 1. 获取欢迎消息

获取AI助手的欢迎消息。

**请求**

```
GET /chat/welcome
```

**响应**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "messageId": "msg_123456789",
    "text": "你好！我是你的AI财务助手。我可以帮你分析财务状况、提供预算建议、回答财务问题，以及为你的财务决策提供支持。请问你有什么需要帮助的吗？",
    "chatContext": "ctx_987654321"
  }
}
```

### 2. 发送聊天消息

发送用户消息并获取AI回复。

**请求**

```
POST /chat/message
```

**请求参数**

```json
{
  "message": "我想了解我的本月支出情况，并分析一下我可以在哪些方面节省开支。",
  "context": "ctx_987654321" // 可选，上下文ID，用于保持对话连贯性
}
```

**响应**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "messageId": "msg_234567890",
    "text": "根据你的记账数据，本月你的总支出为¥8,300，主要分布在以下几个类别：\n\n🏠 住房：¥3,500 (42.2%)\n🍽️ 餐饮：¥1,850 (22.3%)\n🚗 交通：¥950 (11.4%)\n🛒 购物：¥1,200 (14.5%)\n🎭 娱乐：¥800 (9.6%)\n\n与上月相比，你的餐饮支出增加了15%，购物支出增加了20%。如果你想节省开支，这两个类别可能是最佳的切入点。我可以为你提供具体的节省建议。",
    "chatContext": "ctx_987654321"
  }
}
```

### 3. 获取聊天历史列表

获取用户的历史对话列表。

**请求**

```
GET /chat/history
```

**响应**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "conversations": [
      {
        "id": "conv_123456",
        "title": "财务分析",
        "preview": "本月支出分析和节省建议",
        "category": "analysis",
        "time": "今天",
        "timestamp": 1715156400000
      },
      {
        "id": "conv_123457",
        "title": "投资规划",
        "preview": "基金定投与股票投资策略咨询",
        "category": "investment",
        "time": "昨天",
        "timestamp": 1715070000000
      },
      {
        "id": "conv_123458",
        "title": "税务优化",
        "preview": "个人所得税专项附加扣除申报指导",
        "category": "tax",
        "time": "3天前",
        "timestamp": 1714897200000
      }
    ],
    "total": 3
  }
}
```

### 4. 获取特定历史对话的消息记录

获取特定对话的详细消息记录。

**请求**

```
GET /chat/history/{historyId}
```

**响应**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "conversationId": "conv_123456",
    "title": "财务分析",
    "category": "analysis",
    "messages": [
      {
        "id": "msg_123456789",
        "sender": "bot",
        "text": "你好！我是你的AI财务助手。我可以帮你分析财务状况、提供预算建议、回答财务问题，以及为你的财务决策提供支持。请问你有什么需要帮助的吗？",
        "time": "14:30",
        "timestamp": 1715156400000
      },
      {
        "id": "msg_123456790",
        "sender": "user",
        "text": "我想了解我的本月支出情况，并分析一下我可以在哪些方面节省开支。",
        "time": "14:31",
        "timestamp": 1715156460000
      },
      {
        "id": "msg_123456791",
        "sender": "bot",
        "text": "根据你的记账数据，本月你的总支出为¥8,300，主要分布在以下几个类别：\n\n🏠 住房：¥3,500 (42.2%)\n🍽️ 餐饮：¥1,850 (22.3%)\n🚗 交通：¥950 (11.4%)\n🛒 购物：¥1,200 (14.5%)\n🎭 娱乐：¥800 (9.6%)\n\n与上月相比，你的餐饮支出增加了15%，购物支出增加了20%。如果你想节省开支，这两个类别可能是最佳的切入点。我可以为你提供具体的节省建议。",
        "time": "14:32",
        "timestamp": 1715156520000
      }
    ],
    "chatContext": "ctx_987654321"
  }
}
```

### 5. 获取快速提问列表

获取预设的快速提问列表，可以根据问题分类进行过滤。

**请求**

```
GET /chat/quick-questions?category={category}
```

**参数说明**

- `category`: 可选，问题分类，例如 `budget`、`investment` 等

**响应**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "questions": [
      {
        "id": "q1",
        "text": "如何制定月度预算？",
        "category": "budget"
      },
      {
        "id": "q2",
        "text": "我应该如何开始投资？",
        "category": "investment"
      },
      {
        "id": "q3",
        "text": "我的储蓄率合理吗？",
        "category": "savings"
      },
      {
        "id": "q4",
        "text": "如何快速还清信用卡债务？",
        "category": "debt"
      }
    ]
  }
}
```

### 6. 获取对话分类标签

获取所有可用的对话分类标签。

**请求**

```
GET /chat/tabs
```

**响应**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "tabs": [
      {
        "id": "analysis",
        "name": "财务分析"
      },
      {
        "id": "budget",
        "name": "预算规划"
      },
      {
        "id": "investment",
        "name": "投资建议"
      },
      {
        "id": "debt",
        "name": "债务管理"
      },
      {
        "id": "savings",
        "name": "储蓄技巧"
      },
      {
        "id": "tax",
        "name": "税务咨询"
      }
    ]
  }
}
```

### 7. 创建新对话

创建一个新的对话，可以指定对话分类。

**请求**

```
POST /chat/new
```

**请求参数**

```json
{
  "category": "investment" // 对话分类ID
}
```

**响应**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "conversationId": "conv_123459",
    "chatContext": "ctx_987654322"
  }
}
```

### 8. 删除历史对话

删除指定的历史对话。

**请求**

```
DELETE /chat/history/{historyId}
```

**响应**

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "deleted": true
  }
}
```

## 错误码说明

| 错误码 | 说明 |
|--------|------|
| 0      | 成功 |
| 1001   | 未授权 |
| 1002   | 参数错误 |
| 2001   | 聊天上下文不存在 |
| 2002   | 历史对话不存在 |
| 3001   | 服务暂时不可用 |
| 3002   | 调用AI服务失败 |
| 5001   | 内部服务器错误 |

## 实现建议

1. **聊天上下文管理**：
   - 使用Redis或类似的内存数据库存储聊天上下文，设置合理的过期时间
   - 对话上下文可包含用户ID、会话ID、历史消息摘要等

2. **AI模型集成**：
   - 考虑使用OpenAI GPT或类似的大语言模型来提供智能回复
   - 预设合适的提示词，确保AI回复符合财务顾问的角色和语气

3. **性能优化**：
   - 实现消息的分页加载，避免一次性加载大量历史消息
   - 对于长对话历史，可以考虑在后端进行摘要，减少发送给AI模型的token数量

4. **数据安全**：
   - 确保所有包含用户财务数据的通信都使用HTTPS加密
   - 实现适当的数据脱敏和访问控制，保护用户隐私

5. **错误处理**：
   - 实现全局异常处理，确保所有API请求都有统一的错误响应格式
   - 对于AI服务暂时不可用的情况，提供合理的降级策略 