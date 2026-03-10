import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { BarChart3, TrendingUp, Calendar, Filter, Download as DownloadIcon, RefreshCw } from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
import { motion } from 'framer-motion';
import api from '../services/api';

const data = [
    { name: 'Jan', clicks: 4000, installs: 2400 },
    { name: 'Feb', clicks: 3000, installs: 1398 },
    { name: 'Mar', clicks: 2000, installs: 9800 },
    { name: 'Apr', clicks: 2780, installs: 3908 },
    { name: 'May', clicks: 1890, installs: 4800 },
    { name: 'Jun', clicks: 2390, installs: 3800 },
];

const COLORS = ['#0ea5e9', '#6366f1', '#a855f7', '#ec4899'];

const AnalyticsPage: React.FC = () => {
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
        <div className="flex min-h-screen bg-slate-950 text-slate-200">
            <Sidebar />

            <main className="flex-1 ml-64 p-10 space-y-10">
                <header className="flex justify-between items-center">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic flex items-center gap-4">
                            <BarChart3 className="w-10 h-10 text-primary-500 not-italic" />
                            App Analytics
                        </h1>
                        <p className="text-slate-500 font-medium tracking-wide">Deep dive into your attribution performance metrics</p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={fetchStats}
                            className="w-12 h-12 flex items-center justify-center bg-slate-900 border border-slate-800 rounded-2xl hover:bg-slate-800 transition-all active:scale-95"
                        >
                            <RefreshCw className={`w-5 h-5 text-slate-400 ${loading ? 'animate-spin text-primary-500' : ''}`} />
                        </button>
                        <button className="primary-btn !w-auto px-8 h-12 shadow-2xl shadow-primary-500/10 gap-3">
                            <DownloadIcon className="w-5 h-5" />
                            Export PDF
                        </button>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Chart */}
                    <div className="lg:col-span-2 premium-card p-10 flex flex-col gap-10">
                        <div className="flex justify-between items-center">
                            <div className="space-y-1">
                                <h3 className="text-2xl font-black text-white uppercase tracking-tight underline decoration-primary-500/30 decoration-8 underline-offset-4">Tracking Graph</h3>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Live click and install data</p>
                            </div>
                            <div className="flex gap-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-primary-500 shadow-[0_0_10px_rgba(14,165,233,0.5)]" />
                                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Clicks</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                                    <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Installs</span>
                                </div>
                            </div>
                        </div>

                        <div className="h-[400px] w-full">
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
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#475569', fontSize: 10, fontWeight: 'bold' }}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#475569', fontSize: 10, fontWeight: 'bold' }}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#020617', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', backdropFilter: 'blur(20px)' }}
                                        labelStyle={{ color: '#94a3b8', fontWeight: '800', marginBottom: '8px', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                                        itemStyle={{ fontSize: 12, fontWeight: 700, padding: 0 }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="clicks"
                                        stroke="#0ea5e9"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorClicks)"
                                        dot={{ r: 4, fill: '#0ea5e9', strokeWidth: 2, stroke: '#020617' }}
                                        activeDot={{ r: 6, fill: '#0ea5e9', stroke: '#fff', strokeWidth: 2 }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="installs"
                                        stroke="#6366f1"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorInstalls)"
                                        dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#020617' }}
                                        activeDot={{ r: 6, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Secondary Visuals */}
                    <div className="lg:col-span-1 flex flex-col gap-8">
                        <div className="premium-card p-10 flex-1 flex flex-col justify-between">
                            <div className="space-y-4">
                                <h4 className="text-xl font-black text-white italic tracking-tight">Channel Density</h4>
                                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Install distribution by source</p>
                            </div>

                            <div className="h-[200px] w-full mt-6">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data.slice(0, 4)}>
                                        <Bar dataKey="installs" radius={[8, 8, 8, 8]}>
                                            {data.slice(0, 4).map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} fillOpacity={0.8} />
                                            ))}
                                        </Bar>
                                        <Tooltip cursor={{ fill: 'transparent' }} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="space-y-3 mt-8">
                                {['Facebook', 'Organic', 'TikTok', 'Google'].map((source, i) => (
                                    <div key={source} className="flex justify-between items-center text-xs">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                                            <span className="font-bold text-slate-400 uppercase tracking-widest">{source}</span>
                                        </div>
                                        <span className="font-black text-white">{25 - (i * 4)}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="premium-card p-10 bg-gradient-to-br from-primary-500/10 to-transparent border-primary-500/20">
                            <TrendingUp className="w-8 h-8 text-primary-500 mb-6" />
                            <h4 className="text-xl font-black text-white italic">Conversion Lift</h4>
                            <p className="text-4xl font-black text-white mt-4">{stats?.conversionRate || '0.0'}%</p>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                                <span className="text-emerald-500">↑ 12%</span> vs last month
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AnalyticsPage;
