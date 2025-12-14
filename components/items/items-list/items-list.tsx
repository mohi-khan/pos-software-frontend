'use client';
import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Search, Plus, X } from 'lucide-react';

interface Item {
  id: number;
  name: string;
  category: string;
  price: string;
  cost: string;
  margin: string;
  stock: number;
  expanded: boolean;
}

interface FormData {
  name: string;
  category: string;
  description: string;
  availableForSale: boolean;
  soldBy: string;
  price: string;
  cost: string;
  sku: string;
  barcode: string;
  compositeItem: boolean;
  trackStock: boolean;
  color: string;
  shape: string;
}

const InventoryManagement: React.FC = () => {
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: 'new item', category: 'riad', price: '', cost: '', margin: '', stock: 1200, expanded: false }
  ]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [currentItem, setCurrentItem] = useState<Item | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('All items');
  const [stockFilter, setStockFilter] = useState<string>('All items');
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    category: 'No category',
    description: '',
    availableForSale: true,
    soldBy: 'Each',
    price: '',
    cost: '',
    sku: '',
    barcode: '',
    compositeItem: false,
    trackStock: false,
    color: '#FFFFFF',
    shape: 'check'
  });

  const colors: string[] = ['#FFFFFF', '#EF4444', '#EC4899', '#F59E0B', '#EAB308', '#22C55E', '#3B82F6', '#A855F7'];
  const shapes: string[] = ['check', 'circle', 'dashed-circle', 'hexagon'];

  const openModal = (item: Item | null = null): void => {
    if (item) {
      setCurrentItem(item);
      setFormData({
        name: item.name,
        category: item.category,
        description: '',
        availableForSale: true,
        soldBy: 'Each',
        price: item.price,
        cost: item.cost,
        sku: '10001',
        barcode: '',
        compositeItem: false,
        trackStock: false,
        color: '#FFFFFF',
        shape: 'check'
      });
    } else {
      setCurrentItem(null);
      setFormData({
        name: '',
        category: 'No category',
        description: '',
        availableForSale: true,
        soldBy: 'Each',
        price: '',
        cost: '',
        sku: '10001',
        barcode: '',
        compositeItem: false,
        trackStock: false,
        color: '#FFFFFF',
        shape: 'check'
      });
    }
    setShowModal(true);
  };

  const closeModal = (): void => {
    setShowModal(false);
    setCurrentItem(null);
  };

  const handleSave = (): void => {
    if (currentItem) {
      setItems(items.map(item => 
        item.id === currentItem.id 
          ? { ...item, name: formData.name, category: formData.category, price: formData.price, cost: formData.cost }
          : item
      ));
    } else {
      const newItem: Item = {
        id: items.length + 1,
        name: formData.name || 'New item',
        category: formData.category,
        price: formData.price,
        cost: formData.cost,
        margin: '',
        stock: 0,
        expanded: false
      };
      setItems([...items, newItem]);
    }
    closeModal();
  };

  const toggleExpand = (id: number): void => {
    setItems(items.map(item => 
      item.id === id ? { ...item, expanded: !item.expanded } : item
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => openModal()}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 font-medium"
            >
              <Plus size={18} />
              ADD ITEM
            </button>
            <button className="text-gray-700 font-medium px-4 py-2 hover:bg-gray-100 rounded">
              IMPORT
            </button>
            <button className="text-gray-700 font-medium px-4 py-2 hover:bg-gray-100 rounded">
              EXPORT
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Category</label>
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="border rounded px-3 py-1.5 text-sm bg-white min-w-[150px]"
              >
                <option>All items</option>
                <option>riad</option>
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Stock alert</label>
              <select 
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="border rounded px-3 py-1.5 text-sm bg-white min-w-[150px]"
              >
                <option>All items</option>
              </select>
            </div>
            
            <button className="p-2 hover:bg-gray-100 rounded">
              <Search size={20} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white m-4 rounded-lg shadow-sm">
        <table className="w-full">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="w-12 p-4">
                <input type="checkbox" className="w-4 h-4" />
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-700">
                Item name ↑
              </th>
              <th className="text-left p-4 text-sm font-medium text-gray-700">Category</th>
              <th className="text-left p-4 text-sm font-medium text-gray-700">Price</th>
              <th className="text-left p-4 text-sm font-medium text-gray-700">Cost</th>
              <th className="text-left p-4 text-sm font-medium text-gray-700">Margin</th>
              <th className="text-left p-4 text-sm font-medium text-gray-700">In stock</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="p-4">
                  <button onClick={() => toggleExpand(item.id)} className="p-1">
                    {item.expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </button>
                </td>
                <td className="p-4">
                  <input type="checkbox" className="w-4 h-4 mr-3 inline-block" />
                  <button 
                    onClick={() => openModal(item)}
                    className="text-blue-600 hover:underline"
                  >
                    {item.name}
                  </button>
                </td>
                <td className="p-4">
                  <select className="border rounded px-2 py-1 text-sm bg-white min-w-[120px]">
                    <option>{item.category}</option>
                  </select>
                </td>
                <td className="p-4 text-gray-700">{item.price}</td>
                <td className="p-4 text-gray-700">{item.cost}</td>
                <td className="p-4 text-gray-700">{item.margin}</td>
                <td className="p-4 text-gray-700">{item.stock.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between p-4 border-t">
          <div className="flex items-center gap-2">
            <button className="p-2 border rounded hover:bg-gray-50">
              <ChevronRight size={18} className="rotate-180" />
            </button>
            <button className="p-2 border rounded hover:bg-gray-50">
              <ChevronRight size={18} />
            </button>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-600">Page:</span>
            <input 
              type="text" 
              value="1" 
              className="w-12 text-center border rounded px-2 py-1"
              readOnly
            />
            <span className="text-gray-600">of 1</span>
            
            <span className="text-gray-600 ml-6">Rows per page:</span>
            <select className="border rounded px-2 py-1 bg-white">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto m-4">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Name</h2>
              <button onClick={closeModal} className="p-1 hover:bg-gray-100 rounded">
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Category */}
              <div>
                <label className="block text-sm text-gray-600 mb-1">Category</label>
                <select 
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full border rounded px-3 py-2 bg-white"
                >
                  <option>No category</option>
                  <option>riad</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <input 
                  type="text"
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              {/* Available for sale */}
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox"
                  checked={formData.availableForSale}
                  onChange={(e) => setFormData({...formData, availableForSale: e.target.checked})}
                  className="w-4 h-4"
                />
                <label className="text-sm">The item is available for sale</label>
              </div>

              {/* Sold by */}
              <div>
                <label className="block text-sm text-gray-600 mb-2">Sold by</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input 
                      type="radio"
                      checked={formData.soldBy === 'Each'}
                      onChange={() => setFormData({...formData, soldBy: 'Each'})}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Each</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input 
                      type="radio"
                      checked={formData.soldBy === 'Weight/Volume'}
                      onChange={() => setFormData({...formData, soldBy: 'Weight/Volume'})}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Weight/Volume</span>
                  </label>
                </div>
              </div>

              {/* Price and Cost */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Price</label>
                  <input 
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    placeholder="To indicate the price upon sale, leave the field blank"
                    className="w-full border rounded px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Cost</label>
                  <input 
                    type="text"
                    value={formData.cost}
                    onChange={(e) => setFormData({...formData, cost: e.target.value})}
                    placeholder="Tk0.00"
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>

              {/* SKU and Barcode */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">SKU</label>
                  <input 
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({...formData, sku: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                  />
                  <p className="text-xs text-gray-500 mt-1">Unique identifier assigned to an item</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Barcode</label>
                  <input 
                    type="text"
                    value={formData.barcode}
                    onChange={(e) => setFormData({...formData, barcode: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>

              {/* Inventory Section */}
              <div>
                <h3 className="font-medium mb-3">Inventory</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Composite item</span>
                      <span className="text-gray-400 text-xs">ⓘ</span>
                    </div>
                    <label className="relative inline-block w-11 h-6">
                      <input 
                        type="checkbox"
                        checked={formData.compositeItem}
                        onChange={(e) => setFormData({...formData, compositeItem: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-full h-full bg-gray-200 peer-checked:bg-green-500 rounded-full peer transition-colors"></div>
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:left-6 transition-all"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Track stock</span>
                    <label className="relative inline-block w-11 h-6">
                      <input 
                        type="checkbox"
                        checked={formData.trackStock}
                        onChange={(e) => setFormData({...formData, trackStock: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-full h-full bg-gray-200 peer-checked:bg-green-500 rounded-full peer transition-colors"></div>
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full peer-checked:left-6 transition-all"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Variants */}
              <div>
                <h3 className="font-medium mb-2">Variants</h3>
                <p className="text-sm text-gray-600 mb-3">Use variants if an item has different sizes, colors or other options</p>
                <button className="text-green-600 text-sm flex items-center gap-1 hover:text-green-700">
                  <Plus size={16} />
                  ADD VARIANTS
                </button>
              </div>

              {/* POS Representation */}
              <div>
                <h3 className="font-medium mb-3">Representation on POS</h3>
                <div className="flex gap-4 mb-3">
                  <label className="flex items-center gap-2">
                    <input 
                      type="radio"
                      checked={true}
                      readOnly
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Color and shape</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input 
                      type="radio"
                      checked={false}
                      readOnly
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Image</span>
                  </label>
                </div>
                
                {/* Color picker */}
                <div className="flex gap-2 mb-3">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setFormData({...formData, color})}
                      className={`w-10 h-10 rounded ${formData.color === color ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                
                {/* Shape picker */}
                <div className="flex gap-2">
                  {shapes.map((shape) => (
                    <button
                      key={shape}
                      onClick={() => setFormData({...formData, shape})}
                      className={`w-12 h-12 border-2 rounded flex items-center justify-center ${formData.shape === shape ? 'border-blue-500' : 'border-gray-300'}`}
                    >
                      {shape === 'check' && <div className="w-6 h-6 border-2 border-gray-400"></div>}
                      {shape === 'circle' && <div className="w-6 h-6 rounded-full border-2 border-gray-400"></div>}
                      {shape === 'dashed-circle' && <div className="w-6 h-6 rounded-full border-2 border-dashed border-gray-400"></div>}
                      {shape === 'hexagon' && <div className="w-6 h-6 border-2 border-gray-400" style={{clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'}}></div>}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end gap-3">
              <button 
                onClick={closeModal}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                CANCEL
              </button>
              <button 
                onClick={handleSave}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                SAVE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;