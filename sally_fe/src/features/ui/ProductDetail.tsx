'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import {
    Box,
    Button,
    VStack,
    HStack,
    Text,
    Image,
    Badge,
    Heading,
    Divider,
    SimpleGrid,
    useToast,
    useDisclosure,
    Center,
    Spinner
} from '@chakra-ui/react'
import { Product } from '@/types/product'
import { useDeleteProduct } from '@/features/api/useDeleteProduct'
import { ConfirmModal } from '@/shared/ui/Modal'

interface ProductDetailProps {
    product: Product
}

export function ProductDetail({ product }: ProductDetailProps) {
    const router = useRouter()
    const toast = useToast()
    const deleteProduct = useDeleteProduct()
    const queryClient = useQueryClient()
    const { isOpen, onOpen, onClose } = useDisclosure()

    if (!product) {
        return (
            <Center h="50vh">
                <Spinner size="xl" color="blue.500" thickness="4px" />
            </Center>
        )
    }

    const [selectedImage, setSelectedImage] = useState(product.mainImage)

    const handleDelete = async () => {
        try {
            await queryClient.cancelQueries({ queryKey: ['products', product.id] })
            await deleteProduct.mutateAsync(product.id)

            await queryClient.invalidateQueries({ queryKey: ['products'], exact: true })

            toast({
                title: '상품이 삭제되었습니다',
                status: 'success',
                duration: 2000
            })

            onClose()
            router.replace('/')
        } catch (error) {
            toast({
                title: '삭제 실패',
                description: '다시 시도해주세요',
                status: 'error',
                duration: 3000
            })
        }
    }

    return (
        <Box maxW="1200px" mx="auto" p={6}>
            <VStack spacing={8} align="stretch">
                {/* 뒤로가기 버튼 */}
                <Button
                    variant="ghost"
                    alignSelf="flex-start"
                    onClick={() => router.back()}
                >
                    ← 목록으로
                </Button>

                {/* 메인 컨텐츠 */}
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                    {/* 왼쪽: 이미지 영역 */}
                    <VStack spacing={4} align="stretch">
                        <Box
                            borderRadius="lg"
                            overflow="hidden"
                            border="1px solid"
                            borderColor="gray.200"
                        >
                            <Image
                                src={selectedImage}
                                alt={product.name}
                                w="100%"
                                h="400px"
                                objectFit="cover"
                            />
                        </Box>

                        <HStack spacing={2} overflowX="auto" pb={2}>
                            <Box
                                as="button"
                                onClick={() => setSelectedImage(product.mainImage)}
                                flexShrink={0}
                            >
                                <Image
                                    src={product.mainImage}
                                    alt="대표 이미지"
                                    boxSize="80px"
                                    objectFit="cover"
                                    borderRadius="md"
                                    border="2px solid"
                                    borderColor={selectedImage === product.mainImage ? 'blue.500' : 'gray.200'}
                                    cursor="pointer"
                                    transition="all 0.2s"
                                    _hover={{ borderColor: 'blue.300' }}
                                />
                            </Box>

                            {product.detailImages.map((img, index) => (
                                <Box
                                    key={index}
                                    as="button"
                                    onClick={() => setSelectedImage(img)}
                                    flexShrink={0}
                                >
                                    <Image
                                        src={img}
                                        alt={`상세 이미지 ${index + 1}`}
                                        boxSize="80px"
                                        objectFit="cover"
                                        borderRadius="md"
                                        border="2px solid"
                                        borderColor={selectedImage === img ? 'blue.500' : 'gray.200'}
                                        cursor="pointer"
                                        transition="all 0.2s"
                                        _hover={{ borderColor: 'blue.300' }}
                                    />
                                </Box>
                            ))}
                        </HStack>
                    </VStack>

                    {/* 오른쪽: 상품 정보 */}
                    <VStack spacing={6} align="stretch">
                        <Box>
                            <Heading size="xl" mb={2}>
                                {product.name}
                            </Heading>
                            <Text color="gray.600" fontSize="lg">
                                {product.description}
                            </Text>
                        </Box>

                        <Divider />

                        <HStack spacing={4}>
                            <Text fontSize="lg" fontWeight="medium">
                                재고:
                            </Text>
                            <Badge
                                colorScheme={product.stock > 0 ? 'green' : 'red'}
                                fontSize="md"
                                px={3}
                                py={1}
                                borderRadius="md"
                            >
                                {product.stock > 0 ? `${product.stock}개` : '품절'}
                            </Badge>
                        </HStack>

                        <HStack spacing={4}>
                            <Text fontSize="lg" fontWeight="medium">
                                등록일:
                            </Text>
                            <Text color="gray.600">
                                {new Date(product.createdAt).toLocaleDateString('ko-KR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </Text>
                        </HStack>

                        <Divider />

                        <Box>
                            <Heading size="md" mb={3}>
                                상세 설명
                            </Heading>
                            <Text
                                color="gray.700"
                                whiteSpace="pre-wrap"
                                lineHeight="tall"
                            >
                                {product.detailDescription}
                            </Text>
                        </Box>

                        <HStack spacing={4} pt={4}>
                            <Button
                                colorScheme="red"
                                variant="outline"
                                onClick={onOpen}
                                isLoading={deleteProduct.isPending}
                                width="full"
                            >
                                삭제
                            </Button>
                        </HStack>
                    </VStack>
                </SimpleGrid>
            </VStack>

            {/* 삭제 확인 모달 - 공통 컴포넌트 사용 */}
            <ConfirmModal
                isOpen={isOpen}
                onClose={onClose}
                onConfirm={handleDelete}
                title="상품 삭제"
                message={
                    <>
                        정말로 <strong>{product.name}</strong>을(를) 삭제하시겠습니까?
                    </>
                }
                warningMessage="이 작업은 되돌릴 수 없습니다."
                confirmText="삭제"
                cancelText="취소"
                colorScheme="red"
                isLoading={deleteProduct.isPending}
            />
        </Box>
    )
}