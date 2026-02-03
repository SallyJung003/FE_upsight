import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { ImageUploadResponse } from '@/types/product'

export function useImageUpload() {
    return useMutation({
        mutationFn: async ({
            file,
            type
        }: {
            file: File
            type: 'main' | 'detail'
        }) => {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('type', type)

            const { data } = await axios.post<ImageUploadResponse>(
                '/api/upload',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            )
            return data
        }
    })
}