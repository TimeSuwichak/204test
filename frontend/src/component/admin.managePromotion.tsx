import React, { useState } from 'react';
import { Ticket, Plus, Search, Calendar, Tag, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';

interface Promotion {
  id: string;
  code: string;
  description: string;
  type: 'FIXED' | 'PERCENT';
  discountValue: number;
  minSpend: number;
  usageCount: number;
  usageLimit: number;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'INACTIVE';
}

export const ManagePromotionsPage: React.FC = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([
    {
      id: 'PROMO-001',
      code: 'GAMER100',
      description: 'ส่วนลด 100 บาท เมื่อซื้อแผ่น/ตลับเกมขั้นต่ำ 1,500 บาท',
      type: 'FIXED',
      discountValue: 100,
      minSpend: 1500,
      usageCount: 42,
      usageLimit: 100,
      startDate: '2026-03-01',
      endDate: '2026-03-31',
      status: 'ACTIVE'
    },
    {
      id: 'PROMO-002',
      code: 'PS5SUMMER',
      description: 'ต้อนรับหน้าร้อน ลด 10% สำหรับเกม PS5 ทุกรายการ',
      type: 'PERCENT',
      discountValue: 10,
      minSpend: 2000,
      usageCount: 88,
      usageLimit: 200,
      startDate: '2026-03-10',
      endDate: '2026-04-15',
      status: 'ACTIVE'
    },
    {
      id: 'PROMO-003',
      code: 'WELCOME50',
      description: 'โค้ดต้อนรับสมาชิกใหม่ ลดทันที 50 บาท',
      type: 'FIXED',
      discountValue: 50,
      minSpend: 500,
      usageCount: 500,
      usageLimit: 500,
      startDate: '2026-01-01',
      endDate: '2026-02-28',
      status: 'EXPIRED'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State สำหรับเพิ่มคูปองใหม่
  const [newCode, setNewCode] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newType, setNewType] = useState<'FIXED' | 'PERCENT'>('FIXED');
  const [newValue, setNewValue] = useState('');
  const [newMinSpend, setNewMinSpend] = useState('');
  const [newLimit, setNewLimit] = useState('');
  const [newEndDate, setNewEndDate] = useState('');

  // สลับเปิด/ปิด คูปอง
  const toggleStatus = (id: string) => {
    setPromotions(promotions.map(p => {
      if (p.id === id) {
        const nextStatus = p.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        return { ...p, status: nextStatus };
      }
      return p;
    }));
  };

  // ลบคูปอง
  const handleDelete = (id: string, code: string) => {
    if (confirm(`คุณต้องการลบโค้ดโปรโมชัน "${code}" ใช่หรือไม่?`)) {
      setPromotions(promotions.filter(p => p.id !== id));
    }
  };

  // เพิ่มโปรโมชันใหม่
  const handleCreatePromotion = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!newCode || !newValue) return;

    const newPromo: Promotion = {
      id: `PROMO-00${String (promotions.length + 1)}`,
      code: newCode.toUpperCase().trim(),
      description: newDesc,
      type: newType,
      discountValue: Number(newValue),
      minSpend: Number(newMinSpend) || 0,
      usageCount: 0,
      usageLimit: Number(newLimit) || 100,
      startDate: new Date().toISOString().split('T')[0],
      endDate: newEndDate || '2026-12-31',
      status: 'ACTIVE'
    };

    setPromotions([newPromo, ...promotions]);
    setIsModalOpen(false);
    
    // Reset form
    setNewCode('');
    setNewDesc('');
    setNewValue('');
    setNewMinSpend('');
    setNewLimit('');
  };

  const filteredPromotions = promotions.filter(p => 
    p.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-wide flex items-center gap-2">
            <Ticket className="text-indigo-400" />
            จัดการโปรโมชัน & ส่วนลด
          </h1>
          <p className="text-sm text-slate-400 mt-1">สร้างคูปองส่วนลด กำหนดขั้นต่ำ และติดตามจำนวนการใช้งาน</p>
        </div>
        
        <button 
          onClick={() => { setIsModalOpen(true); }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95 self-start sm:self-auto"
        >
          <Plus size={16} />
          สร้างโค้ดส่วนลดใหม่
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
        <input 
          type="text" 
          placeholder="ค้นหาชื่อโค้ด หรือรายละเอียด..." 
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); }}
          className="w-full bg-[#16223f]/40 border border-slate-800/80 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 placeholder-slate-500 transition-colors"
        />
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPromotions.map((p) => (
          <div 
            key={p.id} 
            className={`relative bg-[#16223f]/30 border rounded-2xl p-5 flex flex-col justify-between transition-all ${
              p.status === 'ACTIVE' ? 'border-indigo-500/30 hover:border-indigo-500/60 shadow-lg' : 'border-slate-800 opacity-60'
            }`}
          >
            {/* Header / Badge */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-lg font-black tracking-wider text-indigo-300 bg-indigo-950/60 border border-indigo-500/30 px-3 py-1 rounded-xl">
                  {p.code}
                </span>

                <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold ${
                  p.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  p.status === 'EXPIRED' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
                  'bg-slate-700/30 text-slate-400 border border-slate-600/30'
                }`}>
                  {p.status === 'ACTIVE' ? 'เปิดใช้งาน' : p.status === 'EXPIRED' ? 'หมดอายุ' : 'ปิดใช้งาน'}
                </span>
              </div>

              <p className="text-sm text-slate-300 font-medium mb-4 line-clamp-2">{p.description}</p>

              {/* Discount details */}
              <div className="space-y-2 text-xs text-slate-400 bg-[#0b1120]/60 p-3 rounded-xl mb-4 border border-slate-800/60">
                <div className="flex justify-between items-center">
                  <span>มูลค่าส่วนลด:</span>
                  <span className="text-slate-100 font-bold text-sm">
                    {p.type === 'FIXED' ? `฿${p.discountValue.toLocaleString()}` : `${String (p.discountValue)}%`}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>ขั้นต่ำ:</span>
                  <span className="text-slate-300 font-medium">฿{p.minSpend.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>การสิทธิ์ใช้งาน:</span>
                  <span className="text-indigo-400 font-bold">{p.usageCount} / {p.usageLimit} ครั้ง</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-slate-800">
                  <span className="flex items-center gap-1"><Calendar size={12}/> หมดอายุ:</span>
                  <span className="text-slate-400">{p.endDate}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
              <button 
                onClick={() => { toggleStatus(p.id); }}
                disabled={p.status === 'EXPIRED'}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors disabled:opacity-30"
              >
                {p.status === 'ACTIVE' ? (
                  <><ToggleRight className="text-emerald-400" size={20} /> ปิดใช้งาน</>
                ) : (
                  <><ToggleLeft className="text-slate-500" size={20} /> เปิดใช้งาน</>
                )}
              </button>

              <button 
                onClick={() => { handleDelete(p.id, p.code); }}
                className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                title="ลบโค้ด"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: สร้างโค้ดใหม่ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#111a36] border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Tag className="text-indigo-400" size={20} />
              สร้างโค้ดส่วนลดใหม่
            </h2>

            <form onSubmit={handleCreatePromotion} className="space-y-3.5 text-sm">
              <div>
                <label className="block text-slate-400 text-xs mb-1">ชื่อโค้ดส่วนลด (เช่น SUMMER2026)</label>
                <input 
                  type="text" 
                  required
                  placeholder="เช่น GAME100" 
                  value={newCode}
                  onChange={e => { setNewCode(e.target.value); }}
                  className="w-full bg-[#16223f] border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-xs mb-1">รายละเอียดโปรโมชัน</label>
                <input 
                  type="text" 
                  placeholder="เช่น ส่วนลด 100 บาท สำหรับสมาชิกใหม่" 
                  value={newDesc}
                  onChange={e => { setNewDesc(e.target.value); }}
                  className="w-full bg-[#16223f] border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 text-xs mb-1">ประเภทส่วนลด</label>
                  <select 
                    value={newType}
                    onChange={e => { setNewType(e.target.value as 'FIXED' | 'PERCENT'); }}
                    className="w-full bg-[#16223f] border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-indigo-500 focus:outline-none cursor-pointer"
                  >
                    <option value="FIXED">ลดเป็นบาท (฿)</option>
                    <option value="PERCENT">ลดเป็นเปอร์เซ็นต์ (%)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 text-xs mb-1">มูลค่าส่วนลด</label>
                  <input 
                    type="number" 
                    required
                    placeholder={newType === 'FIXED' ? '100' : '10'} 
                    value={newValue}
                    onChange={e => { setNewValue(e.target.value); }}
                    className="w-full bg-[#16223f] border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 text-xs mb-1">ยอดขั้นต่ำ (บาท)</label>
                  <input 
                    type="number" 
                    placeholder="0" 
                    value={newMinSpend}
                    onChange={e => { setNewMinSpend(e.target.value); }}
                    className="w-full bg-[#16223f] border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 text-xs mb-1">จำนวนสิทธิ์ทั้งหมด</label>
                  <input 
                    type="number" 
                    placeholder="100" 
                    value={newLimit}
                    onChange={e => { setNewLimit(e.target.value); }}
                    className="w-full bg-[#16223f] border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 text-xs mb-1">วันหมดอายุ</label>
                <input 
                  type="date" 
                  value={newEndDate}
                  onChange={e => { setNewEndDate(e.target.value); }}
                  className="w-full bg-[#16223f] border border-slate-700 rounded-xl px-3 py-2 text-slate-100 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button 
                  type="button" 
                  onClick={() => { setIsModalOpen(false); }}
                  className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-colors text-xs"
                >
                  ยกเลิก
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors text-xs shadow-lg shadow-indigo-600/20"
                >
                  สร้างโค้ด
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};