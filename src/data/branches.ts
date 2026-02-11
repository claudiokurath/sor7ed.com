export interface Branch {
    name: string;
    icon: string;
    description: string;
    color: string;
}

export const branches: Branch[] = [
    {
        name: 'Mind',
        icon: '🧠',
        description: 'Executive function, focus, and cognitive clarity.',
        color: 'from-blue-500/20 to-cyan-500/20'
    },
    {
        name: 'Wealth',
        icon: '💰',
        description: 'Financial systems and impulsive spending management.',
        color: 'from-emerald-500/20 to-teal-500/20'
    },
    {
        name: 'Body',
        icon: '💪',
        description: 'Energy levels, sleep, and sensory regulation.',
        color: 'from-orange-500/20 to-red-500/20'
    },
    {
        name: 'Tech',
        icon: '⚡',
        description: 'Digital organization and automation for ADHD.',
        color: 'from-purple-500/20 to-indigo-500/20'
    },
    {
        name: 'Connection',
        icon: '🤝',
        description: 'Social anxiety, RSD, and communication systems.',
        color: 'from-pink-500/20 to-rose-500/20'
    },
    {
        name: 'Growth',
        icon: '📈',
        description: 'Self-awareness and neurodivergent advocacy.',
        color: 'from-yellow-500/20 to-amber-500/20'
    },
    {
        name: 'Impression',
        icon: '✨',
        description: 'Environment design and sensory-friendly living.',
        color: 'from-violet-500/20 to-fuchsia-500/20'
    }
];
