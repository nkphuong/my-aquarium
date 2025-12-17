

export default function CreateTankCardPlaceholder({ onCreateTank }: { onCreateTank: () => void }) {

    return (
        <button onClick={onCreateTank} className="group flex flex-col items-center justify-center min-h-card rounded-card border-2 border-dashed border-blue-200 dark:border-[#1e293b] hover:border-primary hover:bg-white/50 dark:hover:bg-[#152033]/50 transition-all duration-300 gap-4">
            <div className="size-16 rounded-full bg-surface-dark-lighter group-hover:bg-primary/20 flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined icon-xl text-dark-tertiary group-hover:text-primary">add_circle</span>
            </div>
            <div className="text-center">
                <p className="text-lg font-bold text-dark-primary group-hover:text-primary transition-colors">Create New Tank</p>
                <p className="text-sm text-dark-tertiary">Start a new aquatic journey</p>
            </div>
        </button>
    )
}