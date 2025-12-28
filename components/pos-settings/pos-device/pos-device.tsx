"use client"
import React, { useState } from 'react';
import { Plus, Smartphone, Trash2, X } from 'lucide-react';

interface PosDevice {
  id: number;
  name: string;
  store: string;
  status: 'Not activated' | 'Activated';
}

interface FormData {
  name: string;
  store: string;
  status: 'Not activated' | 'Activated';
}

const StoreIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M2 4h12v1H2V4zm0 3h12v1H2V7zm0 3h12v1H2v-1zm0 3h12v1H2v-1z"/>
  </svg>
);

const PosDevice = () => {
  const [devices, setDevices] = useState<PosDevice[]>([
    {
      id: 1,
      name: 'POS 1',
      store: 'new business',
      status: 'Not activated'
    },
    {
      id: 2,
      name: 'POS Devices 2',
      store: 'new store chawkhbazar',
      status: 'Not activated'
    }
  ]);

  const [stores] = useState<string[]>([
    'All stores',
    'new business',
    'new store chawkhbazar'
  ]);

  const [selectedStore, setSelectedStore] = useState<string>('All stores');
  const [selectedDevices, setSelectedDevices] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDevice, setEditingDevice] = useState<PosDevice | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    store: '',
    status: 'Not activated'
  });

  const filteredDevices = selectedStore === 'All stores' 
    ? devices 
    : devices.filter(device => device.store === selectedStore);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedDevices(prev => 
      prev.includes(id) 
        ? prev.filter(deviceId => deviceId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedDevices.length === filteredDevices.length) {
      setSelectedDevices([]);
    } else {
      setSelectedDevices(filteredDevices.map(device => device.id));
    }
  };

  const handleAddDevice = () => {
    setEditingDevice(null);
    setFormData({
      name: '',
      store: stores[1] || '',
      status: 'Not activated'
    });
    setIsModalOpen(true);
  };

  const handleRowClick = (device: PosDevice) => {
    setEditingDevice(device);
    setFormData({
      name: device.name,
      store: device.store,
      status: device.status
    });
    setIsModalOpen(true);
  };

  const handleDeleteSelected = () => {
    if (selectedDevices.length === 0) return;
    
    const count = selectedDevices.length;
    if (window.confirm(`Are you sure you want to delete ${count} POS device${count > 1 ? 's' : ''}?`)) {
      setDevices(devices.filter(device => !selectedDevices.includes(device.id)));
      setSelectedDevices([]);
    }
  };

  const handleDeleteDevice = () => {
    if (editingDevice && window.confirm('Are you sure you want to delete this POS device?')) {
      setDevices(devices.filter(device => device.id !== editingDevice.id));
      setSelectedDevices(selectedDevices.filter(deviceId => deviceId !== editingDevice.id));
      setIsModalOpen(false);
      setEditingDevice(null);
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.store) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingDevice) {
      setDevices(devices.map(device => 
        device.id === editingDevice.id 
          ? { ...device, ...formData }
          : device
      ));
    } else {
      const newDevice: PosDevice = {
        id: devices.length > 0 ? Math.max(...devices.map(d => d.id)) + 1 : 1,
        ...formData
      };
      setDevices([...devices, newDevice]);
    }
    
    setIsModalOpen(false);
    setEditingDevice(null);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingDevice(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={handleAddDevice}
              className="flex-1 sm:flex-none bg-green-500 hover:bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded font-medium flex items-center justify-center gap-2 transition-colors"
            >
              <Plus size={20} />
              ADD POS
            </button>
            {selectedDevices.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="flex-none bg-red-500 hover:bg-red-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <Trash2 size={20} />
                <span className="hidden sm:inline">Delete ({selectedDevices.length})</span>
                <span className="sm:hidden">({selectedDevices.length})</span>
              </button>
            )}
          </div>

          <div className="w-full sm:w-auto flex items-center gap-2">
            <label className="text-sm text-gray-600 whitespace-nowrap">Store</label>
            <select
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              className="flex-1 sm:flex-none sm:w-48 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              {stores.map(store => (
                <option key={store} value={store}>{store}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedDevices.length === filteredDevices.length && filteredDevices.length > 0}
                    onChange={() => {}}
                    onClick={handleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                  />
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Name</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Store</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredDevices.map((device) => (
                <tr 
                  key={device.id} 
                  onClick={() => handleRowClick(device)}
                  className="border-b hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedDevices.includes(device.id)}
                      onChange={() => {}}
                      onClick={(e) => handleCheckboxChange(device.id, e)}
                      className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium">{device.name}</td>
                  <td className="px-6 py-4 text-gray-600">{device.store}</td>
                  <td className="px-6 py-4 text-gray-600">{device.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {filteredDevices.map((device) => (
            <div 
              key={device.id} 
              onClick={() => handleRowClick(device)}
              className="bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3 mb-3">
                <input
                  type="checkbox"
                  checked={selectedDevices.includes(device.id)}
                  onChange={() => {}}
                  onClick={(e) => handleCheckboxChange(device.id, e)}
                  className="w-4 h-4 mt-1 rounded border-gray-300 cursor-pointer"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{device.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">Store: {device.store}</p>
                  <p className="text-sm text-gray-500">Status: {device.status}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 sm:hidden flex items-center justify-between">
              <h2 className="font-semibold text-lg">
                {editingDevice ? 'Edit POS Device' : 'Add POS Device'}
              </h2>
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 sm:p-6">
              <div className="flex justify-center mb-4 sm:mb-6">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-400 rounded-full flex items-center justify-center">
                  <Smartphone className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
              </div>

              <div className="space-y-4 sm:space-y-5">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 text-sm sm:text-base border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="POS device name"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2 items-center gap-2">
                    <StoreIcon />
                    Store
                  </label>
                  <select
                    name="store"
                    value={formData.store}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2.5 text-sm sm:text-base border-b-2 border-gray-300 focus:outline-none focus:border-blue-500 transition-colors bg-white"
                  >
                    <option value="">Select a store</option>
                    {stores.filter(s => s !== 'All stores').map(store => (
                      <option key={store} value={store}>{store}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-600 mb-2 items-center gap-2">
                    <Smartphone size={16} />
                    Status
                  </label>
                  <div className="px-3 py-2.5 text-sm sm:text-base border-b-2 border-gray-300">
                    <p className="text-gray-700 mb-1">{formData.status}</p>
                    <p className="text-xs text-gray-500">
                      Sign in to Loyverse Point of Sale app to activate this POS device
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 sm:mt-8 pt-4 border-t gap-3">
                {editingDevice && (
                  <button 
                    onClick={handleDeleteDevice}
                    className="w-full sm:w-auto order-2 sm:order-1 p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
                {!editingDevice && <div className="hidden sm:block"></div>}
                <div className="flex gap-3 w-full sm:w-auto order-1 sm:order-2">
                  <button
                    onClick={handleCancel}
                    className="flex-1 sm:flex-none px-4 sm:px-6 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors text-sm sm:text-base font-medium"
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex-1 sm:flex-none px-4 sm:px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition-colors text-sm sm:text-base font-medium"
                  >
                    SAVE
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

export default PosDevice;