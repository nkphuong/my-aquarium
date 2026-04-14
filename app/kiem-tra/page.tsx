import { CompatibilityChecker } from '@/components/compatibility/compatibility-checker'
import { compatibilityAccessor } from '@/lib/accessors/compatibility.accessor'

export default async function KiemTraPage() {
  let species = []
  try {
    species = await compatibilityAccessor.getSpeciesList()
  } catch {
    // Backend unavailable — client will still work but with empty species list
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6">
      <CompatibilityChecker initialSpecies={species} />
    </main>
  )
}
