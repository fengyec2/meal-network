import React, { useRef } from 'react';
import { X, Download, Share2, MapPin, Sparkles, GraduationCap, Users } from 'lucide-react';
import { Friend } from '../types';

interface ExportCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  friends: Friend[];
  unlockedProvincesCount: number;
}

export const ExportCardModal: React.FC<ExportCardModalProps> = ({
  isOpen,
  onClose,
  friends,
  unlockedProvincesCount
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  // Group friends by province
  const provinceSummary = Array.from(
    friends.reduce((map, f) => {
      if (!map.has(f.province)) map.set(f.province, []);
      map.get(f.province)!.push(f);
      return map;
    }, new Map<string, Friend[]>())
  ).sort((a, b) => b[1].length - a[1].length);

  const handlePrintOrSave = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="w-full max-w-lg bg-[#141416] rounded-3xl shadow-2xl border border-[#2a2a2e] overflow-hidden text-[#d1d1d1]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#2a2a2e] bg-[#1a1a1c] flex items-center justify-between">
          <h3 className="text-sm font-bold font-serif text-white flex items-center gap-2">
            <Share2 className="w-4 h-4 text-[#c5a059]" />
            生成全国蹭饭手账海报
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-[#6e6e76] hover:text-white rounded-lg hover:bg-[#1e1e21]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Poster Printable Canvas */}
        <div className="p-6 bg-[#0c0c0e] overflow-y-auto max-h-[70vh]">
          <div 
            ref={cardRef}
            className="p-6 bg-[#141416] rounded-2xl border border-[#2a2a2e] shadow-lg space-y-5"
          >
            {/* Poster Banner */}
            <div className="p-5 rounded-xl bg-[#1e1e21] border border-[#2a2a2e] text-white text-center shadow-md">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#c5a059] bg-[#141416] border border-[#2a2a2e] px-2.5 py-0.5 rounded-full">
                毕业去向与各地据点
              </span>
              <h2 className="text-xl font-bold font-serif text-white mt-2">我的全国蹭饭地图</h2>
              <p className="text-xs text-[#6e6e76] mt-1">
                已点亮全国 <strong className="text-[#c5a059] text-sm">{unlockedProvincesCount}</strong> 个省份，共结识 <strong className="text-[#c5a059] text-sm">{friends.length}</strong> 位蹭饭好友！
              </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3 text-center text-xs">
              <div className="p-3 bg-[#1e1e21] rounded-xl border border-[#2a2a2e]">
                <MapPin className="w-4 h-4 text-[#c5a059] mx-auto mb-1" />
                <span className="text-[#6e6e76] text-[11px]">覆盖省份</span>
                <p className="font-bold text-white text-sm mt-0.5">
                  {unlockedProvincesCount} / 34 个
                </p>
              </div>

              <div className="p-3 bg-[#1e1e21] rounded-xl border border-[#2a2a2e]">
                <Users className="w-4 h-4 text-[#c5a059] mx-auto mb-1" />
                <span className="text-[#6e6e76] text-[11px]">蹭饭好友总数</span>
                <p className="font-bold text-white text-sm mt-0.5">
                  {friends.length} 位
                </p>
              </div>
            </div>

            {/* Province Highlights */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-white border-b border-[#2a2a2e] pb-1">
                📍 各省据点与高校清单
              </h4>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {provinceSummary.map(([prov, list]) => (
                  <div key={prov} className="p-2.5 bg-[#1e1e21] rounded-xl border border-[#2a2a2e] text-xs">
                    <div className="flex items-center justify-between font-bold text-white mb-1">
                      <span>📍 {prov} ({list.length}人)</span>
                      <span className="text-[11px] text-[#c5a059]">
                        {Array.from(new Set(list.map(f => f.school))).slice(0, 2).join('、')}
                      </span>
                    </div>
                    <div className="text-[11px] text-[#6e6e76] truncate">
                      好友: {list.map(f => f.name).join('、')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Watermark */}
            <div className="pt-3 border-t border-[#2a2a2e] text-center text-[10px] text-[#6e6e76] flex items-center justify-between">
              <span>生成自全国蹭饭地图助手</span>
              <span>祝毕业快乐 · 聚散皆是星辰</span>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 border-t border-[#2a2a2e] bg-[#1a1a1c] flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-[#6e6e76] hover:text-[#d1d1d1] hover:bg-[#1e1e21] rounded-xl transition"
          >
            关闭
          </button>
          <button
            onClick={handlePrintOrSave}
            className="px-5 py-2 bg-[#c5a059] hover:bg-[#d4af37] text-[#0c0c0e] rounded-xl text-xs font-bold transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            打印/保存为PDF手账
          </button>
        </div>

      </div>
    </div>
  );
};
