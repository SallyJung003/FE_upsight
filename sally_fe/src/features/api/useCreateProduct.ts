import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import { Product, ProductCreateInput } from '@/types/product'

export function useCreateProduct() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (product: ProductCreateInput) => {
            const { data } = await apiClient.post<Product>('/products', product)
            return data
        },
        onSuccess: () => {
            // 상품 목록 캐시 무효화 (자동 리페치)
            queryClient.invalidateQueries({ queryKey: ['products'], exact: true })
        }
    })
}