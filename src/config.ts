// API基础URL
export const apiBaseUrl = process.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

// 默认请求超时时间（毫秒）
export const requestTimeout = 15000

// 生产环境标志
export const isProduction = process.env.NODE_ENV === 'production' 