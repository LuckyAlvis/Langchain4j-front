import axios from 'axios'
import { apiBaseUrl } from '@/config'
import type { ChatMessage, ChatHistory, ChatTab } from '@/types/chat'

// 创建聊天服务实例
const chatService = {
  /**
   * 获取欢迎消息
   * @returns 欢迎消息响应
   */
  getWelcomeMessage: async () => {
    const response = await axios.get(`${apiBaseUrl}/chat/welcome`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    return response.data
  },

  /**
   * 发送聊天消息
   * @param message 用户消息内容
   * @param chatContext 聊天上下文ID
   * @returns AI响应消息
   */
  sendMessage: async (message: string, chatContext?: string) => {
    const response = await axios.post(
      `${apiBaseUrl}/chat/message`,
      {
        message,
        context: chatContext
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    return response.data
  },

  /**
   * 获取聊天历史列表
   * @returns 聊天历史列表
   */
  getChatHistory: async () => {
    const response = await axios.get(`${apiBaseUrl}/chat/history`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    return response.data
  },

  /**
   * 获取特定历史对话的消息记录
   * @param historyId 历史对话ID
   * @returns 消息列表
   */
  getChatMessages: async (historyId: string) => {
    const response = await axios.get(`${apiBaseUrl}/chat/history/${historyId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    return response.data
  },

  /**
   * 获取快速提问列表
   * @param category 问题分类
   * @returns 快速提问列表
   */
  getQuickQuestions: async (category?: string) => {
    const response = await axios.get(`${apiBaseUrl}/chat/quick-questions`, {
      params: { category },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    return response.data
  },

  /**
   * 获取可用的对话分类标签
   * @returns 对话分类标签列表
   */
  getChatTabs: async () => {
    const response = await axios.get(`${apiBaseUrl}/chat/tabs`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    return response.data
  },

  /**
   * 创建新的对话
   * @param category 对话分类
   * @returns 新创建的对话ID
   */
  createNewChat: async (category: string) => {
    const response = await axios.post(
      `${apiBaseUrl}/chat/new`,
      { category },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    )
    return response.data
  },

  /**
   * 删除历史对话
   * @param historyId 历史对话ID
   * @returns 操作结果
   */
  deleteHistory: async (historyId: string) => {
    const response = await axios.delete(`${apiBaseUrl}/chat/history/${historyId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    return response.data
  }
}

export { chatService } 