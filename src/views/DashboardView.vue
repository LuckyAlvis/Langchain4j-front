<template>
  <app-layout>
    <div class="dashboard">
      <!-- 顶部卡片 -->
      <div class="stats-cards">
        <div class="stat-card income">
          <div class="stat-header">
            <h3>本月收入</h3>
            <div class="icon-wrapper up">
              <i class="fas fa-arrow-up"></i>
            </div>
          </div>
          <div class="amount">
            <span class="currency">¥</span>
            <span class="value">12,500</span>
          </div>
          <div class="trend positive">+12.5%</div>
        </div>
        <div class="stat-card expense">
          <div class="stat-header">
            <h3>本月支出</h3>
            <div class="icon-wrapper down">
              <i class="fas fa-arrow-down"></i>
            </div>
          </div>
          <div class="amount">
            <span class="currency">¥</span>
            <span class="value">8,300</span>
          </div>
          <div class="trend negative">-5.2%</div>
        </div>
        <div class="stat-card balance">
          <div class="stat-header">
            <h3>当前余额</h3>
            <div class="icon-wrapper balance">
              <i class="fas fa-wallet"></i>
            </div>
          </div>
          <div class="amount">
            <span class="currency">¥</span>
            <span class="value">45,200</span>
          </div>
          <div class="trend positive">+8.3%</div>
        </div>
        <div class="stat-card target">
          <div class="stat-header">
            <h3>储蓄目标</h3>
            <div class="icon-wrapper target">
              <i class="fas fa-piggy-bank"></i>
            </div>
          </div>
          <div class="amount">
            <span class="value">75%</span>
          </div>
          <div class="trend">已完成</div>
        </div>
      </div>

      <!-- 图表区域 -->
      <div class="charts-container">
        <!-- 收支趋势图 -->
        <div class="chart-card">
          <h3>收支趋势</h3>
          <div ref="trendChart" style="height: 200px;"></div>
        </div>
        <!-- 支出分类图 -->
        <div class="chart-card">
          <h3>支出分类</h3>
          <div ref="categoryChart" style="height: 200px;"></div>
        </div>
      </div>

      <!-- 最近交易 -->
      <div class="recent-transactions">
        <h3>最近交易</h3>
        <table>
          <thead>
          <tr>
            <th>日期</th>
            <th>描述</th>
            <th>分类</th>
            <th>金额</th>
            <th>状态</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>2024-04-08</td>
            <td>工资收入</td>
            <td>收入</td>
            <td class="amount positive">+¥12,500</td>
            <td><span class="status completed">已完成</span></td>
          </tr>
          <tr>
            <td>2024-04-07</td>
            <td>超市购物</td>
            <td>日常支出</td>
            <td class="amount negative">-¥328.50</td>
            <td><span class="status completed">已完成</span></td>
          </tr>
          <tr>
            <td>2024-04-06</td>
            <td>房租支出</td>
            <td>住房</td>
            <td class="amount negative">-¥3,500</td>
            <td><span class="status pending">处理中</span></td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </app-layout>
</template>

<script>
import AppLayout from '@/components/layout/AppLayout.vue'
import * as echarts from 'echarts'

export default {
  name: 'DashboardView',
  components: {
    AppLayout
  },
  data() {
    return {
      recentTransactions: [
        {
          id: 1,
          date: '2024-04-08',
          description: '工资收入',
          amount: '12,500',
          type: 'income'
        },
        {
          id: 2,
          date: '2024-04-07',
          description: '超市购物',
          amount: '328.50',
          type: 'expense'
        },
        {
          id: 3,
          date: '2024-04-06',
          description: '房租支出',
          amount: '3,500',
          type: 'expense'
        }
      ]
    }
  },
  mounted() {
    this.initTrendChart()
    this.initCategoryChart()
  },
  methods: {
    initTrendChart() {
      const chart = echarts.init(this.$refs.trendChart)
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['收入', '支出', '结余']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['1月', '3月', '5月', '7月', '9月', '11月']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '收入',
            type: 'bar',
            stack: 'total',
            itemStyle: {
              color: '#67C23A'
            },
            data: [15000, 12000, 18000, 20000, 25000, 32000]
          },
          {
            name: '支出',
            type: 'bar',
            stack: 'total',
            itemStyle: {
              color: '#F56C6C'
            },
            data: [10000, 8000, 15000, 12000, 15000, 18000]
          },
          {
            name: '结余',
            type: 'line',
            itemStyle: {
              color: '#409EFF'
            },
            data: [5000, 4000, 3000, 8000, 10000, 14000]
          }
        ]
      }
      chart.setOption(option)

      // 响应式处理
      window.addEventListener('resize', () => {
        chart.resize()
      })
    },
    initCategoryChart() {
      const chart = echarts.init(this.$refs.categoryChart)
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'horizontal',
          bottom: 'bottom'
        },
        series: [
          {
            name: '支出分类',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '16',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              {value: 2500, name: '餐饮', itemStyle: {color: '#5470C6'}},
              {value: 1800, name: '交通', itemStyle: {color: '#91CC75'}},
              {value: 3500, name: '购物', itemStyle: {color: '#FAC858'}},
              {value: 1200, name: '娱乐', itemStyle: {color: '#EE6666'}},
              {value: 800, name: '医疗', itemStyle: {color: '#73C0DE'}},
              {value: 3800, name: '居住', itemStyle: {color: '#3BA272'}},
              {value: 1500, name: '教育', itemStyle: {color: '#FC8452'}},
              {value: 1000, name: '其他', itemStyle: {color: '#9A60B4'}}
            ]
          }
        ]
      }
      chart.setOption(option)

      // 响应式处理
      window.addEventListener('resize', () => {
        chart.resize()
      })
    }
  }
}
</script>

<style scoped>
.dashboard {
  padding: 18px;
  background: var(--background-light);
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 12px;
}

.stat-card {
  padding: 12px;
  border-radius: 6px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.stat-header h3 {
  margin: 0;
  color: var(--text-secondary);
  font-size: 13px;
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

.icon-wrapper.target {
  background-color: #E6A23C;
}

.amount {
  margin: 8px 0;
  font-size: 22px;
  font-weight: 500;
  color: #333;
}

.trend {
  font-size: 11px;
  margin-top: 6px;
}

.trend.positive {
  color: var(--success-color);
}

.trend.negative {
  color: var(--error-color);
}

.charts-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 18px;
  margin-bottom: 18px;
}

.chart-card {
  background: white;
  padding: 18px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.chart-card h3 {
  margin: 0 0 18px 0;
  color: var(--text-primary);
}

.recent-transactions {
  background: white;
  padding: 18px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.recent-transactions h3 {
  margin: 0 0 18px 0;
  color: var(--text-primary);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

th {
  font-weight: 600;
  color: var(--text-secondary);
}

.amount.positive {
  color: var(--success-color);
}

.amount.negative {
  color: var(--error-color);
}

.status {
  display: inline-block;
  padding: 3px 6px;
  border-radius: 3px;
  font-size: 11px;
}

.status.completed {
  background: #e8f5e9;
  color: var(--success-color);
}

.status.pending {
  background: #fff3e0;
  color: var(--warning-color);
}

@media (max-width: 1200px) {
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .stats-cards {
    grid-template-columns: 1fr;
  }

  .charts-container {
    grid-template-columns: 1fr;
  }
}
</style> 