import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import StatsCard from '../components/StatsCard';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { MousePointer2, Download, Zap, TrendingUp, Calendar, Filter, Loader2, RefreshCw } from 'lucide-react';
import api from '../services/api';
import { motion } from 'framer-motion';

const data = [
    { name: 'Mon', clicks: 4000, installs: 2400 },
    { name: 'Tue', clicks: 3000, installs: 1398 },
    { name: 'Wed', clicks: 2000, installs: 9800 },
    { name: 'Thu', clicks: 2780, installs: 3908 },
    { name: 'Fri', clicks: 1890, installs: 4800 },
    { name: 'Sat', clicks: 2390, installs: 3800 },
    { name: 'Sun', clicks: 3490, installs: 4300 },
];

const DashboardPage: React.FC = () => {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const res = await api.get('/stats/summary');
            setStats(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-200 font-sans">
            <Sidebar />

            <main className="flex-1 ml-64 p-12 space-y-12">
                {/* Header Section */}
                <div className="flex justify-between items-end">
                    <div className="space-y-1">
                        <h1 className="text-5xl font-black tracking-tighter text-white uppercase">
                            Dashboard <span className="text-primary-500 not-italic">Overview</span>
                        </h1>
                        <p className="text-slate-500 font-medium tracking-wide">Monitor your live attribution performance and app growth</p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={fetchStats}
                            className="w-12 h-12 flex items-center justify-center bg-slate-900 border border-slate-800 rounded-2xl hover:bg-slate-800 transition-all active:scale-95"
                        >
                            <RefreshCw className={`w-5 h-5 text-slate-400 ${loading ? 'animate-spin text-primary-500' : ''}`} />
                        </button>
                        <button className="h-12 px-6 rounded-2xl bg-slate-900 border border-slate-800 text-sm font-bold flex items-center gap-3 hover:bg-slate-800 transition-all">
                            <Calendar className="w-5 h-5 text-slate-500" />
                            Global Time
                        </button>
                    </div>
                </div>

                {loading && !stats ? (
                    <div className="flex justify-center py-40">
                        <div className="relative">
                            <div className="w-16 h-16 border-4 border-primary-500/20 rounded-full" />
                            <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0" />
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            <StatsCard
                                label="Total Interactions"
                                value={stats?.totalClicks.toLocaleString() || '0'}
                                change="12.5%"
                                isPositive
                                icon={MousePointer2}
                                delay={0}
                            />
                            <StatsCard
                                label="Verified Installs"
                                value={stats?.totalInstalls.toLocaleString() || '0'}
                                change="5.2%"
                                isPositive
                                icon={Download}
                                delay={0.1}
                            />
                            <StatsCard
                                label="Active Campaigns"
                                value={stats?.totalCampaigns || '0'}
                                change="2"
                                isPositive
                                icon={Zap}
                                delay={0.2}
                            />
                            <StatsCard
                                label="Estimated Revenue"
                                value={`₹${stats?.totalRevenue.toLocaleString() || '0'}`}
                                change="8.4%"
                                isPositive
                                icon={TrendingUp}
                                delay={0.3}
                            />
                        </div>

                        {/* Middle Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 premium-card p-10 flex flex-col gap-10">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Tracking Activity</h2>
                                    <div className="flex gap-6">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-primary-500" />
                                            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Total Clicks</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-indigo-500" />
                                            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Total Installs</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-[350px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={data}>
                                            <defs>
                                                <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.2} />
                                                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="colorInstalls" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" strokeOpacity={0.5} />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10, fontWeight: 'bold' }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10, fontWeight: 'bold' }} />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', backdropFilter: 'blur(20px)' }}
                                                itemStyle={{ fontSize: 12, fontWeight: 700 }}
                                            />
                                            <Area type="monotone" dataKey="clicks" stroke="#0ea5e9" strokeWidth={4} fillOpacity={1} fill="url(#colorClicks)" />
                                            <Area type="monotone" dataKey="installs" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorInstalls)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="premium-card p-10 flex flex-col gap-8 justify-center bg-gradient-to-br from-indigo-500/10 to-transparent">
                                <div className="space-y-2">
                                    <h2 className="text-3xl font-black text-white uppercase tracking-tight">System Status</h2>
                                    <p className="text-slate-500 font-medium text-sm">Server connectivity is stable</p>
                                </div>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center p-4 rounded-2xl bg-slate-950/40 border border-slate-800/50">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">API Response</span>
                                        <span className="text-emerald-500 font-black">24ms</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 rounded-2xl bg-slate-950/40 border border-slate-800/50">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">SDK Uptime</span>
                                        <span className="text-emerald-500 font-black">99.9%</span>
                                    </div>
                                    <div className="flex justify-between items-center p-4 rounded-2xl bg-slate-950/40 border border-slate-800/50">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">DB Sync</span>
                                        <span className="text-primary-500 font-black">Stable</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="premium-card p-10 overflow-hidden relative">
                            <div className="flex justify-between items-center mb-10">
                                <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Recent Logs</h2>
                                <button className="text-primary-500 text-xs font-black uppercase tracking-widest hover:underline decoration-2 underline-offset-8">Export Data</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b border-slate-800 text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black">
                                            <th className="pb-6">Origin ID</th>
                                            <th className="pb-6">Application</th>
                                            <th className="pb-6">Trigger</th>
                                            <th className="pb-6">Verification</th>
                                            <th className="pb-6 text-right">Moment</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/50">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <tr key={i} className="group hover:bg-white/5 transition-all duration-300">
                                                <td className="py-6 font-mono text-[10px] text-slate-400 group-hover:text-primary-400 transition-colors">
                                                    ANDROID_X_{82730 + i}
                                                </td>
                                                <td className="py-6">
                                                    <span className="text-sm font-black text-white italic group-hover:text-primary-400 transition-colors">
                                                        com.satyainfo.tracky
                                                    </span>
                                                </td>
                                                <td className="py-6">
                                                    <span className="px-3 py-1 rounded-full bg-primary-500/10 text-primary-400 text-[10px] font-black uppercase tracking-widest ring-1 ring-primary-500/20">
                                                        Facebook_Ads
                                                    </span>
                                                </td>
                                                <td className="py-6">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                                        <span className="text-xs font-bold text-slate-400 group-hover:text-emerald-400 transition-colors">Verified</span>
                                                    </div>
                                                </td>
                                                <td className="py-6 text-xs font-bold text-slate-500 text-right group-hover:text-slate-300">
                                                    {i + 2}m ago
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};

export default DashboardPage;
