import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Layout } from '@/features/dashboard/Layout'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Bell, Moon, Lock } from 'lucide-react'

export const Settings: React.FC = () => {
    return (
        <Layout>
            <div className="space-y-6 max-w-4xl">
                <div>
                    <h1 className="text-3xl font-bold">Settings</h1>
                    <p className="text-muted-foreground mt-2">Adjust your application preferences and security settings.</p>
                </div>

                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Moon className="h-5 w-5" />
                                <CardTitle>Appearance</CardTitle>
                            </div>
                            <CardDescription>Customize how the dashboard looks for you.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Dark Mode</Label>
                                    <p className="text-sm text-muted-foreground">Switch between light and dark themes.</p>
                                </div>
                                <Button variant="outline">Light Mode</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Bell className="h-5 w-5" />
                                <CardTitle>Notifications</CardTitle>
                            </div>
                            <CardDescription>Configure how you receive updates and alerts.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Email Notifications</Label>
                                    <p className="text-sm text-muted-foreground">Receive weekly summary reports by email.</p>
                                </div>
                                <Button variant="outline">Enabled</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Lock className="h-5 w-5" />
                                <CardTitle>Security</CardTitle>
                            </div>
                            <CardDescription>Manage your account security and authentication.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Two-Factor Authentication</Label>
                                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
                                </div>
                                <Button variant="outline">Setup</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Layout>
    )
}
