<template>
  <app-layout>
    <div class="chat-page">
      <div class="chat-header">
        <h1>AI财务助手</h1>
        <div class="header-actions">
          <button class="action-btn" @click="toggleHistoryPanel">
            <i class="fas fa-history"></i>
          </button>
          <button class="action-btn">
            <i class="fas fa-ellipsis-v"></i>
          </button>
        </div>
      </div>

      <!-- 对话标签栏 -->
      <div class="tab-bar">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="['tab-btn', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          {{ tab.name }}
        </button>
      </div>

      <!-- 聊天消息区域 -->
      <div class="messages-container" ref="messagesContainer">
        <div v-if="messages.length > 0" class="time-divider">{{ currentTimeString }}</div>
        <p v-if="messages.length === 0" class="empty-state">
          正在连接AI助手...
        </p>
        
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="['message', message.sender === 'bot' ? 'bot-message' : 'user-message']"
        >
          <div class="message-avatar">
            <i :class="message.sender === 'bot' ? 'fas fa-robot' : 'fas fa-user'"></i>
          </div>
          <div class="message-content">
            <div class="message-text" v-html="formatMessageText(message.text)"></div>
            <div class="message-time">{{ message.time }}</div>
          </div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="input-area">
        <div class="input-container">
          <input
            type="text"
            v-model="userInput"
            placeholder="输入消息..."
            @keyup.enter="sendMessage"
            class="message-input"
          />
          <button class="send-btn" @click="sendMessage">
            <i class="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>

      <!-- 快速提问区域 -->
      <div class="quick-questions">
        <h3>快速提问</h3>
        <div class="questions-grid">
          <button
            v-for="(question, index) in quickQuestions"
            :key="index"
            class="question-btn"
            @click="useQuickQuestion(question)"
          >
            {{ question }}
          </button>
        </div>
      </div>
    </div>

    <!-- 历史对话面板 -->
    <div class="history-panel" :class="{ 'panel-open': showHistoryPanel }">
      <div class="panel-header">
        <h2>历史对话</h2>
        <button class="close-btn" @click="toggleHistoryPanel">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="history-list">
        <div
          v-for="(conversation, index) in conversationHistory"
          :key="index"
          class="history-item"
          @click="loadConversation(conversation)"
        >
          <div class="history-content">
            <div class="history-title">{{ conversation.title }}</div>
            <div class="history-preview">{{ conversation.preview }}</div>
          </div>
          <div class="history-time">{{ conversation.time }}</div>
        </div>
      </div>
    </div>
    
    <!-- 遮罩层 -->
    <div
      v-if="showHistoryPanel"
      class="overlay"
      @click="toggleHistoryPanel"
    ></div>
  </app-layout>
</template>

<script>
import AppLayout from '@/components/layout/AppLayout.vue'
import { ref, onMounted, nextTick, computed } from 'vue'

export default {
  name: 'ChatView',
  components: {
    AppLayout
  },
  setup() {
    const userInput = ref('')
    const messages = ref([])
    const messagesContainer = ref(null)
    const showHistoryPanel = ref(false)
    const activeTab = ref('analysis')
    
    // 模拟加载中的状态
    const isLoading = ref(false)

    // 获取当前时间字符串
    const currentTimeString = computed(() => {
      return '今天 ' + new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    })

    // 对话标签
    const tabs = [
      { id: 'analysis', name: '财务分析' },
      { id: 'budget', name: '预算规划' },
      { id: 'investment', name: '投资建议' },
      { id: 'debt', name: '债务管理' },
      { id: 'savings', name: '储蓄技巧' },
      { id: 'tax', name: '税务咨询' }
    ]

    // 快速提问列表
    const quickQuestions = [
      '如何制定月度预算？',
      '我应该如何开始投资？',
      '我的储蓄率合理吗？',
      '如何快速还清信用卡债务？'
    ]

    // 初始化欢迎消息
    onMounted(() => {
      console.log('ChatView mounted');
      setTimeout(() => {
        // 添加欢迎消息
        messages.value.push({
          text: '您好！我是您的AI财务助手。有任何财务问题，都可以随时向我咨询。您可以尝试以下问题，或直接输入您的问题：\n\n• 如何合理规划我的月度预算？\n• 我的收入应该如何分配？\n• 推荐一些适合新手的理财方式\n• 如何评估我的财务健康状况？',
          sender: 'bot',
          time: formatTime(new Date())
        });
        
        // 确保消息容器滚动到底部
        nextTick(() => {
          scrollToBottom();
          console.log('Messages:', messages.value);
          console.log('Messages container exists:', !!messagesContainer.value);
        });
      }, 500);
    });

    // 格式化时间显示
    const formatTime = (date) => {
      return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    }

    // 模拟历史对话
    const conversationHistory = [
      {
        id: 1,
        title: '财务分析',
        preview: '本月支出分析和节省建议',
        time: '今天',
        messages: []
      },
      {
        id: 2,
        title: '投资规划',
        preview: '基金定投与股票投资策略咨询',
        time: '昨天',
        messages: []
      },
      {
        id: 3,
        title: '税务优化',
        preview: '个人所得税专项附加扣除申报指导',
        time: '3天前',
        messages: []
      },
      {
        id: 4,
        title: '房贷咨询',
        preview: '房贷提前还款与利率调整分析',
        time: '上周',
        messages: []
      },
      {
        id: 5,
        title: '理财产品对比',
        preview: '银行理财与货币基金收益率比较',
        time: '上周',
        messages: []
      }
    ]

    // 格式化消息文本，支持基本的换行和表情符号
    const formatMessageText = (text) => {
      // 将换行符转换为<br>标签
      let formattedText = text.replace(/\n/g, '<br>')
      
      // 支持emoji表情显示
      formattedText = formattedText
        .replace(/🏠/g, '<span class="emoji">🏠</span>')
        .replace(/🍽️/g, '<span class="emoji">🍽️</span>')
        .replace(/🚗/g, '<span class="emoji">🚗</span>')
        .replace(/🛒/g, '<span class="emoji">🛒</span>')
        .replace(/🎭/g, '<span class="emoji">🎭</span>')
        .replace(/1️⃣/g, '<span class="emoji">1️⃣</span>')
        .replace(/2️⃣/g, '<span class="emoji">2️⃣</span>')
        .replace(/3️⃣/g, '<span class="emoji">3️⃣</span>')
        .replace(/4️⃣/g, '<span class="emoji">4️⃣</span>')
        .replace(/5️⃣/g, '<span class="emoji">5️⃣</span>')
      
      return formattedText
    }

    // 发送消息
    const sendMessage = () => {
      if (!userInput.value.trim() || isLoading.value) return
      
      // 添加用户消息
      messages.value.push({
        text: userInput.value,
        sender: 'user',
        time: formatTime(new Date())
      })
      
      // 清空输入
      const question = userInput.value
      userInput.value = ''
      
      // 显示加载状态
      isLoading.value = true
      
      // 滚动到底部
      scrollToBottom()
      
      // 模拟AI回复
      setTimeout(() => {
        isLoading.value = false
        
        // 使用自定义生成回复函数
        const response = generateResponse(question)
        
        // 添加AI回复
        messages.value.push({
          text: response,
          sender: 'bot',
          time: formatTime(new Date())
        })
        
        // 滚动到底部
        scrollToBottom()
      }, 1000)
    }

    // 滚动到底部
    const scrollToBottom = () => {
      nextTick(() => {
        if (messagesContainer.value) {
          messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
        }
      })
    }

    // 使用快速提问
    const useQuickQuestion = (question) => {
      userInput.value = question
      sendMessage()
    }

    // 切换历史面板显示状态
    const toggleHistoryPanel = () => {
      showHistoryPanel.value = !showHistoryPanel.value
    }

    // 加载历史对话
    const loadConversation = (conversation) => {
      // 实际应用中应该从API获取对话内容
      // 这里简化处理，切换标签并关闭面板
      activeTab.value = 'analysis'
      showHistoryPanel.value = false
    }

    // 生成回复（示例）
    const generateResponse = (question) => {
      // 关键词映射表
      const keywordResponses = {
        '预算': '制定月度预算可以从追踪一个月的收支开始，遵循50/30/20法则：\n\n• 50%用于必需品（房租、食物、交通）\n• 30%用于个人需求（娱乐、购物）\n• 20%用于储蓄和投资\n\n我建议您使用我们的预算规划功能，它可以根据您的收入自动生成预算方案。',
        '投资': '作为初学者，请考虑以下几点：\n\n1. 先建立应急基金（3-6个月生活费）\n2. 了解自己的风险承受能力\n3. 分散投资（股票、债券、基金）\n4. 考虑定投基金作为入门方式\n5. 长期投资，避免频繁交易\n\n我们的应用有更详细的投资指南，您可以在"投资建议"选项卡查看。',
        '储蓄': '合理的储蓄率在收入的20-30%左右。如果您目前储蓄率低于10%，建议逐步提高；如果高于30%，请确保生活质量没有过度降低。\n\n提高储蓄的技巧：\n• 自动转账\n• 制定明确目标\n• 减少不必要开支\n• 增加额外收入来源',
        '债务': '清理信用卡债务的建议：\n\n1. 停止使用信用卡\n2. 列出所有债务（金额、利率）\n3. 选择策略：雪球法（先还小额）或雪崩法（先还高利率）\n4. 考虑转移至低息卡\n5. 增加还款金额\n\n如果债务超过收入的50%，建议考虑专业的债务咨询服务。',
        '房贷': '关于房贷，您需要考虑：\n\n1. 提前还款：如果有闲钱且房贷利率高于其他投资回报率\n2. 贷款期限：较短期限总利息低，但月供高\n3. 固定vs浮动利率：取决于您对利率变动的预期\n4. 再融资：当市场利率显著低于您当前利率时\n\n我可以帮您计算不同方案的具体数字。',
        '税务': '个人所得税优化建议：\n\n1. 充分利用专项附加扣除（子女教育、继续教育、大病医疗等）\n2. 合理规划年终奖发放\n3. 利用税收优惠政策（如个人养老金、商业健康保险扣除等）\n\n这些方法都是合法的税务规划，可以帮您合理节税。',
        '理财': '适合新手的理财方式：\n\n1. 货币基金：低风险，灵活性高\n2. 定期存款：稳定收益，风险极低\n3. 指数基金：长期表现稳定，费用低\n4. 国债：安全性高\n5. 余额宝等互联网理财产品\n\n建议从低风险产品开始，逐步了解不同产品特性。',
        '财务健康': '评估财务健康的关键指标：\n\n1. 应急基金是否足够（3-6个月开支）\n2. 债务收入比是否低于36%\n3. 储蓄率是否达到20%以上\n4. 投资多元化程度\n5. 是否有足够保险保障\n\n使用我们的"财务健康看板"功能可以自动计算这些指标并提供改进建议。'
      };
      
      // 检查问题中是否包含关键词
      for (const [keyword, response] of Object.entries(keywordResponses)) {
        if (question.toLowerCase().includes(keyword.toLowerCase())) {
          return response;
        }
      }
      
      // 默认回复
      return '谢谢您的问题。作为您的财务助手，我可以帮您分析财务状况、制定预算计划、提供投资建议和理财知识。请尝试询问有关预算规划、投资策略、债务管理或储蓄技巧的具体问题，我会给您更有针对性的回答。';
    }

    return {
      userInput,
      messages,
      messagesContainer,
      showHistoryPanel,
      activeTab,
      tabs,
      quickQuestions,
      conversationHistory,
      currentTimeString,
      formatMessageText,
      sendMessage,
      useQuickQuestion,
      toggleHistoryPanel,
      loadConversation
    }
  }
}
</script>

<style scoped>
.chat-page {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  position: relative;
  overflow: hidden;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: white;
  border-bottom: 1px solid #eee;
  flex-shrink: 0;
}

.chat-header h1 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  background: none;
  border: none;
  color: #666;
  font-size: 16px;
  cursor: pointer;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.action-btn:hover {
  background-color: #f5f5f5;
}

.tab-bar {
  display: flex;
  overflow-x: auto;
  padding: 8px 12px;
  background-color: white;
  border-bottom: 1px solid #eee;
  gap: 8px;
  flex-shrink: 0;
}

.tab-bar::-webkit-scrollbar {
  display: none;
}

.tab-btn {
  white-space: nowrap;
  padding: 6px 14px;
  background-color: #f0f2f5;
  border: none;
  border-radius: 16px;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn.active {
  background-color: #1976d2;
  color: white;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 0; /* Important for Firefox flex container */
}

.empty-state {
  text-align: center;
  color: #999;
  margin: 32px 0;
}

.time-divider {
  align-self: center;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: 12px;
  padding: 4px 10px;
  font-size: 12px;
  color: #666;
  margin: 8px 0;
}

.message {
  display: flex;
  max-width: 80%;
}

.user-message {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.bot-message {
  align-self: flex-start;
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  background-color: #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bot-message .message-avatar {
  background-color: #1976d2;
  color: white;
}

.user-message .message-avatar {
  background-color: #4caf50;
  color: white;
}

.message-avatar i {
  font-size: 18px;
}

.message-content {
  margin: 0 10px;
  position: relative;
}

.message-text {
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.5;
}

.user-message .message-text {
  background-color: #1976d2;
  color: white;
  border-bottom-right-radius: 4px;
}

.bot-message .message-text {
  background-color: white;
  color: #333;
  border-bottom-left-radius: 4px;
}

.message-time {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
  text-align: right;
}

.user-message .message-time {
  color: #999;
}

.emoji {
  font-size: 16px;
  vertical-align: middle;
  display: inline-block;
}

.input-area {
  padding: 16px;
  background-color: white;
  border-top: 1px solid #eee;
  flex-shrink: 0;
}

.input-container {
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: #f0f2f5;
  border-radius: 22px;
  padding: 6px 16px;
}

.message-input {
  flex: 1;
  border: none;
  background: none;
  padding: 10px 0;
  font-size: 15px;
  color: #333;
  outline: none;
}

.send-btn {
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.send-btn:hover {
  background-color: #1565c0;
}

.quick-questions {
  padding: 16px;
  background-color: white;
  border-top: 1px solid #eee;
  flex-shrink: 0;
}

.quick-questions h3 {
  margin: 0 0 12px 0;
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.questions-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.question-btn {
  background-color: #f0f2f5;
  border: none;
  border-radius: 16px;
  padding: 8px 14px;
  font-size: 13px;
  color: #333;
  cursor: pointer;
  transition: background-color 0.2s;
}

.question-btn:hover {
  background-color: #e0e0e0;
}

.history-panel {
  position: fixed;
  top: 0;
  left: -320px;
  width: 320px;
  height: 100vh;
  background-color: white;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  transition: left 0.3s ease;
  display: flex;
  flex-direction: column;
}

.history-panel.panel-open {
  left: 0;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid #eee;
}

.panel-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  color: #666;
  cursor: pointer;
}

.history-list {
  flex: 1;
  overflow-y: auto;
}

.history-item {
  display: flex;
  justify-content: space-between;
  padding: 16px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background-color 0.2s;
}

.history-item:hover {
  background-color: #f5f5f5;
}

.history-content {
  max-width: 80%;
}

.history-title {
  font-weight: 500;
  margin-bottom: 4px;
}

.history-preview {
  font-size: 13px;
  color: #666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.history-time {
  font-size: 12px;
  color: #999;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 999;
}

@media (max-width: 768px) {
  .messages-container {
    padding: 10px;
  }
  
  .message {
    max-width: 90%;
  }
  
  .history-panel {
    width: 280px;
  }
}
</style> 