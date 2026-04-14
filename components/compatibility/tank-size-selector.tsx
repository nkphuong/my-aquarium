'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

const PRESET_SIZES = [30, 60, 100, 200]

interface TankSizeSelectorProps {
  value: number
  onChange: (size: number) => void
}

export function TankSizeSelector({ value, onChange }: TankSizeSelectorProps) {
  const [isCustom, setIsCustom] = useState(!PRESET_SIZES.includes(value) && value > 0)
  const [customValue, setCustomValue] = useState(isCustom ? String(value) : '')

  const handlePresetClick = (size: number) => {
    setIsCustom(false)
    setCustomValue('')
    onChange(size)
  }

  const handleCustomClick = () => {
    setIsCustom(true)
    if (customValue) {
      onChange(Number(customValue))
    }
  }

  const handleCustomChange = (val: string) => {
    setCustomValue(val)
    const num = Number(val)
    if (num > 0) onChange(num)
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-[#1E293B]">
        Kích thước hồ (lít)
      </label>
      <div className="flex flex-wrap gap-2">
        {PRESET_SIZES.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => handlePresetClick(size)}
            className={cn(
              'px-5 py-2.5 text-sm font-semibold transition-all duration-200',
              'min-w-[60px] min-h-[44px]',
              'focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30',
              value === size && !isCustom
                ? 'bg-[#0891B2] text-white shadow-[0_4px_16px_rgba(8,145,178,0.2)]'
                : 'bg-white text-[#64748B] border border-[#E2E8F0] hover:border-[#0891B2] hover:text-[#0891B2]',
            )}
            style={{ borderRadius: '20px 24px 20px 24px' }}
          >
            {size}L
          </button>
        ))}
        <button
          type="button"
          onClick={handleCustomClick}
          className={cn(
            'px-5 py-2.5 text-sm font-semibold transition-all duration-200',
            'min-h-[44px]',
            'focus:outline-none focus:ring-2 focus:ring-[#0891B2]/30',
            isCustom
              ? 'bg-[#0891B2] text-white shadow-[0_4px_16px_rgba(8,145,178,0.2)]'
              : 'bg-white text-[#64748B] border border-[#E2E8F0] hover:border-[#0891B2] hover:text-[#0891B2]',
          )}
          style={{ borderRadius: '20px 24px 20px 24px' }}
        >
          Tùy chỉnh
        </button>
      </div>
      {isCustom && (
        <input
          type="number"
          min={1}
          max={10000}
          value={customValue}
          onChange={(e) => handleCustomChange(e.target.value)}
          placeholder="Nhập số lít..."
          className="w-full h-12 px-4 bg-white border-[1.5px] border-[#E2E8F0] text-sm text-[#1E293B] placeholder:text-[#94A3B8] transition-all duration-200 focus:border-[#0891B2] focus:ring-2 focus:ring-[#0891B2]/10 focus:outline-none"
          style={{
            borderRadius: '14px 16px 14px 18px',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.03)',
          }}
          autoFocus
        />
      )}
    </div>
  )
}
