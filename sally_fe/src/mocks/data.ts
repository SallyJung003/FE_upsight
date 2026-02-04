// src/mocks/data.ts
import { Product } from "@/types/product"

export const products: Product[] = [
    {
        id: '1',
        name: '무선 블루투스 이어폰',
        description: '고음질 노이즈 캔슬링 이어폰',
        detailDescription: '최신 블루투스 5.0 기술을 적용한 프리미엄 이어폰입니다. 최대 30시간 재생 가능하며, IPX7 방수 등급을 지원합니다.',
        stock: 50,
        mainImage: '/api/images/images/pic1.jpg',
        detailImages: [
            '/api/images/images/pic1.jpg',
            '/api/images/images/pic2.jpg'
        ],
        createdAt: '2026-01-15T10:30:00Z'
    },
    {
        id: '2',
        name: '기계식 키보드',
        description: 'RGB 백라이트 게이밍 키보드',
        detailDescription: '청축 스위치를 사용한 기계식 키보드로 타건감이 우수합니다. 1680만 컬러 RGB 백라이트를 지원합니다.',
        stock: 9,
        mainImage: '/api/images/images/pic1.jpg',
        detailImages: [
            '/api/images/images/pic1.jpg',
            '/api/images/images/pic2.jpg'
        ],
        createdAt: '2026-01-20T14:20:00Z'
    },
    {
        id: '3',
        name: '무선 마우스',
        description: '인체공학적 디자인 무선 마우스',
        detailDescription: '손목 피로를 줄여주는 인체공학적 설계. 2.4GHz 무선 연결로 안정적인 사용이 가능합니다.',
        stock: 0,
        mainImage: '/api/images/images/pic1.jpg',
        detailImages: [
            '/api/images/images/pic1.jpg',
            '/api/images/images/pic2.jpg'
        ],
        createdAt: '2026-02-01T09:00:00Z'
    }
]