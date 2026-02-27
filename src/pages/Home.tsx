import { useState } from 'react'
import { branches } from '../data/branches'
import { useNotionData } from '../hooks/useNotionData'
import BranchCard from '../components/BranchCard'
import AuthModal from '../components/AuthModal'
import ToolCard from '../components/ToolCard'
import BlogCard from '../components/BlogCard'

export default function Home() {
    const [activeFaq, setActiveFaq] = useState<number | null>(null)
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

    // Fetch tools and articles from API routes
    const { data: dynamicTools, loading: toolsLoading } = useNotionData<any>('/api/tools')
    const { data: dynamicArticles, loading: articlesLoading } = useNotionData<any>('/api/articles')

    const faqs = [
        { q: "Is this an app?", a: "No. SOR7ED is a web-based system that connects directly to WhatsApp. No downloads, no updates, no friction." },
        { q: "Is it tailored for ADHD?", a: "Yes. Every tool is built on neuro-architecture principles designed specifically for executive dysfunction, time blindness, and sensory overload." },
        { q: "Does it work outside the UK?", a: "Yes. Our tools are accessible globally via the web. The WhatsApp deployment works on any number with international texting." },
        { q: "Is it really free?", a: "The core interactive Lab tools are free to use on the web. Premium WhatsApp integration and advanced protocols may require credits." },
        { q: "Can I use it with medication?", a: "Absolutely. SOR7ED is a behavioural scaffold that complements medication, therapy, or coaching." }
    ]

    return (
        <div className="bg-black text-white font-roboto h-screen overflow-y-auto snap-y snap-mandatory scroll-smooth relative">
            <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

            {/* Background elements (Fixed) */}
            <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
                <div className="absolute inset-0 bg-grid opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-900/10 to-black" />
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-sor7ed-yellow/5 blur-[150px] animate-stealth-glow rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/5 blur-[120px] rounded-full" />
            </div>

            {/* Hero Section */}
            <section id="hero" className="relative h-screen min-h-screen flex flex-col justify-center items-center z-20 px-4 md:px-6 text-center snap-start py-20">
                <div className="animate-in fade-in zoom-in duration-1000 mb-8 md:mb-16">
                    <img src="/logo.png" alt="SOR7ED" className="w-64 md:w-[500px] h-auto object-contain drop-shadow-[0_0_50px_rgba(255,255,255,0.08)] opacity-95" />
                </div>

                <div className="max-w-6xl mx-auto space-y-8 animate-in slide-in-from-bottom-20 duration-1000 delay-300 fill-mode-both">
                    <h1 className="text-4xl md:text-8xl font-anton font-normal uppercase tracking-tighter leading-none text-white">
                        ADHD-FRIENDLY TOOLS — <br />
                        <span className="text-sor7ed-yellow">DELIVERED TO YOUR PHONE.</span>
                    </h1>

                    <p className="text-zinc-500 text-base md:text-xl font-light leading-relaxed max-w-2xl mx-auto">
                        Quick interactive tools for executive function, time blindness, and sensory overwhelm.
                        No complex apps. Just the support you need, exactly when you need it.
                    </p>

                    <div className="pt-4 md:pt-8">
                        <button
                            onClick={() => setIsAuthModalOpen(true)}
                            className="bg-sor7ed-yellow text-black font-anton font-normal uppercase tracking-[0.3em] text-[10px] md:text-xs py-5 md:py-6 px-12 md:px-16 rounded-full hover:bg-yellow-400 hover:scale-110 transition-all duration-500 shadow-[0_0_40px_rgba(245,198,20,0.2)]"
                        >
                            Start Operating
                        </button>
                    </div>

                    {/* Integrated 3 Steps */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 pt-12 md:pt-20 w-full">
                        <div className="stealth-card p-6 md:p-8 space-y-4 bg-white/5 border-white/5 backdrop-blur-md">
                            <div className="text-sor7ed-yellow text-[9px] font-mono-headline uppercase tracking-widest">// STEP_01</div>
                            <h3 className="text-base md:text-lg font-anton uppercase text-white leading-none">Daily Micro-Tools</h3>
                            <p className="text-zinc-500 text-[11px] md:text-sm font-light leading-relaxed">
                                Functional support for executive function and neural regulation.
                            </p>
                        </div>
                        <div className="stealth-card p-6 md:p-8 space-y-4 bg-white/5 border-white/5 backdrop-blur-md">
                            <div className="text-sor7ed-yellow text-[9px] font-mono-headline uppercase tracking-widest">// STEP_02</div>
                            <h3 className="text-base md:text-lg font-anton uppercase text-white leading-none">No Apps. Just WhatsApp.</h3>
                            <p className="text-zinc-500 text-[11px] md:text-sm font-light leading-relaxed">
                                Respond directly to helpful prompts. No complex dashboards to manage.
                            </p>
                        </div>
                        <div className="stealth-card p-6 md:p-8 space-y-4 bg-white/5 border-white/5 backdrop-blur-md">
                            <div className="text-sor7ed-yellow text-[9px] font-mono-headline uppercase tracking-widest">// STEP_03</div>
                            <h3 className="text-base md:text-lg font-anton uppercase text-white leading-none">Neural Scaffolding</h3>
                            <p className="text-zinc-500 text-[11px] md:text-sm font-light leading-relaxed">
                                Designed to bypass friction and keep you operating at peak capacity.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <main className="relative z-10">
                {/* Why Different - Moved Up */}
                <section id="why-different" className="h-screen min-h-screen flex flex-col justify-center border-y border-white/5 bg-sor7ed-yellow/[0.01] snap-start">
                    <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                        <div className="text-center mb-16">
                            <h2 className="section-title">
                                <span className="title-white">WHY IT'S</span> <span className="title-yellow">DIFFERENT.</span>
                            </h2>
                        </div>
                        <div className="max-w-4xl mx-auto space-y-6">
                            <div className="flex items-start gap-8 p-8 stealth-card bg-white/5">
                                <span className="text-red-500 font-anton text-3xl">🗙</span>
                                <div>
                                    <h4 className="text-white font-anton uppercase text-lg mb-2">Traditional Apps</h4>
                                    <p className="text-zinc-500 font-light">Require high executive function to setup and remember. Often become another source of overwhelm.</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-8 p-8 stealth-card border-sor7ed-yellow/20 bg-sor7ed-yellow/5">
                                <span className="text-sor7ed-yellow font-anton text-3xl">✔</span>
                                <div>
                                    <h4 className="text-sor7ed-yellow font-anton uppercase text-lg mb-2">The SOR7ED System</h4>
                                    <p className="text-zinc-400 font-light">Zero-friction deployment. Tools find YOU. No cognitive load wasted on "using the tool" itself.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 7 Vectors (Branches) */}
                <section id="vectors" className="h-screen min-h-screen flex flex-col justify-center items-center snap-start py-24">
                    <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                        <div className="text-center mb-16 max-w-2xl mx-auto">
                            <span className="text-[10px] font-mono-headline text-zinc-500 uppercase tracking-[0.4em] block mb-4 animate-in slide-in-from-bottom-20">// THE_ARCHITECTURE</span>
                            <h2 className="text-6xl md:text-8xl font-anton font-normal uppercase tracking-tighter mb-8 leading-none">
                                THE <span className="text-sor7ed-yellow">ARCHITECTURE.</span>
                            </h2>
                            <p className="text-zinc-500 font-light leading-relaxed">
                                We build a behavioural scaffold. Each vector addresses a core friction point in the neurodivergent experience.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                            {[
                                ...branches.filter(b => b.id !== 'connection' && b.id !== 'impression'),
                                ...branches.filter(b => b.id === 'connection' || b.id === 'impression')
                            ].map((branch, i) => {
                                const span = (i < 2 || i >= 5) ? 'md:col-span-3' : 'md:col-span-2'
                                return (
                                    <div key={branch.name} className={span}>
                                        <BranchCard branch={branch} />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </section>

                {/* Labs (Tools) */}
                <section id="lab" className="h-screen min-h-screen flex flex-col justify-center py-40 bg-white/[0.02] border-y border-white/5 snap-start">
                    <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                        <div className="text-center mb-20">
                            <h2 className="section-title justify-center gap-4 flex mb-6">
                                <span className="title-white">THE</span> <span className="title-yellow">LAB.</span>
                            </h2>
                            <p className="text-zinc-500 font-light leading-relaxed max-w-xl mx-auto">
                                Functional micro-tools designed for immediate relief. From dopamine regulation to impulse filtering.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {toolsLoading ? (
                                <p className="col-span-full text-center text-zinc-500 animate-pulse uppercase tracking-[0.5em] text-xs">Accessing Toolkits...</p>
                            ) : dynamicTools.slice(0, 3).map((tool: any) => (
                                <ToolCard key={tool.id} tool={tool} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Insights (Articles) */}
                <section id="blog" className="h-screen min-h-screen flex flex-col justify-center py-40 snap-start">
                    <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                        <h2 className="section-title text-center mb-24">
                            <span className="title-white">THE</span> <span className="title-yellow">INSIGHTS.</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {articlesLoading ? (
                                <p className="col-span-full text-center text-zinc-500 animate-pulse uppercase tracking-[0.5em] text-xs">Syncing Knowledge Base...</p>
                            ) : dynamicArticles.slice(0, 3).map((post: any) => (
                                <BlogCard key={post.id} article={post} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section id="faq" className="h-screen min-h-screen flex flex-col justify-center py-40 border-t border-white/5 snap-start">
                    <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                        <h2 className="section-title text-center mb-16">
                            <span className="title-white">SYSTEM</span> <span className="title-yellow">FAQ.</span>
                        </h2>
                        <div className="space-y-4">
                            {faqs.map((faq, i) => (
                                <div key={i} className={`stealth-card overflow-hidden transition-all duration-300 ${activeFaq === i ? 'border-sor7ed-yellow shadow-[0_0_30px_rgba(245,198,20,0.1)]' : 'border-white/5'}`}>
                                    <button
                                        onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                                        className="w-full text-left p-6 md:p-8 flex justify-between items-center group"
                                    >
                                        <span className={`text-xs md:text-sm font-anton uppercase tracking-widest transition-colors ${activeFaq === i ? 'text-sor7ed-yellow' : 'text-zinc-400 group-hover:text-white'}`}>
                                            {faq.q}
                                        </span>
                                        <span className={`text-xl transition-transform ${activeFaq === i ? 'rotate-45 text-sor7ed-yellow' : 'text-zinc-500'}`}>+</span>
                                    </button>
                                    {activeFaq === i && (
                                        <div className="px-6 md:px-8 pb-8 text-zinc-400 text-sm leading-relaxed font-light border-t border-white/5 pt-6 animate-in fade-in duration-500">
                                            {faq.a}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Footer CTA */}
                <section className="h-screen min-h-screen flex flex-col justify-center py-60 border-t border-sor7ed-yellow/10 text-center snap-start">
                    <div className="container mx-auto px-4 md:px-6 max-w-7xl">
                        <h2 className="text-6xl md:text-8xl lg:text-9xl font-anton font-normal uppercase tracking-tighter mb-16 leading-none">
                            STOP STRUGGLING. <br /><span className="text-sor7ed-yellow">START OPERATING.</span>
                        </h2>
                        <button
                            onClick={() => setIsAuthModalOpen(true)}
                            className="inline-block bg-sor7ed-yellow text-black font-anton font-normal uppercase tracking-[0.3em] text-[10px] md:text-xs py-5 md:py-6 px-12 md:px-16 rounded-full hover:bg-yellow-400 hover:scale-110 transition-all duration-500 shadow-[0_0_40px_rgba(245,198,20,0.2)]"
                        >
                            Initialize Connection
                        </button>

                        <div className="mt-20 pt-20 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-12 text-zinc-600 font-mono-headline text-[10px] uppercase tracking-[0.4em]">
                            <div className="space-y-4">
                                <p>// DIRECT_LINE</p>
                                <a href="tel:+447360277713" className="text-zinc-400 hover:text-sor7ed-yellow transition-colors">+44 7360 277713</a>
                            </div>
                            <div className="space-y-4">
                                <p>// SECURE_CHANNEL</p>
                                <a href="mailto:hello@sor7ed.com" className="text-zinc-400 hover:text-sor7ed-yellow transition-colors">HELLO@SOR7ED.COM</a>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}

