// StockAdjustmentList.tsx
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Search, Plus, X } from 'lucide-react';

interface StockItem {
  id: string;
  name: string;
  sku: string;
  inStock: number;
  addStock: number;
  cost: number;
  stockAfter: number;
}

interface StockAdjustment {
  id: string;
  adjustmentNumber: string;
  date: string;
  reason: string;
  store: string;
  adjustedBy: string;
  quantity: number;
  items: StockItem[];
}

interface StockAdjustmentListProps {
  adjustments: StockAdjustment[];
  onViewDetail: (adjustment: StockAdjustment) => void;
  onAddNew: () => void;
}

const StockAdjustmentList: React.FC<StockAdjustmentListProps> = ({ 
  adjustments, 
  onViewDetail, 
  onAddNew 
}) => {
  const [reasonFilter, setReasonFilter] = useState('All reasons');
  const [storeFilter, setStoreFilter] = useState('All stores');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const reasons = ['All reasons', 'Receive items', 'Inventory count', 'Loss', 'Damage'];
  const stores = ['All stores', 'New bizflow', 'Main warehouse', 'Store 2'];

  // Filter adjustments based on reason, store, and search
  const filteredAdjustments = adjustments.filter((adj: StockAdjustment) => {
    const matchesReason = reasonFilter === 'All reasons' || adj.reason === reasonFilter;
    const matchesStore = storeFilter === 'All stores' || adj.store.includes(storeFilter.replace('All stores', ''));
    const matchesSearch = searchQuery === '' || 
      adj.adjustmentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      adj.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      adj.store.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesReason && matchesStore && matchesSearch;
  });

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 md:p-6 border-b flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 w-full md:w-auto">
          <button 
            onClick={onAddNew}
            className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Plus size={20} />
            ADD STOCK ADJUSTMENT
          </button>

          <div className="flex gap-2 md:gap-3 w-full sm:w-auto">
            <select
              value={reasonFilter}
              onChange={(e) => setReasonFilter(e.target.value)}
              className="flex-1 sm:flex-none border border-gray-300 rounded px-2 md:px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {reasons.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>

            <select
              value={storeFilter}
              onChange={(e) => setStoreFilter(e.target.value)}
              className="flex-1 sm:flex-none border border-gray-300 rounded px-2 md:px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {stores.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>

        {showSearchBar ? (
          <div className="relative w-full md:w-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search adjustments..."
              className="w-full md:w-64 border border-gray-300 rounded pl-10 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <button
              onClick={() => {
                setShowSearchBar(false);
                setSearchQuery('');
              }}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setShowSearchBar(true)}
            className="p-2 hover:bg-gray-100 rounded self-end md:self-auto"
          >
            <Search size={20} />
          </button>
        )}
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden">
        {filteredAdjustments.map((adj: StockAdjustment) => (
          <div
            key={adj.id}
            className="border-b p-4 hover:bg-gray-50 cursor-pointer"
            onClick={() => onViewDetail(adj)}
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-blue-600 font-medium">{adj.adjustmentNumber}</span>
              <span className="text-sm text-gray-500">{adj.date}</span>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Reason:</span>
                <span className="font-medium">{adj.reason}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Store:</span>
                <span className="font-medium">{adj.store}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Quantity:</span>
                <span className="font-medium">{adj.quantity}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Adjustment #</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Date</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Reason</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Store</th>
              <th className="px-6 py-3 text-right text-sm font-medium text-gray-600">Quantity</th>
            </tr>
          </thead>
          <tbody>
            {filteredAdjustments.map((adj: StockAdjustment) => (
              <tr
                key={adj.id}
                className="border-b hover:bg-gray-50 cursor-pointer"
                onClick={() => onViewDetail(adj)}
              >
                <td className="px-6 py-4 text-blue-600">{adj.adjustmentNumber}</td>
                <td className="px-6 py-4">{adj.date}</td>
                <td className="px-6 py-4">{adj.reason}</td>
                <td className="px-6 py-4">{adj.store}</td>
                <td className="px-6 py-4 text-right">{adj.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 hover:bg-gray-100 rounded disabled:opacity-50"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="text-sm whitespace-nowrap">
            Page: <span className="font-medium">{currentPage}</span> of <span className="font-medium">1</span>
          </span>
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm whitespace-nowrap">Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option>10</option>
            <option>25</option>
            <option>50</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default StockAdjustmentList;