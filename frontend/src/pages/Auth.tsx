import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Fingerprint, Lock, Mail, ArrowRight, UserPlus, Zap } from 'lucide-react';

interface AuthProps {
    onLogin: (username: string, role: 'admin' | 'user') => void;
}

export function Auth({ onLogin }: AuthProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [clearanceId, setClearanceId] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate authentication delay for effect
        setTimeout(() => {
            if (isLogin && email === 'admin@gmail.com' && password === 'admin@123') {
                setIsLoading(false);
                onLogin('admin', 'admin');
                return;
            }

            const usersStr = localStorage.getItem('smartContainerUsers');
            const users = usersStr ? JSON.parse(usersStr) : [];

            if (!isLogin) {
                // Registration Logic
                if (users.some((u: any) => u.email === email)) {
                    setError('A user with this email is already registered.');
                    setIsLoading(false);
                    return;
                }
                const newUser = { email, password, clearanceId };
                users.push(newUser);
                localStorage.setItem('smartContainerUsers', JSON.stringify(users));

                const displayName = clearanceId.trim() ? clearanceId : email.split('@')[0];
                setIsLoading(false);
                onLogin(displayName, 'user');
            } else {
                // Login Logic
                const user = users.find((u: any) => u.email === email && u.password === password);
                if (!user) {
                    setError('Invalid credentials or unauthorized access.');
                    setIsLoading(false);
                    return;
                }

                const displayName = user.clearanceId?.trim() ? user.clearanceId : user.email.split('@')[0];
                setIsLoading(false);
                onLogin(displayName, 'user');
            }
        }, 800);
    };

    return (
        <div className="min-h-screen bg-background text-text-main flex items-center justify-center relative overflow-hidden bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">

            {/* Background Decorations */}
            <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                className="relative z-10 w-full max-w-md"
            >
                {/* Brand Header */}
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="w-20 h-20 mx-auto bg-primary/10 rounded-3xl border border-primary/30 flex items-center justify-center mb-6 relative group shadow-[0_0_40px_rgba(var(--primary),0.2)]"
                    >
                        <MockShield />
                        <div className="absolute -top-2 -right-2 bg-critical text-white text-[9px] font-black px-2 py-1 rounded-full shadow-lg shadow-critical/50 animate-pulse">CLASSIFIED</div>
                    </motion.div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter mb-2 leading-none">SmartContainer <span className="text-primary">Risk Engine</span></h1>
                    <p className="text-text-muted text-xs font-black uppercase tracking-[0.2em]">Authorized Personnel Only</p>
                </div>

                {/* Form Card */}
                <div className="bg-surface/60 backdrop-blur-2xl border border-surfaceHighlight/50 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
                    <div className="flex bg-background/50 p-1 rounded-2xl mb-8 relative border border-surfaceHighlight/30">
                        {/* Tab Switcher Indicator */}
                        <motion.div
                            className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-primary rounded-xl shadow-[0_0_15px_rgba(var(--primary),0.4)]"
                            initial={false}
                            animate={{ left: isLogin ? '4px' : 'calc(50%)' }}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />

                        <button
                            type="button"
                            onClick={() => { setIsLogin(true); setError(''); }}
                            className={`flex-1 py-3 text-xs font-black uppercase tracking-widest relative z-10 transition-colors ${isLogin ? 'text-white' : 'text-text-muted hover:text-text-main'}`}
                        >
                            Log In
                        </button>
                        <button
                            type="button"
                            onClick={() => { setIsLogin(false); setError(''); }}
                            className={`flex-1 py-3 text-xs font-black uppercase tracking-widest relative z-10 transition-colors ${!isLogin ? 'text-white' : 'text-text-muted hover:text-text-main'}`}
                        >
                            Register
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <AnimatePresence>
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10, height: 0 }}
                                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                                    exit={{ opacity: 0, y: -10, height: 0 }}
                                    className="bg-critical/10 border border-critical/30 rounded-xl p-3 mb-4 flex items-start gap-3 text-critical overflow-hidden"
                                >
                                    <Shield size={16} className="mt-0.5 shrink-0" />
                                    <p className="text-xs font-black uppercase tracking-widest leading-relaxed">{error}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <AnimatePresence mode="wait">
                            {/* Force re-render of form inputs when switching tabs for clean state */}
                            <motion.div
                                key={isLogin ? 'login' : 'register'}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-5"
                            >
                                {!isLogin && (
                                    <div className="space-y-2 relative">
                                        <div className="absolute left-4 top-[1.1rem] text-text-muted"><UserPlus size={18} /></div>
                                        <input
                                            type="text"
                                            placeholder="Clearance ID"
                                            required
                                            value={clearanceId}
                                            onChange={(e) => setClearanceId(e.target.value)}
                                            className="w-full bg-background/50 border border-surfaceHighlight/50 rounded-2xl pl-12 pr-4 py-4 text-sm text-text-main focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-text-muted/50 font-medium"
                                        />
                                    </div>
                                )}
                                <div className="space-y-2 relative">
                                    <div className="absolute left-4 top-[1.1rem] text-text-muted"><Mail size={18} /></div>
                                    <input
                                        type="email"
                                        placeholder="Secure Email Address"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-background/50 border border-surfaceHighlight/50 rounded-2xl pl-12 pr-4 py-4 text-sm text-text-main focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-text-muted/50 font-medium"
                                    />
                                </div>
                                <div className="space-y-2 relative">
                                    <div className="absolute left-4 top-[1.1rem] text-text-muted"><Lock size={18} /></div>
                                    <input
                                        type="password"
                                        placeholder="Encrypted Password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-background/50 border border-surfaceHighlight/50 rounded-2xl pl-12 pr-4 py-4 text-sm text-text-main focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-text-muted/50 font-mono tracking-widest"
                                    />
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-white flex items-center justify-center gap-3 transition-all ${isLoading ? 'bg-primary/50 cursor-wait' : 'bg-primary hover:bg-primaryHighlight shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--primary),0.5)] active:scale-[0.98]'
                                }`}
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                    Authenticating...
                                </>
                            ) : (
                                <>
                                    {isLogin ? 'Initiate Session' : 'Request Security Clearance'}
                                    <ArrowRight size={16} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Security Badge */}
                    <div className="mt-8 pt-6 border-t border-surfaceHighlight/30 flex justify-center items-center gap-2 text-text-muted opacity-60">
                        <Fingerprint size={14} />
                        <span className="text-[9px] font-black uppercase tracking-[0.3em]">End-to-End Encrypted Terminal</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

function MockShield() {
    return (
        <svg
            width={40}
            height={40}
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgb(var(--primary))"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 12l2 2 4-4" />
        </svg>
    );
}
