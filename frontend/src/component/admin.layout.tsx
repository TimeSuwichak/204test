import React, { useState } from 'react';
import { AdminNavbar } from '#component/admin.navbar.tsx';
import { AdminSidebar } from '#component/admin.sidebar.tsx';
import { AdminDashboard } from '#page/admin.dashboard.tsx';
import { X } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState('dashboard'); // เริ่มต้นที่หน้า dashboard
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [username] = useState('ItsJeremie');
  const email = 'con****@****.net';

  return (
    <div className="min-h-screen bg-[#070b19] font-sans antialiased text-slate-200">
      
      <AdminNavbar />

      <AdminSidebar 
        activeMenu={activeMenu} 
        setActiveMenu={setActiveMenu}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* ตัวดันระยะขอบซ้าย ปรับตามสถานะเมนูย่อ/ขยายแบบสมบูรณ์ */}
      <div 
        className={`transition-all duration-300 pt-16 min-h-screen ${
          isCollapsed ? 'pl-20' : 'pl-64'
        }`}
      >
        <div className="p-6 md:p-8 max-w-6xl mx-auto">
          <div className="bg-[#0f162c] rounded-xl border border-slate-800/80 min-h-[500px] shadow-2xl p-6 md:p-8 relative overflow-hidden">
            
            <button className="absolute top-6 right-6 p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors border border-slate-700">
              <X size={18} />
            </button>

            {/* สลับหน้าเพจตามเมนูที่เลือก */}
            {activeMenu === 'dashboard' && <AdminDashboard />}

            {/* ส่วนของหน้าอื่นๆ ที่กำลังจะทำเพิ่มลงในโฟลเดอร์ pages */}
            {activeMenu === 'general' && (
              <div className="animate-in fade-in duration-200">
                <h1 className="text-3xl font-bold text-slate-100 pb-4 border-b border-slate-800">ทั่วไป</h1>
                <div className="mt-6 space-y-2 text-sm text-slate-300">
                  <p><span className="text-slate-400">ชื่อผู้ใช้ -</span> {username}</p>
                  <p><span className="text-slate-400">อีเมล -</span> {email}</p>
                </div>
              </div>
            )}

            {/* หน้าอื่นๆ ที่ยังไม่ได้ทำ */}
            {!['dashboard', 'general'].includes(activeMenu) && (
              <div className="animate-in fade-in duration-200 py-12 text-center text-slate-500">
                <p className="text-lg">กำลังพัฒนาหน้าส่วนระบบนี้ในโฟลเดอร์ pages...</p>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};