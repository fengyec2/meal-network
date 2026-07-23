import React, { useEffect, useState, useMemo } from 'react';
import { Friend, MapThemeId } from './types';
import { getStoredFriends, saveFriends } from './utils/storage';
import { parseExcelFile, parseExcelArrayBuffer, downloadExcelTemplate } from './utils/excelParser';
import { Navbar } from './components/Navbar';
import { ChinaMap } from './components/ChinaMap';
import { ProvinceDrawer } from './components/ProvinceDrawer';
import { FriendListTable } from './components/FriendListTable';
import { MealRouletteModal } from './components/MealRouletteModal';
import { StatsOverview } from './components/StatsOverview';
import { ExportCardModal } from './components/ExportCardModal';
import { MAP_THEMES } from './data/mapThemes';
import { Sparkles, MapPin, CheckCircle, AlertCircle, Share2 } from 'lucide-react';

export default function App() {
  const [friends, setFriends] = useState<Friend[]>(() => getStoredFriends());
  const [hasRootDataXlsx, setHasRootDataXlsx] = useState(false);
  const [activeTab, setActiveTab] = useState<'map' | 'list' | 'stats'>('map');
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [currentTheme, setCurrentTheme] = useState<MapThemeId>('emerald');

  // Modals
  const [isRouletteOpen, setIsRouletteOpen] = useState(false);
  const [isExportCardOpen, setIsExportCardOpen] = useState(false);

  // Notifications / Toast
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Check for data.xlsx in root directory on startup
  useEffect(() => {
    async function checkAndLoadRootXlsx() {
      try {
        const res = await fetch('/data.xlsx', { method: 'GET', cache: 'no-cache' });
        if (res.ok) {
          const contentType = res.headers.get('content-type') || '';
          if (!contentType.includes('text/html')) {
            const buffer = await res.arrayBuffer();
            if (buffer.byteLength > 0) {
              const result = parseExcelArrayBuffer(buffer);
              if (result.success && result.friends.length > 0) {
                setFriends(result.friends);
                setHasRootDataXlsx(true);
                return;
              }
            }
          }
        }
      } catch (err) {
        console.log('No root data.xlsx detected');
      }
      setHasRootDataXlsx(false);
    }

    checkAndLoadRootXlsx();
  }, []);

  // Sync state to localStorage whenever friends list changes
  useEffect(() => {
    saveFriends(friends);
  }, [friends]);

  // Derived statistics
  const unlockedProvincesCount = useMemo(() => {
    return new Set(friends.map(f => f.province)).size;
  }, [friends]);

  const totalSchoolsCount = useMemo(() => {
    return new Set(friends.map(f => f.school)).size;
  }, [friends]);

  // Excel File Upload Handler
  const handleFileUpload = async (file: File) => {
    showToast('正在解析表格数据，请稍候...', 'info');
    const result = await parseExcelFile(file);

    if (result.success) {
      if (result.friends.length === 0) {
        showToast('表格中未检测到有效的好友数据，请检查列名', 'error');
        return;
      }

      setFriends(result.friends);

      showToast(`成功导入 ${result.importedCount} 位好友数据！对应省份已自动映射打卡！`, 'success');
      setActiveTab('map');
    } else {
      showToast(result.errors.join('; ') || '文件导入失败', 'error');
    }
  };

  const currentThemeConfig = MAP_THEMES[currentTheme] || MAP_THEMES.emerald;

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors ${
      currentThemeConfig.bg
    } text-[#d1d1d1]`}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 flex items-center gap-2.5 px-4 py-3 bg-[#1e1e21] text-[#d1d1d1] backdrop-blur-md rounded-xl shadow-2xl border border-[#2a2a2e] animate-bounce text-xs font-medium">
          {toastMessage.type === 'success' && <CheckCircle className="w-4 h-4 text-[#c5a059] shrink-0" />}
          {toastMessage.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
          {toastMessage.type === 'info' && <Sparkles className="w-4 h-4 text-[#c5a059] shrink-0" />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unlockedProvincesCount={unlockedProvincesCount}
        totalFriendsCount={friends.length}
        totalSchoolsCount={totalSchoolsCount}
        hasRootDataXlsx={hasRootDataXlsx}
        onFileUpload={handleFileUpload}
        onDownloadTemplate={downloadExcelTemplate}
        onOpenRoulette={() => setIsRouletteOpen(true)}
        currentTheme={currentTheme}
        onChangeTheme={setCurrentTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Map View */}
        {activeTab === 'map' && (
          <div className="space-y-4">
            
            {/* Top Poster Callout Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-[#141416] rounded-xl border border-[#2a2a2e] shadow-xs gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#1e1e21] text-[#c5a059] rounded-lg border border-[#2a2a2e]">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold font-serif text-white tracking-wide">
                    全国省份蹭饭打卡地图
                  </h2>
                  <p className="text-xs text-[#6e6e76] mt-0.5">
                    悬浮省份预览大学名单，点击省份展开去向好友详情 · 颜色越深代表蹭饭据点越丰富
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsExportCardOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#1e1e21] hover:bg-[#2a2a2e] text-[#d1d1d1] hover:text-white rounded-lg text-xs font-medium border border-[#2a2a2e] hover:border-[#c5a059] transition"
              >
                <Share2 className="w-3.5 h-3.5 text-[#c5a059]" />
                生成蹭饭手账海报
              </button>
            </div>

            {/* Interactive ECharts Map Component */}
            <ChinaMap
              friends={friends}
              selectedProvince={selectedProvince}
              onSelectProvince={(prov) => setSelectedProvince(prov)}
              currentTheme={currentTheme}
            />

          </div>
        )}

        {/* Friend Table List View */}
        {activeTab === 'list' && (
          <FriendListTable
            friends={friends}
          />
        )}

        {/* Stats View */}
        {activeTab === 'stats' && (
          <StatsOverview
            friends={friends}
            onSelectProvince={(prov) => {
              setSelectedProvince(prov);
              setActiveTab('map');
            }}
          />
        )}

      </main>

      {/* Selected Province Slide-over Drawer */}
      <ProvinceDrawer
        province={selectedProvince}
        friends={friends}
        onClose={() => setSelectedProvince(null)}
      />

      {/* Meal Roulette Lottery Modal */}
      <MealRouletteModal
        isOpen={isRouletteOpen}
        onClose={() => setIsRouletteOpen(false)}
        friends={friends}
        onSelectProvince={(prov) => {
          setSelectedProvince(prov);
          setActiveTab('map');
        }}
      />

      {/* Export Poster Card Modal */}
      <ExportCardModal
        isOpen={isExportCardOpen}
        onClose={() => setIsExportCardOpen(false)}
        friends={friends}
        unlockedProvincesCount={unlockedProvincesCount}
      />

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-[#2a2a2e] text-center text-xs text-[#6e6e76]">
        <p className="tracking-widest uppercase text-[10px]">全国蹭饭中国地图 · CHINA MEAL-SHARING NETWORK</p>
      </footer>

    </div>
  );
}
