'use client'

import { Check, AlertTriangle, X } from 'lucide-react'
import type { CompatibilityPairResult } from '@/lib/types/compatibility'

interface CompatibilityResultsProps {
  pairs: CompatibilityPairResult[]
  warnings: string[]
}

const verdictConfig = {
  compatible: {
    bg: 'rgba(16,185,129,0.08)',
    text: '#059669',
    label: 'Tương thích',
    Icon: Check,
  },
  risky: {
    bg: 'rgba(245,158,11,0.08)',
    text: '#D97706',
    label: 'Cẩn thận',
    Icon: AlertTriangle,
  },
  incompatible: {
    bg: 'rgba(239,68,68,0.08)',
    text: '#DC2626',
    label: 'Không tương thích',
    Icon: X,
  },
} as const

export function CompatibilityResults({
  pairs,
  warnings,
}: CompatibilityResultsProps) {
  if (pairs.length === 0 && warnings.length === 0) return null

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-[#1E293B]">Kết quả tương thích</h3>

      {warnings.length > 0 && (
        <div className="space-y-2">
          {warnings.map((w, i) => (
            <div
              key={i}
              className="flex items-start gap-2 px-3 py-2 text-sm"
              style={{
                background: 'rgba(245,158,11,0.08)',
                borderRadius: '10px 12px 10px 14px',
              }}
            >
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#D97706]" />
              <span className="text-[#D97706]">{w}</span>
            </div>
          ))}
        </div>
      )}

      <div className="space-y-1">
        {pairs.map((pair, i) => {
          const config = verdictConfig[pair.verdict]
          const Icon = config.Icon
          return (
            <div
              key={i}
              className="flex items-center gap-3 px-3 py-2.5"
            >
              <div className="flex-1 min-w-0">
                <span className="text-sm text-[#1E293B]">
                  {pair.speciesAName} + {pair.speciesBName}
                </span>
              </div>
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold flex-shrink-0"
                style={{
                  background: config.bg,
                  color: config.text,
                  borderRadius: '20px 24px 20px 24px',
                }}
              >
                <Icon className="w-3.5 h-3.5" />
                {config.label}
              </span>
            </div>
          )
        })}
      </div>

      {pairs.some((p) => p.reasonsVn.length > 0) && (
        <details className="group">
          <summary className="text-xs font-medium text-[#0891B2] cursor-pointer hover:underline">
            Xem chi tiết
          </summary>
          <div className="mt-2 space-y-2">
            {pairs
              .filter((p) => p.reasonsVn.length > 0)
              .map((pair, i) => (
                <div key={i} className="text-xs text-[#64748B] pl-4 border-l-2 border-[#E2E8F0]">
                  <span className="font-medium text-[#1E293B]">
                    {pair.speciesAName} + {pair.speciesBName}:
                  </span>{' '}
                  {pair.reasonsVn.join('. ')}
                </div>
              ))}
          </div>
        </details>
      )}
    </div>
  )
}
