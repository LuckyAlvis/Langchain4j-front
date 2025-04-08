// API 通用响应格式
export interface ApiResponse<T> {
    code: number
    message: string
    data: T
}

// 登录相关接口
export interface LoginRequest {
    username: string
    password: string
}

export interface LoginResponse {
    token: string
    username: string
} 