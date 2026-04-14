'use client'

import { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import type { SpeciesBreakdownItem } from '@/lib/types/compatibility'

interface StockingMeterProps {
  percent: number
  verdict: 'ok' | 'warning' | 'overstocked'
  breakdown?: SpeciesBreakdownItem[]
  tankCapacity?: number
  totalBioload?: number
  remainingCapacity?: number
}

export function StockingMeter({
  percent,
  verdict,
  breakdown,
  tankCapacity,
  totalBioload,
  remainingCapacity,
}: StockingMeterProps) {
  const [expanded, setExpanded] = useState(false)

  const color =
    verdict === 'overstocked'
      ? '#EF4444'
      : verdict === 'warning'
        ? '#F59E0B'
        : '#10B981'

  const label =
    verdict === 'overstocked'
      ? 'Quá tải'
      : verdict === 'warning'
        ? 'Gần đầy'
        : 'Ổn'

  const hasBreakdown = breakdown && breakdown.length > 0
  const hasSchoolingWarning = breakdown?.some((s) => s.schoolingWarning) ?? false

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[#1E293B]">Tải trọng hồ</span>
        <span className="text-sm font-semibold" style={{ color }}>
          {percent}% — {label}
        </span>
      </div>

      {/* Progress bar with threshold markers */}
      <div className="relative">
        <div
          className="h-3 bg-[#E2E8F0] overflow-hidden"
          style={{ borderRadius: '10px 12px 10px 14px' }}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Tải trọng hồ: ${percent}%`}
        >
          <div
            className="h-full transition-all duration-300 ease-out"
            style={{
              width: `${Math.min(percent, 100)}%`,
              backgroundColor: color,
              borderRadius: '10px 12px 10px 14px',
            }}
          />
        </div>
        {/* 80% threshold marker */}
        <div className="absolute top-0" style={{ left: '80%' }}>
          <div className="w-0.5 h-[18px] -mt-[3px]" style={{ backgroundColor: '#F59E0B' }} />
          <div className="text-[10px] -ml-2 mt-0.5" style={{ color: '#F59E0B' }}>80%</div>
        </div>
        {/* 100% threshold marker */}
        <div className="absolute top-0 right-0">
          <div className="w-0.5 h-[18px] -mt-[3px]" style={{ backgroundColor: '#EF4444' }} />
          <div className="text-[10px] -ml-3 mt-0.5" style={{ color: '#EF4444' }}>100%</div>
        </div>
      </div>

      {/* Collapsible toggle */}
      {hasBreakdown && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-[13px] font-medium text-[#0D9488] hover:text-[#0E7490] transition-colors mt-1"
        >
          <ChevronRight
            className="w-3.5 h-3.5 transition-transform duration-200"
            style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
          />
          Xem chi tiết tải trọng
        </button>
      )}

      {/* Breakdown table */}
      {expanded && hasBreakdown && (
        <div
          className="border border-[#E2E8F0] overflow-hidden animate-[fadeInUp_200ms_ease-out]"
          style={{ borderRadius: '12px' }}
        >
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-[#F8FAFC]">
                <th className="px-3.5 py-2.5 text-left font-medium text-[#64748B]">Loài cá</th>
                <th className="px-3.5 py-2.5 text-right font-medium text-[#64748B]">SL</th>
                <th className="px-3.5 py-2.5 text-right font-medium text-[#64748B] hidden sm:table-cell">Tải trọng</th>
                <th className="px-3.5 py-2.5 text-right font-medium text-[#64748B]">Khuyến nghị</th>
              </tr>
            </thead>
            <tbody>
              {breakdown!.map((item) => (
                <tr
                  key={item.speciesId}
                  className="border-t border-[#F1F5F9]"
                  style={item.schoolingWarning ? { backgroundColor: '#FFFBEB' } : undefined}
                >
                  <td className="px-3.5 py-2.5">
                    <div className="font-medium text-[#1E293B]">{item.nameEn}</div>
                    <div className="text-[11px] text-[#94A3B8]">{item.nameVn}</div>
                  </td>
                  <td className="px-3.5 py-2.5 text-right">
                    <span
                      className="font-medium"
                      style={{
                        color: item.schoolingWarning ? '#D97706' : '#1E293B',
                      }}
                    >
                      {item.quantity}
                    </span>
                  </td>
                  <td className="px-3.5 py-2.5 text-right hidden sm:table-cell">
                    <span className="font-medium text-[#10B981]">{item.bioloadTotal}</span>
                    <span className="text-[11px] text-[#94A3B8]"> / {tankCapacity}</span>
                  </td>
                  <td className="px-3.5 py-2.5 text-right">
                    {item.schoolingWarning ? (
                      <span className="inline-block px-2 py-0.5 text-[12px] rounded-full bg-[#FEF3C7] text-[#92400E]">
                        cần ít nhất {item.minSchoolSize} con
                      </span>
                    ) : item.maxAdditional > 0 ? (
                      <span className="inline-block px-2 py-0.5 text-[12px] rounded-full bg-[#F0FDF4] text-[#065F46]">
                        tối đa +{item.maxAdditional}
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-0.5 text-[12px] rounded-full bg-[#F1F5F9] text-[#64748B]">
                        đã đủ
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-[#E2E8F0] bg-[#F8FAFC]">
                <td className="px-3.5 py-2.5 font-semibold text-[#1E293B]" colSpan={2}>
                  Tổng
                </td>
                <td className="px-3.5 py-2.5 text-right font-semibold hidden sm:table-cell">
                  <span className="text-[#0D9488]">{totalBioload}</span>
                  <span className="text-[11px] text-[#94A3B8]"> / {tankCapacity}</span>
                </td>
                <td className="px-3.5 py-2.5 text-right text-[12px] text-[#64748B]">
                  còn trống {remainingCapacity} tải trọng
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* Schooling warning */}
      {expanded && hasSchoolingWarning && (
        <div className="flex items-start gap-2 px-3.5 py-2.5 text-[13px] bg-[#FEF3C7]" style={{ borderRadius: '8px' }}>
          <span className="text-[#D97706] text-base leading-none mt-0.5">&#9888;</span>
          <div className="text-[#92400E] space-y-0.5">
            {breakdown!
              .filter((s) => s.schoolingWarning)
              .map((s) => (
                <div key={s.speciesId}>
                  {s.nameVn || s.nameEn} là cá sống theo đàn, cần ít nhất {s.minSchoolSize} con (hiện có {s.quantity})
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
