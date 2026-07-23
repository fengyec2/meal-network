import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, Sparkles, MapPin, Building2, Phone, RotateCw, Utensils, MessageSquare } from 'lucide-react';
import { Friend } from '../types';

interface MealRouletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  friends: Friend[];
  onSelectProvince: (province: string) => void;
}

export const MealRouletteModal: React.FC<MealRouletteModalProps> = ({
  isOpen,
  onClose,
  friends,
  onSelectProvince
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<Friend | null>(null);
  const [displayCandidate, setDisplayCandidate] = useState<Friend | null>(null);

  if (!isOpen) return null;

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleStartSpin = () => {
    if (friends.length === 0) return;

    setIsSpinning(true);
    setWinner(null);

    let counter = 0;
    const totalSteps = 25;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * friends.length);
      setDisplayCandidate(friends[randomIndex]);
      counter++;

      if (counter >= totalSteps) {
        clearInterval(interval);
        const finalWinner = friends[Math.floor(Math.random() * friends.length)];
        setWinner(finalWinner);
        setDisplayCandidate(finalWinner);
        setIsSpinning(false);
        triggerConfetti();
      }
    }, 80);
  };

  const handleGoToProvince = () => {
    if (winner) {
      onSelectProvince(winner.province);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="w-full max-w-lg bg-[#141416] rounded-3xl shadow-2xl border border-[#2a2a2e] overflow-hidden transform transition-all text-center text-[#d1d1d1]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-6 bg-[#1a1a1c] border-b border-[#2a2a2e] text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 bg-[#1e1e21] hover:bg-[#2a2a2e] border border-[#2a2a2e] rounded-full text-[#6e6e76] hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 bg-[#1e1e21] border border-[#2a2a2e] rounded-2xl mx-auto flex items-center justify-center mb-3 shadow-inner text-[#c5a059]">
            <Utensils className="w-7 h-7" />
          </div>

          <h3 className="text-xl font-bold font-serif tracking-tight text-white">
            今天去哪蹭饭？
          </h3>
          <p className="text-xs text-[#6e6e76] mt-1">
            智能随机大转盘，解锁下一个旅行与美食目的地！
          </p>
        </div>

        {/* Content Box */}
        <div className="p-6 space-y-6">
          
          {/* Candidate Card */}
          <div className="p-6 rounded-2xl bg-[#1e1e21] border border-[#2a2a2e] min-h-[160px] flex flex-col items-center justify-center relative overflow-hidden">
            
            {isSpinning && (
              <div className="flex flex-col items-center gap-2">
                <RotateCw className="w-8 h-8 text-[#c5a059] animate-spin" />
                <span className="text-xs font-bold text-[#6e6e76] animate-pulse">正在全国内抽取蹭饭锦鲤...</span>
              </div>
            )}

            {!isSpinning && !winner && (
              <div className="text-center">
                <Sparkles className="w-10 h-10 text-[#c5a059] mx-auto mb-2 opacity-80" />
                <p className="text-sm font-bold text-white">
                  点击下方按钮，抽取今日蹭饭幸运儿！
                </p>
                <p className="text-xs text-[#6e6e76] mt-1">
                  将在当前 {friends.length} 位好友与 34 个省份中挑选
                </p>
              </div>
            )}

            {(isSpinning || winner) && displayCandidate && (
              <div className="w-full transition-all">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#141416] text-[#c5a059] text-xs font-bold mb-3 border border-[#2a2a2e]">
                  <MapPin className="w-3.5 h-3.5 text-[#c5a059]" />
                  目的地: {displayCandidate.province}
                </div>

                <h4 className="text-2xl font-bold font-serif text-white">
                  {displayCandidate.name}
                </h4>

                <div className="flex items-center justify-center gap-1 text-xs font-medium text-[#c5a059] mt-1">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{displayCandidate.school}</span>
                </div>

                <div className="mt-4 p-3 bg-[#141416] rounded-xl border border-[#2a2a2e] text-xs text-[#d1d1d1] flex items-start justify-center gap-2 max-w-sm mx-auto">
                  <MessageSquare className="w-4 h-4 text-[#c5a059] shrink-0 mt-0.5" />
                  <span className="italic">"{displayCandidate.remark}"</span>
                </div>
              </div>
            )}

          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={handleStartSpin}
              disabled={isSpinning || friends.length === 0}
              className="w-full py-3.5 bg-[#c5a059] hover:bg-[#d4af37] text-[#0c0c0e] rounded-2xl font-bold text-sm shadow-md transition active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {isSpinning ? '抽取中...' : winner ? '不满意？重新抽一次！' : '开始蹭饭抽签'}
            </button>

            {winner && (
              <button
                onClick={handleGoToProvince}
                className="w-full py-3 bg-[#1e1e21] hover:bg-[#2a2a2e] text-[#c5a059] border border-[#2a2a2e] hover:border-[#c5a059] rounded-2xl font-semibold text-xs shadow-xs transition active:scale-98 flex items-center justify-center gap-1.5"
              >
                <MapPin className="w-4 h-4" />
                定位到 {winner.province} 地图详情
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
