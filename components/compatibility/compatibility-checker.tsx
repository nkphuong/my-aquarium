'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { Minus, Plus, X, Share2, Fish } from 'lucide-react'
import { TankSizeSelector } from './tank-size-selector'
import { FishSearch } from './fish-search'
import { StockingMeter } from './stocking-meter'
import { CompatibilityResults } from './compatibility-results'
import { compatibilityAccessor } from '@/lib/accessors/compatibility.accessor'
import type {
  SpeciesListItem,
  SelectedFish,
  CompatibilityCheckResult,
} from '@/lib/types/compatibility'

interface CompatibilityCheckerProps {
  initialSpecies: SpeciesListItem[]
}

export function CompatibilityChecker({ initialSpecies }: CompatibilityCheckerProps) {
  const [tankSize, setTankSize] = useState(60)
  const [selectedFish, setSelectedFish] = useState<SelectedFish[]>([])
  const [result, setResult] = useState<CompatibilityCheckResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>()

  const runCheck = useCallback(
    async (size: number, fish: SelectedFish[]) => {
      if (fish.length === 0) {
        setResult(null)
        return
      }

      setLoading(true)
      try {
        const checkResult = await compatibilityAccessor.checkCompatibility(
          size,
          fish.map((f) => ({ id: f.species.id, quantity: f.quantity }))
        )
        setResult(checkResult)
      } catch {
        setResult(null)
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const debouncedCheck = useCallback(
    (size: number, fish: SelectedFish[]) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => runCheck(size, fish), 300)
    },
    [runCheck]
  )

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  const handleTankSizeChange = (size: number) => {
    setTankSize(size)
    debouncedCheck(size, selectedFish)
  }

  const handleAddFish = (species: SpeciesListItem) => {
    const updated = [...selectedFish, { species, quantity: 1 }]
    setSelectedFish(updated)
    debouncedCheck(tankSize, updated)
  }

  const handleRemoveFish = (index: number) => {
    const updated = selectedFish.filter((_, i) => i !== index)
    setSelectedFish(updated)
    debouncedCheck(tankSize, updated)
  }

  const handleQuantityChange = (index: number, delta: number) => {
    const updated = selectedFish.map((f, i) => {
      if (i !== index) return f
      const newQty = Math.max(1, Math.min(50, f.quantity + delta))
      return { ...f, quantity: newQty }
    })
    setSelectedFish(updated)
    debouncedCheck(tankSize, updated)
  }

  const handleShare = async () => {
    const params = new URLSearchParams()
    params.set('tank', String(tankSize))
    const fishParam = selectedFish
      .map((f) => `${f.species.id}:${f.quantity}`)
      .join(',')
    if (fishParam) params.set('fish', fishParam)

    const url = `${window.location.origin}/kiem-tra?${params.toString()}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for browsers without clipboard API
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1
          className="text-[28px] font-semibold text-[#1E293B]"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Kiểm tra tương thích cá
        </h1>
        <p className="text-sm text-[#64748B]">
          Chọn kích thước hồ và thêm cá để kiểm tra tương thích ngay lập tức
        </p>
      </div>

      {/* Input Zone */}
      <div
        className="bg-white border border-[#E2E8F0] p-5 space-y-5"
        style={{
          borderRadius: '20px 24px 22px 18px',
          boxShadow:
            '0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)',
        }}
      >
        <TankSizeSelector value={tankSize} onChange={handleTankSizeChange} />
        <FishSearch
          species={initialSpecies}
          selectedIds={selectedFish.map((f) => f.species.id)}
          onSelect={handleAddFish}
        />
      </div>

      {/* Selected Fish */}
      {selectedFish.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedFish.map((fish, index) => (
            <div
              key={`${fish.species.id}-${index}`}
              className="inline-flex items-center gap-2 pl-3 pr-1.5 py-1.5 bg-[rgba(8,145,178,0.06)] text-[#0E7490] text-sm font-medium animate-[fadeInUp_200ms_ease-out]"
              style={{ borderRadius: '20px 24px 20px 24px' }}
            >
              <span>{fish.species.nameVn}</span>
              <div className="flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => handleQuantityChange(index, -1)}
                  className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[rgba(8,145,178,0.1)] transition-colors"
                  aria-label={`Giảm số lượng ${fish.species.nameVn}`}
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-6 text-center text-xs font-bold">
                  {fish.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => handleQuantityChange(index, 1)}
                  className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[rgba(8,145,178,0.1)] transition-colors"
                  aria-label={`Tăng số lượng ${fish.species.nameVn}`}
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveFish(index)}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-[rgba(239,68,68,0.1)] hover:text-[#DC2626] transition-colors"
                aria-label={`Xóa ${fish.species.nameVn}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {selectedFish.length === 0 && (
        <div className="text-center py-12 space-y-3">
          <div className="w-16 h-16 mx-auto rounded-full bg-[rgba(8,145,178,0.06)] flex items-center justify-center">
            <Fish className="w-8 h-8 text-[#0891B2]" />
          </div>
          <p className="text-base font-medium text-[#1E293B]">
            Thêm cá vào hồ để kiểm tra tương thích
          </p>
          <p className="text-sm text-[#94A3B8]">
            Tìm kiếm và chọn loài cá bạn muốn nuôi chung
          </p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div
          className="bg-white border border-[#E2E8F0] p-5 space-y-5"
          style={{
            borderRadius: '20px 24px 22px 18px',
            boxShadow:
              '0 1px 3px rgba(0,0,0,0.02), 0 4px 12px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)',
          }}
        >
          <StockingMeter
            percent={result.stockingPercent}
            verdict={result.stockingVerdict}
            breakdown={result.speciesBreakdown}
            tankCapacity={result.tankCapacity}
            totalBioload={result.totalBioload}
            remainingCapacity={result.remainingCapacity}
          />
          <CompatibilityResults
            pairs={result.pairs}
            warnings={result.warnings}
          />
        </div>
      )}

      {/* Loading indicator */}
      {loading && (
        <div className="text-center py-4">
          <div className="w-6 h-6 mx-auto border-2 border-[#0891B2] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Share Button */}
      {selectedFish.length > 0 && (
        <button
          type="button"
          onClick={handleShare}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#0891B2] text-white text-sm font-semibold transition-all duration-200 hover:bg-[#0E7490] hover:shadow-[0_4px_16px_rgba(8,145,178,0.2)]"
          style={{ borderRadius: '10px 14px 12px 16px' }}
        >
          <Share2 className="w-4 h-4" />
          {copied ? 'Đã sao chép link!' : 'Chia sẻ kết quả'}
        </button>
      )}
    </div>
  )
}
