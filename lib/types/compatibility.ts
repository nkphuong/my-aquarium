export interface SpeciesListItem {
  id: number
  nameVn: string
  nameScientific: string | null
  nameEn: string
  imageUrl: string | null
  tempMin: number
  tempMax: number
  phMin: number
  phMax: number
  sizeMax: number
  isSchooling: boolean
  minSchoolSize: number
}

export interface CompatibilityPairResult {
  speciesAId: number
  speciesAName: string
  speciesBId: number
  speciesBName: string
  verdict: 'compatible' | 'risky' | 'incompatible'
  score: number
  reasonsVn: string[]
  reasonsEn: string[]
}

export interface SpeciesBreakdownItem {
  speciesId: number
  nameEn: string
  nameVn: string
  quantity: number
  bioloadPerFish: number
  bioloadTotal: number
  maxAdditional: number
  isSchooling: boolean
  minSchoolSize: number
  schoolingWarning: boolean
}

export interface CompatibilityCheckResult {
  stockingPercent: number
  stockingVerdict: 'ok' | 'warning' | 'overstocked'
  pairs: CompatibilityPairResult[]
  warnings: string[]
  overallVerdict: 'compatible' | 'risky' | 'incompatible'
  speciesBreakdown: SpeciesBreakdownItem[]
  tankCapacity: number
  totalBioload: number
  remainingCapacity: number
}

export interface SelectedFish {
  species: SpeciesListItem
  quantity: number
}
