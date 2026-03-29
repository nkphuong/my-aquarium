import { getTanks } from '@/app/actions/tank.actions'
import TanksPageClient from './page.client'

interface TanksPageProps {
  searchParams: Promise<{ type?: string; q?: string }>
}

/**
 * Tanks List Page (Server Component)
 *
 * Reads filters from URL searchParams and fetches filtered data.
 * - ?type=freshwater - Filter by tank type
 * - ?q=reef - Search query
 */
export default async function TanksPage({ searchParams }: TanksPageProps) {
  const { type, q } = await searchParams

  const result = await getTanks({ type, search: q })
  const tanks = result.success ? (result.tanks || []) : []

  return (
    <TanksPageClient
      tanks={tanks}
      activeType={type || 'all'}
      searchQuery={q || ''}
      error={result.error}
    />
  )
}
