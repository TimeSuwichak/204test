import React, { useState } from 'react';
import { Users, Search, Filter, UserX, UserCheck, Plus, Mail } from 'lucide-react';

interface UserItem {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: 'ADMIN' | 'STAFF' | 'USER';
  status: 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
}

export const ManageUsersPage: React.FC = () => {
  const [users, setUsers] = useState<UserItem[]>([
    { id: 'USR-001', username: 'ItsJeremie', email: 'jeremie@game.net', fullName: 'Jeremie Admin', role: 'ADMIN', status: 'ACTIVE', createdAt: '2026-01-10' },
    { id: 'USR-002', username: 'staff_alex', email: 'alex@game.net', fullName: 'Alex Staffer', role: 'STAFF', status: 'ACTIVE', createdAt: '2026-02-15' },
    { id: 'USR-003', username: 'gamer_pro', email: 'gamer99@gmail.com', fullName: 'Somchai Gamer', role: 'USER', status: 'ACTIVE', createdAt: '2026-03-01' },
    { id: 'USR-004', username: 'troll_user', email: 'spammer@bad.com', fullName: 'Bad User', role: 'USER', status: 'SUSPENDED', createdAt: '2026-03-12' },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  // สลับสถานะ ระงับ/ปลดระงับ
  const toggleStatus = (id: string, currentStatus: string, name: string) => {
    const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    const actionText = newStatus === 'SUSPENDED' ? 'ระงับการใช้งาน' : 'ปลดการระงับการใช้งาน';

    if (confirm(`คุณต้องการ${actionText} บัญชีผู้ใช้ "${name}" ใช่หรือไม่?`)) {
      setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
    }
  };

  // เปลี่ยนสิทธิ์ใช้งาน (Role)
  const handleRoleChange = (id: string, newRole: 'ADMIN' | 'STAFF' | 'USER') => {
    setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.email.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Head section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-wide flex items-center gap-2">
            <Users className="text-indigo-400" />
            จัดการผู้ใช้และสิทธิ์พนักงาน
          </h1>
          <p className="text-sm text-slate-400 mt-1">ตรวจสอบรายชื่อ สลับสิทธิ์ผู้ใช้งาน และควบคุมการเข้าถึงระบบ</p>
        </div>
        
        <button 
          onClick={() => { alert('จำลองเปิดป๊อบอัพ: เพิ่มพนักงานใหม่'); }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95 self-start sm:self-auto"
        >
          <Plus size={16} />
          เพิ่มพนักงานใหม่
        </button>
      </div>

      {/* Filter and Search */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="ค้นหาจาก ชื่อบัญชี, อีเมล, รหัส หรือชื่อจริง..." 
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); }}
            className="w-full bg-[#16223f]/40 border border-slate-800/80 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 placeholder-slate-500 transition-colors"
          />
        </div>
        
        <div className="relative">
          <Filter className="absolute left-3 top-2.5 text-slate-500" size={16} />
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); }}
            className="w-full bg-[#16223f]/40 border border-slate-800/80 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
          >
            <option value="All">ทุกระดับสิทธิ์ (All Roles)</option>
            <option value="ADMIN">ผู้ดูแลระบบ (Admin)</option>
            <option value="STAFF">พนักงานร้าน (Staff)</option>
            <option value="USER">ลูกค้าทั่วไป (User)</option>
          </select>
        </div>
      </div>

      <div className="bg-[#16223f]/20 border border-slate-800/60 rounded-2xl overflow-hidden shadow-xl">
      {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-[#111a36]/50 border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">User ID</th>
                <th className="py-3.5 px-4">ข้อมูลผู้ใช้</th>
                <th className="py-3.5 px-4 text-center">สิทธิ์การใช้งาน (Role)</th>
                <th className="py-3.5 px-4 text-center">สถานะ</th>
                <th className="py-3.5 px-4 text-center">วันที่ลงทะเบียน</th>
                <th className="py-3.5 px-4 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-slate-300">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/10 transition-colors">
                    <td className="py-3.5 px-4 font-mono text-xs text-indigo-400 font-bold">{u.id}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-200">{u.fullName} <span className="text-xs text-slate-500">(@{u.username})</span></div>
                      <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><Mail size={12}/>{u.email}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <select 
                        value={u.role}
                        onChange={(e) => {
                          handleRoleChange(
                            u.id, 
                            e.target.value as 'ADMIN' | 'STAFF' | 'USER'
                          );
                        }}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-lg border bg-[#0b1120] focus:outline-none cursor-pointer ${
                          u.role === 'ADMIN' ? 'text-purple-400 border-purple-500/30' :
                          u.role === 'STAFF' ? 'text-blue-400 border-blue-500/30' : 'text-slate-400 border-slate-700'
                        }`}
                      >
                        <option value="USER">USER (ลูกค้า)</option>
                        <option value="STAFF">STAFF (พนักงาน)</option>
                        <option value="ADMIN">ADMIN (แอดมิน)</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-semibold ${
                        u.status === 'ACTIVE' 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {u.status === 'ACTIVE' ? 'ใช้งานปกติ' : 'ถูกระงับสิทธิ์'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center text-xs text-slate-500 font-mono">
                      {u.createdAt}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button 
                        onClick={() => { 
                          toggleStatus(u.id, u.status, u.username);
                        }}
                        className={`p-1.5 rounded-lg transition-colors border border-transparent ${
                          u.status === 'ACTIVE' 
                            ? 'text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20' 
                            : 'text-rose-400 hover:text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/20'
                        }`}
                        title={u.status === 'ACTIVE' ? 'ระงับบัญชีผู้ใช้' : 'ปลดระงับบัญชี'}
                      >
                        {u.status === 'ACTIVE' ? <UserX size={16} /> : <UserCheck size={16} />}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-500 font-medium">
                    ไม่พบผู้ใช้งานที่ตรงตามเงื่อนไข
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