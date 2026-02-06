export interface Product {
    id: number
    title: string
    price: number
    description: string
    category: string
    image: string
    rating: {
        rate: number
        count: number
    }
}

export interface User {
    id: number
    email: string
    username: string
    name: {
        firstname: string
        lastname: string
    }
}

export interface Favorite {
    userId: string
    productId: number
    createdAt: number
}


export type SortField = 'price' | 'rating'
export type SortOrder = 'asc' | 'desc'

export interface SortConfig {
    field: SortField
    order: SortOrder
}

export interface ApiResponse {
    [key: string]: any
}

export type ProductsResponse = { products: Product[]; total: number }
export type UsersResponse = { users: User[]; total: number }
