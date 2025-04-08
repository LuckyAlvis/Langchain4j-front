import axios from 'axios'
import router from '@/router'

const http = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 5000
})

http.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

http.interceptors.response.use(
    response => response.data,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            router.push('/login')
        }
        return Promise.reject(error)
    }
)

export default http 