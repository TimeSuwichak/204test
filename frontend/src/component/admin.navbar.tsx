import React from 'react';
import { Search } from 'lucide-react';

export const AdminNavbar: React.FC = () => {
  return (
    <nav className="bg-[#16223f] border-b border-slate-800 h-16 sticky top-0 z-40 px-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-slate-400 rounded"></div>
        <span className="font-semibold text-lg tracking-wide text-slate-100">
          ร้านขายแผ่นและตลับเกม
        </span>
      </div>

      <div className="hidden md:flex items-center relative w-full max-w-md mx-4">
        <input
          type="text"
          placeholder="ค้นหา เกมสุดที่รัก ..."
          className="w-full bg-[#2a3c66] text-sm text-slate-200 pl-4 pr-10 py-2 rounded-full border border-transparent focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder-slate-400"
        />
        <Search size={18} className="absolute right-3.5 text-slate-400" />
      </div>

      <div className="flex items-center gap-6 text-sm text-slate-300">
        <a href="#products" className="hover:text-white transition-colors">สินค้า</a>
        <a href="#help" className="hover:text-white transition-colors">ช่วยเหลือ</a>
        <a href="#about" className="hover:text-white transition-colors">เกี่ยวกับ</a>
        <div className="w-8 h-8 rounded-full bg-slate-400 border border-slate-600 cursor-pointer"></div>
      </div>
    </nav>
  );
};