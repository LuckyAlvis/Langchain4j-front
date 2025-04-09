/**
 * 聊天消息类型
 */
export interface ChatMessage {
  id: string
  sender: 'user' | 'bot'
  text: string
  time: string
  timestamp: number
}

/**
 * 聊天历史记录类型
 */
export interface ChatHistory {
  id: string
  title: string
  preview: string
  category: string
  time: string
  timestamp: number
  messages?: ChatMessage[]
}

/**
 * 聊天分类标签类型
 */
export interface ChatTab {
  id: string
  name: string
}

/**
 * 聊天响应类型
 */
export interface ChatResponse {
  messageId: string
  text: string
  chatContext: string
}

/**
 * 快速提问类型
 */
export interface QuickQuestion {
  id: string
  text: string
  category: string
} 