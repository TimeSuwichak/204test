import React, { useState } from 'react';
import { Disc, Plus, Search, Filter, Trash2, X, AlertTriangle } from 'lucide-react';

interface GameItem {
  id: string;
  title: string;
  platform: 'PS5' | 'Switch' | 'Xbox' | 'PS4';
  genre: string;
  price: number;
  stock: number;
  coverUrl: string;
}

export const ManageItemsPage: React.FC = () => {
  // Mock Data รายการสินค้า
  const [games, setGames] = useState<GameItem[]>([
    {
      id: 'GAME-001',
      title: 'Elden Ring: Shadow of the Erdtree',
      platform: 'PS5',
      genre: 'Action RPG',
      price: 1990,
      stock: 15,
      coverUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'GAME-002',
      title: 'The Legend of Zelda: Tears of the Kingdom',
      platform: 'Switch',
      genre: 'Adventure',
      price: 1790,
      stock: 3, // สต็อกต่ำ
      coverUrl: 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'GAME-003',
      title: 'Monster Hunter Wilds',
      platform: 'PS5',
      genre: 'Action RPG',
      price: 2290,
      stock: 25,
      coverUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=300&q=80',
    }
  ]);

  // State สำหรับค้นหาและกรอง
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');

  // State สำหรับ Modal เพิ่มเกมใหม่
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newGame, setNewGame] = useState<Omit<GameItem, 'id'>>({
    title: '',
    platform: 'PS5',
    genre: 'Action RPG',
    price: 0,
    stock: 10,
    coverUrl: '',
  });

  // ฟังก์ชันเพิ่มเกมใหม่
  const handleAddGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGame.title || newGame.price <= 0) {
      alert('กรุณากรอกชื่อเกมและราคาให้ถูกต้อง');
      return;
    }

    const createdGame: GameItem = {
      ...newGame,
      id: `GAME-${String(games.length + 1).padStart(3, '0')}`,
      coverUrl: newGame.coverUrl || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=300&q=80',
    };

    setGames([createdGame, ...games]);
    setIsAddModalOpen(false); // ปิด Modal
    // Reset Form
    setNewGame({
      title: '',
      platform: 'PS5',
      genre: 'Action RPG',
      price: 0,
      stock: 10,
      coverUrl: '',
    });
  };

  // ฟังก์ชันลบเกม
  const handleDeleteGame = (id: string) => {
    if (confirm('คุณต้องการลบรายการเกมนี้ใช่หรือไม่?')) {
      setGames(games.filter(g => g.id !== id));
    }
  };

  // Filter รายการเกม
  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) || game.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = selectedPlatform === 'All' || game.platform === selectedPlatform;
    return matchesSearch && matchesPlatform;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header และ ปุ่มเพิ่มเกม */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-wide flex items-center gap-2">
            <Disc className="text-indigo-400" />
            จัดการแผ่นและตลับเกม
          </h1>
          <p className="text-sm text-slate-400 mt-1">คลังสินค้าเกม เพิ่ม แก้ไข ลบ รายการแผ่น/ตลับ และปรับจำนวนสต็อก</p>
        </div>

        {/* ปุ่มเปิด Modal เพิ่มเกม */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 shrink-0 active:scale-95"
        >
          <Plus size={18} />
          เพิ่มเกมใหม่
        </button>
      </div>

      {/* แถบ ค้นหา และ ตัวกรอง */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="ค้นหาชื่อเกม หรือ ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#16223f]/40 border border-slate-800/80 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 placeholder-slate-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-2.5 text-slate-500" size={16} />
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="w-full bg-[#16223f]/40 border border-slate-800/80 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
          >
            <option value="All">ทุกแพลตฟอร์ม (All Platforms)</option>
            <option value="PS5">PlayStation 5</option>
            <option value="Switch">Nintendo Switch</option>
            <option value="Xbox">Xbox Series X</option>
            <option value="PS4">PlayStation 4</option>
          </select>
        </div>
      </div>

      {/* ตารางแสดงรายการสินค้า */}
      <div className="bg-[#16223f]/20 border border-slate-800/60 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-[#111a36]/50 border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">สินค้า</th>
                <th className="py-3.5 px-4 text-center">แพลตฟอร์ม</th>
                <th className="py-3.5 px-4">แนวเกม</th>
                <th className="py-3.5 px-4 text-right">ราคา</th>
                <th className="py-3.5 px-4 text-center">คงเหลือ</th>
                <th className="py-3.5 px-4 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-slate-300">
              {filteredGames.map((game) => (
                <tr key={game.id} className="hover:bg-slate-800/10 transition-colors">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img 
                      src={game.coverUrl} 
                      alt={game.title} 
                      className="w-10 h-12 rounded-lg object-cover bg-slate-800 shrink-0 border border-slate-700/50" 
                    />
                    <div>
                      <div className="font-bold text-slate-100">{game.title}</div>
                      <div className="text-[11px] font-mono text-indigo-400">{game.id}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                      game.platform === 'PS5' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      game.platform === 'Switch' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                      'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    }`}>
                      {game.platform}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-400">{game.genre}</td>
                  <td className="py-3 px-4 text-right font-bold text-slate-100">฿{game.price.toLocaleString()}</td>
                  <td className="py-3 px-4 text-center">
                    {game.stock <= 5 ? (
                      <span className="text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md text-xs font-bold inline-flex items-center gap-1">
                        <AlertTriangle size={12} /> {game.stock} (ใกล้หมด)
                      </span>
                    ) : (
                      <span className="text-slate-300 font-medium">{game.stock} ชิ้น</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => handleDeleteGame(game.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                        title="ลบเกม"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🟢 MODAL ฟอร์มเพิ่มเกมใหม่ */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#0f162c] border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <Plus className="text-indigo-400" size={20} />
                เพิ่มแผ่น/ตลับเกมใหม่
              </h2>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-500 hover:text-slate-300 p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddGame} className="space-y-4 text-xs">
              
              {/* ชื่อเกม */}
              <div>
                <label className="block text-slate-400 mb-1 font-medium">ชื่อเกม (Title)</label>
                <input 
                  type="text" 
                  required
                  placeholder="เช่น Final Fantasy XVI"
                  value={newGame.title}
                  onChange={(e) => setNewGame({ ...newGame, title: e.target.value })}
                  className="w-full bg-[#16223f]/60 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* แพลตฟอร์ม และ แนวเกม */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">แพลตฟอร์ม</label>
                  <select
                    value={newGame.platform}
                    onChange={(e) => setNewGame({ ...newGame, platform: e.target.value as any })}
                    className="w-full bg-[#16223f]/60 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="PS5">PlayStation 5</option>
                    <option value="Switch">Nintendo Switch</option>
                    <option value="Xbox">Xbox Series X</option>
                    <option value="PS4">PlayStation 4</option>
                    <option value="1">PC</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">แนวเกม (Genre)</label>
                  <select
                    value={newGame.genre}
                    onChange={(e) => setNewGame({ ...newGame, genre: e.target.value })}
                    className="w-full bg-[#16223f]/60 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Action RPG">Action RPG</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Turn-Based RPG">Turn-Based RPG</option>
                    <option value="Fighting">Fighting</option>
                    <option value="Open World">Open World</option>
                    <option value="Sports">Sports</option>
                  </select>
                </div>
              </div>

              {/* ราคา และ จำนวนสต็อก */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">ราคา (บาท)</label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    placeholder="1990"
                    value={newGame.price || ''}
                    onChange={(e) => setNewGame({ ...newGame, price: Number(e.target.value) })}
                    className="w-full bg-[#16223f]/60 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-medium">จำนวนสต็อก (ชิ้น)</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    placeholder="10"
                    value={newGame.stock}
                    onChange={(e) => setNewGame({ ...newGame, stock: Number(e.target.value) })}
                    className="w-full bg-[#16223f]/60 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* URL รูปปกเกม */}
              <div>
                <label className="block text-slate-400 mb-1 font-medium">URL รูปภาพปกเกม (ถ้ามี)</label>
                <input 
                  type="url" 
                  placeholder="https://example.com/cover.jpg"
                  value={newGame.coverUrl}
                  onChange={(e) => setNewGame({ ...newGame, coverUrl: e.target.value })}
                  className="w-full bg-[#16223f]/60 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* ปุ่มบันทึก */}
              <div className="flex gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-1/2 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold"
                >
                  ยกเลิก
                </button>
                <button 
                  type="submit" 
                  className="w-1/2 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-md shadow-indigo-600/20"
                >
                  บันทึกสินค้า
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};