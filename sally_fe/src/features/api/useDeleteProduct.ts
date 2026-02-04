import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'

export function useDeleteProduct() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await apiClient.delete(`/products/${id}`)
            return data
        },
        onSuccess: (_, variables) => {
            // 상품 목록 캐시 무효화
            queryClient.invalidateQueries({ queryKey: ['products'], exact: true })

            // 삭제된 상품의 상세 캐시 제거
            queryClient.removeQueries({ queryKey: ['products', variables] })
        }
    })
}