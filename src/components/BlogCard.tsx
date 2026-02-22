import { Link } from 'react-router-dom'

interface Article {
    id: string
    title: string
    excerpt: string
    content: string
    cta: string
    coverImage: string
    branch: string
    branchColor: string
    readTime: string
    date: string
    whatsappKeyword: string
}

interface BlogCardProps {
    article: Article
}

const BlogCard = ({ article }: BlogCardProps) => {
    return (
        <div className="stealth-card p-10 group hover:border-white/20 transition-all duration-700 flex flex-col h-full">
            <div className="flex justify-between items-start mb-6">
                <span className="text-[9px] font-mono-headline text-sor7ed-yellow uppercase tracking-[0.2em]">
                    {article.branch}
                </span>
                <span className="text-[9px] font-mono-headline text-zinc-600 uppercase tracking-[0.2em]">
                    {article.date}
                </span>
            </div>
            <h3 className="text-2xl font-bold text-white group-hover:text-sor7ed-yellow transition-colors uppercase tracking-tight mb-6 leading-none">
                <Link to={`/blog/${encodeURIComponent(article.title)}`}>
                    {article.title}
                </Link>
            </h3>
            <p className="text-sm text-zinc-500 font-light leading-relaxed mb-8 line-clamp-3">
                {article.excerpt}
            </p>
            <div className="mt-auto pt-6 border-t border-white/5 flex justify-end items-center gap-4">
                <span className="text-[9px] font-mono-headline text-zinc-600 uppercase tracking-widest">{article.readTime}</span>
                <Link
                    to={`/blog/${encodeURIComponent(article.title)}`}
                    className="text-zinc-700 group-hover:text-white transition-colors text-lg"
                >
                    →
                </Link>
            </div>
        </div>
    )
}

export default BlogCard
