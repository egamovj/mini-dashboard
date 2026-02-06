import React from 'react'
import { useAuthStore } from '@/store/authStore'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Layout } from '@/features/dashboard/Layout'
import { User, Mail, Shield } from 'lucide-react'

export const Profile: React.FC = () => {
    const { user } = useAuthStore()

    return (
        <Layout>
            <div className="space-y-6 max-w-4xl">
                <div>
                    <h1 className="text-3xl font-bold">User Profile</h1>
                    <p className="text-muted-foreground mt-2">Manage your account information and preferences.</p>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    <Card className="md:col-span-1">
                        <CardHeader className="text-center">
                            <div className="mx-auto h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary text-4xl font-bold mb-4 overflow-hidden border-2 border-primary/20">
                                {user?.photoURL ? (
                                    <img src={user.photoURL} alt={user.name || 'User'} className="h-full w-full object-cover" />
                                ) : (
                                    user?.name?.[0] || 'U'
                                )}
                            </div>
                            <CardTitle>{user?.name || 'User'}</CardTitle>
                            <CardDescription>{user?.email}</CardDescription>
                        </CardHeader>
                    </Card>

                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Account Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                                <User className="h-5 w-5 text-gray-500" />
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase">Full Name</p>
                                    <p className="text-sm font-medium">{user?.name || 'Not provided'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                                <Mail className="h-5 w-5 text-gray-500" />
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase">Email Address</p>
                                    <p className="text-sm font-medium">{user?.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                                <Shield className="h-5 w-5 text-gray-500" />
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase">User ID</p>
                                    <p className="text-sm font-mono text-[10px] break-all">{user?.id}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Layout>
    )
}
