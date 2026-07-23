import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  Building2, 
  Copy, 
  Check, 
  MapPin, 
  Sparkles,
  MessageSquare,
  Search
} from 'lucide-react';
import { Friend } from '../types';

interface ProvinceDrawerProps {
  province: string | null;
  friends: Friend[];
  onClose: () => void;
}

export const ProvinceDrawer: React.FC<ProvinceDrawerProps> = ({
  province,
  friends,
  onClose
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  if (!province) return null;

  // Filter friends in this province
  const provinceFriends = friends.filter(f => f.province === province);

  const filteredFriends = provinceFriends.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.remark.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group unique universities in this province
  const universities = Array.from(new Set(provinceFriends.map(f => f.school))).filter(Boolean);

  const handleCopyContact = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-xs flex justify-end transition-opacity">
      <div 
        className="w-full max-w-lg bg-[#141416] h-full shadow-2xl border-l border-[#2a2a2e] flex flex-col transform transition-transform duration-300 ease-in-out text-[#d1d1d1]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#2a2a2e] bg-[#1a1a1c] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#1e1e21] border border-[#2a2a2e] text-[#c5a059] rounded-xl shadow-md flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-serif text-white">
                  {province} 蹭饭地图
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#1e1e21] text-[#c5a059] border border-[#2a2a2e]">
                  {provinceFriends.length} 位好友
                </span>
              </div>
              <p className="text-xs text-[#6e6e76] mt-0.5">
                包含 {universities.length} 所录取/就读高校
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-[#6e6e76] hover:text-white rounded-lg hover:bg-[#1e1e21] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Universities Tag Bar */}
        {universities.length > 0 && (
          <div className="px-5 py-2.5 bg-[#1a1a1c] border-b border-[#2a2a2e] flex items-center gap-1.5 overflow-x-auto text-xs">
            <span className="text-[#6e6e76] font-medium whitespace-nowrap">高校分布:</span>
            {universities.map((uni, i) => (
              <span 
                key={i}
                className="px-2 py-0.5 bg-[#1e1e21] text-[#d1d1d1] rounded-md border border-[#2a2a2e] whitespace-nowrap font-medium"
              >
                🏫 {uni}
              </span>
            ))}
          </div>
        )}

        {/* Filter / Search */}
        <div className="p-4 border-b border-[#2a2a2e]">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-[#6e6e76] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索姓名、学校或备注..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#1e1e21] border border-[#2a2a2e] rounded-lg text-[#d1d1d1] placeholder-[#6e6e76] focus:outline-none focus:border-[#c5a059]"
            />
          </div>
        </div>

        {/* Friend Cards List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {filteredFriends.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-[#2a2a2e] rounded-2xl">
              <div className="p-3 bg-[#1e1e21] text-[#c5a059] rounded-full mb-3 border border-[#2a2a2e]">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-[#d1d1d1]">
                {provinceFriends.length === 0 ? `该省份暂无记录的好友` : '无匹配好友搜索结果'}
              </h3>
              <p className="text-xs text-[#6e6e76] mt-1 max-w-xs">
                {provinceFriends.length === 0 ? '通过导入或提供 data.xlsx 增加该省份同学信息' : '尝试更换搜索词'}
              </p>
            </div>
          ) : (
            filteredFriends.map((friend) => (
              <div 
                key={friend.id}
                className="group p-4 bg-[#1e1e21] rounded-2xl border border-[#2a2a2e] shadow-xs hover:border-[#c5a059]/60 transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl font-bold flex items-center justify-center text-sm shadow-xs bg-[#141416] text-[#c5a059] border border-[#2a2a2e]`}>
                      {friend.name.slice(0, 2)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">
                          {friend.name}
                        </h4>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-[#c5a059] font-medium mt-0.5">
                        <Building2 className="w-3.5 h-3.5" />
                        <span>{friend.school}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Remark & Meal Signal */}
                <div className="mt-3 p-2.5 rounded-xl bg-[#141416] border border-[#2a2a2e] text-xs text-[#d1d1d1] flex items-start gap-2">
                  <MessageSquare className="w-3.5 h-3.5 text-[#c5a059] shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-normal">{friend.remark}</span>
                </div>

                {/* Contact info if available */}
                {friend.contact && (
                  <div className="mt-2 flex items-center justify-between text-xs text-[#6e6e76] pt-1">
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-[#6e6e76]" />
                      {friend.contact}
                    </span>
                    <button
                      onClick={() => handleCopyContact(friend.id, `${friend.name} - ${friend.school} (${friend.province}): ${friend.contact}`)}
                      className="text-[11px] text-[#c5a059] hover:underline flex items-center gap-1 font-medium"
                    >
                      {copiedId === friend.id ? (
                        <>
                          <Check className="w-3 h-3 text-[#c5a059]" />
                          已复制
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          复制信息
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-[#2a2a2e] bg-[#1a1a1c] text-center text-xs text-[#6e6e76]">
          📍 {province} 包含 {provinceFriends.length} 个蹭饭据点 · 记得提前跟好友打招呼哦！
        </div>
      </div>
    </div>
  );
};
