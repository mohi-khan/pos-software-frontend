// StockAdjustmentPopup.tsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

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

interface StockAdjustmentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  adjustment: StockAdjustment | null;
  viewMode?: boolean;
}

const StockAdjustmentPopup: React.FC<StockAdjustmentPopupProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  adjustment,
  viewMode = false
}) => {
  const [reason, setReason] = useState('Receive items');
  const [store, setStore] = useState('New bizflow chittagong');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<StockItem[]>([]);
  const [searchItem, setSearchItem] = useState('');

  const reasons = ['Receive items', 'Inventory count', 'Loss', 'Damage'];

  useEffect(() => {
    if (adjustment) {
      setReason(adjustment.reason);
      setStore(adjustment.store);
      setItems(adjustment.items);
    } else {
      setReason('Receive items');
      setStore('New bizflow chittagong');
      setNotes('');
      setItems([]);
    }
  }, [adjustment, isOpen]);

  const handleSave = () => {
    onSave({
      reason,
      store,
      notes,
      items,
      date: new Date().toISOString().split('T')[0]
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {viewMode ? (
          // View Mode - Detail View Layout
          <>
            <div className="sticky top-0 bg-white border-b px-4 md:px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-4">
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
                  <X size={20} />
                </button>
                <span className="text-sm md:text-base text-gray-600">All stock adjustments</span>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded">
                <span className="text-lg">⋮</span>
              </button>
            </div>

            <div className="p-4 md:p-6">
              <h1 className="text-2xl md:text-3xl font-semibold mb-6 md:mb-8">{adjustment?.adjustmentNumber}</h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-8 mb-6 md:mb-8">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Date:</div>
                  <div className="font-medium">{adjustment?.date}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Store:</div>
                  <div className="font-medium break-words">{store}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Reason:</div>
                  <div className="font-medium">{reason}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Adjusted by:</div>
                  <div className="font-medium">{adjustment?.adjustedBy || 'Owner'}</div>
                </div>
              </div>

              <h2 className="text-lg md:text-xl font-semibold mb-4">Items</h2>
              <div className="border border-gray-300 rounded overflow-hidden">
                <div className="bg-gray-50 px-4 md:px-6 py-3 flex justify-between text-sm font-medium text-gray-600 border-b">
                  <div>Item</div>
                  <div>Counted stock</div>
                </div>
                {items.map((item, index) => (
                  <div key={index} className="px-4 md:px-6 py-3 md:py-4 flex justify-between border-b last:border-b-0">
                    <div className="flex-1 min-w-0 mr-4">
                      <div className="font-medium text-sm md:text-base truncate">{item.name}</div>
                      <div className="text-xs md:text-sm text-gray-500">SKU {item.sku}</div>
                    </div>
                    <div className="font-medium text-sm md:text-base flex-shrink-0">{item.addStock || 1}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          // Edit Mode - Create New Adjustment
          <>
            <div className="sticky top-0 bg-white border-b px-4 md:px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg md:text-xl font-semibold">Stock Adjustment</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>

            <div className="p-4 md:p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Reason</label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {reasons.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2">Store</label>
                  <select
                    value={store}
                    onChange={(e) => setStore(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>New bizflow chittagong</option>
                    <option>Main warehouse</option>
                    <option>Store 2</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm text-gray-600 mb-2">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Add notes..."
                  maxLength={500}
                />
                <div className="text-right text-sm text-gray-500 mt-1">{notes.length} / 500</div>
              </div>

              <div>
                <h3 className="text-base md:text-lg font-semibold mb-4">Items</h3>
                <div className="border border-gray-300 rounded overflow-x-auto">
                  <div className="min-w-[600px]">
                    <div className="bg-gray-50 px-4 py-3 grid grid-cols-6 gap-2 md:gap-4 text-xs md:text-sm font-medium text-gray-600">
                      <div className="col-span-2">Item</div>
                      <div>In stock</div>
                      <div>Add stock</div>
                      <div>Cost</div>
                      <div>Stock after</div>
                    </div>

                    {items.map((item, index) => (
                      <div key={index} className="px-4 py-3 grid grid-cols-6 gap-2 md:gap-4 border-t border-gray-200 text-xs md:text-sm">
                        <div className="col-span-2">
                          <div className="font-medium truncate">{item.name}</div>
                          <div className="text-xs text-gray-500 truncate">{item.sku}</div>
                        </div>
                        <div className="flex items-center">{item.inStock}</div>
                        <div>
                          <input
                            type="number"
                            value={item.addStock}
                            onChange={(e) => {
                              const newItems = [...items];
                              newItems[index].addStock = Number(e.target.value);
                              newItems[index].stockAfter = newItems[index].inStock + Number(e.target.value);
                              setItems(newItems);
                            }}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-xs md:text-sm"
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            value={item.cost}
                            onChange={(e) => {
                              const newItems = [...items];
                              newItems[index].cost = Number(e.target.value);
                              setItems(newItems);
                            }}
                            className="w-full border border-gray-300 rounded px-2 py-1 text-xs md:text-sm"
                          />
                        </div>
                        <div className="flex items-center">{item.stockAfter}</div>
                      </div>
                    ))}
                  </div>

                  <div className="px-4 py-3 border-t border-gray-200">
                    <input
                      type="text"
                      value={searchItem}
                      onChange={(e) => setSearchItem(e.target.value)}
                      placeholder="Search item"
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t px-4 md:px-6 py-4 flex flex-col-reverse sm:flex-row justify-end gap-3">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
              >
                CANCEL
              </button>
              <button
                onClick={handleSave}
                className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                ADJUST
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StockAdjustmentPopup;