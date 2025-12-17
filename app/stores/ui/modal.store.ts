/**
 * Modal Store (Next.js/React Layer)
 *
 * Pure UI state - no business logic needed.
 * This type of store doesn't need to call application services.
 *
 * Location: app/stores/ui/ (React-specific UI state, part of Next.js framework layer)
 */

import { create } from 'zustand'

interface ModalState {
  // State
  isOpen: boolean
  modalType: 'confirm' | 'alert' | 'form' | null
  modalProps: Record<string, any>

  // Actions
  openModal: (type: ModalState['modalType'], props?: Record<string, any>) => void
  closeModal: () => void
}

/**
 * Modal Store
 *
 * ⭐ Pure UI State:
 * - No business logic
 * - No service calls
 * - Just UI state management
 */
export const useModalStore = create<ModalState>((set) => ({
  // Initial state
  isOpen: false,
  modalType: null,
  modalProps: {},

  // Actions
  openModal: (type, props = {}) => {
    set({
      isOpen: true,
      modalType: type,
      modalProps: props,
    })
  },

  closeModal: () => {
    set({
      isOpen: false,
      modalType: null,
      modalProps: {},
    })
  },
}))
