import React, { useMemo, useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Building2, 
  MapPin, 
  MessageSquare, 
  Phone
} from 'lucide-react';
import { Friend } from '../types';
import { CHINA_PROVINCES } from '../data/universityProvinceMap';
import { exportFriendsToExcel } from '../utils/excelParser';

interface FriendListTableProps {
  friends: Friend[];
}

export const FriendListTable: React.FC<FriendListTableProps> = ({
  friends
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProvinceFilter, setSelectedProvinceFilter] = useState<string>('ALL');

  // Filtered dataset
  const filteredFriends = useMemo(() => {
    return friends.filter(f => {
      const matchSearch = 
        f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.province.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.remark.toLowerCase().includes(searchTerm.toLowerCase());

      const matchProv = selectedProvinceFilter === 'ALL' || f.province === selectedProvinceFilter;

      return matchSearch && matchProv;
    });
  }, [friends, searchTerm, selectedProvinceFilter]);

  const handleExport = () => {
    exportFriendsToExcel(filteredFriends, `蹭饭好友通讯录_${selectedProvinceFilter === 'ALL' ? '全国' : selectedProvinceFilter}.xlsx`);
  };

  return (
    <div className="bg-[#141416] rounded-2xl border border-[#2a2a2e] shadow-2xl overflow-hidden">
      
      {/* Top Filter & Toolbar */}
      <div className="p-4 sm:p-6 border-b border-[#2a2a2e] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        
        {/* Left: Search & Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3 flex-1 max-w-2xl">
          
          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#6e6e76] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="检索姓名、学校、备注..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-[#1e1e21] border border-[#2a2a2e] rounded-xl text-[#d1d1d1] placeholder-[#6e6e76] focus:outline-none focus:border-[#c5a059]"
            />
          </div>

          {/* Province Filter Dropdown */}
          <div className="relative w-full sm:w-44">
            <Filter className="w-3.5 h-3.5 text-[#6e6e76] absolute left-3 top-3 pointer-events-none" />
            <select
              value={selectedProvinceFilter}
              onChange={(e) => setSelectedProvinceFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#1e1e21] border border-[#2a2a2e] rounded-xl text-[#d1d1d1] focus:outline-none focus:border-[#c5a059] cursor-pointer"
            >
              <option value="ALL">全部省份 ({friends.length})</option>
              {CHINA_PROVINCES.map(prov => {
                const count = friends.filter(f => f.province === prov).length;
                if (count === 0) return null;
                return (
                  <option key={prov} value={prov}>
                    {prov} ({count}人)
                  </option>
                );
              })}
            </select>
          </div>

        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#1e1e21] hover:bg-[#2a2a2e] text-[#d1d1d1] border border-[#2a2a2e] rounded-xl text-xs font-medium transition"
            title="导出为Excel文件"
          >
            <Download className="w-3.5 h-3.5 text-[#6e6e76]" />
            导出XLSX
          </button>
        </div>

      </div>

      {/* Main Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#1a1a1c] border-b border-[#2a2a2e] text-[11px] font-semibold text-[#6e6e76] uppercase tracking-wider">
              <th className="py-3.5 px-4">姓名</th>
              <th className="py-3.5 px-4">录取/就读学校</th>
              <th className="py-3.5 px-4">所在省份</th>
              <th className="py-3.5 px-4">蹭饭备注 / 口号</th>
              <th className="py-3.5 px-4">联系方式</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1e1e21] text-xs">
            {filteredFriends.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-[#6e6e76]">
                  暂无匹配的蹭饭好友数据
                </td>
              </tr>
            ) : (
              filteredFriends.map((f) => {
                return (
                  <tr 
                    key={f.id}
                    className="hover:bg-[#1e1e21]/60 transition"
                  >
                    <td className="py-3 px-4 font-bold text-white">
                      <div className="flex items-center gap-2">
                        <span className={`w-7 h-7 rounded-lg text-[11px] font-bold flex items-center justify-center bg-[#1e1e21] text-[#c5a059] border border-[#2a2a2e]`}>
                          {f.name.slice(0, 1)}
                        </span>
                        <span>{f.name}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-medium text-[#d1d1d1]">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[#c5a059]" />
                        <span>{f.school}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#1e1e21] text-[#c5a059] font-medium border border-[#2a2a2e]">
                        <MapPin className="w-3 h-3 text-[#c5a059]" />
                        {f.province}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-[#6e6e76] max-w-xs truncate">
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3 text-[#c5a059] shrink-0" />
                        <span title={f.remark}>{f.remark}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-[#6e6e76]">
                      {f.contact ? (
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[#6e6e76]" />
                          <span>{f.contact}</span>
                        </div>
                      ) : (
                        <span className="text-[#2a2a2e]">-</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="p-4 border-t border-[#2a2a2e] bg-[#1a1a1c] text-xs text-[#6e6e76] flex items-center justify-between">
        <span>显示 {filteredFriends.length} / 共 {friends.length} 条记录</span>
        <span>数据来源于表格导入或指定数据源</span>
      </div>

    </div>
  );
};
