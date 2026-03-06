import React, { useState, useRef, useEffect } from 'react';
import { Sidebar, Subpage } from './components/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Upload } from './pages/Upload';
import { PredictionsTable } from './pages/PredictionsTable';
import { Analytics } from './pages/Analytics';
import { ExplainableAI } from './components/ExplainableAI';
import { Architecture } from './components/Architecture';
import { Auth } from './pages/Auth';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, User, LogOut, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useAppContext } from './context/AppContext';

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('Agent');
    const [userRole, setUserRole] = useState<'admin' | 'user'>('user');
    const [currentTab, setCurrentTab] = useState<Subpage>('dashboard');
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { predictions } = useAppContext();

    const notificationsRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    // Click-away listener
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const recentCriticals = predictions.filter(p => p.Risk_Level === 'Critical').slice(0, 3);

    if (!isAuthenticated) {
        return <Auth onLogin={(name, role) => {
            setUsername(name);
            setUserRole(role);
            setIsAuthenticated(true);
        }} />;
    }

    const renderContent = () => {
        switch (currentTab) {
            case 'upload': return <Upload onUploadSuccess={() => setCurrentTab('dashboard')} />;
            case 'dashboard': return <Dashboard onNavigateUpload={() => setCurrentTab('upload')} />;
            case 'predictions': return <PredictionsTable />;
            case 'analytics': return <Analytics />;
            case 'explainable': return <ExplainableAI />;
            case 'architecture': return userRole === 'admin' ? <Architecture /> : <Dashboard onNavigateUpload={() => setCurrentTab('upload')} />;
            default: return <div className="text-text-muted p-8 border border-dashed border-surfaceHighlight/50 rounded-xl">Target node offline or inaccessible.</div>;
        }
    };

    return (
        <div className="flex min-h-screen bg-background text-text-main overflow-hidden transition-colors duration-300">
            {/* Sidebar Navigation */}
            <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} userRole={userRole} />

            {/* Main Content Area */}
            <div className="ml-64 flex-1 flex flex-col h-screen relative">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />

                {/* Top Header */}
                <header className="h-20 px-8 flex items-center justify-between border-b border-surfaceHighlight/30 bg-surface/50 backdrop-blur-md z-30 sticky top-0">
                    <div className="relative group">
                        <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted transition-colors group-focus-within:text-primary" />
                        <input
                            type="text"
                            placeholder="Universal search: Container ID, Origin, Manifest..."
                            className="bg-background/50 border border-surfaceHighlight/40 rounded-xl pl-10 pr-4 py-2.5 text-sm text-text-main focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 w-80 transition-all duration-300 placeholder:text-text-muted/50"
                        />
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="relative" ref={notificationsRef}>
                            <button
                                onClick={() => { setIsNotificationsOpen(!isNotificationsOpen); setIsProfileOpen(false); }}
                                className={`relative text-text-muted hover:text-primary transition-all p-2 rounded-lg hover:bg-primary/10 ${isNotificationsOpen ? 'text-primary bg-primary/10' : ''}`}
                            >
                                <Bell size={20} />
                                {recentCriticals.length > 0 && (
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-critical rounded-full border-2 border-surface shadow-[0_0_8px_rgba(var(--critical),0.6)] animate-pulse"></span>
                                )}
                            </button>

                            <AnimatePresence>
                                {isNotificationsOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 top-full mt-2 w-80 bg-surface/90 backdrop-blur-xl border border-surfaceHighlight/50 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden"
                                    >
                                        <div className="px-4 py-3 border-b border-surfaceHighlight/30 flex justify-between items-center bg-background/50">
                                            <span className="text-xs font-black uppercase tracking-widest text-text-main">Tactical Alerts</span>
                                            <span className="text-[10px] font-bold text-critical bg-critical/10 px-2 py-0.5 rounded-full">{recentCriticals.length} Critical</span>
                                        </div>
                                        <div className="max-h-80 overflow-y-auto">
                                            {recentCriticals.length === 0 ? (
                                                <div className="px-4 py-8 text-center text-text-muted">
                                                    <ShieldAlert size={24} className="mx-auto mb-2 opacity-20" />
                                                    <p className="text-xs uppercase tracking-widest font-bold">No High-Risk Assets</p>
                                                </div>
                                            ) : (
                                                recentCriticals.map((alert, idx) => (
                                                    <div key={idx} className="px-4 py-3 border-b border-surfaceHighlight/20 hover:bg-surfaceHighlight/30 transition-colors cursor-pointer group">
                                                        <div className="flex items-start gap-3">
                                                            <div className="mt-0.5 p-1.5 rounded-lg bg-critical/10 text-critical group-hover:scale-110 transition-transform"><AlertTriangle size={14} /></div>
                                                            <div>
                                                                <p className="text-sm font-bold text-text-main tracking-tight leading-tight mb-1">{alert.Container_ID}</p>
                                                                <p className="text-[10px] text-text-muted font-medium leading-relaxed line-clamp-2">{alert.Explanation_Summary}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                        <div className="px-4 py-2 border-t border-surfaceHighlight/30 bg-background/30 text-center">
                                            <button
                                                onClick={() => { setCurrentTab('predictions'); setIsNotificationsOpen(false); }}
                                                className="text-[10px] font-black uppercase tracking-widest text-primary hover:text-primaryHighlight transition-colors"
                                            >
                                                View All Threat Intelligence
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <div className="relative" ref={profileRef}>
                            <div
                                onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotificationsOpen(false); }}
                                className="flex items-center gap-4 pl-6 border-l border-surfaceHighlight/30 cursor-pointer group"
                            >
                                <div className="text-right flex flex-col justify-center">
                                    <span className="text-sm font-black uppercase tracking-tighter leading-none mb-1 group-hover:text-primary transition-colors">{username}</span>
                                    <span className={`text-[10px] font-black tracking-widest uppercase opacity-80 group-hover:opacity-100 transition-opacity ${userRole === 'admin' ? 'text-critical' : 'text-primary'}`}>
                                        {userRole === 'admin' ? 'Admin Protocol' : 'Customs Protocol'}
                                    </span>
                                </div>
                                <div className={`w-10 h-10 rounded-xl bg-surface border flex items-center justify-center relative overflow-hidden transition-all shadow-lg ${isProfileOpen ? 'border-primary shadow-[0_0_15px_rgba(var(--primary),0.3)]' : 'border-surfaceHighlight/50 group-hover:border-primary/50'}`}>
                                    <div className={`absolute inset-0 bg-gradient-to-tr from-primary/10 to-purple-500/10 transition-opacity ${isProfileOpen ? 'opacity-100' : 'opacity-50 group-hover:opacity-100'}`}></div>
                                    <User size={18} className="text-text-main relative z-10" />
                                </div>
                            </div>

                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute right-0 top-full mt-4 w-56 bg-surface/90 backdrop-blur-xl border border-surfaceHighlight/50 rounded-2xl shadow-2xl py-2 z-50 overflow-hidden"
                                    >
                                        <div className="px-4 py-3 border-b border-surfaceHighlight/30 mb-1">
                                            <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-1">Logged in as</p>
                                            <p className="text-sm font-black text-text-main uppercase tracking-tighter truncate">{username}</p>
                                        </div>
                                        <div className="px-2">
                                            <button
                                                onClick={() => setIsAuthenticated(false)}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-critical hover:bg-critical/10 hover:shadow-[0_0_10px_rgba(var(--critical),0.1)] transition-all group group-active:scale-95"
                                            >
                                                <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
                                                <span className="text-xs font-black uppercase tracking-widest">Disconnect</span>
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto p-8 relative z-20">
                    <div className="max-w-7xl mx-auto pb-12">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                            >
                                {renderContent()}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>
            </div>
        </div>
    );
}
