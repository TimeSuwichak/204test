import React, { useState } from 'react';
import { ShoppingBag, Search, Filter, Eye } from 'lucide-react';

interface OrderItem {
  id: string;
  customerName: string;
  totalAmount: number;
  paymentMethod: string;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'CANCELLED';
  trackingNo: string;
  createdAt: string;
  items: { name: string; qty: number; price: number }[];
}

export const ManageOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderItem[]>([
    {
      id: 'ORD-2026-001',
      customerName: 'Somchai Gamer',
      totalAmount: 1990,
      paymentMethod: 'PromptPay QR',
      status: 'PAID',
      trackingNo: '',
      createdAt: '2026-07-20 14:30',
      items: [{ name: 'Elden Ring: Shadow of the Erdtree (PS5)', qty: 1, price: 1990 }]
    },
    {
      id: 'ORD-2026-002',
      customerName: 'Alex Staffer',
      totalAmount: 3580,
      paymentMethod: 'Credit Card',
      status: 'SHIPPED',
      trackingNo: 'TH1234567890',
      createdAt: '2026-07-19 10:15',
      items: [{ name: 'The Legend of Zelda (Switch)', qty: 2, price: 1790 }]
    },
    {
      id: 'ORD-2026-003',
      customerName: 'Anan N.',
      totalAmount: 2290,
      paymentMethod: 'PromptPay QR',
      status: 'PENDING',
      trackingNo: '',
      createdAt: '2026-07-20 18:00',
      items: [{ name: 'Monster Hunter Wilds (PS5)', qty: 1, price: 2290 }]
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

  // เปลี่ยนสถานะออเดอร์
  const handleStatusChange = (orderId: string, newStatus: OrderItem['status']) => {
    setOrders(orders.map(o => {
      if (o.id === orderId) {
        let tracking = o.trackingNo;
        if (newStatus === 'SHIPPED' && !tracking) {
          tracking = prompt('กรุณากรอกเลข Tracking พัสดุ:') ?? 'TH-PENDING';
        }
        return { ...o, status: newStatus, trackingNo: tracking };
      }
      return o;
    }));
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          o.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 tracking-wide flex items-center gap-2">
            <ShoppingBag className="text-indigo-400" />
            จัดการคำสั่งซื้อและจัดส่ง
          </h1>
          <p className="text-sm text-slate-400 mt-1">ตรวจสอบรายการสั่งซื้อ อัปเดตสถานะการชำระเงิน และกรอกเลขพัสดุ</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="ค้นหาจาก หมายเลขออเดอร์ หรือชื่อลูกค้า..." 
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
            <option value="All">ทุกสถานะ (All Status)</option>
            <option value="PENDING">รอชำระเงิน (Pending)</option>
            <option value="PAID">ชำระแล้ว (Paid)</option>
            <option value="SHIPPED">จัดส่งแล้ว (Shipped)</option>
            <option value="CANCELLED">ยกเลิก (Cancelled)</option>
          </select>
        </div>
      </div>

      <div className="bg-[#16223f]/20 border border-slate-800/60 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-[#111a36]/50 border-b border-slate-800 text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">ลูกค้า</th>
                <th className="py-3.5 px-4 text-right">ยอดรวม</th>
                <th className="py-3.5 px-4 text-center">ช่องทางชำระ</th>
                <th className="py-3.5 px-4 text-center">สถานะ</th>
                <th className="py-3.5 px-4 text-center">เลขพัสดุ</th>
                <th className="py-3.5 px-4 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-slate-300">
              {filteredOrders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-800/10 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-xs text-indigo-400 font-bold">{o.id}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-200">{o.customerName}</div>
                    <div className="text-[11px] text-slate-500">{o.createdAt}</div>
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-100">฿{o.totalAmount.toLocaleString()}</td>
                  <td className="py-3.5 px-4 text-center text-xs text-slate-400">{o.paymentMethod}</td>
                  <td className="py-3.5 px-4 text-center">
                    <select
                      value={o.status}
                      onChange={(e) => { handleStatusChange(o.id, e.target.value as OrderItem['status']); }}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg border bg-[#0b1120] focus:outline-none cursor-pointer ${
                        o.status === 'PAID' ? 'text-emerald-400 border-emerald-500/30' :
                        o.status === 'SHIPPED' ? 'text-blue-400 border-blue-500/30' :
                        o.status === 'PENDING' ? 'text-amber-400 border-amber-500/30' : 'text-rose-400 border-rose-500/30'
                      }`}
                    >
                      <option value="PENDING">รอชำระเงิน</option>
                      <option value="PAID">ชำระเงินแล้ว</option>
                      <option value="SHIPPED">จัดส่งแล้ว</option>
                      <option value="CANCELLED">ยกเลิกออเดอร์</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono text-xs text-slate-400">
                    {o.trackingNo || '-'}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <button 
                      onClick={() => { setSelectedOrder(o); }}
                      className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800/50 rounded-lg transition-colors"
                      title="ดูรายละเอียดสินค้า"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal ดูรายละเอียดสินค้าในออเดอร์ */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#111a36] border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <h2 className="text-xl font-bold text-slate-100">รายละเอียดออเดอร์ #{selectedOrder.id}</h2>
            <div className="space-y-2 border-y border-slate-800 py-3 text-sm">
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-slate-300">
                  <span>{item.name} x{item.qty}</span>
                  <span className="font-bold text-slate-100">฿{(item.price * item.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm font-bold text-slate-100">
              <span>ยอดรวมทั้งหมด:</span>
              <span className="text-indigo-400">฿{selectedOrder.totalAmount.toLocaleString()}</span>
            </div>
            <button 
              onClick={() => { setSelectedOrder(null); }}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold text-xs"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      )}
    </div>
  );
};