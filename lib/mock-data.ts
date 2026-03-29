/**
 * Mock Data for UI Development
 *
 * Used when MOCK_MODE=true to run the frontend without a backend.
 * All data here is realistic dummy data for design iteration.
 */

import type { Tank } from './types/tank'
import type { AIInsight } from './types/chat'

export const MOCK_USER = {
  id: 1,
  name: 'Aquarist',
  email: 'demo@aquaheart.app',
  fullname: 'Demo Aquarist',
}

export const MOCK_TANKS: Tank[] = [
  {
    id: 1,
    name: '55g Planted Community',
    width: 48,
    height: 21,
    length: 13,
    userId: 1,
    status: 'active',
    type: 'freshwater',
    style: 'planted',
    description: 'Heavily planted community tank with CO2 injection',
    setupAt: '2025-06-15',
    avatar: '/images/creatures/coral-reef.png',
  },
  {
    id: 2,
    name: '20g Nano Reef',
    width: 24,
    height: 16,
    length: 12,
    userId: 1,
    status: 'active',
    type: 'saltwater',
    style: 'reef',
    description: 'Small reef tank with soft corals and clownfish',
    setupAt: '2025-09-01',
    avatar: '/images/creatures/cute-clownfish.png',
  },
  {
    id: 3,
    name: '10g Betta Paradise',
    width: 20,
    height: 12,
    length: 10,
    userId: 1,
    status: 'active',
    type: 'freshwater',
    style: 'natural',
    description: 'Single betta with live plants and driftwood',
    setupAt: '2025-11-20',
  },
  {
    id: 4,
    name: '75g Cichlid Tank',
    width: 48,
    height: 21,
    length: 18,
    userId: 1,
    status: 'cycling',
    type: 'freshwater',
    style: 'rocky',
    description: 'African cichlid setup with limestone rock formations',
    setupAt: '2026-02-10',
  },
]

export const MOCK_INSIGHTS: AIInsight[] = [
  {
    id: '1',
    priority: 'warning',
    title: 'pH levels trending low',
    description: 'Your 55g Planted Community tank pH has dropped from 7.2 to 6.8 over the past week. Consider testing KH and adjusting CO2 levels.',
    tankId: '1',
    tankName: '55g Planted Community',
    actionLabel: 'View Parameters',
  },
  {
    id: '2',
    priority: 'suggestion',
    title: 'Time for a water change',
    description: 'Your 20g Nano Reef is due for a 10% water change. Last change was 8 days ago.',
    tankId: '2',
    tankName: '20g Nano Reef',
    actionLabel: 'Log Water Change',
  },
  {
    id: '3',
    priority: 'info',
    title: 'Nitrogen cycle progressing',
    description: 'Your 75g Cichlid Tank is showing ammonia at 0.25ppm and nitrites at 0.5ppm. The cycle is progressing normally.',
    tankId: '4',
    tankName: '75g Cichlid Tank',
    actionLabel: 'View Cycle Progress',
  },
  {
    id: '4',
    priority: 'suggestion',
    title: 'Consider adding fertilizer',
    description: 'Several plants in your 55g Planted Community show signs of iron deficiency. Consider dosing with liquid iron.',
    tankId: '1',
    tankName: '55g Planted Community',
    actionLabel: 'View Plants',
  },
  {
    id: '5',
    priority: 'info',
    title: 'Temperature stable',
    description: 'All active tanks are maintaining stable temperatures within ideal ranges. Great job!',
    actionLabel: 'View All Temps',
  },
]

export const MOCK_CHAT_RESPONSES = [
  "Based on your tank parameters, everything looks healthy! Your pH is within the ideal range for your community fish. I'd recommend doing a 25% water change this weekend to maintain optimal water quality.",
  "For your planted tank, I'd suggest increasing your CO2 injection slightly. Your plants would benefit from about 30ppm CO2 during the photoperiod. Also consider adding root tabs for your sword plants.",
  "The cycling process in your new tank is progressing well. You should start seeing nitrite levels drop within the next week. Don't add any fish until both ammonia and nitrite read zero for at least 3 consecutive days.",
]

export function isMockMode(): boolean {
  return process.env.MOCK_MODE === 'true'
}
