import React, { useState }  from 'react';
import { AdminSidebar }     from '#component/admin.sidebar.tsx';
import { AdminDashboard }   from '#page/admin.dashboard.tsx';
import {ManageItemsPage}    from '#page/admin.manageitem.tsx';
import { X }                from 'lucide-react';

// สมมติว่า Navbar อยู่ในโฟลเดอร์เดียวกัน หากพาทไม่ตรงสามารถปรับตามพาทจริงได้ครับ
// ตัวอย่าง: import { Navbar } from './components/admin/Navbar';
import { AdminNavbar }      from '#component/admin.navbar'; 

export const AdminLayout: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState('dashboard'); // เริ่มต้นที่หน้าแดชบอร์ด
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
  /* 💡 ใช้ h-screen และ flex-col เพื่อควบคุมไม่ให้หน้าจอยืดล้น และจัดสรรพื้นที่แบบไม่มีช่องว่างคาด */
  <div className="h-screen w-screen bg-[#070b19] font-sans antialiased text-slate-200 flex flex-col overflow-hidden">
    
    {/* 1. แถบเมนูด้านบน (Top Navbar) - บล็อกความสูงไว้คงที่ */}
    <div className="h-16 flex-shrink-0 z-40">
      <AdminNavbar />
    </div>

    {/* 2. พื้นที่ด้านล่าง Navbar (รวม Sidebar และ Content Area เข้าด้วยกัน) */}
    <div className="flex flex-1 relative overflow-hidden">
      
      {/* แถบเมนูด้านข้าง (Admin Sidebar) 
          เปลี่ยนสไตล์ในนี้ให้ชิดขอบบนที่เกิดจาก flex wrapper ด้านบนแทนการใช้ top-16 */}
      <AdminSidebar 
        activeMenu={activeMenu} 
        setActiveMenu={setActiveMenu}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* 3. พื้นที่แสดงเนื้อหาหลัก (Main Content Area) 
          - ใช้ flex-1 เพื่อให้กินพื้นที่ที่เหลือทั้งหมด
          - ลบ pt-16, pt-14 ออกไปให้หมดเพื่อแก้ปัญหาช่องว่างสีดำลอยเหนือบอร์ด
          - ใส่ overflow-y-auto เพื่อให้เนื้อหาภายใน scroll ได้อิสระเมื่อมียอดขายหรือข้อมูลจำนวนมาก
      */}
      <main 
        className={`flex-1 overflow-y-auto transition-all duration-300 bg-[#070b19] ${
          isCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        {/* ปรับระยะห่างรอบนอกกล่องสีกรมท่าให้ชิดขอบบนมากขึ้นด้วย pt-4 */}
        <div className="pt-4 pb-6 px-4 md:px-6 max-w-6xl mx-auto">
          
          {/* กล่องเนื้อหาหลักสีกรมท่า */}
          <div className="bg-[#0f162c] rounded-xl border border-slate-800/80 min-h-[500px] shadow-2xl p-5 md:p-6 relative overflow-hidden">
            
            {/* ปุ่มปิด (X) มุมขวาบน */}
            <button className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors border border-slate-700">
              <X size={18} />
            </button>

            {/* ส่วนควบคุมการเปลี่ยนหน้าเพจ */}
            {activeMenu === 'dashboard' && <AdminDashboard />}

            {activeMenu === 'items' && <ManageItemsPage />}

            {activeMenu === 'users' && (
              <div className="animate-in fade-in duration-200">
                <h1 className="text-2xl font-bold text-slate-100 pb-3 border-b border-slate-800">จัดการผู้ใช้และสิทธิ์พนักงาน (Manage Users)</h1>
                <p className="text-sm text-slate-400 mt-4">ระบบ กำลังพัฒนาไฟล์ ManageUsersPage.tsx...</p>
              </div>
            )}

            {/* ดักจับกรณีหน้าอื่นๆ */}
            {!['dashboard', 'items', 'users'].includes(activeMenu) && (
              <div className="animate-in fade-in duration-200 py-16 text-center text-slate-500">
                <p className="text-base">กำลังพัฒนาหน้าส่วนระบบนี้เพิ่มในโฟลเดอร์ pages/admin/ ...</p>
              </div>
            )}
            
          </div>
        </div>
      </main>
    </div>
  </div>
);
};