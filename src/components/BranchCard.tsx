import { Branch } from '../data/branches'

interface BranchCardProps {
    branch: Branch;
    delay?: number;
    className?: string;
}

export default function BranchCard({ branch, delay = 0, className = "" }: BranchCardProps) {
    return (
        <div
            className={`stealth-card p-10 group cursor-default hover:border-sor7ed-yellow/30 flex flex-col justify-between h-full ${className}`}
            style={{ animationDelay: `${delay}ms` }}
        >
            <h3 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-white group-hover:text-sor7ed-yellow transition-colors duration-500 mb-4 leading-[0.85]">
                {branch.name}
            </h3>
            <p className="text-zinc-500 font-medium text-sm leading-relaxed max-w-sm group-hover:text-zinc-300 transition-colors">
                {branch.description}
            </p>
        </div>
    )
}
