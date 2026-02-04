'use client'

import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    NumberInput,
    NumberInputField,
    VStack,
    HStack,
    Image,
    FormErrorMessage,
    useToast,
    Text
} from '@chakra-ui/react'
import { useImageUpload } from '@/features/api/useImageUpload'
import { useCreateProduct } from '@/features/api/useCreateProduct'
import { ProductCreateInput } from '@/types/product'

export function ProductForm() {
    const router = useRouter()
    const toast = useToast()

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm<ProductCreateInput>({
        defaultValues: {
            name: '',
            description: '',
            detailDescription: '',
            stock: 0,
            mainImage: '',
            detailImages: []
        },
        mode: "onBlur"
    })

    // 이미지 업로드 mutation
    const imageUpload = useImageUpload()

    // 상품 등록 mutation
    const createProduct = useCreateProduct()

    // 이미지 미리보기 상태
    const [mainImagePreview, setMainImagePreview] = useState<string>('')
    const [detailImagePreviews, setDetailImagePreviews] = useState<string[]>([])

    // input ref
    const mainImageInputRef = useRef<HTMLInputElement>(null)
    const detailImagesInputRef = useRef<HTMLInputElement>(null)

    // 숨겨진 필드 등록 (유효성 검사용)
    useEffect(() => {
        register('mainImage', {
            required: '대표 이미지를 업로드해주세요'
        })
        register('detailImages', {
            validate: (value) =>
                value.length > 0 || '상세 이미지를 최소 1개 이상 업로드해주세요'
        })
    }, [register])

    // 대표 이미지 업로드
    const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        try {
            const result = await imageUpload.mutateAsync({ file, type: 'main' })
            setValue('mainImage', result.url, { shouldValidate: true })
            setMainImagePreview(result.url)

            toast({
                title: '대표 이미지 업로드 완료',
                status: 'success',
                duration: 2000
            })

            if (mainImageInputRef.current) {
                mainImageInputRef.current.value = ""
            }

        } catch (error) {
            toast({
                title: '이미지 업로드 실패',
                description: '다시 시도해주세요',
                status: 'error',
                duration: 3000
            })
        }
    }

    // 상세 이미지 업로드
    const handleDetailImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        try {
            const uploadPromises = Array.from(files).map(file =>
                imageUpload.mutateAsync({ file, type: 'detail' })
            )

            const results = await Promise.all(uploadPromises)
            const newUrls = results.map(r => r.url)

            const updatedImages = [...detailImagePreviews, ...newUrls]
            setValue('detailImages', updatedImages, { shouldValidate: true })
            setDetailImagePreviews(updatedImages)

            toast({
                title: '상세 이미지 업로드 완료',
                status: 'success',
                duration: 2000
            })

            if (detailImagesInputRef.current) {
                detailImagesInputRef.current.value = ""
            }
        } catch (error) {
            toast({
                title: '이미지 업로드 실패',
                description: '다시 시도해주세요',
                status: 'error',
                duration: 3000
            })
        }
    }

    // 대표 이미지 삭제
    const handleRemoveMainImage = () => {
        setValue('mainImage', '', { shouldValidate: true })
        setMainImagePreview('')
    }

    // 상세 이미지 삭제
    const handleRemoveDetailImage = (index: number) => {
        const updated = detailImagePreviews.filter((_, i) => i !== index)
        setValue('detailImages', updated, { shouldValidate: true })
        setDetailImagePreviews(updated)
    }

    // 폼 제출
    const onSubmit = async (data: ProductCreateInput) => {
        try {
            await createProduct.mutateAsync(data)

            toast({
                title: '상품 등록 완료',
                status: 'success',
                duration: 2000
            })

            router.push('/')
        } catch (error) {
            toast({
                title: '상품 등록 실패',
                description: '다시 시도해주세요',
                status: 'error',
                duration: 3000
            })
        }
    }

    return (
        <Box as="form" onSubmit={handleSubmit(onSubmit)} noValidate maxW="800px" mx="auto" p={6}>
            <VStack spacing={6} align="stretch">
                {/* 상품명 */}
                <FormControl isInvalid={!!errors.name} isRequired>
                    <FormLabel>상품명</FormLabel>
                    <Input
                        {...register('name', {
                            required: '상품명을 입력해주세요',
                            minLength: { value: 2, message: '최소 2자 이상 입력해주세요' }
                        })}
                        placeholder="상품명을 입력하세요"
                    />
                    <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                </FormControl>

                {/* 간단 설명 */}
                <FormControl isInvalid={!!errors.description} isRequired>
                    <FormLabel>간단 설명</FormLabel>
                    <Input
                        {...register('description', {
                            required: '간단 설명을 입력해주세요',
                            maxLength: { value: 100, message: '100자 이내로 입력해주세요' }
                        })}
                        placeholder="상품 간단 설명"
                    />
                    <FormErrorMessage>{errors.description?.message}</FormErrorMessage>
                </FormControl>

                {/* 상세 설명 */}
                <FormControl isInvalid={!!errors.detailDescription} isRequired>
                    <FormLabel>상세 설명</FormLabel>
                    <Textarea
                        {...register('detailDescription', {
                            required: '상세 설명을 입력해주세요',
                            minLength: { value: 10, message: '최소 10자 이상 입력해주세요' }
                        })}
                        placeholder="상품 상세 설명"
                        rows={6}
                    />
                    <FormErrorMessage>{errors.detailDescription?.message}</FormErrorMessage>
                </FormControl>

                {/* 재고 */}
                <FormControl isInvalid={!!errors.stock} isRequired>
                    <FormLabel>재고</FormLabel>
                    <NumberInput min={0}>
                        <NumberInputField
                            {...register('stock', {
                                required: '재고를 입력해주세요',
                                min: { value: 0, message: '0 이상의 숫자를 입력해주세요' },
                                valueAsNumber: true
                            })}
                            placeholder="재고 수량"
                        />
                    </NumberInput>
                    <FormErrorMessage>{errors.stock?.message}</FormErrorMessage>
                </FormControl>

                {/* 대표 이미지 */}
                <FormControl isInvalid={!!errors.mainImage} isRequired>
                    <FormLabel>대표 이미지</FormLabel>

                    {/* 숨겨진 input */}
                    <Input
                        ref={mainImageInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/jpg"
                        onChange={handleMainImageUpload}
                        display="none"
                    />

                    {/* 커스텀 버튼 */}
                    <Button
                        onClick={() => mainImageInputRef.current?.click()}
                        isLoading={imageUpload.isPending}
                        colorScheme="blue"
                        variant="outline"
                        width="full"
                    >
                        {mainImagePreview ? '이미지 변경' : '이미지 선택'}
                    </Button>

                    <Text fontSize="sm" color="gray.600" mt={1}>
                        JPG, PNG, WEBP 형식 / 최대 5MB
                    </Text>
                    <FormErrorMessage>{errors.mainImage?.message}</FormErrorMessage>

                    {mainImagePreview && (
                        <Box mt={4} position="relative" display="inline-block">
                            <Image
                                src={mainImagePreview}
                                alt="대표 이미지 미리보기"
                                maxH="200px"
                                objectFit="cover"
                                borderRadius="md"
                            />
                            <Button
                                size="xs"
                                colorScheme="red"
                                position="absolute"
                                top={1}
                                right={1}
                                onClick={handleRemoveMainImage}
                            >
                                삭제
                            </Button>
                        </Box>
                    )}
                </FormControl>

                {/* 상세 이미지 */}
                <FormControl isInvalid={!!errors.detailImages} isRequired>
                    <FormLabel>상세 이미지 (최소 1개 이상)</FormLabel>

                    {/* 숨겨진 input */}
                    <Input
                        ref={detailImagesInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/jpg"
                        multiple
                        onChange={handleDetailImagesUpload}
                        display="none"
                    />

                    {/* 커스텀 버튼 */}
                    <Button
                        onClick={() => detailImagesInputRef.current?.click()}
                        isLoading={imageUpload.isPending}
                        colorScheme="blue"
                        variant="outline"
                        width="full"
                    >
                        상세 이미지 추가
                    </Button>

                    <Text fontSize="sm" color="gray.600" mt={1}>
                        JPG, PNG, WEBP 형식 / 최대 5MB / 여러 장 선택 가능
                    </Text>
                    <FormErrorMessage>{errors.detailImages?.message}</FormErrorMessage>

                    {detailImagePreviews.length > 0 && (
                        <Box mt={4}>
                            <Text fontSize="sm" fontWeight="medium" mb={2}>
                                업로드된 이미지 ({detailImagePreviews.length}개)
                            </Text>
                            <HStack spacing={4} wrap="wrap">
                                {detailImagePreviews.map((url, index) => (
                                    <Box key={index} position="relative">
                                        <Image
                                            src={url}
                                            alt={`상세 이미지 ${index + 1}`}
                                            boxSize="100px"
                                            objectFit="cover"
                                            borderRadius="md"
                                        />
                                        <Button
                                            size="xs"
                                            colorScheme="red"
                                            position="absolute"
                                            top={1}
                                            right={1}
                                            onClick={() => handleRemoveDetailImage(index)}
                                        >
                                            삭제
                                        </Button>
                                    </Box>
                                ))}
                            </HStack>
                        </Box>
                    )}
                </FormControl>

                {/* 제출 버튼 */}
                <HStack spacing={4} justify="flex-end" pt={4}>
                    <Button
                        variant="outline"
                        onClick={() => router.back()}
                        isDisabled={createProduct.isPending}
                    >
                        취소
                    </Button>
                    <Button
                        type="submit"
                        colorScheme="blue"
                        isLoading={createProduct.isPending || imageUpload.isPending}
                        loadingText="등록 중..."
                    >
                        등록하기
                    </Button>
                </HStack>
            </VStack>
        </Box>
    )
}