import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const { path: paramsPath } = await params
        // 1. uploads 폴더 확인
        const uploadsPath = path.join(process.cwd(), 'uploads', ...paramsPath)

        // 2. public 폴더 확인
        const publicPath = path.join(process.cwd(), 'public', ...paramsPath)

        let filepath: string
        let fileExists = false

        // uploads 먼저 확인
        try {
            await fs.access(uploadsPath)
            filepath = uploadsPath
            fileExists = true
        } catch {
            // uploads에 없으면 public 확인
            try {
                await fs.access(publicPath)
                filepath = publicPath
                fileExists = true
            } catch {
                fileExists = false
            }
        }

        if (!fileExists) {
            return NextResponse.json(
                { error: '이미지를 찾을 수 없습니다' },
                { status: 404 }
            )
        }

        const file = await fs.readFile(filepath!)
        const ext = path.extname(filepath!).toLowerCase()

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
        console.error('Image error:', error)
        return NextResponse.json(
            { error: '이미지를 찾을 수 없습니다' },
            { status: 404 }
        )
    }
}