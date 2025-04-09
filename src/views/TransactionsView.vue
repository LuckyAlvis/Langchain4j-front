<template>
  <app-layout>
    <!-- 操作栏 -->
    <div class="action-bar">
      <div class="left-actions">
        <button class="btn-primary" @click="showAddTransactionModal">
          <i class="fas fa-plus"></i> 新增交易
        </button>
        <button class="btn-secondary">
          <i class="fas fa-file-import"></i> 导入
        </button>
        <button class="btn-secondary">
          <i class="fas fa-file-export"></i> 导出
        </button>
      </div>
      <div class="right-actions">
        <div class="date-filter">
          <button
              v-for="period in datePeriods"
              :key="period.value"
              :class="['btn-secondary', { active: selectedPeriod === period.value }]"
              @click="selectedPeriod = period.value"
          >
            {{ period.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- 筛选器 -->
    <div class="filters">
      <div class="filter-group">
        <label>类型</label>
        <select v-model="filters.type">
          <option value="all">全部</option>
          <option value="income">收入</option>
          <option value="expense">支出</option>
        </select>
      </div>
      <div class="filter-group">
        <label>分类</label>
        <select v-model="filters.category">
          <option value="all">全部分类</option>
          <option v-for="category in categories" :key="category.value" :value="category.value">
            {{ category.label }}
          </option>
        </select>
      </div>
      <div class="filter-group">
        <label>金额范围</label>
        <div class="range-inputs">
          <input type="number" v-model="filters.minAmount" placeholder="最小">
          <span>-</span>
          <input type="number" v-model="filters.maxAmount" placeholder="最大">
        </div>
      </div>
    </div>

    <!-- 交易列表 -->
    <div class="transactions-list">
      <table>
        <thead>
        <tr>
          <th>日期</th>
          <th>描述</th>
          <th>分类</th>
          <th>金额</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="transaction in filteredTransactions" :key="transaction.id">
          <td>{{ transaction.date }}</td>
          <td>{{ transaction.description }}</td>
          <td>{{ transaction.category }}</td>
          <td :class="['amount', transaction.type]">
            {{ transaction.type === 'income' ? '+' : '-' }}¥{{ transaction.amount }}
          </td>
          <td>
            <span :class="['status', transaction.status]">{{ getStatusText(transaction.status) }}</span>
          </td>
          <td>
            <div class="actions">
              <button class="btn-icon" @click="editTransaction(transaction)">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn-icon" @click="deleteTransaction(transaction)">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页 -->
    <div class="pagination">
      <button class="btn-secondary" @click="prevPage" :disabled="currentPage === 1">
        <i class="fas fa-chevron-left"></i>
      </button>
      <button
          v-for="page in displayedPages"
          :key="page"
          :class="['btn-secondary', { active: currentPage === page }]"
          @click="currentPage = page"
      >
        {{ page }}
      </button>
      <span v-if="totalPages > maxDisplayPages">...</span>
      <button
          class="btn-secondary"
          v-if="totalPages > maxDisplayPages"
          @click="currentPage = totalPages"
      >
        {{ totalPages }}
      </button>
      <button class="btn-secondary" @click="nextPage" :disabled="currentPage === totalPages">
        <i class="fas fa-chevron-right"></i>
      </button>
    </div>

    <!-- 新增/编辑交易弹窗 -->
    <modal v-model="showModal" :title="modalTitle">
      <template #default>
        <form @submit.prevent="submitTransaction" class="transaction-form">
          <div class="form-group">
            <label>交易类型</label>
            <div class="radio-group">
              <label>
                <input type="radio" v-model="transactionForm.type" value="income">
                收入
              </label>
              <label>
                <input type="radio" v-model="transactionForm.type" value="expense">
                支出
              </label>
            </div>
          </div>
          <div class="form-group">
            <label>金额</label>
            <input type="number" v-model="transactionForm.amount" required>
          </div>
          <div class="form-group">
            <label>分类</label>
            <select v-model="transactionForm.category" required>
              <option v-for="category in filteredCategories" :key="category.value" :value="category.value">
                {{ category.label }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>日期</label>
            <input type="date" v-model="transactionForm.date" required>
          </div>
          <div class="form-group">
            <label>描述</label>
            <textarea v-model="transactionForm.description" rows="3"></textarea>
          </div>
        </form>
      </template>
      <template #footer>
        <button class="btn-secondary" @click="showModal = false">取消</button>
        <button class="btn-primary" @click="submitTransaction">保存</button>
      </template>
    </modal>
  </app-layout>
</template>

<script>
import AppLayout from '@/components/layout/AppLayout.vue'
import Modal from '@/components/common/Modal.vue'

export default {
  name: 'TransactionsView',
  components: {
    AppLayout,
    Modal
  },
  data() {
    return {
      showModal: false,
      selectedPeriod: 'week',
      currentPage: 1,
      maxDisplayPages: 5,
      filters: {
        type: 'all',
        category: 'all',
        minAmount: '',
        maxAmount: ''
      },
      transactionForm: {
        type: 'expense',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        description: ''
      },
      editingTransaction: null,
      transactions: [
        {
          id: 1,
          date: '2024-04-08',
          description: '工资收入',
          category: 'salary',
          amount: '12500',
          type: 'income',
          status: 'completed'
        },
        {
          id: 2,
          date: '2024-04-07',
          description: '超市购物',
          category: 'shopping',
          amount: '328.50',
          type: 'expense',
          status: 'completed'
        },
        {
          id: 3,
          date: '2024-04-06',
          description: '房租支出',
          category: 'housing',
          amount: '3500',
          type: 'expense',
          status: 'pending'
        }
      ]
    }
  },
  computed: {
    datePeriods() {
      return [
        {value: 'week', label: '本周'},
        {value: 'month', label: '本月'},
        {value: 'year', label: '本年'},
        {value: 'custom', label: '自定义'}
      ]
    },
    categories() {
      return [
        {value: 'salary', label: '工资'},
        {value: 'bonus', label: '奖金'},
        {value: 'food', label: '餐饮'},
        {value: 'transport', label: '交通'},
        {value: 'shopping', label: '购物'},
        {value: 'housing', label: '住房'},
        {value: 'entertainment', label: '娱乐'},
        {value: 'medical', label: '医疗'}
      ]
    },
    filteredCategories() {
      return this.categories.filter(category => {
        if (this.transactionForm.type === 'income') {
          return ['salary', 'bonus'].includes(category.value)
        }
        return !['salary', 'bonus'].includes(category.value)
      })
    },
    filteredTransactions() {
      return this.transactions.filter(transaction => {
        if (this.filters.type !== 'all' && transaction.type !== this.filters.type) return false
        if (this.filters.category !== 'all' && transaction.category !== this.filters.category) return false
        if (this.filters.minAmount && transaction.amount < this.filters.minAmount) return false
        if (this.filters.maxAmount && transaction.amount > this.filters.maxAmount) return false
        return true
      })
    },
    totalPages() {
      return Math.ceil(this.filteredTransactions.length / 10)
    },
    displayedPages() {
      const pages = []
      const start = Math.max(1, this.currentPage - Math.floor(this.maxDisplayPages / 2))
      const end = Math.min(this.totalPages, start + this.maxDisplayPages - 1)
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      return pages
    },
    modalTitle() {
      return this.editingTransaction ? '编辑交易' : '新增交易'
    }
  },
  methods: {
    showAddTransactionModal() {
      this.editingTransaction = null
      this.transactionForm = {
        type: 'expense',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        description: ''
      }
      this.showModal = true
    },
    editTransaction(transaction) {
      this.editingTransaction = transaction
      this.transactionForm = {...transaction}
      this.showModal = true
    },
    deleteTransaction(transaction) {
      if (confirm('确定要删除这条交易记录吗？')) {
        this.transactions = this.transactions.filter(t => t.id !== transaction.id)
      }
    },
    submitTransaction() {
      const transaction = {
        ...this.transactionForm,
        id: this.editingTransaction ? this.editingTransaction.id : Date.now(),
        status: 'completed'
      }

      if (this.editingTransaction) {
        const index = this.transactions.findIndex(t => t.id === transaction.id)
        this.transactions.splice(index, 1, transaction)
      } else {
        this.transactions.unshift(transaction)
      }

      this.showModal = false
    },
    getStatusText(status) {
      return {
        completed: '已完成',
        pending: '处理中'
      }[status]
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
      }
    }
  }
}
</script>

<style scoped>
/* 添加整体容器样式 */
:deep(.content) {
  height: 100%;
  width: 100%;
  overflow: auto;
}

.action-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  padding: 15px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.left-actions, .right-actions {
  display: flex;
  gap: 12px;
}

.filters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
  padding: 16px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-group label {
  font-size: 14px;
  color: #666;
}

.filter-group select,
.filter-group input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.range-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
}

.range-inputs input {
  width: 100%;
}

.transactions-list {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  font-weight: 600;
  color: #666;
  background: #f9f9f9;
}

.amount {
  font-family: monospace;
  font-weight: 600;
}

.amount.income {
  color: #00c853;
}

.amount.expense {
  color: #ff1744;
}

.status {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.status.completed {
  background: #e8f5e9;
  color: #00c853;
}

.status.pending {
  background: #fff3e0;
  color: #ff9100;
}

.actions {
  display: flex;
  gap: 8px;
}

.btn-icon {
  padding: 6px;
  border: none;
  background: none;
  color: #666;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: #f5f5f5;
  color: #333;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  padding: 16px;
}

.transaction-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  color: #666;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.radio-group {
  display: flex;
  gap: 16px;
}

.radio-group label {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.btn-primary {
  background: #1976d2;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #1565c0;
}

.btn-secondary {
  background: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

.btn-secondary.active {
  background: #e3f2fd;
  border-color: #1976d2;
  color: #1976d2;
}

.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style> 