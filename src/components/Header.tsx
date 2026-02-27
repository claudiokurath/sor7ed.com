import { Link } from 'react-router-dom'

const Header = () => {
    return (
        <header className="bg-black border-b border-gray-800 sticky top-0 z-50">
            <nav className="container mx-auto px-6 py-4">
                <div className="flex items-center justify-between">
                    <Link to="/">
                        <img src="/logo.png" alt="SOR7ED" className="h-8 w-auto object-contain opacity-90" />
                    </Link>
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-[10px] font-anton uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors">
                            Home
                        </Link>
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
                    <Link
                        to="/tools"
                        className="bg-sor7ed-yellow text-black px-6 py-2 rounded-full font-anton uppercase text-[10px] tracking-widest hover:bg-yellow-400 hover:scale-105 transition-all shadow-[0_0_20px_rgba(245,198,20,0.2)]"
                    >
                        Try Free Tools
                    </Link>
                </div>
            </nav>
        </header>
    )
}

export default Header
