import { useQuery } from '@tanstack/react-query'
import api from '@/api/axiosInstance'

export const useFetchData = <T>(queryKey: string[], endpoint: string) => {
    return useQuery<T>({
        queryKey,
        queryFn: async () => {
            const { data } = await api.get<T>(endpoint)
            return data
        },
    })
}
