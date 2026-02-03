import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

// POST /api/upload - 이미지 업로드
export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File
        const type = formData.get('type') as 'main' | 'detail'

        if (!file) {
            return NextResponse.json(
                { error: '파일이 없습니다' },
                { status: 400 }
            )
        }

        // 파일 타입 검증
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: '이미지 파일만 업로드 가능합니다 (jpg, png, webp)' },
                { status: 400 }
            )
        }

        // 파일 크기 검증 (5MB 제한)
        const maxSize = 5 * 1024 * 1024 // 5MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: '파일 크기는 5MB 이하여야 합니다' },
                { status: 400 }
            )
        }

        // 업로드 디렉토리 생성
        const uploadDir = path.join(process.cwd(), 'uploads', 'products', type)
        await fs.mkdir(uploadDir, { recursive: true })

        // 파일명 생성 (타임스탬프 + 랜덤)
        const timestamp = Date.now()
        const randomStr = Math.random().toString(36).substring(7)
        const ext = path.extname(file.name)
        const filename = `${timestamp}-${randomStr}${ext}`

        // 파일 저장
        const filepath = path.join(uploadDir, filename)
        const buffer = Buffer.from(await file.arrayBuffer())
        await fs.writeFile(filepath, buffer)

        // 클라이언트에서 접근 가능한 경로 반환
        const publicPath = `/api/images/products/${type}/${filename}`

        return NextResponse.json({ url: publicPath }, { status: 200 })
    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json(
            { error: '업로드 실패' },
            { status: 500 }
        )
    }
}