"use client"

import { useParams, useRouter } from "next/navigation"
import { useProduct } from "@/features/api/useProduct"
import { Box, Center, Text, Button } from '@chakra-ui/react'
import { ProductDetail } from "@/features/ui/ProductDetail"

export default function ProductPage() {
    const param = useParams()
    const router = useRouter()
    const productId = param.productId as string
    const { data: product, error } = useProduct(productId)

    if (error) {
        return (
            <Center h="50vh">
                <Box textAlign="center">
                    <Text fontSize="xl" mb={4} color="gray.600">
                        상품을 찾을 수 없습니다
                    </Text>
                    <Button colorScheme="blue" onClick={() => router.push('/')}>
                        목록으로 돌아가기
                    </Button>
                </Box>
            </Center>
        )
    }

    if (!product) {
        return null
    }

    return (
        <>
            <Box>
                <ProductDetail product={product} />
            </Box>
        </>
    )
}