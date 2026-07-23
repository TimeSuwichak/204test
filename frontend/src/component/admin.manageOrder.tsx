import React, { useState } from 'react';
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  Truck, 
  XCircle, 
  CheckCircle2, 
  Clock, 
  Eye, 
  X, 
  Package, 
  CreditCard,
  User,
  MapPin
} from 'lucide-react';

interface OrderItem {
  id: string;
  customerName: string;
  address: string;
  items: { name: string; quantity: number; price: number }[];
  totalAmount: number;
  paymentStatus: 'PAID' | 'UNPAID'; // ขึ้นกับฝั่งลูกค้าว่าจ่ายหรือยัง
  fulfillmentStatus: 'PENDING' | 'SHIPPED' | 'CANCELLED'; // ฝั่ง Admin เปลี่ยนได้แค่ จัดส่งแล้ว หรือ ยกเลิก
  createdAt: string;
  trackingNumber?: string;
}

export const ManageOrdersPage: React.FC = () => {
  // Mock Data รายการคำสั่งซื้อ
  const [orders, setOrders] = useState<OrderItem[]>([
    {
      id: 'ORD-2026-8801',
      customerName: 'สมชาย สายเกม',
      address: '123/45 ถ.สุขุมวิท แขวงคลองเตย เขตคลองเตย กทม. 10110',
      items: [
        { name: 'Elden Ring (PS5)', quantity: 1, price: 1990 },
      ],
      totalAmount: 1990,
      paymentStatus: 'PAID', // ลูกค้าจ่ายแล้ว
      fulfillmentStatus: 'PENDING',
      createdAt: '22 ก.ค. 2026 - 14:00',
    },
    {
      id: 'ORD-2026-8802',
      customerName: 'วิภาดา มีทรัพย์',
      address: '99/1 หมู่ 2 ต.ลาดสวาย อ.ลำลูกกา จ.ปทุมธานี 12150',
      items: [
        { name: 'Nintendo Switch OLED Model', quantity: 1, price: 12500 },
        { name: 'Zelda: Tears of the Kingdom', quantity: 1, price: 1890 },
      ],
      totalAmount: 14390,
      paymentStatus: 'UNPAID', // ลูกค้ายังไม่จ่าย
      fulfillmentStatus: 'PENDING',
      createdAt: '22 ก.ค. 2026 - 15:30',
    },
    {
      id: 'ORD-2026-8790',
      customerName: 'ธนกฤต ใจดี',
      address: '45/8 ถ.มิตรภาพ อ.เมือง จ.ขอนแก่น 40000',
      items: [
        { name: 'DualSense Wireless Controller', quantity: 1, price: 2390 }
      ],
      totalAmount: 2390,
      paymentStatus: 'PAID',
      fulfillmentStatus: 'SHIPPED',
      trackingNumber: 'TH1234567890',
      createdAt: '21 ก.ค. 2026 - 09:15',
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // State สำหรับ Modal ดูและอัปเดตสถานะออเดอร์
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [trackingInput, setTrackingInput] = useState('');

  // เปิด Modal ดูรายละเอียด
  const handleOpenDetail = (order: OrderItem) => {
    setSelectedOrder(order);
    setTrackingInput(order.trackingNumber ?? '');
  };

  // เปลี่ยนสถานะเป็น "จัดส่งแล้ว" หรือ "ยกเลิกออเดอร์"
  const handleUpdateStatus = (newStatus: 'SHIPPED' | 'CANCELLED') => {
    if (!selectedOrder) return;

    if (newStatus === 'SHIPPED' && !trackingInput.trim()) {
      alert('กรุณากรอกเลขพัสดุ (Tracking Number) ก่อนเปลี่ยนสถานะเป็นจัดส่งแล้ว');
      return;
    }

    setOrders(orders.map(o => {
      if (o.id === selectedOrder.id) {
        return {
          ...o,
          fulfillmentStatus: newStatus,
          trackingNumber: newStatus === 'SHIPPED' ? trackingInput.trim() : undefined
        };
      }
      return o;
    }));

    setSelectedOrder(null);
  };

  // กรองข้อมูล
  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || o.fulfillmentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-wide flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 border border-indigo-500/30 rounded-xl text-indigo-400">
            <ShoppingCart size={24} />
          </div>
          จัดการคำสั่งซื้อ (Manage Orders)
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          ตรวจสอบสถานะชำระเงินของลูกค้า และจัดการอัปเดตการจัดส่งหรือยกเลิกออเดอร์
        </p>
      </div>

      {/* แถบ ค้นหา และ ตัวกรอง */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="ค้นหาด้วยรหัสคำสั่งซื้อ (ORD-...) หรือชื่อลูกค้า..." 
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); }}
            className="w-full bg-[#16223f]/40 border border-slate-800/80 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 placeholder-slate-500"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-2.5 text-slate-500" size={16} />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); }}
            className="w-full bg-[#16223f]/40 border border-slate-800/80 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
          >
            <option value="ALL">ทุกสถานะการจัดส่ง</option>
            <option value="PENDING">🟡 รอดำเนินการจัดส่ง (Pending)</option>
            <option value="SHIPPED">🟢 จัดส่งแล้ว (Shipped)</option>
            <option value="CANCELLED">🔴 ยกเลิกออเดอร์ (Cancelled)</option>
          </select>
        </div>
      </div>

      {/* ตารางคำสั่งซื้อ */}
      <div className="bg-[#16223f]/20 border border-slate-800/60 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-[#111a36]/50 border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">คำสั่งซื้อ / เวลา</th>
                <th className="py-3.5 px-4">ลูกค้า</th>
                <th className="py-3.5 px-4 text-right">ยอดรวม</th>
                <th className="py-3.5 px-4 text-center">การชำระเงิน (ลูกค้า)</th>
                <th className="py-3.5 px-4 text-center">สถานะการจัดส่ง</th>
                <th className="py-3.5 px-4 text-center">การจัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-slate-300">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    ไม่พบรายการคำสั่งซื้อ
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-800/10 transition-colors">
                    
                    {/* Order ID & Time */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-indigo-400">{order.id}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{order.createdAt}</div>
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-100">{order.customerName}</div>
                      <div className="text-xs text-slate-400 line-clamp-1">{order.address}</div>
                    </td>

                    {/* Total */}
                    <td className="py-3.5 px-4 text-right font-bold font-mono text-emerald-400">
                      ฿{order.totalAmount.toLocaleString()}
                    </td>

                    {/* Payment Status (อ่านอย่างเดียว) */}
                    <td className="py-3.5 px-4 text-center">
                      {order.paymentStatus === 'PAID' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                          <CheckCircle2 size={12} /> ชำระเงินแล้ว
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
                          <Clock size={12} /> รอการชำระเงิน
                        </span>
                      )}
                    </td>

                    {/* Fulfillment Status */}
                    <td className="py-3.5 px-4 text-center">
                      {order.fulfillmentStatus === 'PENDING' && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-full">
                          <Clock size={12} /> รอดำเนินการ
                        </span>
                      )}
                      {order.fulfillmentStatus === 'SHIPPED' && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full">
                          <Truck size={12} /> จัดส่งแล้ว
                        </span>
                      )}
                      {order.fulfillmentStatus === 'CANCELLED' && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-full">
                          <XCircle size={12} /> ยกเลิกออเดอร์
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-center">
                      <button 
                        onClick={() => { handleOpenDetail(order); }}
                        className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 hover:text-white rounded-lg text-xs font-semibold transition-all inline-flex items-center gap-1.5"
                      >
                        <Eye size={14} /> ดู/จัดการ
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🟢 MODAL ดูรายละเอียดออเดอร์ และ ปรับสถานะจัดส่ง/ยกเลิก */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#0f162c] border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono text-indigo-400 font-bold">{selectedOrder.id}</span>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 mt-0.5">
                  <Package size={20} className="text-indigo-400" />
                  รายละเอียดคำสั่งซื้อ
                </h2>
              </div>
              <button 
                onClick={() => { setSelectedOrder(null); }}
                className="text-slate-500 hover:text-slate-300 p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content Details */}
            <div className="space-y-4 text-xs">
              
              {/* ข้อมูลลูกค้า & การชำระเงิน */}
              <div className="grid grid-cols-2 gap-3 bg-[#16223f]/40 p-3 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-500 block flex items-center gap-1"><User size={12} /> ข้อมูลลูกค้า:</span>
                  <span className="font-bold text-slate-200 block mt-0.5">{selectedOrder.customerName}</span>
                  <span className="text-slate-400 block text-[11px] mt-1 flex items-start gap-1">
                    <MapPin size={12} className="shrink-0 mt-0.5" /> {selectedOrder.address}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block flex items-center gap-1"><CreditCard size={12} /> สถานะชำระเงิน:</span>
                  <div className="mt-1">
                    {selectedOrder.paymentStatus === 'PAID' ? (
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                        ✓ ชำระเงินเรียบร้อยแล้ว
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                        ⏳ รอการชำระเงินจากลูกค้า
                      </span>
                    )}
                  </div>
                  <span className="text-slate-400 block text-[11px] mt-2">ยอดรวมทั้งสิ้น: <strong className="text-emerald-400 font-mono text-sm">฿{selectedOrder.totalAmount.toLocaleString()}</strong></span>
                </div>
              </div>

              {/* รายการสินค้า */}
              <div>
                <span className="text-slate-400 font-bold block mb-1">รายการสินค้าที่สั่งซื้อ:</span>
                <div className="bg-[#16223f]/60 border border-slate-800 rounded-xl divide-y divide-slate-800/60 overflow-hidden">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="p-2.5 flex justify-between items-center text-slate-200">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-[11px] text-slate-400">จำนวน: x{item.quantity}</div>
                      </div>
                      <div className="font-mono font-semibold text-slate-300">
                        ฿{(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ช่องกรอก เลขพัสดุ (สำหรับจัดส่ง) */}
              <div className="pt-2 border-t border-slate-800">
                <label className="block text-slate-300 font-bold mb-1">เลขพัสดุ / Tracking Number</label>
                <input 
                  type="text" 
                  placeholder="เช่น TH1234567890 (จำเป็นต้องใส่เมื่อกด 'จัดส่งแล้ว')"
                  value={trackingInput}
                  onChange={(e) => { setTrackingInput(e.target.value); }}
                  className="w-full bg-[#16223f] border border-slate-700/80 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-indigo-500 placeholder-slate-500 font-mono"
                />
              </div>

              {/* ปุ่มเปลี่ยนสถานะ (เลือกได้แค่ จัดส่งแล้ว หรือ ยกเลิก) */}
              <div className="pt-2 space-y-2">
                <span className="text-slate-400 font-bold block text-center text-[11px]">เลือกเปลี่ยนสถานะการจัดส่งคำสั่งซื้อ</span>
                
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    type="button" 
                    onClick={() => { handleUpdateStatus('SHIPPED'); }}
                    className="py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-md shadow-indigo-600/20 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Truck size={16} /> ยืนยันจัดส่งแล้ว
                  </button>

                  <button 
                    type="button" 
                    onClick={() => { handleUpdateStatus('CANCELLED'); }}
                    className="py-2.5 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/40 text-rose-300 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <XCircle size={16} /> ยกเลิกออเดอร์
                  </button>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};