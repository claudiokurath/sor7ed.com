import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

interface Protocol {
    id: string
    title: string
    branch: string
    trigger: string
    template: string
}

const Vault = () => {
    const [isLoading, setIsLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const [protocols, setProtocols] = useState<Protocol[]>([])
    const [email, setEmail] = useState('')
    const [isSending, setIsSending] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const urlToken = urlParams.get('token')

        if (urlToken) {
            localStorage.setItem('sor7ed_vault_token', urlToken)
            window.history.replaceState({}, document.title, window.location.pathname)
            fetchVaultContent(urlToken)
        } else {
            const token = localStorage.getItem('sor7ed_vault_token')
            if (token) {
                fetchVaultContent(token)
            } else {
                setIsLoading(false)
            }
        }
    }, [])

    const fetchVaultContent = async (token: string) => {
        setIsLoading(true)
        try {
            const res = await fetch(`/api/vault/content?token=${token}`)
            if (res.ok) {
                const data = await res.json()
                setUser(data.user)
                setProtocols(data.protocols)
            } else {
                localStorage.removeItem('sor7ed_vault_token')
            }
        } catch (err) {
            console.error('Failed to fetch vault content')
        } finally {
            setIsLoading(false)
        }
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSending(true)
        setMessage(null)

        try {
            const res = await fetch('/api/vault/send-link', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            })

            if (res.ok) {
                setMessage({ type: 'success', text: 'Magic link sent to your WhatsApp!' })
            } else {
                const data = await res.json()
                setMessage({ type: 'error', text: data.error || 'Check your details and try again.' })
            }
        } catch (err) {
            setMessage({ type: 'error', text: 'Something went wrong. Please try again later.' })
        } finally {
            setIsSending(false)
        }
    }

    if (isLoading) {
        return (
            <div className="bg-[#050505] min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-sor7ed-yellow border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <div className="bg-[#050505] min-h-screen bg-grid relative overflow-hidden text-white font-sans">
            {/* Full-Screen Background Video */}
            <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
                <video autoPlay muted loop playsInline className="w-full h-full object-cover opacity-20 filter grayscale scale-105">
                    <source src="/Intro.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
            </div>

            {user ? (
                <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
                    <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8 animate-in fade-in">
                        <div>
                            <span className="text-[10px] font-mono-headline text-sor7ed-yellow uppercase tracking-[0.4em] block mb-4">// VAULT_ACCESS_GRANTED</span>
                            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">Welcome, <span className="text-sor7ed-yellow">{user.name}</span></h1>
                            <p className="text-zinc-500 mt-4 font-light tracking-wide max-w-xl">Your secure repository of neural protocols and architectural frameworks.</p>
                        </div>
                        <button
                            onClick={() => { localStorage.removeItem('sor7ed_vault_token'); window.location.reload(); }}
                            className="px-8 py-3 text-[10px] font-black text-zinc-500 hover:text-white uppercase tracking-[0.2em] border border-white/10 rounded-full transition-all"
                        >
                            De-authorize Session
                        </button>
                    </header>

                    {protocols.length === 0 ? (
                        <div className="stealth-card p-20 text-center animate-in zoom-in">
                            <p className="text-zinc-500 mb-8 font-light tracking-widest uppercase text-xs">// Repository Empty</p>
                            <Link to="/tools" className="btn-primary">Initialize Tools</Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {protocols.map((protocol, i) => (
                                <div key={protocol.id} className="stealth-card p-10 group animate-in fade-in slide-in-from-bottom-20" style={{ animationDelay: `${i * 100}ms` }}>
                                    <div className="flex justify-between items-start mb-8">
                                        <span className="text-[9px] font-mono-headline text-zinc-600 uppercase tracking-[0.3em]">// {protocol.branch}</span>
                                        <div className="w-10 h-1 bg-sor7ed-yellow/20 rounded-full group-hover:bg-sor7ed-yellow/40 transition-colors"></div>
                                    </div>
                                    <h3 className="text-2xl font-black text-white mb-8 group-hover:text-sor7ed-yellow transition-colors uppercase tracking-tight leading-none">
                                        {protocol.title}
                                    </h3>
                                    <div className="space-y-4">
                                        <Link
                                            to={`/blog/${encodeURIComponent(protocol.title)}`}
                                            className="block w-full text-center border border-white/10 bg-white/5 text-white py-4 rounded-xl hover:bg-white/10 transition-all text-xs font-bold uppercase tracking-widest"
                                        >
                                            View Analysis
                                        </Link>
                                        <button
                                            onClick={() => window.open(`https://wa.me/447360277713?text=${encodeURIComponent(protocol.trigger)}`, '_blank')}
                                            className="block w-full text-center border border-sor7ed-yellow/20 text-sor7ed-yellow py-4 rounded-xl hover:bg-sor7ed-yellow/10 transition-all text-xs font-bold uppercase tracking-widest"
                                        >
                                            Re-deploy Protocol
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <section className="mt-40 animate-in fade-in delay-1000">
                        <div className="stealth-card p-12 md:p-16 border-sor7ed-yellow/20 bg-gradient-to-br from-sor7ed-yellow/5 to-transparent">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                                <div className="max-w-xl text-center md:text-left">
                                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">The Evolution Continues.</h2>
                                    <p className="text-zinc-400 font-light leading-relaxed">Our interactive lab tools are migrating into a high-performance neural dashboard. Beta access is active.</p>
                                </div>
                                <Link to="/tools" className="btn-primary whitespace-nowrap">Explore Beta Tools</Link>
                            </div>
                        </div>
                    </section>
                </div>
            ) : (
                <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
                    <div className="w-full max-w-md animate-in zoom-in">
                        <div className="text-center mb-16">
                            <img src="/logo.png" className="w-48 mx-auto mb-12 opacity-80" />
                            <h1 className="text-2xl font-black text-white uppercase tracking-[0.3em] mb-4">The Vault</h1>
                            <p className="text-zinc-600 font-mono-headline text-[10px] uppercase tracking-[0.2em]">Authentication Required</p>
                        </div>

                        <div className="stealth-card p-10">
                            <form onSubmit={handleLogin} className="space-y-8">
                                <div>
                                    <label className="block text-[10px] font-mono-headline text-zinc-500 mb-3 uppercase tracking-widest">Registry ID (Email)</label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-sor7ed-yellow focus:outline-none transition-all font-light"
                                        placeholder="Enter registered email..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSending}
                                    className="w-full bg-white text-black font-black py-5 rounded-xl hover:bg-sor7ed-yellow transition-all disabled:opacity-50 uppercase tracking-[0.3em] text-[10px] shadow-[0_0_30px_rgba(255,255,255,0.05)]"
                                >
                                    {isSending ? 'Verifying...' : 'Initialize Access'}
                                </button>

                                {message && (
                                    <div className={`p-4 rounded-xl text-[10px] font-mono-headline uppercase tracking-widest text-center ${message.type === 'success'
                                        ? 'bg-green-500/10 border border-green-500/20 text-green-400'
                                        : 'bg-red-500/10 border border-red-500/20 text-red-400'
                                        }`}>
                                        {message.text}
                                    </div>
                                )}
                            </form>
                        </div>
                        <p className="text-center text-[10px] font-mono-headline text-zinc-700 mt-12 uppercase tracking-widest">
                            No credentials? <Link to="/" className="text-zinc-500 hover:text-white transition-colors">Return to Surface</Link>
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Vault
