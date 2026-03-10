import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../services/api';
import { ShieldCheck, Users, Smartphone, Trash2, Loader2, AlertTriangle, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminPage: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [apps, setApps] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchAdminData = async () => {
        try {
            // These endpoints might need to be created in the backend
            // For now, let's assume they exist or let's create placeholders
            const [usersRes, appsRes] = await Promise.all([
                api.get('/admin/users'),
                api.get('/admin/apps')
            ]);
            setUsers(usersRes.data);
            setApps(appsRes.data);
        } catch (err) {
            console.error("Admin fetch failed", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdminData();
    }, []);

    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-200">
            <Sidebar />

            <main className="flex-1 ml-64 p-10 space-y-10">
                <header className="flex justify-between items-center">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic flex items-center gap-4">
                            <ShieldCheck className="w-10 h-10 text-rose-500 not-italic" />
                            Admin Control <span className="text-rose-500">Center</span>
                        </h1>
                        <p className="text-slate-500 font-medium tracking-wide">Manage registered users and application inventory</p>
                    </div>

                    <div className="relative group w-72">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 group-focus-within:text-rose-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Universal Search..."
                            className="input-field pl-12 h-12 !rounded-2xl border-rose-500/20 focus:border-rose-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* User Management */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <Users className="w-6 h-6 text-rose-500" />
                            <h2 className="text-2xl font-black text-white uppercase">User Management</h2>
                        </div>

                        <div className="premium-card overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-rose-500/5 border-b border-rose-500/10 text-rose-500 text-[10px] uppercase font-black tracking-widest">
                                    <tr>
                                        <th className="px-6 py-4">Identity</th>
                                        <th className="px-6 py-4 text-right">Access Level</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/50">
                                    {users.length === 0 ? (
                                        <tr><td colSpan={2} className="p-10 text-center text-slate-600 font-bold uppercase italic tracking-widest">No nodes detected</td></tr>
                                    ) : (
                                        users.map(u => (
                                            <tr key={u.id} className="hover:bg-rose-500/5 transition-all group">
                                                <td className="px-6 py-4">
                                                    <p className="font-black text-white">{u.username}</p>
                                                    <p className="text-xs text-slate-500 font-mono italic">{u.email}</p>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black tracking-tighter uppercase ${u.role === 'ROLE_ADMIN' ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* App Management */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <Smartphone className="w-6 h-6 text-rose-400" />
                            <h2 className="text-2xl font-black text-white uppercase">App Inventory</h2>
                        </div>

                        <div className="premium-card overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-rose-500/5 border-b border-rose-500/10 text-rose-500 text-[10px] uppercase font-black tracking-widest">
                                    <tr>
                                        <th className="px-6 py-4">Asset</th>
                                        <th className="px-6 py-4 text-right">Control</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-800/50">
                                    {apps.length === 0 ? (
                                        <tr><td colSpan={2} className="p-10 text-center text-slate-600 font-bold uppercase italic tracking-widest">Inventory empty</td></tr>
                                    ) : (
                                        apps.map(a => (
                                            <tr key={a.id} className="hover:bg-rose-500/5 transition-all">
                                                <td className="px-6 py-4">
                                                    <p className="font-black text-white italic">{a.appName}</p>
                                                    <p className="text-xs text-slate-500 font-mono uppercase tracking-widest">{a.packageName}</p>
                                                </td>
                                                <td className="px-6 py-4 text-right text-rose-500/40">
                                                    <button className="p-2 hover:bg-rose-500 hover:text-white rounded-xl transition-all">
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="premium-card p-10 bg-amber-500/5 border-amber-500/20 flex gap-8 items-center border-l-[12px]">
                    <AlertTriangle className="w-12 h-12 text-amber-500 flex-shrink-0" />
                    <div>
                        <h4 className="text-xl font-black text-amber-400 uppercase">Attention</h4>
                        <p className="text-slate-500 font-medium">Changes made here are permanent and affect the entire platform. Please handle with care.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminPage;
