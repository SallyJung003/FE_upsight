'use client'
import {SimpleGrid, Heading, Box } from '@chakra-ui/react'
import { useProducts } from '@/features/api/useProducts'
import { ProductCard } from '@/features/ui/ProductCard'

export default function ProductListPage() {
  const { data: products, error } = useProducts()
  
  if (error) {
    return (
      <>
        <Box textAlign="center" color="red.500">
          상품을 불러오는데 실패했습니다.
        </Box>
      </>
    )
  }

  return (
    <>
      <Heading mb={8} color="gray.800">
        {products?.length}개의 상품 목록 
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {products?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </SimpleGrid>

      {/* 상품 없을 때 */}
      {products?.length === 0 && (
        <Box textAlign="center" py={12} color="gray.500">
          등록된 상품이 없습니다.
        </Box>
      )}
    </>
  )
}