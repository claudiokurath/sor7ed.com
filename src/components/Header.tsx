import { Link } from 'react-router-dom'

interface HeaderProps {
    onOpenAuth: (mode?: 'signup' | 'signin') => void
}

const Header = ({ onOpenAuth }: HeaderProps) => {
    return (
        <header className="bg-black border-b border-white/5 sticky top-0 z-50">
            <nav className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-8">
                        <Link to="/tools" className="text-[10px] font-anton uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors">
                            Tools
                        </Link>
                        <Link to="/blog" className="text-[10px] font-anton uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors">
                            Blog
                        </Link>
                        <Link to="/about" className="text-[10px] font-anton uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors">
                            About
                        </Link>
                        <Link to="/vault" className="text-[10px] font-anton uppercase tracking-[0.2em] text-zinc-400 hover:text-sor7ed-yellow transition-colors border border-white/5 bg-white/[0.03] px-4 py-2 rounded-lg">
                            Vault
                        </Link>
                    </div>

                    <div className="flex items-center space-x-6">
                        <button
                            onClick={() => onOpenAuth('signin')}
                            className="text-[10px] font-anton uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => onOpenAuth('signup')}
                            className="bg-sor7ed-yellow text-black px-8 py-3 rounded-full font-anton uppercase text-[11px] tracking-widest hover:bg-yellow-400 hover:scale-105 transition-all shadow-[0_0_20px_rgba(245,198,20,0.1)]"
                        >
                            Start Operating
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    )
}

export default Header
