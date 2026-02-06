import React from 'react'
import { useAuthStore } from '@/store/authStore'
import { Button } from '@/components/ui/button'
import { LogOut, LayoutDashboard, Settings, User } from 'lucide-react'
import { NavLink, Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface LayoutProps {
    children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { logout, user } = useAuthStore()

    const navItems = [
        { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/profile', icon: User, label: 'Profile' },
        { to: '/settings', icon: Settings, label: 'Settings' },
    ]

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            <aside className="w-64 bg-white border-r hidden md:flex flex-col flex-shrink-0">
                <div className="p-6 border-b">
                    <Link to="/" className="text-xl font-bold text-primary">Mini Dashboard</Link>
                </div>
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                cn(
                                    "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                                    isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-gray-100"
                                )
                            }
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
                <div className="p-4 border-t">
                    <Button variant="ghost" className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={logout}>
                        <LogOut className="h-4 w-4" /> Logout
                    </Button>
                </div>
            </aside>

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-16 bg-white border-b flex items-center justify-between px-8 flex-shrink-0">
                    <div className="md:hidden font-bold text-primary text-xl">MiniDash</div>
                    <div className="ml-auto flex items-center gap-4">
                        <span className="text-sm font-medium">{user?.name}</span>
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {user?.name?.[0]}
                        </div>
                    </div>
                </header>
                <main className="flex-1 p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}
