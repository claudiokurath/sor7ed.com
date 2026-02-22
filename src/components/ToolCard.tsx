interface Tool {
    id: string
    emoji: string
    name: string
    description: string
    whatsappKeyword: string
    category: string
}

interface ToolCardProps {
    tool: Tool
}

const ToolCard = ({ tool }: ToolCardProps) => {
    const whatsappUrl = `https://wa.me/447360277713?text=${encodeURIComponent(tool.whatsappKeyword)}`

    return (
        <div className="stealth-card p-10 group hover:border-sor7ed-yellow/30 transition-all duration-500">
            <div className="text-4xl mb-8 grayscale group-hover:grayscale-0 transition-all duration-500 opacity-50 group-hover:opacity-100">{tool.emoji}</div>
            <h3 className="text-xl font-bold mb-4 text-white uppercase tracking-widest">{tool.name}</h3>
            <p className="text-zinc-400 text-sm mb-8 font-light leading-relaxed">{tool.description}</p>
            <div className="flex justify-end pt-6 border-t border-white/5">
                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-mono-headline text-zinc-500 hover:text-sor7ed-yellow uppercase tracking-[0.2em] transition-colors"
                >
                    Deploy to Phone →
                </a>
            </div>
        </div>
    )
}

export default ToolCard
