import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, Layers, Disc, CircleDot, AlertTriangle } from 'lucide-react';

// อินเทอร์เฟซรองรับข้อมูลสินค้าแผ่นเกม
interface GameItem {
  id: string;
  name: string;
  platform: 'PS5' | 'Switch' | 'Xbox';
  type: 'แผ่นเกม' | 'ตลับเกม';
  price: number;
  stock: number;
  genre: string;
}

export const ManageItemsPage: React.FC = () => {
  // ข้อมูลจำลองรายการแผ่น/ตลับเกม (เชื่อมต่อกับ MySQL ในอนาคต)
  const [items, setItems] = useState<GameItem[]>([
    { id: 'GAME-001', name: 'Elden Ring: Shadow of the Erdtree', platform: 'PS5', type: 'แผ่นเกม', price: 1990, stock: 12, genre: 'Action RPG' },
    { id: 'GAME-002', name: 'Monster Hunter Wilds', platform: 'PS5', type: 'แผ่นเกม', price: 2290, stock: 4, genre: 'Action RPG' },
    { id: 'GAME-003', name: 'The Legend of Zelda: Tears of the Kingdom', platform: 'Switch', type: 'ตลับเกม', price: 1790, stock: 25, genre: 'Adventure' },
    { id: 'GAME-004', name: 'Persona 6', platform: 'PS5', type: 'แผ่นเกม', price: 2190, stock: 0, genre: 'RPG' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');

  // ฟังก์ชันจำลองสำหรับการลบสินค้า (เชื่อมโยงกับ Product Service -> MySQL)
  const handleDelete = (id: string, name: string) => {
    if (confirm(`คุณต้องการลบเกม "${name}" ออกจากระบบใช่หรือไม่?`)) {
      setItems(items.filter(item => item.id !== id));
      // ในอนาคต: ตรงนี้จะยิง API DELETE และเรียกปุ่ม Clear Redis Cache อัตโนมัติ
    }
  };

  // กรองข้อมูลสินค้าตามการค้นหาและตัวเลือก Platform
  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || item.id.includes(searchQuery);
    const matchesPlatform = selectedPlatform === 'All' || item.platform === selectedPlatform;
    return matchesSearch && matchesPlatform;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* 1. ส่วนหัวของหน้าเว็บ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 tracking-wide flex items-center gap-2">
            <Layers className="text-indigo-400" />
            จัดการแผ่น/ตลับเกม
          </h1>
          <p className="text-sm text-slate-400 mt-1">คลังสินค้าหลักสำหรับเพิ่ม แก้ไข หรือลบรายการสินค้าภายในร้าน</p>
        </div>
        
        {/* ปุ่มเพิ่มสินค้าใหม่ */}
        <button 
          onClick={() => alert('เปิดฟอร์มเพิ่มแผ่นเกมใหม่ (กำลังเชื่อมระบบเพิ่มข้อมูลเข้าฐานข้อมูล MySQL)')}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95 self-start sm:self-auto"
        >
          <Plus size={16} />
          เพิ่มเกมใหม่
        </button>
      </div>

      {/* 2. เครื่องมือการค้นหาและฟิลเตอร์ (Search & Filter Bar) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="ค้นหาด้วยรหัสสินค้า หรือ ชื่อแผ่นเกม..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#16223f]/40 border border-slate-800/80 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 placeholder-slate-500 transition-colors"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-2.5 text-slate-500" size={16} />
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="w-full bg-[#16223f]/40 border border-slate-800/80 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
          >
            <option value="All">ทุกแพลตฟอร์ม</option>
            <option value="PS5">PlayStation 5</option>
            <option value="Switch">Nintendo Switch</option>
            <option value="Xbox">Xbox Series X</option>
          </select>
        </div>
      </div>

      {/* 3. ตารางแสดงรายการสินค้าหลัก */}
      <div className="bg-[#16223f]/20 border border-slate-800/60 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-[#111a36]/50 border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">รหัสสินค้า</th>
                <th className="py-3.5 px-4">ชื่อสินค้า</th>
                <th className="py-3.5 px-4 text-center">ประเภท</th>
                <th className="py-3.5 px-4 text-right">ราคา</th>
                <th className="py-3.5 px-4 text-right">สต็อกคงเหลือ</th>
                <th className="py-3.5 px-4 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-slate-300">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/10 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-xs text-indigo-400 font-bold">{item.id}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-200">{item.name}</div>
                      <div className="text-xs text-slate-500 font-medium">{item.genre}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-semibold ${
                        item.type === 'แผ่นเกม' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {item.type === 'แผ่นเกม' ? <Disc size={12} /> : <CircleDot size={12} />}
                        {item.platform} ({item.type})
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-semibold text-slate-100">
                      ฿{item.price.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {item.stock === 0 ? (
                        <span className="inline-flex items-center gap-1 text-xs text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-lg font-medium border border-rose-500/20">
                          <AlertTriangle size={12} /> สินค้าหมด
                        </span>
                      ) : item.stock <= 5 ? (
                        <span className="inline-flex items-center text-xs text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-lg font-medium border border-amber-500/20">
                          ใกล้หมด ({item.stock})
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium">{item.stock} ชิ้น</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* ปุ่มเปิดหน้าแก้ไข - ในอนาคตใช้ลิงก์สลับหรือเปิด Modal เพื่อแก้ไขแบบฟอร์ม */}
                        <button 
                          onClick={() => alert(`แก้ไขสินค้า: ${item.name}`)}
                          className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800/50 rounded-lg transition-colors border border-transparent hover:border-slate-700"
                          title="แก้ไขรายละเอียด"
                        >
                          <Edit2 size={14} />
                        </button>
                        {/* ปุ่มลบสินค้า */}
                        <button 
                          onClick={() => handleDelete(item.id, item.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800/50 rounded-lg transition-colors border border-transparent hover:border-slate-700"
                          title="ลบสินค้า"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-500 font-medium">
                    ไม่พบรายการแผ่นเกมหรือตลับเกมที่ค้นหา
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};