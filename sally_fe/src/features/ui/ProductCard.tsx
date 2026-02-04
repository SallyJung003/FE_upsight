'use client'

import { 
  Card, 
  CardBody, 
  Image, 
  Stack, 
  Heading, 
  Text, 
  Badge,
  Flex,
  Box
} from '@chakra-ui/react'
import { useRouter } from 'next/navigation'
import { Product } from '@/types/product'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter()

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStockColor = (stock: number) => {
    if (stock === 0) return 'red'
    if (stock < 10) return 'orange'
    return 'green'
  }

  const handleClick = () => {
    router.push(`/${product.id}`)
  }

  return (
    <Card
      maxW="sm"
      cursor="pointer"
      transition="all 0.2s"
      _hover={{
        transform: 'translateY(-4px)',
        shadow: 'xl'
      }}
      onClick={handleClick}
    >
      {/* 이미지 */}
      <CardBody>
        <Image
          src={product.mainImage}
          alt={product.name}
          borderRadius="lg"
          objectFit="cover"
          h="200px"
          w="100%"
        />

        <Stack mt={6} spacing={3}>
          {/* 상품명 */}
          <Heading size="md" noOfLines={1}>
            {product.name}
          </Heading>

          {/* 간단 설명 */}
          <Text color="gray.600" noOfLines={2}>
            {product.description}
          </Text>

          {/* 재고 배지 */}
          <Flex justify="space-between" align="center">
            <Badge 
              colorScheme={getStockColor(product.stock)} 
              fontSize="sm"
              px={2}
              py={1}
            >
              재고: {product.stock}개
            </Badge>

            {product.stock === 0 && (
              <Badge colorScheme="red">품절</Badge>
            )}
          </Flex>

          {/* 등록일 */}
          <Text fontSize="sm" color="gray.500">
            등록일: {formatDate(product.createdAt)}
          </Text>
        </Stack>
      </CardBody>
    </Card>
  )
}