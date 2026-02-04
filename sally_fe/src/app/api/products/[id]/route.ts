import { NextRequest, NextResponse } from 'next/server'
import { getProductById, deleteProduct } from '@/lib/db'
import fs from 'fs/promises'
import path from 'path'

// GET /api/products/:id - 상품 상세 조회
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const product = await getProductById(id)

        if (!product) {
            return NextResponse.json(
                { error: '상품을 찾을 수 없습니다' },
                { status: 404 }
            )
        }

        return NextResponse.json(product)
    } catch (error) {
        console.error('Get product error:', error)
        return NextResponse.json(
            { error: '상품 조회 실패' },
            { status: 500 }
        )
    }
}

// DELETE /api/products/:id - 상품 삭제
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        // 삭제 전 상품 정보 가져오기 (이미지 파일 삭제용)
        const product = await getProductById(id)

        if (!product) {
            return NextResponse.json(
                { error: '상품을 찾을 수 없습니다' },
                { status: 404 }
            )
        }

        const success = await deleteProduct(id)

        if (!success) {
            return NextResponse.json(
                { error: '삭제 실패' },
                { status: 500 }
            )
        }

        try {
            // mainImage 삭제
            if (product.mainImage.startsWith('/api/images/')) {
                const mainImagePath = product.mainImage.replace('/api/images/', '')
                const mainFilePath = path.join(process.cwd(), 'uploads', mainImagePath)
                await fs.unlink(mainFilePath).catch(() => { })
            }

            // detailImages 삭제
            for (const img of product.detailImages) {
                if (img.startsWith('/api/images/')) {
                    const imagePath = img.replace('/api/images/', '')
                    const filePath = path.join(process.cwd(), 'uploads', imagePath)
                    await fs.unlink(filePath).catch(() => { })
                }
            }
        } catch (fileError) {
            console.warn('이미지 파일 삭제 중 오류 (무시):', fileError)
        }

        return NextResponse.json({ message: '삭제 완료' })
    } catch (error) {
        console.error('Delete product error:', error)
        return NextResponse.json(
            { error: '삭제 실패' },
            { status: 500 }
        )
    }
}