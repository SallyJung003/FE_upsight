// 기본 상품 타입
export interface Product {
    id: string
    name: string
    description: string
    detailDescription: string
    stock: number
    mainImage: string
    detailImages: string[]
    createdAt: string
}

// 상품 등록 시 사용 (id, createdAt 제외)
export interface ProductCreateInput {
    name: string
    description: string
    detailDescription: string
    stock: number
    mainImage: string
    detailImages: string[]
}

// 상품 등록 폼 데이터 (이미지 업로드 전)
export interface ProductFormData {
    name: string
    description: string
    detailDescription: string
    stock: number
    mainImageFile: File | null
    detailImageFiles: File[]
}

// API 응답 타입들
export interface ProductListResponse {
    products: Product[]
}

export interface ProductDetailResponse {
    product: Product
}

export interface ProductCreateResponse {
    product: Product
}

export interface ProductDeleteResponse {
    message: string
}

// 이미지 업로드 관련
export type ImageType = 'main' | 'detail'

export interface ImageUploadResponse {
    url: string
}

export interface ImageUploadError {
    error: string
}

// DB 구조 (서버 사이드에서만 사용)
export interface ProductDatabase {
    products: Product[]
    nextId: number
}

// API 에러 응답
export interface ApiError {
    error: string
    details?: unknown
}

export interface PaginatedProducts {
    products: Product[]
}