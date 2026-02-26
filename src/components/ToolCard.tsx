import { useNavigate } from 'react-router-dom'
import { useVaultSession } from '../hooks/useVaultSession'

interface Tool {
    id: string
    emoji: string
    name: string
    description: string
    whatsappKeyword: string
    category: string
    coverImage?: string
}

interface ToolCardProps {
    tool: Tool
}

const ToolCard = ({ tool }: ToolCardProps) => {
    const navigate = useNavigate()
    const { isLoggedIn } = useVaultSession()
    const whatsappUrl = `https://wa.me/447360277713?text=${encodeURIComponent(tool.whatsappKeyword || tool.name)}`

    const handleClick = () => {
        if (isLoggedIn) {
            window.open(whatsappUrl, '_blank')
        } else {
            navigate('/vault')
        }
    }

    return (
        <div
            onClick={handleClick}
            className="stealth-card group hover:border-sor7ed-yellow/30 transition-all duration-500 cursor-pointer overflow-hidden p-0 h-full flex flex-col"
        >
            <div className="relative h-48 w-full bg-zinc-900 flex items-center justify-center">
                {tool.coverImage ? (
                    <img
                        src={tool.coverImage}
                        alt={tool.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-all duration-1000"
                    />
                ) : (
                    <div className="text-4xl grayscale group-hover:grayscale-0 transition-all duration-500 opacity-50 group-hover:opacity-100">
                        {tool.emoji || '🛠️'}
                    </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />
            </div>

            <div className="p-10 flex-grow flex flex-col">
                <h3 className="text-xl font-bold mb-4 text-white uppercase tracking-widest">{tool.name}</h3>
                <p className="text-zinc-400 text-sm mb-8 font-light leading-relaxed flex-grow">{tool.description}</p>
                <div className="flex justify-end pt-6 border-t border-white/5">
                    <span className="text-[10px] font-mono-headline text-zinc-500 group-hover:text-sor7ed-yellow uppercase tracking-[0.2em] transition-colors">
                        {isLoggedIn ? 'Deploy to Phone →' : 'Members Only →'}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default ToolCard
