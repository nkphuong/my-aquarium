'use client'

import { useCallback, useTransition, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useRouter, useSearchParams } from 'next/navigation'
import { clsx } from 'clsx'

import TankCardList from '@/components/tanks/tank-card-list'
import type { Tank } from '@/lib/types'

// Dynamic imports for lucide icons
const Search = dynamic(() => import('lucide-react').then((mod) => ({ default: mod.Search })))
const Plus = dynamic(() => import('lucide-react').then((mod) => ({ default: mod.Plus })))
const Lightbulb = dynamic(() => import('lucide-react').then((mod) => ({ default: mod.Lightbulb })))
const Droplets = dynamic(() => import('lucide-react').then((mod) => ({ default: mod.Droplets })))

interface TanksPageClientProps {
    tanks: Tank[]
    activeType: string
    searchQuery: string
    error?: string
}

const filterTabs = [
    { id: 'all', label: 'All Tanks' },
    { id: 'freshwater', label: 'Freshwater' },
    { id: 'saltwater', label: 'Saltwater' },
    { id: 'brackish', label: 'Brackish' },
    { id: 'quarantine', label: 'Quarantine' },
]

const SEARCH_DEBOUNCE_MS = 300

/**
 * Tanks Page Client Component
 *
 * Handles UI interactions and URL-based navigation.
 * Filtering happens on server via searchParams.
 */
export default function TanksPageClient({ tanks, activeType, searchQuery, error }: TanksPageClientProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isPending, startTransition] = useTransition()
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current)
            }
        }
    }, [])

    const handleClickCreateTank = useCallback(() => {
        router.push('/tanks/create')
    }, [router])

    // Update URL params (triggers server re-fetch)
    const updateParams = useCallback(
        (updates: { type?: string; q?: string }) => {
            const params = new URLSearchParams(searchParams.toString())

            Object.entries(updates).forEach(([key, value]) => {
                if (value && value !== 'all' && value !== '') {
                    params.set(key, value)
                } else {
                    params.delete(key)
                }
            })

            startTransition(() => {
                router.push(`/tanks?${params.toString()}`)
            })
        },
        [router, searchParams]
    )

    const handleFilterChange = useCallback(
        (type: string) => {
            updateParams({ type })
        },
        [updateParams]
    )

    // Debounced search to avoid excessive server requests
    const handleSearchChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value

            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current)
            }

            searchTimeoutRef.current = setTimeout(() => {
                updateParams({ q: value })
            }, SEARCH_DEBOUNCE_MS)
        },
        [updateParams]
    )

    if (error) {
        return (
            <div className="flex flex-col mx-auto w-full max-w-7xl px-6 py-8 md:px-12 md:py-12">
                <div className="text-destructive">Error: {error}</div>
            </div>
        )
    }

    return (
        <div className="flex flex-col mx-auto w-full max-w-7xl px-6 py-8 md:px-12 md:py-12 gap-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-border">
                <div className="flex flex-col gap-2">
                    <h1 className="text-dark-primary text-4xl sm:text-5xl font-black leading-tight tracking-tight">
                        My Tanks
                    </h1>
                    <p className="text-dark-secondary text-base sm:text-lg">
                        Welcome back! Your underwater worlds look thriving today.
                    </p>
                </div>
                <button
                    onClick={handleClickCreateTank}
                    className="group flex items-center gap-2 h-12 px-6 rounded-full btn-primary-glow text-base"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add New Tank</span>
                </button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
                {/* Search */}
                <label className="flex min-w-[300px] h-12 w-full lg:w-auto lg:flex-1 max-w-lg relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-dark-secondary group-focus-within:text-primary transition-colors">
                        <Search className="w-5 h-5" />
                    </div>
                    <input
                        className="flex w-full h-full rounded-2xl border-none bg-card text-dark-primary placeholder:text-dark-secondary pl-10 pr-4 text-base focus:ring-2 focus:ring-primary transition-all shadow-sm"
                        placeholder="Search tanks by name, style, or inhabitants..."
                        type="text"
                        defaultValue={searchQuery}
                        onChange={handleSearchChange}
                    />
                </label>

                {/* Filter Tabs */}
                <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
                    {filterTabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => handleFilterChange(tab.id)}
                            disabled={isPending}
                            className={clsx(
                                'flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-full px-5 transition-colors',
                                activeType === tab.id
                                    ? 'bg-foreground text-background font-bold'
                                    : 'bg-card text-dark-secondary hover:bg-secondary border border-surface-light font-medium',
                                isPending && 'opacity-70'
                            )}
                        >
                            <span className="text-sm">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Tank Grid */}
            {isPending ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
            ) : (
                <TankCardList tanks={tanks} onCreateTank={handleClickCreateTank} />
            )}

            {/* Tips Section */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-primary/10 p-6 rounded-card-lg border border-transparent flex gap-4 items-center">
                    <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                        <Lightbulb className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h4 className="font-bold text-dark-primary mb-1">Tip of the day</h4>
                        <p className="text-sm text-dark-secondary">
                            Regular 20% water changes help maintain stable water parameters and reduce algae
                            growth.
                        </p>
                    </div>
                </div>
                <div className="bg-primary/10 p-6 rounded-card-lg border border-transparent flex gap-4 items-center">
                    <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                        <Droplets className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h4 className="font-bold text-dark-primary mb-1">Water Quality Alert</h4>
                        <p className="text-sm text-dark-secondary">
                            Your filter media replacement for "Bedroom Reef" is due in 3 days.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
