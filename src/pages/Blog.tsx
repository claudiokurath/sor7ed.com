export default function Blog() {
    return (
        <div className="pt-32 pb-20 px-6">
            <div className="container mx-auto">
                <h1 className="section-title text-center">Insights & Systems</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
                    {[1, 2].map((i) => (
                        <div key={i} className="glass p-8 rounded-2xl card-hover">
                            <span className="text-sor7ed-yellow text-sm font-bold uppercase tracking-widest">Growth</span>
                            <h3 className="text-2xl font-bold text-white mt-4 mb-4">Mastering Executive Shine</h3>
                            <p className="text-zinc-400">A deep dive into how minimalism can transform your cognitive load.</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
