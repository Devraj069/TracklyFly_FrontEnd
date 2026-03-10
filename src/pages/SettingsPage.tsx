import React from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { Settings, User, Bell, Shield, Palette, Database, Save, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

const SettingsPage: React.FC = () => {
    const { user, logout } = useAuth();

    const sections = [
        { id: 'profile', icon: User, label: 'Profile' },
        { id: 'security', icon: Shield, label: 'Security' },
        { id: 'notifications', icon: Bell, label: 'Alerts' },
        { id: 'api', icon: Database, label: 'API & Webhooks' },
        { id: 'appearance', icon: Palette, label: 'Interface' },
    ];

    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-200">
            <Sidebar />

            <main className="flex-1 ml-64 p-10 space-y-10">
                <header className="flex justify-between items-center">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic flex items-center gap-4">
                            <Settings className="w-10 h-10 text-primary-500 not-italic" />
                            General Settings
                        </h1>
                        <p className="text-slate-500 font-medium tracking-wide">Manage your account preferences and security</p>
                    </div>

                    <button className="primary-btn !w-auto px-8 h-12 shadow-2xl shadow-primary-500/10 gap-2">
                        <Save className="w-5 h-5" />
                        Save Changes
                    </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                    {/* Sidebar Nav */}
                    <div className="lg:col-span-1 space-y-2">
                        {sections.map((section) => (
                            <button
                                key={section.id}
                                className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl bg-slate-900/40 border border-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all duration-300 group"
                            >
                                <section.icon className="w-5 h-5 group-hover:text-primary-500 transition-colors" />
                                <span className="font-bold tracking-tight text-sm uppercase">{section.label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-3 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="premium-card p-10 space-y-10"
                        >
                            <div className="space-y-6">
                                <h3 className="text-2xl font-black text-white uppercase tracking-tight">Account Details</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Username</label>
                                        <input
                                            type="text"
                                            readOnly
                                            value={user?.username}
                                            className="input-field bg-slate-950/40 opacity-70 cursor-not-allowed"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Email Address</label>
                                        <input
                                            type="email"
                                            readOnly
                                            value={user?.email}
                                            className="input-field bg-slate-950/40 opacity-70 cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                            </div>

                            <hr className="border-slate-800/50" />

                            <div className="space-y-6">
                                <h3 className="text-2xl font-black text-white uppercase tracking-tight underline decoration-primary-500/30 decoration-8 underline-offset-4">Security</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">Current Password</label>
                                        <input type="password" placeholder="••••••••" className="input-field" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-widest pl-1">New Password</label>
                                        <input type="password" placeholder="••••••••" className="input-field" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <div className="premium-card p-10 bg-red-500/5 border-red-500/20 flex flex-col md:flex-row justify-between items-center gap-8">
                            <div className="space-y-1">
                                <h4 className="text-xl font-black text-red-400 italic">Terminate Session</h4>
                                <p className="text-slate-500 text-sm font-medium">Log out from all devices and clear local cache</p>
                            </div>
                            <button
                                onClick={logout}
                                className="w-full md:w-auto px-10 h-14 rounded-2xl bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 font-black tracking-tighter uppercase transition-all duration-300 border border-red-500/20 flex items-center justify-center gap-3"
                            >
                                <LogOut className="w-6 h-6" />
                                De-Authenticate
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SettingsPage;
