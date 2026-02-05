// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw'
import { products } from './data'
import { Product } from '@/types/product'

//복사본
let mockProducts = [...products]
//id 오류 미연 방지
let nextId = 4

export const handlers = [
    // 1. 상품 목록 조회 GET /api/products
    http.get('/api/products', () => {
        return HttpResponse.json({
            success: true,
            data: mockProducts
        })
    }),

    // 2. 상품 상세 조회 GET /api/products/:id
    http.get('/api/products/:id', ({ params }) => {
        const { id } = params
        const product = mockProducts.find(p => p.id === id)

        if (!product) {
            return HttpResponse.json(
                { success: false, message: '상품을 찾을 수 없습니다' },
                { status: 404 }
            )
        }

        return HttpResponse.json({
            success: true,
            data: product
        })
    }),

    // 3. 상품 등록 POST /api/products
    http.post('/api/products', async ({ request }) => {
        const newProduct = await request.json() as Omit<Product, 'id' | 'createdAt'>

        const product: Product = {
            ...newProduct,
            id: String(nextId++),
            createdAt: new Date().toISOString()
        }

        mockProducts.push(product)

        return HttpResponse.json({
            success: true,
            data: product
        }, { status: 201 })
    }),

    // 4. 상품 삭제 DELETE /api/products/:id
    http.delete('/api/products/:id', ({ params }) => {
        const { id } = params
        const index = mockProducts.findIndex(p => p.id === id)

        if (index === -1) {
            return HttpResponse.json(
                { success: false, message: '상품을 찾을 수 없습니다' },
                { status: 404 }
            )
        }

        mockProducts.splice(index, 1)

        return HttpResponse.json({
            success: true,
            message: '상품이 삭제되었습니다'
        })
    }),

    // 5. 이미지 업로드 POST /api/upload
    http.post('/api/upload', async () => {
        return HttpResponse.json({
            url: 'https://via.placeholder.com/150'
        })
    }),
]