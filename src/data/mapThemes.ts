import { MapThemeConfig, MapThemeId } from '../types';

export const MAP_THEMES: Record<MapThemeId, MapThemeConfig> = {
  emerald: {
    id: 'emerald',
    name: '雅致暗金',
    bg: 'bg-[#0c0c0e]',
    borderColor: '#3a3a3e',
    areaColor: '#1e1e21',
    hoverColor: '#d4af37',
    selectedColor: '#c5a059',
    colorRange: ['#1e1e21', '#c5a059'],
    textColor: '#d1d1d1'
  },
  tech: {
    id: 'tech',
    name: '科技深蓝',
    bg: 'bg-[#0a0f1d]',
    borderColor: '#1e293b',
    areaColor: '#111827',
    hoverColor: '#38bdf8',
    selectedColor: '#0284c7',
    colorRange: ['#111827', '#38bdf8'],
    textColor: '#e2e8f0'
  },
  warm: {
    id: 'warm',
    name: '暖阳古铜',
    bg: 'bg-[#120f0d]',
    borderColor: '#3d2e24',
    areaColor: '#241a15',
    hoverColor: '#f59e0b',
    selectedColor: '#d97706',
    colorRange: ['#241a15', '#f59e0b'],
    textColor: '#e5e7eb'
  },
  ink: {
    id: 'ink',
    name: '水墨墨韵',
    bg: 'bg-[#111113]',
    borderColor: '#2e2e33',
    areaColor: '#1c1c20',
    hoverColor: '#a8a29e',
    selectedColor: '#c5a059',
    colorRange: ['#1c1c20', '#d1d1d1'],
    textColor: '#e5e7eb'
  }
};

