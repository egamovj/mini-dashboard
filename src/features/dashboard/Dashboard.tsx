import React, { useState, useMemo, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useFetchData } from '@/hooks/useFetchData'
import { useFirestore } from '@/hooks/useFirestore'
import type { Product, User, SortConfig, SortField } from '@/types'
import { Layout } from '@/features/dashboard/Layout'
import { Users, Package, ShoppingCart, Search, Plus, Edit2, Trash2, ArrowUpDown, X, Star } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export const Dashboard: React.FC = () => {
    const { toast } = useToast()
    const { data: productsData } = useFetchData<Product[]>(['products'], '/products')
    const { data: users, isLoading: loadingUsers } = useFetchData<User[]>(['users'], '/users?limit=5')
    const { favorites, toggleFavorite } = useFirestore()

    const [localProducts, setLocalProducts] = useState<Product[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'price', order: 'asc' })
    const [isEditing, setIsEditing] = useState(false)
    const [currentProduct, setCurrentProduct] = useState<Partial<Product> | null>(null)

    useEffect(() => {
        if (productsData) {
            setLocalProducts(productsData)
        }
    }, [productsData])

    const categories = useMemo(() => {
        return ['all', ...new Set(localProducts.map(p => p.category))]
    }, [localProducts])

    const filteredAndSortedProducts = useMemo(() => {
        let result = [...localProducts]

        if (searchTerm) {
            result = result.filter(p =>
                p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.description.toLowerCase().includes(searchTerm.toLowerCase())
            )
        }

        if (selectedCategory !== 'all') {
            result = result.filter(p => p.category === selectedCategory)
        }

        result.sort((a, b) => {
            const valA = sortConfig.field === 'price' ? a.price : a.rating.rate
            const valB = sortConfig.field === 'price' ? b.price : b.rating.rate

            if (sortConfig.order === 'asc') return valA - valB
            return valB - valA
        })

        return result
    }, [localProducts, searchTerm, selectedCategory, sortConfig])

    const stats = [
        { title: 'Total Products', value: localProducts.length, icon: Package, color: 'text-blue-600' },
        { title: 'Registered Users', value: users?.length || 0, icon: Users, color: 'text-green-600' },
        { title: 'Avg Price', value: `$${((filteredAndSortedProducts.reduce((acc, p) => acc + p.price, 0) || 0) / (filteredAndSortedProducts.length || 1)).toFixed(2)}`, icon: ShoppingCart, color: 'text-purple-600' },
    ]

    const toggleSort = (field: SortField) => {
        setSortConfig(prev => ({
            field,
            order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc'
        }))
    }

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this product?')) {
            setLocalProducts(prev => prev.filter(p => p.id !== id))
            toast({ title: "Product deleted", description: "The product was removed from your local list." })
        }
    }

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault()
        if (!currentProduct?.title || !currentProduct?.price) return

        if (currentProduct.id) {
            setLocalProducts(prev => prev.map(p => p.id === currentProduct.id ? (currentProduct as Product) : p))
            toast({ title: "Product updated", description: `${currentProduct.title} has been updated.` })
        } else {
            const newProduct: Product = {
                ...currentProduct as Product,
                id: Math.max(...localProducts.map(p => p.id), 0) + 1,
                rating: { rate: 0, count: 0 },
                image: 'https://via.placeholder.com/150'
            }
            setLocalProducts(prev => [newProduct, ...prev])
            toast({ title: "Product added", description: `${newProduct.title} has been added to the list.` })
        }
        setIsEditing(false)
        setCurrentProduct(null)
    }

    return (
        <Layout>
            <div className="space-y-6 relative">
                {isEditing && (
                    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                        <Card className="w-full max-w-lg">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>{currentProduct?.id ? 'Edit Product' : 'Add New Product'}</CardTitle>
                                <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSave} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Title</label>
                                        <Input
                                            value={currentProduct?.title || ''}
                                            onChange={e => setCurrentProduct(prev => ({ ...prev, title: e.target.value }))}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Price ($)</label>
                                            <Input
                                                type="number" step="0.01"
                                                value={currentProduct?.price || ''}
                                                onChange={e => setCurrentProduct(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Category</label>
                                            <select
                                                className="w-full h-10 px-3 py-2 bg-background border rounded-md text-sm"
                                                value={currentProduct?.category || ''}
                                                onChange={e => setCurrentProduct(prev => ({ ...prev, category: e.target.value }))}
                                                required
                                            >
                                                <option value="">Select Category</option>
                                                {categories.filter(c => c !== 'all').map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Description</label>
                                        <textarea
                                            className="w-full min-h-[100px] px-3 py-2 bg-background border rounded-md text-sm"
                                            value={currentProduct?.description || ''}
                                            onChange={e => setCurrentProduct(prev => ({ ...prev, description: e.target.value }))}
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                                        <Button type="submit">Save Product</Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                )}

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <h1 className="text-3xl font-bold">Dashboard Overview</h1>
                    <div className="flex items-center gap-2">
                        <div className="relative w-full md:w-64">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search products..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="h-10 px-3 py-2 bg-background border rounded-md text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>
                                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </option>
                            ))}
                        </select>
                        <Button onClick={() => { setCurrentProduct({}); setIsEditing(true); }}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    {stats.map((stat) => (
                        <Card key={stat.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Featured Products</CardTitle>
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => toggleSort('price')}>
                                <ArrowUpDown className="h-4 w-4 mr-1" />
                                Price {sortConfig.field === 'price' && (sortConfig.order === 'asc' ? '↑' : '↓')}
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => toggleSort('rating')}>
                                <ArrowUpDown className="h-4 w-4 mr-1" />
                                Rating {sortConfig.field === 'rating' && (sortConfig.order === 'asc' ? '↑' : '↓')}
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {loadingUsers && localProducts.length === 0 ? (
                            <div className="text-center py-4">Loading data...</div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px]"></TableHead>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead className="text-right">Price</TableHead>
                                        <TableHead className="text-right">Rating</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredAndSortedProducts.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell>
                                                <Button
                                                    variant="ghost" size="icon" className="h-8 w-8"
                                                    onClick={() => toggleFavorite(product.id)}
                                                >
                                                    <Star className={`h-4 w-4 ${favorites.includes(product.id) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                                </Button>
                                            </TableCell>
                                            <TableCell className="font-medium max-w-[200px] truncate">
                                                {product.title}
                                            </TableCell>
                                            <TableCell className="capitalize">{product.category}</TableCell>
                                            <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                                            <TableCell className="text-right">{product.rating.rate} / 5</TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button
                                                    variant="ghost" size="icon" className="h-8 w-8 text-blue-600"
                                                    onClick={() => { setCurrentProduct(product); setIsEditing(true); }}
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost" size="icon" className="h-8 w-8 text-red-600"
                                                    onClick={() => handleDelete(product.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {filteredAndSortedProducts.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                                No products found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </Layout>
    )
}
