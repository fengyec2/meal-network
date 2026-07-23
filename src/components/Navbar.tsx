import React, { useRef } from 'react';
import { 
  MapPin, 
  Upload, 
  Download, 
  Plus, 
  Dice5, 
  Palette, 
  RotateCcw, 
  Users, 
  GraduationCap, 
  Table, 
  Map,
  BarChart2,
  Sparkles
} from 'lucide-react';
import { MapThemeId } from '../types';
import { MAP_THEMES } from '../data/mapThemes';

interface NavbarProps {
  activeTab: 'map' | 'list' | 'stats';
  setActiveTab: (tab: 'map' | 'list' | 'stats') => void;
  unlockedProvincesCount: number;
  totalFriendsCount: number;
  totalSchoolsCount: number;
  hasRootDataXlsx: boolean;
  onFileUpload: (file: File) => void;
  onDownloadTemplate: () => void;
  onOpenRoulette: () => void;
  currentTheme: MapThemeId;
  onChangeTheme: (theme: MapThemeId) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  unlockedProvincesCount,
  totalFriendsCount,
  totalSchoolsCount,
  hasRootDataXlsx,
  onFileUpload,
  onDownloadTemplate,
  onOpenRoulette,
  currentTheme,
  onChangeTheme
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#141416]/95 backdrop-blur-md border-b border-[#2a2a2e] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-3 gap-3">
          
          {/* Logo & Main Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#1e1e21] border border-[#2a2a2e] text-[#c5a059] rounded-lg shadow-sm flex items-center justify-center">
                <MapPin className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-serif text-[#c5a059] flex items-center gap-2 tracking-tight">
                  全国蹭饭地图
                  <span className="text-[10px] px-2 py-0.5 rounded-md font-mono uppercase tracking-wider bg-[#1e1e21] text-[#c5a059] border border-[#2a2a2e]">
                    MEAL NETWORK
                  </span>
                </h1>
                <p className="text-xs text-[#6e6e76] uppercase tracking-[0.15em] mt-0.5">
                  China Meal-Sharing Network
                </p>
              </div>
            </div>

            {/* Quick Mobile Action Toggle */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={onOpenRoulette}
                title="蹭饭抽签"
                className="p-2 bg-[#c5a059] text-[#0c0c0e] rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1 active:scale-95 transition"
              >
                <Dice5 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Real-time Statistics Badges */}
          <div className="flex items-center gap-2 overflow-x-auto py-1 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1e1e21] text-[#d1d1d1] border border-[#2a2a2e] font-medium whitespace-nowrap">
              <MapPin className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>覆盖省份: <strong className="text-[#c5a059] text-sm font-serif">{unlockedProvincesCount}</strong>/34</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1e1e21] text-[#d1d1d1] border border-[#2a2a2e] font-medium whitespace-nowrap">
              <Users className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>饭友总数: <strong className="text-[#c5a059] text-sm font-serif">{totalFriendsCount}</strong> 人</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1e1e21] text-[#d1d1d1] border border-[#2a2a2e] font-medium whitespace-nowrap">
              <GraduationCap className="w-3.5 h-3.5 text-[#c5a059]" />
              <span>涵盖高校: <strong className="text-[#c5a059] text-sm font-serif">{totalSchoolsCount}</strong> 所</span>
            </div>
          </div>

          {/* Action Buttons & Tab Switchers */}
          <div className="flex items-center justify-between lg:justify-end gap-2 flex-wrap">
            
            {/* View Tabs */}
            <div className="inline-flex rounded-lg p-1 bg-[#1a1a1c] border border-[#2a2a2e]">
              <button
                onClick={() => setActiveTab('map')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
                  activeTab === 'map'
                    ? 'bg-[#c5a059] text-[#0c0c0e] font-bold shadow-xs'
                    : 'text-[#6e6e76] hover:text-[#d1d1d1]'
                }`}
              >
                <Map className="w-3.5 h-3.5" />
                可视化地图
              </button>
              <button
                onClick={() => setActiveTab('list')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
                  activeTab === 'list'
                    ? 'bg-[#c5a059] text-[#0c0c0e] font-bold shadow-xs'
                    : 'text-[#6e6e76] hover:text-[#d1d1d1]'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                数据详情表
              </button>
              <button
                onClick={() => setActiveTab('stats')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
                  activeTab === 'stats'
                    ? 'bg-[#c5a059] text-[#0c0c0e] font-bold shadow-xs'
                    : 'text-[#6e6e76] hover:text-[#d1d1d1]'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                统计图表
              </button>
            </div>

            {/* Buttons Row */}
            <div className="flex items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileChange}
                className="hidden"
              />

              {/* Upload XLSX and Download Template (Hidden if root data.xlsx exists) */}
              {!hasRootDataXlsx && (
                <>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#c5a059] hover:bg-[#d4af37] text-[#0c0c0e] rounded-lg text-xs font-bold uppercase tracking-wider shadow-xs transition active:scale-95 cursor-pointer"
                    title="导入包含姓名、学校、省份、备注的XLSX文件"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    导入 XLSX
                  </button>

                  <button
                    onClick={onDownloadTemplate}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#1e1e21] hover:bg-[#2a2a2e] text-[#d1d1d1] rounded-lg text-xs font-medium border border-[#2a2a2e] transition"
                    title="下载标准XLSX表格模板"
                  >
                    <Download className="w-3.5 h-3.5 text-[#6e6e76]" />
                    <span className="hidden sm:inline">下载模板</span>
                  </button>
                </>
              )}

              {/* Roulette Wheel */}
              <button
                onClick={onOpenRoulette}
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1e1e21] hover:bg-[#2a2a2e] text-[#c5a059] rounded-lg text-xs font-medium border border-[#2a2a2e] hover:border-[#c5a059] transition active:scale-95"
                title="随机抽取去哪个省份/找谁蹭饭"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#c5a059] animate-spin" />
                今天去哪蹭饭？
              </button>

              {/* Map Theme Selector */}
              <div className="relative group">
                <button
                  className="p-1.5 bg-[#1e1e21] hover:bg-[#2a2a2e] text-[#d1d1d1] rounded-lg border border-[#2a2a2e] text-xs transition"
                  title="切换地图皮肤"
                >
                  <Palette className="w-4 h-4 text-[#c5a059]" />
                </button>
                <div className="absolute right-0 top-full mt-1 hidden group-hover:block w-36 bg-[#141416] border border-[#2a2a2e] rounded-xl shadow-2xl py-1 z-50">
                  <div className="px-3 py-1 text-[10px] font-semibold text-[#6e6e76] uppercase tracking-wider">
                    地图视觉主题
                  </div>
                  {Object.values(MAP_THEMES).map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => onChangeTheme(theme.id)}
                      className={`w-full text-left px-3 py-1.5 text-xs font-medium flex items-center justify-between transition ${
                        currentTheme === theme.id
                          ? 'bg-[#1e1e21] text-[#c5a059] font-bold'
                          : 'text-[#d1d1d1] hover:bg-[#1a1a1c]'
                      }`}
                    >
                      <span>{theme.name}</span>
                      <span className="w-2.5 h-2.5 rounded-full border border-[#2a2a2e]" style={{ backgroundColor: theme.colorRange[1] }}></span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
