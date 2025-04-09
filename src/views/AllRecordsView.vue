<template>
  <app-layout>
    <div class="records-page">
      <div class="page-header">
        <h2>所有记账记录</h2>
        <div class="filter-actions">
          <div class="filter-group">
            <select v-model="filterType" class="filter-select">
              <option value="">所有类型</option>
              <option v-for="type in expenseTypes" :key="type.value" :value="type.value">
                {{ type.label }}
              </option>
            </select>
            <select v-model="filterMonth" class="filter-select">
              <option value="">所有月份</option>
              <option v-for="month in 12" :key="month" :value="month">
                {{ month }}月
              </option>
            </select>
            <div class="date-range">
              <input type="date" v-model="startDate" class="date-input">
              <span>至</span>
              <input type="date" v-model="endDate" class="date-input">
            </div>
          </div>
          <button class="btn-primary" @click="searchRecords">
            <i class="fas fa-search"></i> 查询
          </button>
        </div>
      </div>
      
      <div class="records-stats">
        <div class="stat-card income">
          <div class="stat-header">
            <h3>总收入</h3>
            <div class="icon-wrapper up">
              <i class="fas fa-arrow-up"></i>
            </div>
          </div>
          <div class="amount">
            <span class="currency">¥</span>
            <span class="value">{{ totalIncome.toLocaleString() }}</span>
          </div>
        </div>
        <div class="stat-card expense">
          <div class="stat-header">
            <h3>总支出</h3>
            <div class="icon-wrapper down">
              <i class="fas fa-arrow-down"></i>
            </div>
          </div>
          <div class="amount">
            <span class="currency">¥</span>
            <span class="value">{{ totalExpense.toLocaleString() }}</span>
          </div>
        </div>
        <div class="stat-card balance">
          <div class="stat-header">
            <h3>净收支</h3>
            <div class="icon-wrapper balance">
              <i class="fas fa-wallet"></i>
            </div>
          </div>
          <div class="amount">
            <span class="currency">¥</span>
            <span class="value">{{ netBalance.toLocaleString() }}</span>
          </div>
        </div>
      </div>
      
      <div class="records-table-container">
        <table class="records-table">
          <thead>
            <tr>
              <th>日期</th>
              <th>星期</th>
              <th>描述</th>
              <th>类型</th>
              <th>金额</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in filteredRecords" :key="record.id" :class="{ 'income-row': record.amount > 0 }">
              <td>{{ record.recordDate }}</td>
              <td>{{ record.weekday }}</td>
              <td>{{ record.expenseDetail }}</td>
              <td>
                <span class="type-badge" :class="record.expenseType">
                  {{ record.expenseTypeName }}
                </span>
              </td>
              <td :class="record.amount > 0 ? 'amount positive' : 'amount negative'">
                {{ record.amount > 0 ? '+' : '' }}¥{{ Math.abs(record.amount).toLocaleString() }}
              </td>
              <td>
                <div class="action-buttons">
                  <button class="btn-icon" @click="editRecord(record)">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn-icon delete" @click="confirmDelete(record)">
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div v-if="loading" class="loading-spinner">
          <i class="fas fa-spinner fa-spin"></i> 加载中...
        </div>
        
        <div v-if="!loading && filteredRecords.length === 0" class="no-records">
          <i class="fas fa-info-circle"></i> 没有找到记录
        </div>
        
        <!-- 分页控件 -->
        <div class="pagination" v-if="total > 0">
          <button 
            class="page-btn" 
            :disabled="currentPage === 1"
            @click="handlePageChange(currentPage - 1)"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          
          <span class="page-info">
            第 {{ currentPage }} 页，共 {{ Math.ceil(total / pageSize) }} 页
          </span>
          
          <button 
            class="page-btn" 
            :disabled="currentPage >= Math.ceil(total / pageSize)"
            @click="handlePageChange(currentPage + 1)"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  </app-layout>
</template>

<script>
import AppLayout from '@/components/layout/AppLayout.vue'
import axios from 'axios'

export default {
  name: 'AllRecordsView',
  components: {
    AppLayout
  },
  data() {
    return {
      records: [],
      loading: true,
      filterType: '',
      filterMonth: '',
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: '',
      expenseTypes: [
        { value: 'meal', label: '工作餐' },
        { value: 'transport', label: '交通' },
        { value: 'shopping', label: '购物' },
        { value: 'social', label: '社交' },
        { value: 'entertainment', label: '娱乐' },
        { value: 'medical', label: '医疗' },
        { value: 'housing', label: '居住' },
        { value: 'education', label: '教育' },
        { value: 'communication', label: '通信' },
        { value: 'other', label: '其他' }
      ],
      showDeleteConfirm: false,
      recordToDelete: null,
      // 分页参数
      currentPage: 1,
      pageSize: 10,
      total: 0
    }
  },
  computed: {
    filteredRecords() {
      return this.records
    },
    totalIncome() {
      return this.filteredRecords
        .filter(record => record.amount > 0)
        .reduce((sum, record) => sum + record.amount, 0)
    },
    totalExpense() {
      return Math.abs(this.filteredRecords
        .filter(record => record.amount < 0)
        .reduce((sum, record) => sum + record.amount, 0))
    },
    netBalance() {
      return this.totalIncome - this.totalExpense
    }
  },
  mounted() {
    this.fetchRecords()
  },
  methods: {
    fetchRecords() {
      this.loading = true;
      
      // 构建查询参数
      const queryDTO = {
        page: this.currentPage - 1, 
        size: this.pageSize,
        expenseType: this.filterType,
        minAmount: this.minAmount ? parseFloat(this.minAmount) : 0,
        maxAmount: this.maxAmount ? parseFloat(this.maxAmount) : 0,
        startDate: this.startDate,
        endDate: this.endDate,
        month: this.filterMonth ? parseInt(this.filterMonth) : 0
      };
      
      // 不要使用 { queryDTO: JSON.stringify(queryDTO) }，直接传递参数对象
      axios.get('/api/expenses/all', {
        //params: queryDTO
      })
      .then(response => {
        if (response.data.code === 200) {
          this.records = response.data.data || [];
          this.total = this.records.length;
        } else {
          console.error('获取记录失败:', response.data.message);
          this.$message.error(`获取记录失败: ${response.data.message}`);
        }
      })
      .catch(error => {
        console.error('API调用出错:', error);
        this.$message.error('获取记录数据出错，请稍后再试');
      })
      .finally(() => {
        this.loading = false;
      });
    },
    searchRecords() {
      this.currentPage = 1; // 重置页码
      this.fetchRecords();
    },
    handlePageChange(page) {
      this.currentPage = page;
      this.fetchRecords();
    },
    editRecord(record) {
      // 编辑记录逻辑
      this.$router.push(`/transactions/edit/${record.id}`);
    },
    confirmDelete(record) {
      this.recordToDelete = record;
      if (confirm(`确定要删除"${record.expenseDetail}"这条记录吗？`)) {
        this.deleteRecord();
      }
    },
    deleteRecord() {
      if (!this.recordToDelete) return;
      
      axios.delete(`/api/expenses/${this.recordToDelete.id}`)
        .then(response => {
          if (response.data.code === 200) {
            this.$message.success('删除成功');
            this.fetchRecords(); // 重新加载数据
          } else {
            this.$message.error(`删除失败: ${response.data.message}`);
          }
        })
        .catch(error => {
          console.error('删除记录出错:', error);
          this.$message.error('删除记录出错，请稍后再试');
        })
        .finally(() => {
          this.recordToDelete = null;
        });
    }
  }
}
</script>

<style scoped>
.records-page {
  padding: 15px;
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  overflow-y: auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.page-header h2 {
  margin: 0;
  color: #333;
}

.filter-actions {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
  color: #666;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-input {
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
  color: #666;
}

.btn-primary {
  background: #1890ff;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background-color 0.3s;
}

.btn-primary:hover {
  background: #40a9ff;
}

.records-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

.stat-card {
  padding: 15px;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.stat-header h3 {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.icon-wrapper {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-wrapper i {
  font-size: 16px;
  color: white;
}

.icon-wrapper.up {
  background-color: #67C23A;
}

.icon-wrapper.down {
  background-color: #F56C6C;
}

.icon-wrapper.balance {
  background-color: #409EFF;
}

.amount {
  margin: 10px 0;
  font-size: 24px;
  font-weight: 500;
  color: #333;
}

.records-table-container {
  background: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow-x: auto;
}

.records-table {
  width: 100%;
  border-collapse: collapse;
}

.records-table th {
  padding: 12px 15px;
  text-align: left;
  border-bottom: 2px solid #eee;
  color: #666;
  font-weight: 600;
}

.records-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
}

.records-table tr:last-child td {
  border-bottom: none;
}

.records-table tr:hover {
  background-color: #f9f9f9;
}

.income-row {
  background-color: #f7fbff;
}

.type-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  background-color: #f0f0f0;
  color: #666;
}

.type-badge.food {
  background-color: #e6f7ff;
  color: #1890ff;
}

.type-badge.transport {
  background-color: #e8f5e9;
  color: #52c41a;
}

.type-badge.shopping {
  background-color: #fff7e6;
  color: #fa8c16;
}

.type-badge.entertainment {
  background-color: #fff0f6;
  color: #eb2f96;
}

.type-badge.medical {
  background-color: #e6fffb;
  color: #13c2c2;
}

.type-badge.housing {
  background-color: #f9f0ff;
  color: #722ed1;
}

.type-badge.education {
  background-color: #fcffe6;
  color: #a0d911;
}

.amount {
  font-weight: 500;
}

.amount.positive {
  color: #67C23A;
}

.amount.negative {
  color: #F56C6C;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.btn-icon {
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 4px;
  background-color: #f5f5f5;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-icon:hover {
  background-color: #e9e9e9;
  color: #333;
}

.btn-icon.delete:hover {
  background-color: #fff1f0;
  color: #f56c6c;
}

.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  color: #666;
  font-size: 14px;
}

.no-records {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 30px;
  color: #999;
  font-size: 14px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  gap: 10px;
}

.page-btn {
  width: 36px;
  height: 36px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.page-btn:hover:not(:disabled) {
  border-color: #1890ff;
  color: #1890ff;
}

.page-btn:disabled {
  color: #d9d9d9;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: #666;
}

@media (max-width: 992px) {
  .records-stats {
    grid-template-columns: 1fr 1fr;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .filter-actions {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .records-stats {
    grid-template-columns: 1fr;
  }
  
  .filter-group {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
  }
  
  .filter-select, .date-input {
    width: 100%;
  }
  
  .date-range {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .btn-primary {
    width: 100%;
    justify-content: center;
  }
}
</style> 