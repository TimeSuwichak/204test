import React, { useState, type SubmitEvent } from 'react';
import { 
  MessageSquareWarning, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Eye, 
  Send, 
  X,
  Package,
  User
} from 'lucide-react';

interface ComplaintItem {
  id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  category: 'สินค้าชำรุด/เสียหาย' | 'จัดส่งล่าช้า' | 'ได้รับสินค้าไม่ครบ' | 'ปัญหาการชำระเงิน' | 'อื่นๆ';
  subject: string;
  details: string;
  createdAt: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
  adminNote?: string;
}

export const ManageComplaintsPage: React.FC = () => {
  // Mock Data การร้องเรียน/แจ้งปัญหา
  const [complaints, setComplaints] = useState<ComplaintItem[]>([
    {
      id: 'CMP-001',
      orderId: 'ORD-2026-8801',
      customerName: 'สมชาย สายเกม',
      customerEmail: 'somchai@gmail.com',
      category: 'สินค้าชำรุด/เสียหาย',
      subject: 'กล่องแผ่นเกม PS5 มีรอยแตกจากการขนส่ง',
      details: 'ได้รับพัสดุวันนี้ เวลา 14:00 น. พอแกะกล่องพบว่าเคสพลาสติกของแผ่นเกม Elden Ring แตกตรงมุมล่างขวาครับ ต้องการขอเปลี่ยนกล่องใหม่ครับ',
      createdAt: '22 ก.ค. 2026 - 14:30',
      status: 'PENDING',
    },
    {
      id: 'CMP-002',
      orderId: 'ORD-2026-8742',
      customerName: 'วิภาดา มีทรัพย์',
      customerEmail: 'wipada.m@gmail.com',
      category: 'จัดส่งล่าช้า',
      subject: 'ยังไม่ได้รับสินค้า สถานะค้างที่คลังนานเกินไป',
      details: 'สั่งซื้อตลับ Switch ไปตั้งแต่ 3 วันที่แล้ว เลข Tracking ขึ้นว่าอยู่ที่ศูนย์คัดแยก แต่ไม่มีความเคลื่อนไหวเลย ช่วยติดตามให้หน่อยค่ะ',
      createdAt: '21 ก.ค. 2026 - 10:15',
      status: 'IN_PROGRESS',
      adminNote: 'ประสานงานกับทางบริษัทขนส่งเรียบร้อยแล้ว อยู่ระหว่างเร่งติดตาม',
    },
    {
      id: 'CMP-003',
      orderId: 'ORD-2026-8690',
      customerName: 'ธนกฤต ใจดี',
      customerEmail: 'tanakrit@hotmail.com',
      category: 'ได้รับสินค้าไม่ครบ',
      subject: 'ขาดโค้ด DLC Pre-order ในกล่อง',
      details: 'สั่งจอง Monster Hunter Wilds ได้รับแผ่นแล้ว แต่ค้นหาใบโค้ด DLC ของแถมในกล่องไม่เจอครับ',
      createdAt: '20 ก.ค. 2026 - 18:00',
      status: 'RESOLVED',
      adminNote: 'จัดส่งโค้ดทางอีเมลให้ลูกค้าเรียบร้อยแล้ว ลูกค้ายืนยันรับทราบ',
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  
  // State สำหรับ Modal ตอบกลับ/จัดการปัญหา
  const [selectedComplaint, setSelectedComplaint] = useState<ComplaintItem | null>(null);
  const [replyNote, setReplyNote] = useState('');
  const [newStatus, setNewStatus] = useState<ComplaintItem['status']>('PENDING');

  // เปิด Modal ดูรายละเอียด
  const handleOpenDetail = (item: ComplaintItem) => {
    setSelectedComplaint(item);
    setReplyNote(item.adminNote ?? '');
    setNewStatus(item.status);
  };

  // บันทึกการอัปเดตสถานะและคำตอบ
  const handleSaveResolution = (e: SubmitEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    setComplaints(complaints.map(c => {
      if (c.id === selectedComplaint.id) {
        return {
          ...c,
          status: newStatus,
          adminNote: replyNote.trim()
        };
      }
      return c;
    }));

    setSelectedComplaint(null);
  };

  // กรองข้อมูล
  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = 
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-wide flex items-center gap-3">
          <div className="p-2 bg-amber-500/20 border border-amber-500/30 rounded-xl text-amber-400">
            <MessageSquareWarning size={24} />
          </div>
          จัดการการร้องเรียน & แจ้งปัญหา
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          ตรวจสอบข้อร้องเรียน ปัญหาสินค้า หรือคำขอความช่วยเหลือจากลูกค้า
        </p>
      </div>

      {/* แถบ ค้นหา และ ตัวกรอง */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="ค้นหาตามเลขเคส (CMP), รหัสคำสั่งซื้อ (ORD), ชื่อลูกค้า หรือหัวข้อ..." 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value); 
            }}
            className="w-full bg-[#16223f]/40 border border-slate-800/80 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 placeholder-slate-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-2.5 text-slate-500" size={16} />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value); 
            }}
            className="w-full bg-[#16223f]/40 border border-slate-800/80 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
          >
            <option value="ALL">ทุกสถานะ (All Status)</option>
            <option value="PENDING">🔴 รอดำเนินการ (Pending)</option>
            <option value="IN_PROGRESS">🟡 กำลังตรวจสอบ (In Progress)</option>
            <option value="RESOLVED">🟢 แก้ไขแล้ว (Resolved)</option>
            <option value="REJECTED">⚪ ปฏิเสธเคส (Rejected)</option>
          </select>
        </div>
      </div>

      {/* ตารางแสดงรายการแจ้งปัญหา */}
      <div className="bg-[#16223f]/20 border border-slate-800/60 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-[#111a36]/50 border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">เลขเคส / เวลา</th>
                <th className="py-3.5 px-4">ลูกค้า / คำสั่งซื้อ</th>
                <th className="py-3.5 px-4">หมวดหมู่ & หัวข้อเรื่อง</th>
                <th className="py-3.5 px-4 text-center">สถานะ</th>
                <th className="py-3.5 px-4 text-center">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-slate-300">
              {filteredComplaints.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500">
                    ไม่พบรายการร้องเรียน
                  </td>
                </tr>
              ) : (
                filteredComplaints.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/10 transition-colors">
                    
                    {/* ID & Date */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-amber-400">{item.id}</div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock size={12} /> {item.createdAt}
                      </div>
                    </td>

                    {/* Customer & Order */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-100 flex items-center gap-1.5">
                        <User size={14} className="text-slate-400" />
                        {item.customerName}
                      </div>
                      <div className="text-xs text-indigo-400 font-mono flex items-center gap-1 mt-0.5">
                        <Package size={12} /> {item.orderId}
                      </div>
                    </td>

                    {/* Category & Subject */}
                    <td className="py-3.5 px-4">
                      <span className="text-[11px] font-semibold bg-slate-800 text-slate-300 border border-slate-700/60 px-2 py-0.5 rounded-md">
                        {item.category}
                      </span>
                      <div className="text-sm font-medium text-slate-200 mt-1 line-clamp-1">
                        {item.subject}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4 text-center">
                      {item.status === 'PENDING' && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
                          <AlertCircle size={12} /> รอดำเนินการ
                        </span>
                      )}
                      {item.status === 'IN_PROGRESS' && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-full">
                          <Clock size={12} /> กำลังตรวจสอบ
                        </span>
                      )}
                      {item.status === 'RESOLVED' && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                          <CheckCircle2 size={12} /> แก้ไขแล้ว
                        </span>
                      )}
                      {item.status === 'REJECTED' && (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-400 bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-full">
                          <XCircle size={12} /> ปฏิเสธเคส
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-center">
                      <button 
                        onClick={() => { handleOpenDetail(item); }}
                        className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 hover:text-white rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1.5"
                      >
                        <Eye size={14} /> ดูรายละเอียด
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🟢 MODAL ดูรายละเอียด & ตอบกลับการร้องเรียน */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#0f162c] border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-5">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-amber-400 font-bold">{selectedComplaint.id}</span>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 mt-0.5">
                  {selectedComplaint.subject}
                </h2>
              </div>
              <button 
                onClick={() => { setSelectedComplaint(null); }}
                className="text-slate-500 hover:text-slate-300 p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {/* Complaint Detail Body */}
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-[#16223f]/40 p-3 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-500 block">ผู้แจ้งปัญหา:</span>
                  <span className="font-bold text-slate-200">{selectedComplaint.customerName}</span>
                  <span className="text-slate-400 block text-[11px]">{selectedComplaint.customerEmail}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">อ้างอิงคำสั่งซื้อ:</span>
                  <span className="font-mono font-bold text-indigo-400">{selectedComplaint.orderId}</span>
                  <span className="text-slate-400 block text-[11px]">{selectedComplaint.createdAt}</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 font-bold block mb-1">รายละเอียดปัญหาที่แจ้ง:</span>
                <div className="bg-[#16223f]/60 border border-slate-800 rounded-xl p-3 text-slate-200 leading-relaxed text-xs">
                  {selectedComplaint.details}
                </div>
              </div>

              {/* Form สำหรับเปลี่ยนสถานะและตอบกลับ */}
              <form onSubmit={handleSaveResolution} className="space-y-3 pt-2 border-t border-slate-800">
                <div>
                  <label className="block text-slate-400 mb-1 font-bold">อัปเดตสถานะเคส</label>
                  <select
                    value={newStatus}
                    onChange={(e) => { setNewStatus(e.target.value as "PENDING"); }}
                    className="w-full bg-[#16223f] border border-slate-700/80 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="PENDING">🔴 รอดำเนินการ (Pending)</option>
                    <option value="IN_PROGRESS">🟡 กำลังตรวจสอบ (In Progress)</option>
                    <option value="RESOLVED">🟢 แก้ไขปัญหาเรียบร้อย (Resolved)</option>
                    <option value="REJECTED">⚪ ปฏิเสธเคส (Rejected)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-bold">บันทึกวิธีแก้ไข / ข้อความแจ้งลูกค้า</label>
                  <textarea
                    rows={3}
                    placeholder="เช่น จัดส่งสินค้าชิ้นใหม่ทดแทนให้แล้ว / จัดส่งโค้ดผ่านทางอีเมล..."
                    value={replyNote}
                    onChange={(e) => { setReplyNote(e.target.value); }}
                    className="w-full bg-[#16223f] border border-slate-700/80 rounded-xl p-3 text-slate-100 focus:outline-none focus:border-indigo-500 placeholder-slate-500"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button 
                    type="button" 
                    onClick={() => { setSelectedComplaint(null) }}
                    className="w-1/2 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold"
                  >
                    ยกเลิก
                  </button>
                  <button 
                    type="submit" 
                    className="w-1/2 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5"
                  >
                    <Send size={14} /> บันทึกและตอบกลับ
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};