import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

// GET /api/images/products/main/xxx.jpg - 이미지 파일 제공
export async function GET(
    request: NextRequest,
    { params }: { params: { path: string[] } }
) {
    try {
        // uploads/products/main/xxx.jpg
        const filepath = path.join(process.cwd(), 'uploads', ...params.path)

        // 파일 존재 확인
        await fs.access(filepath)

        const file = await fs.readFile(filepath)
        const ext = path.extname(filepath).toLowerCase()

        // MIME 타입 결정
        const mimeTypes: Record<string, string> = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.webp': 'image/webp'
        }

        const contentType = mimeTypes[ext] || 'application/octet-stream'

        return new NextResponse(file, {
            headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=31536000, immutable'
            }
        })
    } catch (error) {
        return NextResponse.json(
            { error: '이미지를 찾을 수 없습니다' },
            { status: 404 }
        )
    }
}