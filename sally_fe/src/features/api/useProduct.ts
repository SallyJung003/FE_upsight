import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import { Product } from '@/types/product'

export function useProduct(id: string) {
    return useQuery({
        queryKey: ['products', id],
        queryFn: async () => {
            const { data } = await apiClient.get<Product>(`/products/${id}`)
            return data
        },
        enabled: !!id
    })
}