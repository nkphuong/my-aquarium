import { createHttpClient } from '@/lib/api'
import type { SpeciesListItem, CompatibilityCheckResult, SpeciesBreakdownItem } from '@/lib/types/compatibility'

const API_URL =
  typeof window !== 'undefined'
    ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000')
    : (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000')

class CompatibilityAccessorClass {
  private getClient() {
    return createHttpClient(API_URL)
  }

  async getSpeciesList(): Promise<SpeciesListItem[]> {
    const client = this.getClient()
    const response = await client.get('/v1/compatibility/species').send<any>()
    const data: any[] = response?.data ?? response
    return data.map((s: any) => ({
      id: s.id,
      nameVn: s.name_vn,
      nameScientific: s.name_scientific,
      nameEn: s.name_en,
      imageUrl: s.image_url,
      tempMin: s.temp_min,
      tempMax: s.temp_max,
      phMin: s.ph_min,
      phMax: s.ph_max,
      sizeMax: s.size_max,
      isSchooling: s.is_schooling,
      minSchoolSize: s.min_school_size,
    }))
  }

  async checkCompatibility(
    tankSizeLiters: number,
    species: Array<{ id: number; quantity: number }>,
  ): Promise<CompatibilityCheckResult> {
    const client = this.getClient()
    const response = await client
      .post('/v1/compatibility/check')
      .withBody({ tank_size_liters: tankSizeLiters, species })
      .send<any>()
    const data = response?.data ?? response

    return {
      stockingPercent: data.stocking_percent,
      stockingVerdict: data.stocking_verdict,
      pairs: data.pairs.map((p: any) => ({
        speciesAId: p.species_a_id,
        speciesAName: p.species_a_name,
        speciesBId: p.species_b_id,
        speciesBName: p.species_b_name,
        verdict: p.verdict,
        score: p.score,
        reasonsVn: p.reasons_vn,
        reasonsEn: p.reasons_en,
      })),
      warnings: data.warnings,
      overallVerdict: data.overall_verdict,
      speciesBreakdown: (data.species_breakdown ?? []).map((s: any): SpeciesBreakdownItem => ({
        speciesId: s.species_id,
        nameEn: s.name_en,
        nameVn: s.name_vn,
        quantity: s.quantity,
        bioloadPerFish: s.bioload_per_fish,
        bioloadTotal: s.bioload_total,
        maxAdditional: s.max_additional,
        isSchooling: s.is_schooling,
        minSchoolSize: s.min_school_size,
        schoolingWarning: s.schooling_warning,
      })),
      tankCapacity: data.tank_capacity ?? 0,
      totalBioload: data.total_bioload ?? 0,
      remainingCapacity: data.remaining_capacity ?? 0,
    }
  }
}

export const compatibilityAccessor = new CompatibilityAccessorClass()
