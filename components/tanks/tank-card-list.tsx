'use client'

import type { Tank } from '@/lib/types'
import TankCard from './tank-card'
import CreateTankCardPlaceholder from './create-tank-card-placeholder'

interface TankCardListProps {
    tanks: Tank[]
    onCreateTank: () => void
}

/**
 * TankCardList Component
 *
 * Displays a grid of tank cards.
 * Receives tanks as props from Server Component (no client-side fetching).
 */
export default function TankCardList({ tanks, onCreateTank }: TankCardListProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tanks.map((tank) => (
                <TankCard key={tank.id} tank={tank} />
            ))}
            <CreateTankCardPlaceholder onCreateTank={onCreateTank} />
        </div>
    )
}