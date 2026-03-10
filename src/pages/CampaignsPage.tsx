import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../services/api';
import { Zap, Plus, Trash2, Link as LinkIcon, Smartphone, Loader2, X, Copy, ExternalLink, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AppModel {
    id: number;
    appId: string;
    appName: string;
}

interface CampaignModel {
    id: number;
    name: string;
    campaignId: string;
    app: AppModel;
    mediaSource: string;
    createdAt: string;
}

const CampaignsPage: React.FC = () => {
    const [campaigns, setCampaigns] = useState<CampaignModel[]>([]);
    const [apps, setApps] = useState<AppModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        appId: '',
        mediaSource: 'Organic'
    });

    const fetchAll = async () => {
        try {
            const [campRes, appsRes] = await Promise.all([
                api.get('/campaigns'),
                api.get('/apps')
            ]);
            setCampaigns(campRes.data);
            setApps(appsRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.appId) {
            alert("Please select an app");
            return;
        }
        setIsSubmitting(true);
        try {
            await api.post('/campaigns/create', {
                ...formData,
                appId: parseInt(formData.appId)
            });
            setShowModal(false);
            setFormData({ name: '', appId: '', mediaSource: 'Organic' });
            fetchAll();
        } catch (err: any) {
            alert(err.response?.data || "Creation failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure? This will remove the campaign data.")) return;
        try {
            await api.delete(`/campaigns/${id}`);
            fetchAll();
        } catch (err) {
            alert("Delete failed");
        }
    };

    const generateTrackingLink = (campaign: CampaignModel) => {
        const baseUrl = "http://localhost:8080/api/click";
        return `${baseUrl}?app_id=${campaign.app.appId}&campaign=${encodeURIComponent(campaign.name)}&media_source=${encodeURIComponent(campaign.mediaSource)}`;
    };

    return (
        <div className="flex min-h-screen bg-slate-950 text-slate-200">
            <Sidebar />

            <main className="flex-1 ml-64 p-10 space-y-10">
                <header className="flex justify-between items-center">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-black tracking-tighter text-white italic flex items-center gap-4">
                            <Zap className="w-10 h-10 text-primary-500 not-italic" />
                            Growth Campaigns
                        </h1>
                        <p className="text-slate-500 font-medium tracking-wide">Generate tracking URLs and monitor source performance</p>
                    </div>

                    <button
                        onClick={() => setShowModal(true)}
                        className="primary-btn !w-auto px-8 h-12 shadow-2xl shadow-primary-500/20"
                    >
                        <Plus className="w-5 h-5" />
                        New Campaign
                    </button>
                </header>

                {loading ? (
                    <div className="flex justify-center py-40">
                        <Loader2 className="w-12 h-12 animate-spin text-primary-500" />
                    </div>
                ) : campaigns.length === 0 ? (
                    <div className="premium-card p-24 flex flex-col items-center justify-center text-center space-y-8">
                        <div className="w-24 h-24 bg-slate-800/50 rounded-3xl flex items-center justify-center border border-slate-700/50">
                            <Zap className="w-12 h-12 text-slate-600" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-3xl font-bold text-white tracking-tight">Ready to scale?</h2>
                            <p className="text-slate-500 max-w-sm mx-auto">Create your first campaign to generate high-precision tracking links for your marketing channels.</p>
                        </div>
                        <button
                            onClick={() => setShowModal(true)}
                            className="secondary-btn !w-auto px-10 border-slate-700/50 hover:bg-slate-800 hover:text-primary-400"
                        >
                            Launch Campaign
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {campaigns.map((camp) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={camp.id}
                                className="premium-card group hover:border-primary-500/30 overflow-hidden"
                            >
                                <div className="p-8 flex flex-col md:flex-row gap-8 items-start md:items-center">
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 rounded-2xl bg-primary-500/10 text-primary-500">
                                                <Smartphone className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black text-white italic tracking-tight uppercase group-hover:text-primary-400 transition-colors">
                                                    {camp.name}
                                                </h3>
                                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                                    <Globe className="w-3 h-3 text-indigo-500" />
                                                    Linked to: <span className="text-slate-300">{camp.app.appName}</span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-[0.2em] font-black text-slate-500 pl-1">Target Tracking URL</label>
                                            <div className="flex gap-2">
                                                <div className="flex-1 h-12 bg-slate-950/60 border border-slate-800/50 rounded-xl flex items-center px-4 font-mono text-xs text-primary-400/80 overflow-hidden">
                                                    <LinkIcon className="w-4 h-4 mr-3 text-slate-600" />
                                                    <span className="truncate">{generateTrackingLink(camp)}</span>
                                                </div>
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(generateTrackingLink(camp));
                                                        alert("Link copied!");
                                                    }}
                                                    className="w-12 h-12 flex items-center justify-center bg-slate-800 hover:bg-slate-700 rounded-xl transition-all active:scale-95 border border-slate-700/50"
                                                >
                                                    <Copy className="w-5 h-5 text-white" />
                                                </button>
                                                <a
                                                    href={generateTrackingLink(camp)}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="w-12 h-12 flex items-center justify-center bg-slate-800 hover:bg-slate-700 rounded-xl transition-all border border-slate-700/50"
                                                >
                                                    <ExternalLink className="w-5 h-5 text-white" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-full md:w-auto flex md:flex-col gap-4 items-center">
                                        <div className="flex-1 md:w-32 text-center p-4 bg-slate-950/40 rounded-2xl border border-slate-800/30">
                                            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Source</p>
                                            <p className="text-sm font-bold text-white mt-1 uppercase tracking-tighter">{camp.mediaSource}</p>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(camp.id)}
                                            className="p-3 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                        >
                                            <Trash2 className="w-6 h-6" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Create Modal */}
                <AnimatePresence>
                    {showModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowModal(false)}
                                className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 40 }}
                                className="relative w-full max-w-2xl premium-card p-12 bg-slate-900 overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-500 to-indigo-600" />

                                <div className="flex justify-between items-center mb-10">
                                    <div className="space-y-1">
                                        <h2 className="text-3xl font-black text-white italic">Create Campaign</h2>
                                        <p className="text-slate-500 font-medium">Link a channel to your application</p>
                                    </div>
                                    <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-800 rounded-full transition-all">
                                        <X className="w-7 h-7 text-slate-400" />
                                    </button>
                                </div>

                                <form onSubmit={handleCreate} className="space-y-8">
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] pl-1">Campaign Label</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="e.g. FB_Ads_Summer_2024"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="input-field"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] pl-1">Select Application</label>
                                            <select
                                                required
                                                value={formData.appId}
                                                onChange={(e) => setFormData({ ...formData, appId: e.target.value })}
                                                className="input-field appearance-none"
                                            >
                                                <option value="" className="bg-slate-950">Select an App</option>
                                                {apps.map(app => (
                                                    <option key={app.id} value={app.id} className="bg-slate-950">
                                                        {app.appName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] pl-1">Media Source</label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="e.g. Facebook, Google, TikTok"
                                                value={formData.mediaSource}
                                                onChange={(e) => setFormData({ ...formData, mediaSource: e.target.value })}
                                                className="input-field"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-6 pt-6">
                                        <button
                                            type="button"
                                            onClick={() => setShowModal(false)}
                                            className="secondary-btn h-14"
                                        >
                                            Disregard
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="primary-btn h-14 flex-1"
                                        >
                                            {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Initiate Campaign"}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default CampaignsPage;
