"use client";
// StockAdjustment.tsx (Main Component)
import React, { useState } from 'react';
import StockAdjustmentList from './stock-adjustment-list';
import StockAdjustmentPopup from './stock-adjustment-popup';



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

const StockAdjustment = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedAdjustment, setSelectedAdjustment] = useState<StockAdjustment | null>(null);

  const [adjustments, setAdjustments] = useState<StockAdjustment[]>([
    {
      id: '1',
      adjustmentNumber: 'SA1002',
      date: 'Dec 30, 2025',
      reason: 'Inventory count',
      store: 'New bizflow',
      adjustedBy: 'Owner',
      quantity: 1,
      items: [
        {
          id: '1',
          name: 'fried rice',
          sku: 'fr-1000',
          inStock: 0,
          addStock: 1,
          cost: 0,
          stockAfter: 1
        }
      ]
    },
    {
      id: '2',
      adjustmentNumber: 'SA1001',
      date: 'Dec 30, 2025',
      reason: 'Receive items',
      store: 'New bizflow',
      adjustedBy: 'Owner',
      quantity: 1,
      items: []
    }
  ]);

  const handleSaveAdjustment = (data: any) => {
    const newAdjustment: StockAdjustment = {
      id: String(adjustments.length + 1),
      adjustmentNumber: `SA${1000 + adjustments.length + 1}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      reason: data.reason,
      store: data.store,
      adjustedBy: 'Owner',
      quantity: data.items.reduce((sum: number, item: any) => sum + item.addStock, 0),
      items: data.items
    };

    setAdjustments([newAdjustment, ...adjustments]);
  };

  const handleViewDetail = (adjustment: StockAdjustment) => {
    setSelectedAdjustment(adjustment);
    setIsPopupOpen(true);
  };

  const handleAddNew = () => {
    setSelectedAdjustment(null);
    setIsPopupOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <StockAdjustmentList
          adjustments={adjustments}
          onViewDetail={handleViewDetail}
          onAddNew={handleAddNew}
        />

        <StockAdjustmentPopup
          isOpen={isPopupOpen}
          onClose={() => {
            setIsPopupOpen(false);
            setSelectedAdjustment(null);
          }}
          onSave={handleSaveAdjustment}
          adjustment={selectedAdjustment}
          viewMode={selectedAdjustment !== null}
        />
      </div>
    </div>
  );
};

export default StockAdjustment;