import axios from 'axios'

export const apiClient = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json'
    },
    timeout: 10000
})

//에러 체크(추후 삭제)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error.response?.data || error.message)
        return Promise.reject(error)
    }
)