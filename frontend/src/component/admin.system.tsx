import React, { useState } from 'react';
import { Settings, Plus, Trash2, Disc, Layers, CheckCircle2 } from 'lucide-react';

interface MasterItem {
  id: string;
  name: string;
  code?: string;
}

export const SystemSettingsPage: React.FC = () => {
  // Mock Data สำหรับ แพลตฟอร์มเครื่องเกม
  const [platforms, setPlatforms] = useState<MasterItem[]>([
    { id: '1', name: 'PlayStation 5', code: 'PS5' },
    { id: '2', name: 'Nintendo Switch', code: 'Switch' },
    { id: '3', name: 'Xbox Series X', code: 'Xbox' },
    { id: '4', name: 'PlayStation 4', code: 'PS4' },
  ]);

  // Mock Data สำหรับ หมวดหมู่แนวเกม
  const [genres, setGenres] = useState<MasterItem[]>([
    { id: '1', name: 'Action RPG' },
    { id: '2', name: 'Open World' },
    { id: '3', name: 'Turn-Based RPG' },
    { id: '4', name: 'Survival Horror' },
    { id: '5', name: 'Fighting' },
  ]);

  // State สำหรับฟอร์มเพิ่มข้อมูล
  const [newPlatformName, setNewPlatformName] = useState('');
  const [newPlatformCode, setNewPlatformCode] = useState('');
  const [newGenreName, setNewGenreName] = useState('');

  // ฟังก์ชันเพิ่ม แพลตฟอร์ม
  const handleAddPlatform = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlatformName.trim()) return;
    const newItem: MasterItem = {
      id: Date.now().toString(),
      name: newPlatformName.trim(),
      code: newPlatformCode.trim() || newPlatformName.trim().toUpperCase(),
    };
    setPlatforms([...platforms, newItem]);
    setNewPlatformName('');
    setNewPlatformCode('');
  };

  // ฟังก์ชันเพิ่ม แนวเกม
  const handleAddGenre = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGenreName.trim()) return;
    const newItem: MasterItem = {
      id: Date.now().toString(),
      name: newGenreName.trim(),
    };
    setGenres([...genres, newItem]);
    setNewGenreName('');
  };

  // ฟังก์ชันลบ
  const handleDeletePlatform = (id: string) => {
    setPlatforms(platforms.filter(p => p.id !== id));
  };

  const handleDeleteGenre = (id: string) => {
    setGenres(genres.filter(g => g.id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-wide flex items-center gap-3">
          <div className="p-2 bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-indigo-400">
            <Settings size={24} />
          </div>
          ตั้งค่าข้อมูลหลักร้าน
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          จัดการ Master Data ของระบบ เช่น แพลตฟอร์มเครื่องเกม และ หมวดหมู่แนวเกม สำหรับใช้อ้างอิงในคลังสินค้า
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 1. ส่วนจัดการแพลตฟอร์ม (Platforms) */}
        <div className="bg-[#16223f]/20 border border-slate-800/80 rounded-2xl p-6 space-y-5 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Disc className="text-indigo-400" size={20} />
              จัดการแพลตฟอร์ม (Platforms)
            </h2>
            <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-full font-medium">
              ทั้งหมด {platforms.length} รายการ
            </span>
          </div>

          {/* ฟอร์มเพิ่มแพลตฟอร์ม */}
          <form onSubmit={handleAddPlatform} className="space-y-3 bg-[#111a36]/60 p-4 rounded-xl border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 block">เพิ่มแพลตฟอร์มใหม่</span>
            <div className="grid grid-cols-3 gap-2">
              <input 
                type="text" 
                placeholder="ชื่อแพลตฟอร์ม (เช่น PS5)" 
                value={newPlatformName}
                onChange={(e) => setNewPlatformName(e.target.value)}
                className="col-span-2 bg-[#16223f] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
              <input 
                type="text" 
                placeholder="Code (ย่อ)" 
                value={newPlatformCode}
                onChange={(e) => setNewPlatformCode(e.target.value)}
                className="col-span-1 bg-[#16223f] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button 
              type="submit" 
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20"
            >
              <Plus size={14} /> เพิ่มแพลตฟอร์ม
            </button>
          </form>

          {/* รายการแพลตฟอร์ม */}
          <div className="divide-y divide-slate-800/60 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
            {platforms.map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between hover:bg-slate-800/20 px-2 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-400"></div>
                  <span className="text-sm text-slate-200 font-medium">{p.name}</span>
                  {p.code && <span className="text-[11px] font-mono bg-slate-800 text-indigo-300 px-2 py-0.5 rounded-md border border-slate-700">{p.code}</span>}
                </div>
                <button 
                  onClick={() => handleDeletePlatform(p.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  title="ลบรายการ"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 2. ส่วนจัดการหมวดหมู่แนวเกม (Game Genres) */}
        <div className="bg-[#16223f]/20 border border-slate-800/80 rounded-2xl p-6 space-y-5 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Layers className="text-indigo-400" size={20} />
              หมวดหมู่แนวเกม (Game Genres)
            </h2>
            <span className="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded-full font-medium">
              ทั้งหมด {genres.length} หมวดหมู่
            </span>
          </div>

          {/* ฟอร์มเพิ่มแนวเกม */}
          <form onSubmit={handleAddGenre} className="space-y-3 bg-[#111a36]/60 p-4 rounded-xl border border-slate-800">
            <span className="text-xs font-semibold text-slate-400 block">เพิ่มแนวเกมใหม่</span>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="ชื่อแนวเกม (เช่น Survival Horror)" 
                value={newGenreName}
                onChange={(e) => setNewGenreName(e.target.value)}
                className="flex-1 bg-[#16223f] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              />
              <button 
                type="submit" 
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20"
              >
                <Plus size={14} /> เพิ่ม
              </button>
            </div>
          </form>

          {/* รายการแนวเกม */}
          <div className="divide-y divide-slate-800/60 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
            {genres.map((g) => (
              <div key={g.id} className="py-3 flex items-center justify-between hover:bg-slate-800/20 px-2 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={14} className="text-indigo-400" />
                  <span className="text-sm text-slate-200 font-medium">{g.name}</span>
                </div>
                <button 
                  onClick={() => handleDeleteGenre(g.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  title="ลบรายการ"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};