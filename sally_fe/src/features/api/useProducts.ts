import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/axios'
import { Product } from '@/types/product'

export function useProducts() {
    return useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const { data } = await apiClient.get<Product[]>('/products')
            return data
        }
    })
}