'use client'

import { useState, useRef, useEffect } from 'react'
import { Search } from 'lucide-react'
import type { SpeciesListItem } from '@/lib/types/compatibility'

interface FishSearchProps {
  species: SpeciesListItem[]
  selectedIds: number[]
  onSelect: (species: SpeciesListItem) => void
}

export function FishSearch({ species, selectedIds, onSelect }: FishSearchProps) {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const filtered = query.trim()
    ? species.filter(
        (s) =>
          !selectedIds.includes(s.id) &&
          (s.nameVn.toLowerCase().includes(query.toLowerCase()) ||
            s.nameEn.toLowerCase().includes(query.toLowerCase()) ||
            (s.nameScientific?.toLowerCase().includes(query.toLowerCase()) ?? false))
      )
    : species.filter((s) => !selectedIds.includes(s.id))

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (s: SpeciesListItem) => {
    onSelect(s)
    setQuery('')
    setIsOpen(false)
    inputRef.current?.focus()
  }

  return (
    <div className="relative space-y-3">
      <label className="text-sm font-medium text-[#1E293B]">
        Thêm cá vào hồ
      </label>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#94A3B8]" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Tìm kiếm cá..."
          className="w-full h-12 pl-11 pr-4 bg-[#F8FAFC] border-[1.5px] border-[#E2E8F0] text-sm text-[#1E293B] placeholder:text-[#94A3B8] transition-all duration-200 focus:border-[#0891B2] focus:ring-2 focus:ring-[#0891B2]/10 focus:outline-none"
          style={{
            borderRadius: '16px 20px 18px 22px',
            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.03)',
          }}
        />
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-[#E2E8F0] max-h-[300px] overflow-y-auto"
          style={{
            borderRadius: '14px 16px 14px 18px',
            boxShadow:
              '0 2px 4px rgba(0,0,0,0.02), 0 8px 16px rgba(0,0,0,0.04), 0 16px 32px rgba(0,0,0,0.06)',
          }}
        >
          {filtered.length === 0 ? (
            <div className="px-4 py-6 text-center text-sm text-[#94A3B8]">
              {query
                ? `Không tìm thấy '${query}'`
                : 'Đã thêm tất cả các loài'}
            </div>
          ) : (
            filtered.slice(0, 20).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => handleSelect(s)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[rgba(8,145,178,0.04)] transition-colors duration-150"
              >
                {s.imageUrl ? (
                  <img
                    src={s.imageUrl}
                    alt={s.nameVn}
                    className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-[rgba(8,145,178,0.06)] flex items-center justify-center flex-shrink-0">
                    <span className="text-xs text-[#0891B2]">
                      {s.nameVn.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="min-w-0">
                  <div className="text-sm font-medium text-[#1E293B] truncate">
                    {s.nameVn}
                  </div>
                  <div className="text-xs text-[#94A3B8] truncate">
                    {s.nameScientific || s.nameEn}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
