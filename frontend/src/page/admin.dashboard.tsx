import React from 'react';
import { AdminLayout } from "#component/admin.layout.tsx";

import { TrendingUp, ShoppingBag, DollarSign, Package, Zap } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const stats = [
    { title: 'ยอดขายวันนี้', value: '฿18,450', icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { title: 'ออเดอร์ที่ต้องจัดส่ง', value: '14 ออเดอร์', icon: Package, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { title: 'แผ่นเกมที่ขายได้เดือนนี้', value: '342 แผ่น', icon: ShoppingBag, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  ];

  const topGames = [
    { id: 1, name: 'Elden Ring: Shadow of the Erdtree (PS5)', sales: 88, price: '฿1,990', stock: 12, platform: 'PS5' },
    { id: 2, name: 'Monster Hunter Wilds (PS5)', sales: 74, price: '฿2,290', stock: 4, platform: 'PS5' },
    { id: 3, name: 'The Legend of Zelda: Tears of the Kingdom', sales: 65, price: '฿1,790', stock: 25, platform: 'Switch' },
    { id: 4, name: 'Persona 6 (PS5)', sales: 52, price: '฿2,190', stock: 0, platform: 'PS5' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 tracking-wide flex items-center gap-2">
            <TrendingUp className="text-indigo-400" /> ภาพรวมระบบ (Dashboard)
          </h1>
          <p className="text-sm text-slate-400 mt-1">ยินดีต้อนรับกลับมา! ข้อมูลหลังบ้านร้านแผ่นเกมของคุณในปัจจุบัน</p>
        </div>
        <button
          onClick={() => { alert('ล้าง Redis Cache เรียบร้อย!') }}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg border border-amber-500/30 active:scale-95"
        >
          <Zap size={14} /> เคลียร์ Redis Cache
        </button>
      </div>

      {/* Grid การ์ดสถิติ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-[#16223f]/50 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-medium">{stat.title}</span>
                <p className="text-2xl font-black text-slate-100">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}><Icon size={24} /></div>
            </div>
          );
        })}
      </div>

      {/* ตารางสินค้าขายดี & สเตตัส API */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#16223f]/30 border border-slate-800 rounded-2xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-200 text-base">แผ่นเกมขายดีประจำเดือน</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-xs uppercase">
                  <th className="py-3 px-2">ชื่อแผ่นเกม</th>
                  <th className="py-3 px-2 text-center">แพลตฟอร์ม</th>
                  <th className="py-3 px-2 text-right">ยอดขาย (แผ่น)</th>
                  <th className="py-3 px-2 text-right">คงเหลือในคลัง</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-slate-300">
                {topGames.map((game) => (
                  <tr key={game.id} className="hover:bg-slate-800/20">
                    <td className="py-3 px-2 font-medium">{game.name}</td>
                    <td className="py-3 px-2 text-center">
                      <span className={`text-[10px] px-2 py-0.5 font-bold rounded ${
                        game.platform === 'PS5' ? 'bg-blue-600/20 text-blue-400 border border-blue-500/20' : 'bg-red-600/20 text-red-400 border border-red-500/20'
                      }`}>{game.platform}</span>
                    </td>
                    <td className="py-3 px-2 text-right font-semibold">{game.sales}</td>
                    <td className="py-3 px-2 text-right">
                      {game.stock === 0 ? <span className="text-rose-400 text-xs bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">สินค้าหมด</span> : <span className="text-slate-400">{game.stock} ชิ้น</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-[#16223f]/30 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <h3 className="font-bold text-slate-200 text-base">สถานะการเชื่อมต่อ API</h3>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-900/40 border border-slate-800 rounded-xl">
              <span>MySQL Database</span> <span className="text-emerald-400 font-bold">● Connected</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-900/40 border border-slate-800 rounded-xl">
              <span>Omise Gateway</span> <span className="text-emerald-400 font-bold">● Operational</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const content = function AdminDashboard ()
{
  return (<AdminLayout/>)
}

export default content;