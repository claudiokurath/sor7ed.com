export default function Tools() {
    return (
        <div className="pt-32 pb-20 px-6">
            <div className="container mx-auto">
                <h1 className="section-title text-center">ADHD-Friendly Tools</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                    {['Executive Function', 'Time Management', 'Sensory Tools'].map((tool) => (
                        <div key={tool} className="glass p-8 rounded-2xl card-hover">
                            <h3 className="text-2xl font-bold text-sor7ed-yellow mb-4">{tool}</h3>
                            <p className="text-zinc-400">Streamline your workflow with our premium {tool.toLowerCase()} solutions.</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
