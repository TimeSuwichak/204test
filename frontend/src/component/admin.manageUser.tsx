import React, { useState } from 'react';
import { Users, Lock, Search, Filter, Key, X, UserPlus, UserCheck, UserX, Mail, User } from 'lucide-react';

// โครงสร้างขอบเขตสิทธิ์ในระบบ
interface ModulePermission {
  moduleKey: string;
  moduleName: string;
  canView: boolean;   // เข้าดูได้
  canEdit: boolean;   // เพิ่ม/แก้ไขได้
  canDelete: boolean; // ลบข้อมูลได้
}

interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'MANAGER' | 'STAFF' | 'CUSTOMER';
  status: 'ACTIVE' | 'BANNED';
  permissions: ModulePermission[];
}

export const ManageUsersPage: React.FC = () => {
  // มอดูลทั้งหมดที่มีในระบบหลังบ้าน
  const defaultModules: ModulePermission[] = [
    { moduleKey: 'items', moduleName: 'จัดการแผ่น/ตลับเกม', canView: true, canEdit: true, canDelete: false },
    { moduleKey: 'orders', moduleName: 'จัดการคำสั่งซื้อ & จัดส่ง', canView: true, canEdit: true, canDelete: false },
    { moduleKey: 'promotions', moduleName: 'โปรโมชัน & คูปอง', canView: true, canEdit: false, canDelete: false },
    { moduleKey: 'users', moduleName: 'จัดการผู้ใช้ & สิทธิ์', canView: false, canEdit: false, canDelete: false },
    { moduleKey: 'settings', moduleName: 'ตั้งค่าข้อมูลหลักร้าน', canView: false, canEdit: false, canDelete: false },
  ];

  // Mock Data ผู้ใช้งาน
  const [users, setUsers] = useState<UserAccount[]>([
    {
      id: 'USR-001',
      name: 'Somchai Manager',
      email: 'manager@gamestore.com',
      role: 'MANAGER',
      status: 'ACTIVE',
      permissions: defaultModules.map(m => ({ ...m, canView: true, canEdit: true, canDelete: true }))
    },
    {
      id: 'USR-002',
      name: 'Alex Staffer',
      email: 'alex.staff@gamestore.com',
      role: 'STAFF',
      status: 'ACTIVE',
      permissions: defaultModules
    },
    {
      id: 'USR-003',
      name: 'Anan Customer',
      email: 'anan.n@gmail.com',
      role: 'CUSTOMER',
      status: 'ACTIVE',
      permissions: []
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  // State สำหรับ Modal แก้ไขสิทธิ์พนักงาน
  const [selectedUserForPerms, setSelectedUserForPerms] = useState<UserAccount | null>(null);

  // State สำหรับ Modal เพิ่มพนักงานใหม่
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STAFF' as 'MANAGER' | 'STAFF' | 'CUSTOMER',
  });

  // ฟังก์ชันเพิ่มพนักงานใหม่
  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name || !newUser.email) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    const createdUser: UserAccount = {
      id: `USR-${String(users.length + 1).padStart(3, '0')}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: 'ACTIVE',
      permissions: newUser.role === 'MANAGER' 
        ? defaultModules.map(m => ({ ...m, canView: true, canEdit: true, canDelete: true }))
        : newUser.role === 'STAFF' 
        ? defaultModules 
        : []
    };

    setUsers([createdUser, ...users]);
    setIsAddUserModalOpen(false);
    // Reset Form
    setNewUser({ name: '', email: '', password: '', role: 'STAFF' });
  };

  // ฟังก์ชันสลับสถานะ Ban/Active
  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        return { ...u, status: u.status === 'ACTIVE' ? 'BANNED' : 'ACTIVE' };
      }
      return u;
    }));
  };

  // ฟังก์ชันบันทึกสิทธิ์การใช้งาน
  const handleSavePermissions = () => {
    if (!selectedUserForPerms) return;
    setUsers(users.map(u => u.id === selectedUserForPerms.id ? selectedUserForPerms : u));
    setSelectedUserForPerms(null);
  };

  // ฟังก์ชันสลับติ๊กสิทธิ์
  const togglePermission = (moduleKey: string, field: 'canView' | 'canEdit' | 'canDelete') => {
    if (!selectedUserForPerms) return;
    const updatedPerms = selectedUserForPerms.permissions.map(p => {
      if (p.moduleKey === moduleKey) {
        return { ...p, [field]: !p[field] };
      }
      return p;
    });
    setSelectedUserForPerms({ ...selectedUserForPerms, permissions: updatedPerms });
  };

  // Filter รายการผู้ใช้งาน
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header และ ปุ่มเพิ่มผู้ใช้/พนักงาน */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-wide flex items-center gap-2">
            <Users className="text-indigo-400" />
            จัดการผู้ใช้ & สิทธิ์การทำงาน
          </h1>
          <p className="text-sm text-slate-400 mt-1">เพิ่มพนักงานใหม่ และกำหนดสิทธิ์การเข้าถึงเมนูต่าง ๆ (อ่าน/แก้ไข/ลบ)</p>
        </div>

        {/* ปุ่มเปิด Modal เพิ่มพนักงานใหม่ */}
        <button
          onClick={() => setIsAddUserModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 shrink-0 active:scale-95"
        >
          <UserPlus size={18} />
          เพิ่มพนักงานใหม่
        </button>
      </div>

      {/* แถบ ค้นหา และ กรอง Role */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="ค้นหาชื่อ, อีเมล หรือ ID..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#16223f]/40 border border-slate-800/80 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 placeholder-slate-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-2.5 text-slate-500" size={16} />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full bg-[#16223f]/40 border border-slate-800/80 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
          >
            <option value="All">ทุกบทบาท (All Roles)</option>
            <option value="MANAGER">ผู้จัดการ (Manager)</option>
            <option value="STAFF">พนักงาน (Staff)</option>
            <option value="CUSTOMER">ลูกค้า (Customer)</option>
          </select>
        </div>
      </div>

      {/* ตารางแสดงผู้ใช้งาน */}
      <div className="bg-[#16223f]/20 border border-slate-800/60 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-[#111a36]/50 border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">ผู้ใช้งาน</th>
                <th className="py-3.5 px-4 text-center">บทบาท (Role)</th>
                <th className="py-3.5 px-4 text-center">สถานะ</th>
                <th className="py-3.5 px-4 text-center">การจัดการสิทธิ์</th>
                <th className="py-3.5 px-4 text-center">การใช้งานบัญชี</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-slate-300">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/10 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-100">{u.name}</div>
                    <div className="text-xs text-slate-400">{u.email} <span className="font-mono text-indigo-400/80">({u.id})</span></div>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                      u.role === 'MANAGER' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' :
                      u.role === 'STAFF' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' :
                      'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                      u.status === 'ACTIVE' ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
                    }`}>
                      {u.status === 'ACTIVE' ? 'เปิดใช้งาน' : 'ระงับใช้งาน'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {u.role === 'MANAGER' ? (
                      <span className="text-xs text-slate-500 italic">เข้าถึงได้ทั้งหมด (Full Override)</span>
                    ) : u.role === 'STAFF' ? (
                      <button 
                        onClick={() => setSelectedUserForPerms({ ...u })}
                        className="px-3 py-1 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1.5"
                      >
                        <Key size={14} /> ตั้งค่าสิทธิ์เข้าถึง
                      </button>
                    ) : (
                      <span className="text-xs text-slate-600">-</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => toggleUserStatus(u.id)}
                      className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        u.status === 'ACTIVE' 
                          ? 'text-slate-400 hover:text-rose-400 hover:bg-rose-500/10' 
                          : 'text-rose-400 hover:text-emerald-400 hover:bg-emerald-500/10'
                      }`}
                      title={u.status === 'ACTIVE' ? 'ระงับบัญชีนี้' : 'เปิดใช้งานบัญชี'}
                    >
                      {u.status === 'ACTIVE' ? <UserX size={16} /> : <UserCheck size={16} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🟢 MODAL เพิ่มผู้ใช้ / พนักงานใหม่ */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#0f162c] border border-slate-800 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <UserPlus className="text-indigo-400" size={20} />
                เพิ่มพนักงาน / ผู้ใช้ใหม่
              </h2>
              <button 
                onClick={() => setIsAddUserModalOpen(false)}
                className="text-slate-500 hover:text-slate-300 p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4 text-xs">
              
              {/* ชื่อ-นามสกุล */}
              <div>
                <label className="block text-slate-400 mb-1 font-medium">ชื่อ-นามสกุล</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 text-slate-500" size={16} />
                  <input 
                    type="text" 
                    required
                    placeholder="เช่น สมชาย สายเกม"
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    className="w-full bg-[#16223f]/60 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* อีเมล */}
              <div>
                <label className="block text-slate-400 mb-1 font-medium">อีเมล (สำหรับเข้าสู่ระบบ)</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 text-slate-500" size={16} />
                  <input 
                    type="email" 
                    required
                    placeholder="staff@gamestore.com"
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    className="w-full bg-[#16223f]/60 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* รหัสผ่าน */}
              <div>
                <label className="block text-slate-400 mb-1 font-medium">รหัสผ่านเริ่มต้น</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 text-slate-500" size={16} />
                  <input 
                    type="password" 
                    required
                    placeholder="••••••••"
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    className="w-full bg-[#16223f]/60 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* เลือก บทบาท (Role) */}
              <div>
                <label className="block text-slate-400 mb-1 font-medium">บทบาทในระบบ (Role)</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })}
                  className="w-full bg-[#16223f]/60 border border-slate-700/80 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="STAFF">พนักงาน (Staff)</option>
                  <option value="MANAGER">ผู้จัดการ (Manager)</option>
                  <option value="CUSTOMER">ลูกค้า (Customer)</option>
                </select>
              </div>

              {/* ปุ่มกดยืนยัน */}
              <div className="flex gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="w-1/2 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold"
                >
                  ยกเลิก
                </button>
                <button 
                  type="submit" 
                  className="w-1/2 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-md shadow-indigo-600/20"
                >
                  บันทึกผู้ใช้ใหม่
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 🔐 MODAL ปรับแต่งสิทธิ์พนักงาน */}
      {selectedUserForPerms && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#0f162c] border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Key className="text-indigo-400" size={20} />
                  กำหนดสิทธิ์พนักงาน: {selectedUserForPerms.name}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">{selectedUserForPerms.email}</p>
              </div>
              <button 
                onClick={() => setSelectedUserForPerms(null)}
                className="text-slate-500 hover:text-slate-300 p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {/* ตารางสิทธิ์แต่ละมอดูล */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">ขอบเขตสิทธิ์การเข้าถึง (Module Permissions)</span>
              
              <div className="bg-[#16223f]/30 border border-slate-800/80 rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-[#111a36] text-slate-400 border-b border-slate-800 font-semibold">
                      <th className="py-2.5 px-3">มอดูลระบบ</th>
                      <th className="py-2.5 px-3 text-center">เข้าดู (View)</th>
                      <th className="py-2.5 px-3 text-center">เพิ่ม/แก้ไข (Edit)</th>
                      <th className="py-2.5 px-3 text-center">ลบ (Delete)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-200">
                    {selectedUserForPerms.permissions.map((perm) => (
                      <tr key={perm.moduleKey} className="hover:bg-slate-800/20">
                        <td className="py-2.5 px-3 font-medium text-slate-200">{perm.moduleName}</td>
                        
                        <td className="py-2.5 px-3 text-center">
                          <input 
                            type="checkbox" 
                            checked={perm.canView} 
                            onChange={() => togglePermission(perm.moduleKey, 'canView')}
                            className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-0 cursor-pointer"
                          />
                        </td>

                        <td className="py-2.5 px-3 text-center">
                          <input 
                            type="checkbox" 
                            checked={perm.canEdit} 
                            onChange={() => togglePermission(perm.moduleKey, 'canEdit')}
                            className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-0 cursor-pointer"
                          />
                        </td>

                        <td className="py-2.5 px-3 text-center">
                          <input 
                            type="checkbox" 
                            checked={perm.canDelete} 
                            onChange={() => togglePermission(perm.moduleKey, 'canDelete')}
                            className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-indigo-600 focus:ring-0 cursor-pointer"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ปุ่มบันทึก */}
            <div className="flex gap-2 pt-2">
              <button 
                type="button" 
                onClick={() => setSelectedUserForPerms(null)}
                className="w-1/2 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-xs"
              >
                ยกเลิก
              </button>
              <button 
                type="button" 
                onClick={handleSavePermissions}
                className="w-1/2 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs shadow-md shadow-indigo-600/20"
              >
                บันทึกสิทธิ์ใช้งาน
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};