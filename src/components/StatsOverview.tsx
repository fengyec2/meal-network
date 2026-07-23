import React, { useMemo } from 'react';
import { 
  BarChart2, 
  MapPin, 
  GraduationCap, 
  Trophy, 
  PieChart as PieIcon, 
  Sparkles,
  Compass
} from 'lucide-react';
import { Friend } from '../types';
import { CHINA_PROVINCES } from '../data/universityProvinceMap';

interface StatsOverviewProps {
  friends: Friend[];
  onSelectProvince: (province: string) => void;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  friends,
  onSelectProvince
}) => {
  // Top Provinces
  const topProvinces = useMemo(() => {
    const counts: Record<string, number> = {};
    friends.forEach(f => {
      counts[f.province] = (counts[f.province] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([province, count]) => ({ province, count }))
      .sort((a, b) => b.count - a.count);
  }, [friends]);

  // Top Universities
  const topUniversities = useMemo(() => {
    const counts: Record<string, { count: number; province: string }> = {};
    friends.forEach(f => {
      if (!counts[f.school]) {
        counts[f.school] = { count: 0, province: f.province };
      }
      counts[f.school].count += 1;
    });

    return Object.entries(counts)
      .map(([school, data]) => ({ school, count: data.count, province: data.province }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [friends]);

  // Total unlocked provinces
  const unlockedCount = topProvinces.length;
  const coveragePercent = Math.round((unlockedCount / 34) * 100);

  return (
    <div className="space-y-6">
      
      {/* Top Banner Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Card 1: National Coverage */}
        <div className="p-6 bg-[#141416] rounded-2xl border border-[#2a2a2e] shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[#6e6e76] uppercase tracking-wider">
                全国版图解锁率
              </span>
              <h3 className="text-2xl font-black font-serif text-white mt-1">
                {coveragePercent}%
              </h3>
              <p className="text-xs text-[#c5a059] font-medium mt-1">
                已点亮 {unlockedCount} / 34 个省级行政区
              </p>
            </div>
            <div className="p-3 bg-[#1e1e21] border border-[#2a2a2e] text-[#c5a059] rounded-2xl">
              <Compass className="w-8 h-8" />
            </div>
          </div>

          <div className="w-full bg-[#1a1a1c] rounded-full h-2 mt-4 overflow-hidden border border-[#2a2a2e]">
            <div 
              className="bg-[#c5a059] h-2 rounded-full transition-all duration-1000"
              style={{ width: `${coveragePercent}%` }}
            ></div>
          </div>
        </div>

        {/* Card 2: Total Friends */}
        <div className="p-6 bg-[#141416] rounded-2xl border border-[#2a2a2e] shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[#6e6e76] uppercase tracking-wider">
                蹭饭点数总计
              </span>
              <h3 className="text-2xl font-black font-serif text-[#c5a059] mt-1">
                {friends.length} 人
              </h3>
              <p className="text-xs text-[#6e6e76] mt-1">
                平均每省 {unlockedCount > 0 ? (friends.length / unlockedCount).toFixed(1) : 0} 位好友
              </p>
            </div>
            <div className="p-3 bg-[#1e1e21] border border-[#2a2a2e] text-[#c5a059] rounded-2xl">
              <Sparkles className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* Card 3: Total Universities */}
        <div className="p-6 bg-[#141416] rounded-2xl border border-[#2a2a2e] shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[#6e6e76] uppercase tracking-wider">
                涵盖高校总数
              </span>
              <h3 className="text-2xl font-black font-serif text-white mt-1">
                {topUniversities.length} 所
              </h3>
              <p className="text-xs text-[#6e6e76] mt-1">
                包含985/211及全国各省地标院校
              </p>
            </div>
            <div className="p-3 bg-[#1e1e21] border border-[#2a2a2e] text-[#c5a059] rounded-2xl">
              <GraduationCap className="w-8 h-8" />
            </div>
          </div>
        </div>

      </div>

      {/* Main Grid: Top Provinces & Top Schools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Top Provinces Ranking */}
        <div className="p-6 bg-[#141416] rounded-2xl border border-[#2a2a2e] shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold font-serif text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#c5a059]" />
              热门蹭饭省份 Top 8
            </h3>
            <span className="text-xs text-[#6e6e76]">点击省份直达地图</span>
          </div>

          <div className="space-y-3">
            {topProvinces.slice(0, 8).map((item, idx) => {
              const maxVal = topProvinces[0]?.count || 1;
              const percent = Math.round((item.count / maxVal) * 100);

              return (
                <div 
                  key={item.province}
                  onClick={() => onSelectProvince(item.province)}
                  className="p-3 rounded-xl bg-[#1e1e21] hover:bg-[#2a2a2e] transition cursor-pointer group border border-[#2a2a2e] hover:border-[#c5a059]"
                >
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold ${
                        idx === 0 ? 'bg-[#c5a059] text-[#0c0c0e]' :
                        idx === 1 ? 'bg-[#6e6e76] text-white' :
                        idx === 2 ? 'bg-[#2a2a2e] text-[#c5a059]' : 'bg-[#141416] text-[#6e6e76]'
                      }`}>
                        {idx + 1}
                      </span>
                      <span className="text-white font-bold group-hover:text-[#c5a059] transition">
                        📍 {item.province}
                      </span>
                    </div>
                    <span className="text-[#c5a059] font-bold">
                      {item.count} 人
                    </span>
                  </div>

                  <div className="w-full bg-[#141416] rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-[#c5a059] h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Universities List */}
        <div className="p-6 bg-[#141416] rounded-2xl border border-[#2a2a2e] shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold font-serif text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#c5a059]" />
              好友去向最多高校 Top 6
            </h3>
          </div>

          <div className="space-y-3">
            {topUniversities.map((item, idx) => (
              <div 
                key={item.school}
                className="p-3.5 rounded-xl bg-[#1e1e21] border border-[#2a2a2e] flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#141416] text-[#c5a059] rounded-xl font-bold text-xs border border-[#2a2a2e]">
                    🏫
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">
                      {item.school}
                    </h4>
                    <span className="text-[11px] text-[#6e6e76]">
                      位于: {item.province}
                    </span>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-lg bg-[#141416] text-[#c5a059] border border-[#2a2a2e] font-bold text-xs">
                  {item.count} 位同学
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
