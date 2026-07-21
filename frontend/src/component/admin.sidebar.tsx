import React from 'react';
import { 
  LayoutDashboard, 
  Disc, 
  Users, 
  TicketPercent, 
  ShoppingBag, 
  Settings,
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

import type { LucideIcon } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  icon: LucideIcon;
}

interface SidebarProps {
  activeMenu: string;
  setActiveMenu: (id: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const AdminSidebar: React.FC<SidebarProps> = ({ 
  activeMenu, 
  setActiveMenu, 
  isCollapsed, 
  setIsCollapsed 
}) => {
  
  // 🔥 เมนูตรงตามหน้าเพจที่มีในระบบครบ 100%
  const sidebarMenus: MenuItem[] = [
    { id: 'dashboard', name: 'Dashboard ภาพรวม', icon: LayoutDashboard },
    { id: 'items', name: 'จัดการแผ่น/ตลับเกม', icon: Disc },
    { id: 'shipments', name: 'จัดการคำสั่งซื้อ & จัดส่ง', icon: ShoppingBag },
    { id: 'users', name: 'จัดการผู้ใช้ & สิทธิ์', icon: Users },
    { id: 'promotions', name: 'โปรโมชัน & คูปอง', icon: TicketPercent },
    { id: 'settings', name: 'ตั้งค่าข้อมูลหลักร้าน', icon: Settings },
  ];

  return (
    <aside 
      className={`fixed top-16 left-0 bottom-0 bg-[#111a36] border-r border-slate-800/80 transition-all duration-300 z-30 flex flex-col justify-between ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* รายการเมนูทั้งหมด */}
      <ul className="p-4 space-y-2 overflow-y-auto flex-1 custom-scrollbar">
        {sidebarMenus.map((menu) => {
          const Icon = menu.icon;
          const isActive = activeMenu === menu.id;
          return (
            <li key={menu.id}>
              <button
                onClick={() => { setActiveMenu(menu.id); }}
                className={`w-full flex items-center rounded-xl text-sm font-medium transition-all py-3 ${
                  isCollapsed ? 'justify-center px-0' : 'px-4 gap-4'
                } ${
                  isActive
                    ? 'bg-[#1e2d5a] text-white shadow-md border border-slate-700/50'
                    : 'text-slate-400 hover:bg-[#16223f] hover:text-slate-200'
                }`}
                title={menu.name}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                  isActive ? 'bg-indigo-600 text-white' : 'bg-slate-700/60 text-slate-300'
                }`}>
                  <Icon size={16} />
                </div>
                
                {!isCollapsed && (
                  <span className="whitespace-nowrap animate-in fade-in duration-200">
                    {menu.name}
                  </span>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {/* ปุ่มยุบ/กางเมนู */}
      <div className="p-4 border-t border-slate-800 flex justify-center">
        <button
          onClick={() => { setIsCollapsed(!isCollapsed); }}
          className="w-full py-2 bg-[#16223f] hover:bg-[#1e2d5a] text-slate-400 hover:text-white rounded-lg flex items-center justify-center transition-colors border border-slate-800"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </aside>
  );
};