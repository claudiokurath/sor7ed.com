import { branches } from '../data/branches'
type Branch = typeof branches[number]

interface BranchCardProps {
    branch: Branch;
    delay?: number;
    className?: string;
}

export default function BranchCard({ branch, delay = 0, className = "" }: BranchCardProps) {
    return (
        <div
            className={`bg-sor7ed-yellow rounded-2xl p-6 md:p-10 group cursor-default transition-transform duration-500 hover:-translate-y-2 flex flex-col justify-between h-full ${className}`}
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="flex justify-between items-start mb-4 md:mb-8">
                <h3 className="text-3xl md:text-5xl font-anton font-normal uppercase tracking-tighter text-black leading-none break-words">
                    {branch.name}
                </h3>
            </div>
            <div>
                <div className="mb-3">
                    <p className="text-[9px] font-mono-headline text-black/40 uppercase tracking-widest mb-1 md:mb-2">// THE_PROBLEM</p>
                    <p className="text-black font-anton font-normal text-base md:text-lg uppercase leading-none">{branch.problem}</p>
                </div>
                <div>
                    <p className="text-[9px] font-mono-headline text-black/40 uppercase tracking-widest mb-1 md:mb-2">// THE_FIX</p>
                    <p className="text-black font-roboto font-normal text-xs leading-tight opacity-80">{branch.description}</p>
                </div>
            </div>
        </div>
    )
}
