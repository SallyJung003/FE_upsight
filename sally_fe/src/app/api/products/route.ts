import { NextRequest, NextResponse } from 'next/server'
import { getProducts, createProduct } from '@/lib/db'

// GET /api/products - 상품 목록 조회
export async function GET() {
    try {
        const products = await getProducts()
        return NextResponse.json(products)
    } catch (error) {
        console.error('Get products error:', error)
        return NextResponse.json(
            { error: '상품 조회 실패' },
            { status: 500 }
        )
    }
}

// POST /api/products - 상품 등록
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const required = ['name', 'description', 'detailDescription', 'stock', 'mainImage']
        for (const field of required) {
            if (!body[field] && body[field] !== 0) {
                return NextResponse.json(
                    { error: `${field}는 필수 항목입니다` },
                    { status: 400 }
                )
            }
        }

        if (typeof body.stock !== 'number' || body.stock < 0) {
            return NextResponse.json(
                { error: '재고는 0 이상의 숫자여야 합니다' },
                { status: 400 }
            )
        }

        const newProduct = await createProduct({
            name: body.name,
            description: body.description,
            detailDescription: body.detailDescription,
            stock: body.stock,
            mainImage: body.mainImage,
            detailImages: body.detailImages || []
        })

        return NextResponse.json(newProduct, { status: 201 })
    } catch (error) {
        console.error('Create product error:', error)
        return NextResponse.json(
            { error: '상품 등록 실패' },
            { status: 500 }
        )
    }
}