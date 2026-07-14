import React from 'react';
import { LayoutDashboard, User, Shield, Truck, CreditCard, ChevronLeft, ChevronRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Menuitem {
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
  // เพิ่มหน้า Dashboard เป็นเมนูแรกสุด
  const sidebarMenus: Menuitem[] = [
    { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
    { id: 'general', name: 'ทั่วไป', icon: User },
    { id: 'security', name: 'ความปลอดภัย', icon: Shield },
    { id: 'shipping', name: 'การจัดส่ง', icon: Truck },
    { id: 'payment', name: 'การชำระเงิน', icon: CreditCard },
  ];

  return (
    <aside 
      className={`fixed top-16 left-0 bottom-0 bg-[#111a36] border-r border-slate-800/80 transition-all duration-300 z-30 flex flex-col justify-between ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <ul className="p-4 space-y-3">
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
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  isActive ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300'
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