import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { chinaGeoJson } from '../data/chinaGeoJson';
import { CHINA_PROVINCES } from '../data/universityProvinceMap';
import { Friend, MapThemeId } from '../types';
import { MAP_THEMES } from '../data/mapThemes';
import { Maximize2, Minimize2, RotateCcw, Search, MapPin, Info, Sparkles, Users } from 'lucide-react';

interface ChinaMapProps {
  friends: Friend[];
  selectedProvince: string | null;
  onSelectProvince: (province: string) => void;
  currentTheme: MapThemeId;
}

// Register china map geometry once
if (!echarts.getMap('china')) {
  echarts.registerMap('china', chinaGeoJson as any);
}

export const ChinaMap: React.FC<ChinaMapProps> = ({
  friends,
  selectedProvince,
  onSelectProvince,
  currentTheme
}) => {
  const chartRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const graduationRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPinLabels, setShowPinLabels] = useState(true);
  const [showGraduation, setShowGraduation] = useState(false);
  const [graduationTick, setGraduationTick] = useState(0); // force rebuild graduation overlay on map pan

  // Group friends by province
  const provinceMap = useMemo(() => {
    const map = new Map<string, Friend[]>();
    CHINA_PROVINCES.forEach(p => map.set(p, []));

    friends.forEach(f => {
      const prov = f.province;
      if (map.has(prov)) {
        map.get(prov)!.push(f);
      } else {
        // Fallback matching
        for (const stdProv of CHINA_PROVINCES) {
          if (prov.includes(stdProv) || stdProv.includes(prov)) {
            map.get(stdProv)!.push(f);
            break;
          }
        }
      }
    });

    return map;
  }, [friends]);

  // Find max friends count for scale
  const maxFriendsCount = useMemo(() => {
    let max = 1;
    provinceMap.forEach((list) => {
      if (list.length > max) max = list.length;
    });
    return max;
  }, [provinceMap]);

  // Build ECharts option
  const themeConfig = MAP_THEMES[currentTheme] || MAP_THEMES.emerald;

  const chartOption = useMemo(() => {
    const mapData = CHINA_PROVINCES.map(prov => {
      const list = provinceMap.get(prov) || [];
      const isSelected = selectedProvince === prov;
      
      return {
        name: prov,
        value: list.length,
        selected: isSelected,
        itemStyle: isSelected ? {
          areaColor: themeConfig.selectedColor,
          borderColor: '#ffffff',
          borderWidth: 2,
          shadowBlur: 10,
          shadowColor: 'rgba(0,0,0,0.3)'
        } : undefined
      };
    });

    return {
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(20, 20, 22, 0.95)',
        borderColor: '#2a2a2e',
        borderWidth: 1,
        padding: [12, 16],
        textStyle: {
          color: '#d1d1d1',
          fontSize: 12,
          fontFamily: 'sans-serif'
        },
        formatter: (params: any) => {
          const provName = params.name;
          const list = provinceMap.get(provName) || [];
          if (list.length === 0) {
            return `
              <div style="font-weight: bold; margin-bottom: 4px; display: flex; align-items: center; gap: 6px; color: #ffffff;">
                <span>📍 ${provName}</span>
                <span style="font-size: 11px; color: #6e6e76;">(暂无蹭饭好友)</span>
              </div>
              <div style="font-size: 11px; color: #6e6e76;">点击省份可添加好友或记录去向</div>
            `;
          }

          // Group by school
          const schoolSet = Array.from(new Set(list.map(f => f.school)));
          const topFriends = list.slice(0, 4).map(f => `• ${f.name} (${f.school})`).join('<br/>');
          const moreCount = list.length > 4 ? list.length - 4 : 0;

          return `
            <div style="min-width: 180px;">
              <div style="font-weight: bold; font-size: 13px; margin-bottom: 6px; border-bottom: 1px solid #2a2a2e; padding-bottom: 4px; display: flex; justify-content: space-between; align-items: center; color: #ffffff;">
                <span>📍 ${provName}</span>
                <span style="background-color: #c5a059; color: #0c0c0e; font-weight: bold; padding: 1px 8px; border-radius: 4px; font-size: 10px;">${list.length} 人可蹭饭</span>
              </div>
              <div style="font-size: 11px; color: #c5a059; margin-bottom: 4px;">
                涉及高校 (${schoolSet.length}所): ${schoolSet.slice(0, 2).join('、')}${schoolSet.length > 2 ? '等' : ''}
              </div>
              <div style="font-size: 11px; color: #6e6e76; margin-top: 6px; line-height: 1.5;">
                ${topFriends}
                ${moreCount > 0 ? `<div style="color: #c5a059; font-size: 10px; margin-top: 2px;">+ 还有 ${moreCount} 位好友...</div>` : ''}
              </div>
              <div style="font-size: 10px; color: #c5a059; margin-top: 8px; text-align: right; font-weight: 500;">👉 点击查看该省份详情名单</div>
            </div>
          `;
        }
      },
      visualMap: {
        min: 0,
        max: Math.max(maxFriendsCount, 5),
        left: '20',
        bottom: '20',
        text: ['好友多', '暂无'],
        calculable: true,
        inRange: {
          color: themeConfig.colorRange
        },
        textStyle: {
          color: '#6e6e76',
          fontSize: 11
        }
      },
      geo: {
        map: 'china',
        roam: true,
        zoom: 1.15,
        center: [104.195397, 35.86166],
        selectedMode: 'single',
        label: {
          show: true,
          fontSize: 11,
          color: '#d1d1d1',
          formatter: (params: any) => {
            const list = provinceMap.get(params.name) || [];
            if (showPinLabels && list.length > 0) {
              return `${params.name}\n(${list.length})`;
            }
            return params.name;
          }
        },
        itemStyle: {
          areaColor: themeConfig.areaColor,
          borderColor: themeConfig.borderColor,
          borderWidth: 1
        },
        emphasis: {
          label: {
            show: true,
            fontWeight: 'bold',
            color: '#ffffff'
          },
          itemStyle: {
            areaColor: themeConfig.hoverColor,
            borderWidth: 1.5,
            borderColor: '#c5a059',
            shadowBlur: 8,
            shadowColor: 'rgba(0,0,0,0.5)'
          }
        },
        select: {
          label: {
            show: true,
            color: '#0c0c0e',
            fontWeight: 'bold'
          },
          itemStyle: {
            areaColor: themeConfig.selectedColor,
            borderColor: '#c5a059',
            borderWidth: 2
          }
        }
      },
      series: [
        {
          name: '蹭饭分布',
          type: 'map',
          geoIndex: 0,
          selectedMode: 'single',
          data: mapData
        }
      ]
    };
  }, [provinceMap, selectedProvince, themeConfig, maxFriendsCount, showPinLabels]);

  // Synchronize React selectedProvince state with ECharts instance selection state
  useEffect(() => {
    if (!chartRef.current) return;
    const echartInstance = chartRef.current.getEchartsInstance();
    if (!echartInstance) return;

    // Clear all existing selections in ECharts
    CHINA_PROVINCES.forEach(prov => {
      echartInstance.dispatchAction({
        type: 'geoUnSelect',
        name: prov
      });
      echartInstance.dispatchAction({
        type: 'unselect',
        name: prov,
        seriesIndex: 0
      });
    });

    // If a province is selected, highlight it via ECharts action
    if (selectedProvince) {
      echartInstance.dispatchAction({
        type: 'geoSelect',
        name: selectedProvince
      });
      echartInstance.dispatchAction({
        type: 'select',
        name: selectedProvince,
        seriesIndex: 0
      });
    }
  }, [selectedProvince]);

  // Handle map click
  const onChartClick = (params: any) => {
    if (params.name) {
      if (selectedProvince === params.name) {
        onSelectProvince('');
      } else {
        onSelectProvince(params.name);
      }
    }
  };

  // Reset zoom view
  const handleResetZoom = () => {
    if (chartRef.current) {
      const echartInstance = chartRef.current.getEchartsInstance();
      CHINA_PROVINCES.forEach(prov => {
        echartInstance.dispatchAction({
          type: 'geoUnSelect',
          name: prov
        });
        echartInstance.dispatchAction({
          type: 'unselect',
          name: prov,
          seriesIndex: 0
        });
      });
      echartInstance.setOption({
        geo: {
          zoom: 1.15,
          center: [104.195397, 35.86166]
        }
      });
    }
    onSelectProvince('');
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Handle search — first try friend name, then province name
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const query = searchQuery.trim().toLowerCase();
    // ponytail: search friends by name first; fallback to province match
    const matchingFriend = friends.find(f => f.name.toLowerCase().includes(query) || query.includes(f.name.toLowerCase()));
    const matchedProv = matchingFriend ? matchingFriend.province : CHINA_PROVINCES.find(p => p.includes(query) || query.includes(p));
    if (matchedProv) {
      onSelectProvince(matchedProv);
      setSearchQuery('');
    }
  };

  // Compute graduation overlay positions: map province centers to screen coords,
  // then project outward to place labels and curved lines
  const { lines, labels } = useMemo(() => {
    if (!showGraduation || !chartRef.current) return { lines: [] as any[], labels: [] as any[] };

    const echartsInstance = chartRef.current.getEchartsInstance();
    if (!echartsInstance) return { lines: [], labels: [] };

    // Get province centers from GeoJson
    const centers: Map<string, [number, number]> = new Map();
    if (chinaGeoJson?.features) {
      for (const feature of chinaGeoJson.features as any[]) {
        const name = feature.properties?.name;
        const center = feature.properties?.center;
        if (name && center && Array.isArray(center)) {
          centers.set(name, center as [number, number]);
        }
      }
    }

    const rect = containerRef.current?.getBoundingClientRect();
    const mapW = rect?.width || 900;
    const mapH = rect?.height || 700;

    // Only include provinces that have friends
    interface ProvEntry { name: string; lngLat: [number, number]; friends: Friend[]; screenPos: [number, number] | null }
    const validProvs: ProvEntry[] = [];
    
    CHINA_PROVINCES.forEach(prov => {
      const provFriends = provinceMap.get(prov) || [];
      if (provFriends.length === 0) return;
      const center = centers.get(prov);
      if (!center) return;
      const sp = echartsInstance.convertToPixel(
        { coordSys: 'geo', geoIndex: 0 }, 
        center
      );
      validProvs.push({ name: prov, lngLat: center, friends: provFriends, screenPos: sp ? (sp as [number, number]) : null });
    });

    const maxTextHeight = 11;
    const maxLabelWidth = Math.min(mapW * 0.22, 250);
    const pad = 16;
    const lineH = (p: ProvEntry) => p.friends.length * maxTextHeight + 18; // province header + entries + padding
    const entryH = (p: ProvEntry) => Math.ceil(p.friends.length / 2) * maxTextHeight + 14;

    // Simple placement: project outward from map center along radial direction
    const mapCx = mapW / 2;
    const mapCy = mapH / 2;

    const projectedLines: any[] = [];
    const projectedLabels: any[] = [];

    // Try to fit labels without overlap using a simple greedy packing
    interface LabelSlot { x: number; y: number; w: number; h: number }
    const occupiedSlots: LabelSlot[] = [];
    
    const canPlace = (nx: number, ny: number, nw: number, nh: number): boolean => {
      for (const s of occupiedSlots) {
        if (!(nx + nw < s.x || nx > s.x + s.w || ny + nh < s.y || ny > s.y + s.h)) {
          return false;
        }
      }
      return true;
    };

    const tryPlace = (entry: ProvEntry, side: 'left' | 'right', row: number): { x: number; y: number; lineEnd: [number, number] } | null => {
      if (!entry.screenPos) return null;
      const [sx, sy] = entry.screenPos;
      const h = entryH(entry);
      
      // Position: push outward along radial direction, stagger by row
      const radialX = sx - mapCx;
      const radialY = sy - mapCy;
      const dist = Math.sqrt(radialX * radialX + radialY * radialY) || 1;
      
      // Push factor: how far outside the map edge to place label
      const pushDist = 40 + row * 15;
      const offsetX = (radialX / dist) * pushDist;
      const offsetY = (radialY / dist) * pushDist * 0.3; // Less vertical offset for subtlety
      
      let lx: number, ly: number;
      
      if (side === 'left') {
        lx = sx - 15 - maxLabelWidth + offsetX * 0.5;
      } else {
        lx = sx + 15 + offsetX * 0.5;
      }
      ly = sy + offsetY;
      
      // Clamp to visible area
      lx = Math.max(pad, Math.min(lx, mapW - maxLabelWidth - pad));
      ly = Math.max(pad, Math.min(ly, mapH - h - pad));

      if (!canPlace(lx, ly, maxLabelWidth, h)) {
        // Fallback: just stack vertically from top
        ly = pad + occupiedSlots.length * (h + 6);
        lx = side === 'left' ? pad : mapW - maxLabelWidth - pad;
        if (!canPlace(lx, ly, maxLabelWidth, h)) return null;
      }

      // Try to find a better non-overlapping position
      occupiedSlots.push({ x: lx, y: ly, w: maxLabelWidth, h });
      
      const lineEndX = side === 'left' ? lx + maxLabelWidth + 5 : lx - 5;
      const lineEndY = ly + h / 2;

      return { x: lx, y: ly, lineEnd: [lineEndX, lineEndY] };
    };

    validProvs.forEach((entry, i) => {
      if (!entry.screenPos) return;
      
      const side = entry.name === '台湾' || entry.name === '香港' || entry.name === '澳门' || entry.lngLat[0] >= 108 ? 'right' : 'left';
      const pos = tryPlace(entry, side, i);
      if (!pos) return;

      const [sx, sy] = entry.screenPos;
      const [lx, ly, lEx, lEy] = [pos.x, pos.y, pos.lineEnd[0], pos.lineEnd[1]];
      
      // Build curved path: quadratic bezier from province center to label edge
      const cpX = (sx + lEx) / 2;
      const cpY = (sy + lEy) / 2 + 20; // Slight curve downward
      
      projectedLines.push({
        d: `M ${sx} ${sy} Q ${cpX} ${cpY} ${lEx} ${lEy}`,
        province: entry.name,
      });

      projectedLabels.push({
        x: pos.x,
        y: pos.y,
        width: maxLabelWidth,
        text: entry.friends.map(f => `${f.name} · ${f.school}`).join('\n'),
        province: entry.name,
      });
    });

    return { lines: projectedLines, labels: projectedLabels };
  }, [showGraduation, provinceMap, graduationTick]);

  return (
    <div 
      ref={containerRef}
      className={`relative w-full rounded-2xl border border-[#2a2a2e] shadow-2xl overflow-hidden transition-all ${
        themeConfig.bg
      } ${isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen w-screen' : 'h-[620px] lg:h-[720px]'}`}
    >
      {/* Map Header Floating Toolbar */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        
        {/* Quick Search Bar */}
        <form 
          onSubmit={handleSearchSubmit} 
          className="pointer-events-auto flex items-center gap-1.5 bg-[#141416]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#2a2a2e] shadow-md max-w-xs w-full"
        >
          <Search className="w-4 h-4 text-[#6e6e76]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索人名或省份 (如: 小王、浙江)..."
            className="w-full text-xs bg-transparent text-[#d1d1d1] placeholder-[#6e6e76] focus:outline-none"
          />
          <button type="submit" className="text-xs bg-[#c5a059] hover:bg-[#d4af37] text-[#0c0c0e] px-2.5 py-0.5 rounded-md font-bold transition">
            跳转
          </button>
        </form>

        {/* Map Control Buttons */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={() => setShowPinLabels(!showPinLabels)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border shadow-md backdrop-blur-md transition ${
              showPinLabels 
                ? 'bg-[#1e1e21] text-[#c5a059] border-[#c5a059]' 
                : 'bg-[#141416]/90 text-[#6e6e76] border-[#2a2a2e] hover:text-[#d1d1d1]'
            }`}
          >
            {showPinLabels ? '显示省份人数' : '仅显示省名'}
          </button>

          {/* Graduation Toggle */}
          <button
            onClick={() => setShowGraduation(!showGraduation)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border shadow-md backdrop-blur-md transition flex items-center gap-1.5 ${
              showGraduation 
                ? 'bg-[#1e1e21] text-[#c5a059] border-[#c5a059]' 
                : 'bg-[#141416]/90 text-[#6e6e76] border-[#2a2a2e] hover:text-[#d1d1d1]'
            }`}
            title="毕业去向图（姓名+院校连线）"
          >
            <Users className="w-3.5 h-3.5" />
            {showGraduation ? '去向图 ON' : '去向图'}
          </button>

          <button
            onClick={handleResetZoom}
            className="p-2 bg-[#141416]/90 text-[#d1d1d1] rounded-xl border border-[#2a2a2e] shadow-md hover:bg-[#1e1e21] transition"
            title="复位地图缩放"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-2 bg-[#141416]/90 text-[#d1d1d1] rounded-xl border border-[#2a2a2e] shadow-md hover:bg-[#1e1e21] transition"
            title={isFullscreen ? '退出全屏' : '全屏显示地图'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Selected Province Floating Badge */}
      {selectedProvince && (
        <div className="absolute top-16 left-4 z-10 bg-[#c5a059] text-[#0c0c0e] px-3.5 py-1.5 rounded-xl shadow-xl border border-[#d4af37] flex items-center gap-2 text-xs font-bold animate-bounce">
          <MapPin className="w-4 h-4" />
          <span>当前聚焦: {selectedProvince}</span>
          <button 
            onClick={() => onSelectProvince('')}
            className="ml-2 hover:bg-[#d4af37] p-0.5 rounded-full"
            title="清除聚焦"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main ECharts Map Canvas */}
      <ReactECharts
        ref={chartRef}
        option={chartOption}
        notMerge={true}
        style={{ height: '100%', width: '100%' }}
        onEvents={{ click: onChartClick, georoam: () => showGraduation && setGraduationTick(t => t + 1) }}
      />

      {/* Graduation Overlay: SVG lines + HTML labels */}
      {showGraduation && (
        <div
          ref={graduationRef}
          className="absolute inset-0 pointer-events-none overflow-visible"
          style={{ zIndex: 5 }}
        >
          <svg
            className="absolute inset-0 w-full h-full overflow-visible"
            style={{ pointerEvents: 'none' }}
          >
            {lines.map((line: any) => (
              <path
                key={line.province}
                d={line.d}
                fill="none"
                stroke="rgba(197, 160, 89, 0.3)"
                strokeWidth="1"
                strokeDasharray="4 3"
              />
            ))}
          </svg>
          
          {labels.map((label: any) => (
            <div
              key={label.province}
              className="absolute pointer-events-auto"
              style={{
                left: label.x,
                top: label.y,
                maxWidth: 250,
                color: '#c5a059',
                fontSize: '10px',
                lineHeight: '14px',
              }}
            >
              <div className="text-[#6e6e76] text-[9px] mb-0.5 font-bold tracking-wide border-b border-[#2a2a2e] pb-0.5">{label.province}</div>
              {label.text.split('\n').map((line: string, j: number) => (
                <div key={j} className="whitespace-nowrap text-[#c5a059]/90 truncate" title={line}>{line}</div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Floating Bottom Info Tip */}
      <div className="absolute bottom-4 right-4 z-10 bg-[#141416]/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[#2a2a2e] text-[11px] text-[#6e6e76] shadow-xs hidden sm:flex items-center gap-1.5">
        <Info className="w-3.5 h-3.5 text-[#c5a059]" />
        <span>支持滚轮缩放与拖拽地图，点击省份展开去向好友详情列表</span>
      </div>
    </div>
  );
};
