import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Smartphone, BarChart3, Settings, LogOut, ShieldCheck, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const Sidebar: React.FC = () => {
    const { user, logout } = useAuth();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Smartphone, label: 'My Apps', path: '/apps' },
        { icon: Zap, label: 'Campaigns', path: '/campaigns' },
        { icon: BarChart3, label: 'Analytics', path: '/analytics' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    if (user?.role === 'ROLE_ADMIN') {
        menuItems.splice(1, 0, { icon: ShieldCheck, label: 'Admin Panel', path: '/admin' });
    }

    return (
        <aside className="w-64 h-screen bg-slate-950 border-r border-slate-800 flex flex-col fixed left-0 top-0">
            <div className="p-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                        <LayoutDashboard className="text-white w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold tracking-tight italic">Trackyfly</span>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-1 mt-6">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
                            isActive
                                ? "bg-primary-500/10 text-primary-500"
                                : "text-slate-400 hover:bg-slate-900 hover:text-white"
                        )}
                    >
                        <item.icon className={cn(
                            "w-5 h-5 transition-colors",
                            "group-hover:text-primary-500"
                        )} />
                        <span className="font-medium">{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-800">
                <div className="flex items-center gap-3 px-2 py-3 rounded-lg bg-slate-900/50 mb-4">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold font-sans">
                        {user?.username.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium text-white truncate">{user?.username}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.role === 'ROLE_ADMIN' ? 'Administrator' : 'Developer'}</p>
                    </div>
                </div>
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
