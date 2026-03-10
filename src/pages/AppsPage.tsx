import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../services/api';
import { Smartphone, Plus, Trash2, Key, Globe, Loader2, X, CheckSquare, Copy, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AppModel {
    id: number;
    appId: string;
    appName: string;
    packageName: string;
    sdkKey: string;
    createdAt: string;
}

const AppsPage: React.FC = () => {
    const [apps, setApps] = useState<AppModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [visibleKeys, setVisibleKeys] = useState<Record<number, boolean>>({});

    const [formData, setFormData] = useState({
        appName: '',
        packageName: ''
    });

    const fetchApps = async () => {
        try {
            const res = await api.get('/apps');
            setApps(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApps();
    }, []);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('/apps/register', formData);
            setShowModal(false);
            setFormData({ appName: '', packageName: '' });
            fetchApps();
        } catch (err: any) {
            alert(err.response?.data || "Registration failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure? This will stop tracking for this app.")) return;
        try {
            await api.delete(`/apps/${id}`);
            fetchApps();
        } catch (err) {
            alert("Delete failed");
        }
    };

    const toggleKeyVisibility = (id: number) => {
        setVisibleKeys(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // Simple feedback could be added here
    };

    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-200">
            <Sidebar />

            <main className="flex-1 ml-64 p-10 space-y-8">
                <header className="flex justify-between items-center">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3 italic">
                            <Smartphone className="w-8 h-8 text-primary-500 not-italic" />
                            My Apps
                        </h1>
                        <p className="text-slate-400">Manage your Android applications and SDK keys</p>
                    </div>

                    <button
                        onClick={() => setShowModal(true)}
                        className="primary-btn !w-auto px-6 h-10 gap-2 shadow-lg shadow-primary-500/20"
                    >
                        <Plus className="w-4 h-4" />
                        Register New App
                    </button>
                </header>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
                    </div>
                ) : apps.length === 0 ? (
                    <div className="premium-card p-20 flex flex-col items-center justify-center text-center space-y-6">
                        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center">
                            <Smartphone className="w-10 h-10 text-slate-500" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-white">No Apps Registered</h2>
                            <p className="text-slate-400 max-w-sm">Register your first app to start tracking clicks, installs and custom events.</p>
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-white font-semibold transition-colors border border-slate-700"
                        >
                            Get Started
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                        {apps.map((app) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                key={app.id}
                                className="premium-card group hover:border-primary-500/50 transition-all duration-300 relative overflow-hidden"
                            >
                                {/* Background Decor */}
                                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                                    <Smartphone className="w-32 h-32 text-primary-500" />
                                </div>

                                <div className="p-8 space-y-6">
                                    <div className="flex justify-between items-start">
                                        <div className="flex gap-4">
                                            <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center border border-slate-700 text-primary-500 font-bold text-xl uppercase">
                                                {app.appName.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors uppercase italic tracking-wider">{app.appName}</h3>
                                                <p className="text-sm font-mono text-slate-500 flex items-center gap-1.5 mt-1">
                                                    <Globe className="w-3 h-3 text-indigo-500/50" />
                                                    {app.packageName}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(app.id)}
                                            className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 pl-1">SDK KEY</label>
                                            <div className="flex gap-2">
                                                <div className="flex-1 h-10 bg-slate-950 border border-slate-800 flex items-center px-4 rounded-lg font-mono text-sm text-primary-500/80 group/key overflow-hidden">
                                                    <Key className="w-3.5 h-3.5 mr-2 text-slate-600" />
                                                    <span className="truncate flex-1">
                                                        {visibleKeys[app.id] ? app.sdkKey : "••••••••••••••••••••••••••••"}
                                                    </span>
                                                    <div className="flex items-center gap-2 ml-2">
                                                        <button onClick={() => toggleKeyVisibility(app.id)} className="text-slate-600 hover:text-white transition-colors p-1 rounded-md hover:bg-slate-900">
                                                            {visibleKeys[app.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                        </button>
                                                        <button onClick={() => copyToClipboard(app.sdkKey)} className="text-slate-600 hover:text-white transition-colors p-1 rounded-md hover:bg-slate-900 active:text-primary-500">
                                                            <Copy className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex divide-x divide-slate-800 pt-2 text-center">
                                            <div className="flex-1 py-1">
                                                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">App ID</p>
                                                <p className="text-sm font-bold text-white mt-1 font-mono">#{app.appId}</p>
                                            </div>
                                            <div className="flex-1 py-1">
                                                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Created</p>
                                                <p className="text-sm font-bold text-white mt-1">
                                                    {new Date(app.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>

            {/* Register Modal */}
            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowModal(false)}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg premium-card p-10 bg-slate-900 border border-slate-700 shadow-3xl"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-bold text-white italic">Register New App</h2>
                                <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-white hover:rotate-90 transition-all duration-300">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleRegister} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Application Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. My Awesome Game"
                                        value={formData.appName}
                                        onChange={(e) => setFormData({ ...formData, appName: e.target.value })}
                                        className="input-field"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Package Name (Android Bundle ID)</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. com.company.game"
                                        value={formData.packageName}
                                        onChange={(e) => setFormData({ ...formData, packageName: e.target.value })}
                                        className="input-field font-mono"
                                    />
                                    <p className="text-[10px] text-slate-500 italic pl-1 flex items-center gap-1.5 pt-1">
                                        <CheckSquare className="w-3 h-3 text-primary-500" />
                                        Make sure this matches exactly your Android Studio package name.
                                    </p>
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="secondary-btn border border-slate-700"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="primary-btn flex-1"
                                    >
                                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm Registration"}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AppsPage;
