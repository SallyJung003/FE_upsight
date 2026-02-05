// src/features/ui/__tests__/ProductForm.integration.test.tsx

import { render, screen, waitFor, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ProductForm } from '../ProductForm'
import { ChakraProvider } from '@chakra-ui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const pushMock = jest.fn()
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: pushMock,
        back: jest.fn(),
    }),
}))

const createTestQueryClient = () => new QueryClient({
    defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
    }
})

const renderWithProviders = (ui: React.ReactElement) => {
    const queryClient = createTestQueryClient()
    return {
        ...render(
            <ChakraProvider>
                <QueryClientProvider client={queryClient}>
                    {ui}
                </QueryClientProvider>
            </ChakraProvider>
        ),
        queryClient,
    }
}

describe('ProductForm Integration Test', () => {
    afterEach(async () => {
        cleanup()
        jest.clearAllMocks()
        // 비동기 작업이 완료될 시간 확보
        await new Promise(resolve => setTimeout(resolve, 0))
    })

    it('폼을 작성하고 메인/상세 이미지를 업로드 후 제출하면 성공적으로 등록된다', async () => {
        const user = userEvent.setup()
        const { container, queryClient } = renderWithProviders(<ProductForm />)

        await user.type(screen.getByLabelText(/상품명/i), '테스트 상품')
        await user.type(screen.getByLabelText(/간단 설명/i), '이것은 테스트 상품입니다')
        await user.type(screen.getByLabelText(/상세 설명/i), '상세 설명은 10자 이상이어야 합니다.')
        
        const stockInput = screen.getByPlaceholderText('재고 수량')
        await user.clear(stockInput)
        await user.type(stockInput, '50')

        const mainFile = new File(['main-image-content'], 'main.png', { type: 'image/png' })
        const detailFile = new File(['detail-image-content'], 'detail.png', { type: 'image/png' })

        const fileInputs = container.querySelectorAll('input[type="file"]')
        const mainInput = fileInputs[0] as HTMLInputElement
        const detailInput = fileInputs[1] as HTMLInputElement

        await user.upload(mainInput, mainFile)
        await screen.findByText('대표 이미지 업로드 완료')

        await user.upload(detailInput, [detailFile])
        await screen.findByText('상세 이미지 업로드 완료')

        const submitButton = screen.getByRole('button', { name: '등록하기' })
        await user.click(submitButton)

        await screen.findByText('상품 등록 완료')

        await waitFor(() => {
            expect(pushMock).toHaveBeenCalledWith('/')
        })
        queryClient.clear()
    })
})